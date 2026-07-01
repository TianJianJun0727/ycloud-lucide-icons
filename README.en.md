# YCloud Icons

Language: [中文](./README.md) | English

YCloud Icons is a multi-framework SVG icon component library for YCloud products, admin systems, and design engineering workflows.

This project is developed from [Lucide](https://github.com/lucide-icons/lucide). It keeps the upstream ISC license and required third-party notices, while adapting the brand, Chinese-first source data, package names, documentation, publishing flow, and icon maintenance model for YCloud.

It provides consistent icon source data, tree-shakable component packages, static assets, and icon data packages. Application projects can install the package for their framework, import icons on demand, and get TypeScript autocomplete, refactoring, and type-checking support.

The repository maintains three SVG asset families:

- **Generic icons**: stored in `icons/`, using 24x24 linear SVGs, `icons/*.json` metadata, and the generic category system.
- **Business icons**: stored in `business-icons/`, grouped by first-level color-mode folders (`mono`, `duotone`, and `multicolor`), preserving business-specific geometry, and exported through each package's `business` subpath plus `business-icons/` and `business-font/` in the static package.
- **Illustrations**: stored in `illustration-icons/`, preserving original SVG colors and size attributes, and exported through each package's `illustration` subpath plus `illustration-icons/` in the static package.

## Packages

| Target          | Package                          | Source directory              |
| --------------- | -------------------------------- | ----------------------------- |
| Core JavaScript | `@ycloud-web/icons`              | `packages/icons`              |
| React           | `@ycloud-web/icons-react`        | `packages/icons-react`        |
| Vue             | `@ycloud-web/icons-vue`          | `packages/icons-vue`          |
| Svelte          | `@ycloud-web/icons-svelte`       | `packages/icons-svelte`       |
| Solid           | `@ycloud-web/icons-solid`        | `packages/icons-solid`        |
| Preact          | `@ycloud-web/icons-preact`       | `packages/icons-preact`       |
| React Native    | `@ycloud-web/icons-react-native` | `packages/icons-react-native` |
| Angular         | `@ycloud-web/icons-angular`      | `packages/icons-angular`      |
| Astro           | `@ycloud-web/icons-astro`        | `packages/icons-astro`        |
| Static assets   | `@ycloud-web/icons-static`       | `packages/icons-static`       |
| Icon data       | `@ycloud-web/icons-data`         | `packages/icons-data`         |

`@ycloud-web/icons-data` provides generic icon node data, business icon SVG / data URI data, and illustration SVG / data URI data.

## Usage Examples

React:

```tsx
import { Camera } from '@ycloud-web/icons-react';

export function Example() {
  return (
    <Camera
      size={24}
      color="currentColor"
    />
  );
}
```

Vue:

```vue
<script setup lang="ts">
import { Camera } from '@ycloud-web/icons-vue';
</script>

<template>
  <Camera
    :size="24"
    color="currentColor"
  />
</template>
```

Core JavaScript:

```ts
import { createIcons, Camera } from '@ycloud-web/icons';

createIcons({
  icons: {
    Camera,
  },
});
```

Business icons in React:

```tsx
import { Billing } from '@ycloud-web/icons-react/business';

export function BusinessExample() {
  return <Billing size={24} />;
}
```

Business icon font:

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/@ycloud-web/icons-static@latest/business-font/ycloud-business.css"
/>

<div class="business-icon-billing"></div>
```

Illustrations in React:

```tsx
import { EmptyPage } from '@ycloud-web/icons-react/illustration';

export function IllustrationExample() {
  return (
    <EmptyPage
      width="100%"
      height="auto"
    />
  );
}
```

## Design Goals

- **Component-first experience**: Use icons as real components in React, Vue, and other frameworks.
- **On-demand bundling**: Application bundles include only the icons that are actually imported.
- **Strong typing**: Component names, props, and icon data include type declarations for autocomplete, checking, and refactoring.
- **One source, many targets**: Generic icons, business icons, and illustrations are generated from their source directories into framework packages, static assets, and icon data.
- **Sustainable maintenance**: The generation pipeline is based on stable SVG data, build scripts, and package publishing workflows.

## Style Strategy

YCloud Icons keeps stable public component names such as `Camera`. The current release ships one outline-style icon set. If outline, filled, or other style variants are introduced later, they should be separated by explicit package entrypoints or directories instead of adding style suffixes to component names. This keeps component naming, icon search, and refactoring behavior consistent.

## Development

```sh
pnpm install
pnpm icons-react build
pnpm icons-vue build
pnpm docs:dev
```

The documentation site can enable or disable OG image generation with one command:

```sh
# Default development mode: disable OG image generation for faster startup and rebuilds
pnpm docs:dev

# Explicitly enable OG image generation
pnpm docs:dev:og

# Build docs while skipping per-page OG images
pnpm docs:build:no-og
```

## License

YCloud Icons is released under the ISC License. See [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) for upstream and third-party notices, and [LICENSE](./LICENSE) for the full license text.
