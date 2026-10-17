
  (function () {
    const overlay = document.getElementById('shortcut-overlay');
    const hint = document.getElementById('shortcut-hint');
    const uiLabels = document.getElementById('ui-labels');
    const article = document.getElementById('article');
    const postContent = document.getElementById('post-content');
    const comments = document.getElementById('post-comments');
    const codeCopyLabel = uiLabels ? uiLabels.dataset.codeCopy : 'Copy';
    const codeCopiedLabel = uiLabels ? uiLabels.dataset.codeCopied : 'Copied';
    const codePlainTextLabel = uiLabels ? uiLabels.dataset.codePlainText : 'Text';
    const searchUrl = uiLabels ? uiLabels.dataset.searchUrl : '';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prevUrl = article ? article.dataset.shortcutPrev : '';
    const nextUrl = article ? article.dataset.shortcutNext : '';
    let gSequenceAt = 0;

    function isEditableTarget(target) {
      if (!target) {
        return false;
      }
      const tagName = target.tagName;
      if (!tagName) {
        return false;
      }
      if (target.isContentEditable) {
        return true;
      }
      return ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(tagName);
    }

    function scrollPageBy(top) {
      window.scrollBy({
        top,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    }

    function scrollToPosition(top) {
      window.scrollTo({
        top,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    }

    function scrollToElement(element) {
      if (!element) {
        return;
      }
      const top = element.getBoundingClientRect().top + window.scrollY - 12;
      scrollToPosition(Math.max(top, 0));
    }

    function navigateTo(url) {
      if (!url) {
        return;
      }
      window.location.href = url;
    }

    function search() {
      const searchInput = document.querySelector('.pagefind-ui__search-input');
      if (searchInput) {
        searchInput.focus();
        return;
      }
      navigateTo(searchUrl);
    }

    function toggleOverlay(force) {
      if (!overlay) {
        return;
      }
      const shouldShow = typeof force === 'boolean' ? force : overlay.hidden;
      overlay.hidden = !shouldShow;
    }

    function updateShortcutAvailability() {
      const availability = {
        content: Boolean(postContent),
        comments: Boolean(comments),
        prev: Boolean(prevUrl),
        next: Boolean(nextUrl)
      };

      document.querySelectorAll('[data-requires]').forEach(function (node) {
        node.hidden = !availability[node.dataset.requires];
      });
    }

    function getCodeBlockLanguage(codeNode) {
      if (!codeNode) {
        return codePlainTextLabel;
      }

      if (codeNode.dataset.lang) {
        return codeNode.dataset.lang;
      }

      const languageClass = Array.from(codeNode.classList).find(function (className) {
        return className.indexOf('language-') === 0;
      });

      if (!languageClass) {
        return codePlainTextLabel;
      }

      return languageClass.replace('language-', '');
    }

    function enhanceCodeBlocks() {
      document.querySelectorAll('.markdown-body .highlight').forEach(function (block) {
        if (block.querySelector('.code-block-toolbar')) {
          return;
        }

        const codeNode = block.querySelector('code');
        if (!codeNode) {
          return;
        }

        const toolbar = document.createElement('div');
        const button = document.createElement('button');
        const language = document.createElement('span');
        const action = document.createElement('span');

        toolbar.className = 'code-block-toolbar';
        button.className = 'code-copy-button';
        button.type = 'button';
        button.setAttribute('aria-label', [getCodeBlockLanguage(codeNode), codeCopyLabel].join(' '));

        language.className = 'code-copy-language';
        language.textContent = getCodeBlockLanguage(codeNode);

        action.className = 'code-copy-action';
        action.textContent = codeCopyLabel;

        button.appendChild(language);
        button.appendChild(action);

        button.addEventListener('click', async function () {
          if (!navigator.clipboard) {
            return;
          }

          try {
            await navigator.clipboard.writeText(codeNode.textContent || '');
            button.dataset.copied = 'true';
            action.textContent = codeCopiedLabel;

            window.setTimeout(function () {
              delete button.dataset.copied;
              action.textContent = codeCopyLabel;
            }, 1600);
          } catch (error) {
            console.error('Failed to copy code block', error);
          }
        });

        toolbar.appendChild(button);
        block.insertBefore(toolbar, block.firstChild);
      });
    }

    document.addEventListener('keydown', function (event) {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (isEditableTarget(event.target)) {
        return;
      }

      if (event.key === '?') {
        event.preventDefault();
        toggleOverlay();
        return;
      }

      if (!overlay.hidden && event.key === 'Escape') {
        event.preventDefault();
        toggleOverlay(false);
        return;
      }

      if (!overlay.hidden) {
        return;
      }

      if (event.key === '/') {
        event.preventDefault();
        search();
        return;
      }

      const viewportStep = Math.max(window.innerHeight * 0.12, 72);
      const halfPage = window.innerHeight * 0.5;

      if (event.key === 'j') {
        event.preventDefault();
        scrollPageBy(viewportStep);
        return;
      }

      if (event.key === 'k') {
        event.preventDefault();
        scrollPageBy(-viewportStep);
        return;
      }

      if (event.key === 'd') {
        event.preventDefault();
        scrollPageBy(halfPage);
        return;
      }

      if (event.key === 'u') {
        event.preventDefault();
        scrollPageBy(-halfPage);
        return;
      }

      if (event.key === 's' && typeof window.toggleTheme === 'function') {
        event.preventDefault();
        window.toggleTheme();
        return;
      }

      if (event.key === 'l') {
        const langBtn = document.querySelector('.lang-switch-btn');
        if (langBtn) {
          event.preventDefault();
          window.location.href = langBtn.href;
        }
        return;
      }

      if (event.key === 'g') {
        const now = Date.now();
        if (now - gSequenceAt < 600) {
          event.preventDefault();
          gSequenceAt = 0;
          scrollToPosition(0);
          return;
        }
        gSequenceAt = now;
        return;
      }

      gSequenceAt = 0;

      if (event.key === 'G') {
        event.preventDefault();
        scrollToPosition(document.documentElement.scrollHeight);
        return;
      }

      if (event.key === 't' && postContent) {
        event.preventDefault();
        scrollToElement(postContent);
        return;
      }

      if (event.key === 'c' && comments) {
        event.preventDefault();
        scrollToElement(comments);
        return;
      }

      if (event.key === '[' && prevUrl) {
        event.preventDefault();
        navigateTo(prevUrl);
        return;
      }

      if (event.key === ']' && nextUrl) {
        event.preventDefault();
        navigateTo(nextUrl);
      }
    });

    if (overlay) {
      overlay.addEventListener('click', function (event) {
        if (event.target === overlay) {
          toggleOverlay(false);
        }
      });
    }

    if (hint) {
      hint.addEventListener('click', function () {
        toggleOverlay(true);
      });
    }

    function initToc() {
      const toc = document.getElementById('toc');
      if (!toc) {
        return;
      }

      const toggle = document.getElementById('toc-toggle');
      const body = document.getElementById('toc-body');
      const mq = window.matchMedia('(max-width: 1360px)');

      function syncTocCollapse() {
        if (!toggle || !body) {
          return;
        }
        if (mq.matches) {
          const expanded = toggle.getAttribute('aria-expanded') === 'true';
          body.hidden = !expanded;
          toc.classList.toggle('is-collapsed', !expanded);
        } else {
          body.hidden = false;
          toggle.setAttribute('aria-expanded', 'true');
          toc.classList.remove('is-collapsed');
        }
      }

      if (toggle && body) {
        toggle.addEventListener('click', function () {
          if (!mq.matches) {
            return;
          }
          const next = toggle.getAttribute('aria-expanded') !== 'true';
          toggle.setAttribute('aria-expanded', next ? 'true' : 'false');
          syncTocCollapse();
        });
        mq.addEventListener('change', syncTocCollapse);
        syncTocCollapse();
      }

      const links = Array.from(toc.querySelectorAll('nav#TableOfContents a[href^="#"]'));
      if (!links.length) {
        return;
      }

      const linkById = new Map();
      const headings = [];
      links.forEach(function (link) {
        const id = decodeURIComponent(link.getAttribute('href').slice(1));
        if (!id) {
          return;
        }
        const heading = document.getElementById(id);
        if (!heading) {
          return;
        }
        linkById.set(id, link);
        headings.push(heading);
      });

      if (!headings.length) {
        return;
      }

      function setActive(id) {
        links.forEach(function (link) {
          const active = linkById.get(id) === link;
          link.classList.toggle('is-active', active);
          if (active) {
            link.setAttribute('aria-current', 'location');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      }

      function updateActive() {
        const activationLine = parseFloat(getComputedStyle(headings[0]).scrollMarginTop) + 1;
        let current = headings[0];
        for (const heading of headings) {
          if (heading.getBoundingClientRect().top > activationLine) {
            break;
          }
          current = heading;
        }
        // A short final section may never reach the activation line.
        if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1) {
          current = headings[headings.length - 1];
        }
        setActive(current.id);
      }

      let scheduled = false;
      function scheduleUpdate() {
        if (scheduled) {
          return;
        }
        scheduled = true;
        requestAnimationFrame(function () {
          scheduled = false;
          updateActive();
        });
      }

      window.addEventListener('scroll', scheduleUpdate, { passive: true });
      window.addEventListener('resize', scheduleUpdate);
      window.addEventListener('hashchange', scheduleUpdate);
      new ResizeObserver(scheduleUpdate).observe(document.getElementById('post-content'));
      scheduleUpdate();
    }

    if (document.getElementById('search')) {
      new PagefindUI({
        element: '#search',
        showImages: false,
        showSubResults: true,
        resetStyles: false,
        translations: { placeholder: uiLabels.dataset.searchPlaceholder }
      });
    }

    updateShortcutAvailability();
    enhanceCodeBlocks();
    initToc();
  })();
