<p align="center">
  <a href="https://github.com/TianJianJun0727/ycloud-icons">
    <img src="https://tianjianjun0727.github.io/ycloud-icons/package-logos/icons.svg" alt="" width="540">
  </a>
</p>

<p align="center">
Language: [中文](./README.md) | English
</p>

<p align="center">
Helper library that exports YCloud Icons icon data.
</p>

<div align="center">
  [![npm](https://img.shields.io/npm/v/@ycloud-web/icons-data?color=blue)](https://www.npmjs.com/package/@ycloud-web/icons-data)
  ![NPM Downloads](https://img.shields.io/npm/dw/@ycloud-web/icons-data)
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

# @ycloud-web/icons-data

Exports YCloud Icons icon data in a tree-shakable format and provides helper functions for dynamic icon imports.

## Installation

```sh
pnpm add @ycloud-web/icons-data@latest
```

```sh
npm install @ycloud-web/icons-data@latest
```

```sh
yarn add @ycloud-web/icons-data@latest
```

```sh
bun add @ycloud-web/icons-data@latest
```

### Version requirements

No framework peer dependency.

### Usage

```ts
import { House } from '@ycloud-web/icons-data';
import { buildYCloudSvg } from '@ycloud-web/icons-data/build';

const houseSvg = buildYCloudSvg(House, {
  size: 24,
  color: '#111827',
});
```

## Documentation

Read the full documentation at [YCloud Icons docs](https://tianjianjun0727.github.io/ycloud-icons/en/guide/ycloud).

## License

YCloud Icons is developed from [Lucide](https://github.com/lucide-icons/lucide) and keeps the upstream ISC license and required third-party notices. This package provides icon data and helper functions for dynamic icon imports.

YCloud Icons is released under the ISC License. See [LICENSE](https://tianjianjun0727.github.io/ycloud-icons/license).
