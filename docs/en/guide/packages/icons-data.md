# YCloud Icons Data

YCloud Icons Data exposes tree-shakable icon node data and helpers for custom renderers and framework integrations.

The package now covers both icon families:

- Generic icons are exported from `@ycloud-web/icons-data` as normalized node data for the generic builders.
- Business icons are exported from `@ycloud-web/icons-data/business` as cleaned SVG strings, data URIs, and index data.

**You can use it to:**

- Consume icon nodes without a framework component layer.
- Build SVG strings, DOM elements, or data URLs from icon data.
- Create custom integrations for frameworks that are not shipped by this repository.

## Installation

::: code-group

```sh [pnpm]
pnpm add @ycloud-web/icons-data@latest
```

```sh [npm]
npm install @ycloud-web/icons-data@latest
```

```sh [yarn]
yarn add @ycloud-web/icons-data@latest
```

```sh [bun]
bun add @ycloud-web/icons-data@latest
```

:::

## Version Requirements

No framework peer dependency.

## Usage

```ts
import { House } from '@ycloud-web/icons-data';
import { buildYCloudSvg } from '@ycloud-web/icons-data/build';

const svg = buildYCloudSvg(House);
```

Business icon data:

```ts
import { billingDataUri, businessIconNames, getBusinessIcon } from '@ycloud-web/icons-data/business';

const billing = getBusinessIcon('billing');
const imageSource = billingDataUri;
const availableBusinessIcons = businessIconNames;
```

Business icons are not generic stroke node data, so they do not support generic builder params such as `strokeWidth` or `absoluteStrokeWidth`.

## Documentation

Read the full guide: [YCloud Icons Data](/en/packages).

## License

YCloud Icons is released under the ISC License. It is based on [Lucide](https://github.com/lucide-icons/lucide) and keeps the required upstream license and third-party notices.
