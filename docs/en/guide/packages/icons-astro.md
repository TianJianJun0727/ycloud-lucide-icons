# YCloud Icons Astro

YCloud Icons for Astro provides Astro components that render optimized inline SVG at build time.

**You can use it to:**

- Use icons without adding client-side JavaScript runtime.
- Render icons in static sites and server-rendered Astro pages.
- Import only the icons used by each page.

## Installation

::: code-group

```sh [pnpm]
pnpm add @ycloud-web/icons-astro@latest
```

```sh [npm]
npm install @ycloud-web/icons-astro@latest
```

```sh [yarn]
yarn add @ycloud-web/icons-astro@latest
```

```sh [bun]
bun add @ycloud-web/icons-astro@latest
```

:::

## Version Requirements

Astro `^4 || ^5 || ^6`.

## Usage

```astro
---
import House from '@ycloud-web/icons-astro/icons/house';
---

<House size={32} color="#ff5a5f" />
```

## Documentation

Read the full guide: [YCloud Icons Astro](/en/guide/astro/).

## License

YCloud Icons is released under the ISC License. It is based on [Lucide](https://github.com/lucide-icons/lucide) and keeps the required upstream license and third-party notices.
