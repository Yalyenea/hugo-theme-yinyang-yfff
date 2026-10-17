# Yinyang yfff

Shared Hugo theme for [blog.yfff.me](https://blog.yfff.me/) and [weekly.yfff.me](https://weekly.yfff.me/).

Requires Hugo 0.167.0 extended. The theme owns layouts, styles, scripts, translations and the default content archetype. Each site keeps its content, static assets, configuration and deployment workflow.

## Configuration

- `params.mainSections`: content sections included in the archive and RSS.
- `params.showPostNavigation`: show previous and next article links.
- `params.author`: author name and homepage.
- `params.giscus`: repository and discussion category for comments.
- `languages.*.menus.main`: localized navigation using Hugo `pageRef` or `url` entries.
- `languages.*.params.searchPlaceholder`: localized search prompt.

Set `math = true` in article front matter to load KaTeX. Fenced `pseudo` blocks automatically load algorithm styling, rendering and KaTeX. Ordinary pages omit these optional assets.

## Shared implementation

- `layouts/_default/baseof.html`: page frame.
- `layouts/partials/post-list.html`: archive entries shared by home and section pages.
- `layouts/`: article, search, RSS, metadata, navigation and image rendering.
- `assets/css/`: layout, article, syntax and optional algorithm styles.
- `assets/js/`: theme switching, reading controls, mathematics and optional algorithms.
- `i18n/`: Chinese and English interface labels.
- `scripts/build.sh`: Hugo build followed by Pagefind 1.5.2 indexing; run from a site root.
- `scripts/generate_orbit.py`: regenerate the shared background illustration with `uv run`.

Both sites use this repository as a Git submodule. Publish a theme change first, then update the pinned submodule commit in each site that needs it.

MIT. Original Yinyang theme by Joway Wang; see `LICENSE.md`.
