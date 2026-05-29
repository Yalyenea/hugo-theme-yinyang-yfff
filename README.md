# yinyang-my-fork

`yinyang-my-fork` is a Hugo theme forked from [joway/hugo-theme-yinyang](https://github.com/joway/hugo-theme-yinyang) and tailored for a personal writing blog.

It keeps the original minimalist direction, but this fork has already diverged in behavior and should be treated as its own maintained variant.

## What This Fork Adds

- Minimal light/dark theme toggle with a simplified `◐` button
- System font stack by default, without external font dependency
- Fingerprinted external CSS bundle for better browser caching
- Native lazy loading for Markdown images and gallery images
- `giscus` comments instead of Disqus
- KaTeX rendering with Obsidian-friendly `$...$` and `$$...$$` delimiters
- Table of contents shown only when the article actually has headings
- Built-in reading shortcuts with a Vim-style help overlay
- Theme and `giscus` color scheme kept in sync

## Current Shortcut Keys

- `?`: open or close shortcut help
- `j` / `k`: scroll down or up
- `d` / `u`: half-page down or up
- `gg`: jump to top
- `Shift + g`: jump to bottom
- `t`: jump to article content
- `c`: jump to comments
- `[`: previous post
- `]`: next post
- `s`: toggle theme
- `Esc`: close shortcut help

## Installation

From the root of your Hugo site:

```bash
git submodule add git@github.com:Yalyenea/hugo-theme-yinyang-yfff.git themes/yinyang-my-fork
```

Then set the theme in your site config:

```toml
theme = "yinyang-my-fork"
```

## Minimal Configuration

```toml
baseURL = "https://example.com/"
languageCode = "en-us"
title = "My Blog"
theme = "yinyang-my-fork"
DefaultContentLanguage = "en"

[markup]
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = true

[languages]
  [languages.en]
    contentDir = "content/en"
    languageName = "English"
    weight = 1

[params]
  description = "A minimal Hugo blog"
  headTitle = "My Blog"
  mainSections = ["posts"]
  postHeaderContent = ""
  postFooterContent = ""
  extraCSSFiles = []
  extraHead = ""
  extraBody = ""
  favicon = "/favicon.ico"
  staticPrefix = ""

  [params.author]
    name = "Your Name"
    homepage = "https://example.com"

[[params.socials]]
name = "GitHub"
link = "https://github.com/yourname"
```

## Recommended Content Settings

The theme expects standard Hugo Markdown rendering with unsafe HTML enabled:

```toml
[markup]
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = true
```

If you use multiple languages, configure them in the usual Hugo way:

```toml
[languages]
  [languages.en]
    contentDir = "content/en"
    languageName = "English"
    weight = 1
  [languages.cn]
    contentDir = "content/cn"
    languageName = "Chinese"
    weight = 2
```

## Theme Parameters

### Core

- `params.headTitle`: site title shown in the header
- `params.description`: subtitle shown below the title
- `params.mainSections`: content sections treated as posts
- `params.favicon`: favicon path
- `params.staticPrefix`: optional CDN/static prefix

If `headTitle` is not set, the theme falls back to `params.author.name`.

### Header / Footer Injection

- `params.postHeaderContent`: HTML inserted before article content
- `params.postFooterContent`: HTML inserted after article content
- `params.extraHead`: extra HTML injected into `<head>`
- `params.extraBody`: extra HTML injected before `</body>`

### Extra Styles

```toml
[params]
extraCSSFiles = ["css/custom.css"]
```

### Social Links

```toml
[[params.socials]]
name = "RSS"
link = "/index.xml"
```

### Author

```toml
[params.author]
name = "Your Name"
homepage = "https://example.com"
```

## Comments With giscus

This fork supports `giscus` out of the box.

Example:

```toml
[params.giscus]
enabled = true
repo = "owner/repo"
repoId = "YOUR_REPO_ID"
category = "General"
categoryId = "YOUR_CATEGORY_ID"
mapping = "pathname"
strict = "0"
reactionsEnabled = "1"
emitMetadata = "0"
inputPosition = "top"
lang = "en"
themeLight = "light"
themeDark = "dark"
```

Required fields:

- `enabled`
- `repo`
- `repoId`
- `category`
- `categoryId`

The theme automatically keeps the embedded `giscus` theme aligned with the site light/dark mode.

## Math With KaTeX

Math is loaded only when enabled for the current page or globally in site params.

Per page front matter:

```toml
math = true
```

Legacy compatibility is also kept:

```toml
mathjax = true
```

Supported delimiters:

- `$...$`
- `$$...$$`
- `\(...\)`
- `\[...\]`

This makes the theme work well with Obsidian-style writing.

## Table Of Contents

The single post template renders a TOC only when the generated table of contents actually contains headings.

Behavior in this fork:

- no fold triangle
- visible by default
- divider shown under the TOC title

## Images

Markdown images are rendered with:

- `loading="lazy"`
- `decoding="async"`

This applies to the render hook in [`layouts/_markup/render-image.html`](layouts/_markup/render-image.html).

## Structure

Important files in this fork:

- [`theme.toml`](theme.toml)
- [`layouts/partials/head.html`](layouts/partials/head.html)
- [`layouts/partials/header.html`](layouts/partials/header.html)
- [`layouts/partials/giscus.html`](layouts/partials/giscus.html)
- [`layouts/partials/scripts.html`](layouts/partials/scripts.html)
- [`layouts/_default/single.html`](layouts/_default/single.html)
- [`assets/css/index.css`](assets/css/index.css)

## Notes

- The header currently includes fixed links to `/posts/` and `/weekly/`
- The theme is optimized around a personal blog rather than a fully generic Hugo distribution
- If you want to publish this as a reusable public theme, the next cleanup step should be making navigation configurable instead of hardcoded

## License

MIT. See [`LICENSE.md`](LICENSE.md).
