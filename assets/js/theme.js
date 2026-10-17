
	    (function () {
	      const themeKey = 'theme';
	      const themes = { light: 'light', dark: 'dark', system: 'system' };
	      const lightThemeLabel = document.querySelector('meta[name="theme-switch-light-label"]');
	      const darkThemeLabel = document.querySelector('meta[name="theme-switch-dark-label"]');
	      const themeLabels = {
	        light: lightThemeLabel ? lightThemeLabel.content : 'Switch to light mode',
	        dark: darkThemeLabel ? darkThemeLabel.content : 'Switch to dark mode'
	      };

      function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      function getStoredTheme() {
        return localStorage.getItem(themeKey);
      }
      function getCurrentTheme() {
        const stored = getStoredTheme();
        if (stored && stored !== themes.system) {
          return stored;
        }
        return getSystemTheme();
      }
      function setTheme(theme) {
        const root = document.documentElement;
        if (theme === themes.system) {
          theme = getSystemTheme();
        }
        if (theme === themes.dark) {
          root.setAttribute('data-theme', 'dark');
        } else {
          root.removeAttribute('data-theme');
        }
        updateToggleButton(theme);
        updateGiscusTheme(theme);
      }
      function updateToggleButton(theme) {
        const button = document.getElementById('theme-toggle');
        if (!button) {
          return;
        }
        const isDark = theme === themes.dark;
        // aria describes the action (switch to the other mode); icon shows current mode.
        const nextAction = isDark ? themeLabels.light : themeLabels.dark;
        button.setAttribute('aria-label', nextAction);
        button.setAttribute('title', nextAction);
        button.dataset.theme = isDark ? 'dark' : 'light';
      }
      function updateGiscusTheme(theme) {
        const iframe = document.querySelector('iframe.giscus-frame');
        if (!iframe || !iframe.contentWindow) {
          return;
        }
        const giscusThemeMap = window.__giscusThemeMap || { light: 'light', dark: 'dark' };
        iframe.contentWindow.postMessage(
          {
            giscus: {
              setConfig: {
                theme: theme === 'dark' ? giscusThemeMap.dark : giscusThemeMap.light
              }
            }
          },
          'https://giscus.app'
        );
      }
      function ensureButtonUpdated() {
        updateToggleButton(getCurrentTheme());
      }
      function initTheme() {
        const stored = getStoredTheme();
        if (stored) {
          setTheme(stored === themes.system ? getSystemTheme() : stored);
        } else {
          setTheme(themes.system);
        }
      }
      function toggleTheme() {
        const current = getStoredTheme() || themes.system;
        let next;
        if (current === themes.system) {
          next = getSystemTheme() === 'dark' ? themes.light : themes.dark;
        } else if (current === themes.dark) {
          next = themes.light;
        } else {
          next = themes.dark;
        }
        localStorage.setItem(themeKey, next);
        setTheme(next);
      }

      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
        const stored = getStoredTheme();
        if (!stored || stored === themes.system) {
          setTheme(themes.system);
        }
      });

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ensureButtonUpdated);
      } else {
        ensureButtonUpdated();
      }

      window.toggleTheme = toggleTheme;
      initTheme();
    })();
