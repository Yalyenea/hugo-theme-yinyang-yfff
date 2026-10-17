(function () {
    function escapeHtml(value) {
      return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function stripBraces(value) {
      const trimmed = value.trim();
      if (trimmed.charAt(0) === '{' && trimmed.charAt(trimmed.length - 1) === '}') {
        return trimmed.slice(1, -1).trim();
      }
      return trimmed;
    }

    function parsePseudocode(source) {
      const rows = [];
      const labels = {
        REQUIRE: 'Input',
        ENSURE: 'Output',
        RETURN: 'Return',
        IF: 'If',
        ELSE: 'Else',
        ELSIF: 'Else if',
        FOR: 'For',
        FORALL: 'For each',
        WHILE: 'While',
        REPEAT: 'Repeat',
        UNTIL: 'Until'
      };
      let caption = '';
      let indent = 0;

      source.replace(/\r\n/g, '\n').split('\n').forEach(function (line) {
        const trimmed = line.trim();
        const captionMatch = trimmed.match(/^\\caption\{(.+)\}$/);
        if (captionMatch) {
          caption = captionMatch[1].trim();
          return;
        }

        if (!trimmed || /^\\(begin|end)\{algorithm(ic)?\}$/i.test(trimmed)) {
          return;
        }

        const commandMatch = trimmed.match(/^\\([A-Z]+)\b\s*(.*)$/);
        const command = commandMatch ? commandMatch[1] : 'STATE';
        const content = stripBraces(commandMatch ? commandMatch[2] : trimmed);

        if (command === 'ENDIF' || command === 'ENDFOR' || command === 'ENDWHILE' || command === 'ELSE' || command === 'ELSIF') {
          indent = Math.max(indent - 1, 0);
        }

        if (command === 'REQUIRE' || command === 'ENSURE') {
          rows.push({ kind: 'meta', label: labels[command], content, indent });
          return;
        }

        if (command === 'STATE') {
          rows.push({ kind: 'step', label: '', content, indent });
          return;
        }

        if (labels[command]) {
          rows.push({ kind: 'step', label: labels[command], content, indent });
        } else if (command.indexOf('END') !== 0) {
          rows.push({
            kind: 'step',
            label: command.charAt(0) + command.slice(1).toLowerCase(),
            content,
            indent
          });
        }

        if (command === 'IF' || command === 'FOR' || command === 'FORALL' || command === 'WHILE' || command === 'REPEAT' || command === 'ELSE' || command === 'ELSIF') {
          indent += 1;
        }
      });

      return { caption, rows };
    }

    function renderMathInNode(node) {
      if (!node || typeof renderMathInElement !== 'function') {
        return;
      }

      renderMathInElement(node, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true }
        ],
        throwOnError: false
      });
    }

    function renderPseudocodeBlocks() {
      document.querySelectorAll('.markdown-body code.language-pseudo').forEach(function (codeNode) {
        const block = codeNode.closest('.highlight') || codeNode.closest('pre');
        if (!block || block.dataset.pseudocodeRendered === 'true') {
          return;
        }

        const parsed = parsePseudocode(codeNode.textContent || '');
        if (!parsed.rows.length) {
          return;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'pseudocode-block';
        wrapper.dataset.source = codeNode.textContent || '';

        if (parsed.caption) {
          const title = document.createElement('div');
          title.className = 'pseudocode-title';
          title.innerHTML = escapeHtml(parsed.caption);
          wrapper.appendChild(title);
        }

        const body = document.createElement('div');
        body.className = 'pseudocode-body';

        parsed.rows.forEach(function (row) {
          const item = document.createElement('div');
          item.className = row.kind === 'meta' ? 'pseudocode-row pseudocode-meta' : 'pseudocode-row pseudocode-step';
          item.style.setProperty('--pseudo-indent', String(row.indent));

          const label = document.createElement('span');
          label.className = 'pseudocode-label';
          label.textContent = row.label;

          const content = document.createElement('span');
          content.className = 'pseudocode-content';
          content.innerHTML = escapeHtml(row.content);

          item.appendChild(label);
          item.appendChild(content);
          body.appendChild(item);
        });

        wrapper.appendChild(body);
        block.dataset.pseudocodeRendered = 'true';
        block.replaceWith(wrapper);
        renderMathInNode(wrapper);
      });
    }


  renderPseudocodeBlocks();
})();
