<p align="center">
  <a href="https://github.com/TianJianJun0727/ycloud-icons">
    <img src="https://tianjianjun0727.github.io/ycloud-icons/package-logos/ycloud.svg" alt="YCloud Icons web icon library." width="540">
  </a>
</p>

<p align="center">
Language: <a href="./README.md">中文</a> | English
</p>

<p align="center">
YCloud Icons icon library for web and JavaScript applications.
</p>

<div align="center">

[![npm](https://img.shields.io/npm/v/@ycloud-web/icons?color=blue)](https://www.npmjs.com/package/@ycloud-web/icons)
![NPM Downloads](https://img.shields.io/npm/dw/@ycloud-web/icons)
[![License](https://img.shields.io/badge/license-ISC-green)](https://tianjianjun0727.github.io/ycloud-icons/license)

</div>

<p align="center">
  <a href="https://tianjianjun0727.github.io/ycloud-icons/en/guide/">Introduction</a>
  ·
  <a href="https://tianjianjun0727.github.io/ycloud-icons/en/icons/">Icons</a>
  ·
  <a href="https://tianjianjun0727.github.io/ycloud-icons/en/guide/ycloud">Docs</a>
  ·
  <a href="https://tianjianjun0727.github.io/ycloud-icons/license">License</a>
</p>

# @ycloud-web/icons

Core YCloud Icons package for web and JavaScript applications.

## Installation

```sh
pnpm add @ycloud-web/icons@latest
```

```sh
npm install @ycloud-web/icons@latest
```

```sh
yarn add @ycloud-web/icons@latest
```

```sh
bun add @ycloud-web/icons@latest
```

### Version requirements

No framework peer dependency.

### CDN

```html
<!-- Development build -->
<script src="https://unpkg.com/@ycloud-web/icons@latest/dist/umd/icons.js"></script>

<!-- Production build -->
<script src="https://unpkg.com/@ycloud-web/icons@latest"></script>
```

The CDN build exposes the global variable `ycloud`:

```html
<i data-ycloud="menu"></i>

<script>
  ycloud.createIcons();
</script>
```

## Documentation

Read the full documentation at [tianjianjun0727.github.io/ycloud-icons](https://tianjianjun0727.github.io/ycloud-icons/en/guide/ycloud).

## License

YCloud Icons is developed from [Lucide](https://github.com/lucide-icons/lucide) and keeps the upstream ISC license and required third-party notices. This package provides the core runtime for web and JavaScript applications.

YCloud Icons is released under the ISC License. See [LICENSE](https://tianjianjun0727.github.io/ycloud-icons/license).
