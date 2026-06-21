# YCloud Icons Vue

YCloud Icons for Vue provides standalone Vue components that render optimized inline SVG icons.

**You can use it to:**

- Use icons directly in Vue components.
- Keep imports tree-shakable so unused icons stay out of the final bundle.
- Customize size, color, stroke width, and standard SVG attributes with props.

## Installation

::: code-group

```sh [pnpm]
pnpm add @ycloud-web/icons-vue@latest
```

```sh [npm]
npm install @ycloud-web/icons-vue@latest
```

```sh [yarn]
yarn add @ycloud-web/icons-vue@latest
```

```sh [bun]
bun add @ycloud-web/icons-vue@latest
```

:::

## Version Requirements

Vue `>=3.0.1`.

## Usage

```vue
<script setup>
import { House } from '@ycloud-web/icons-vue';
</script>

<template>
  <House
    :size="32"
    color="#ff5a5f"
  />
</template>
```

## Documentation

Read the full guide: [YCloud Icons Vue](/en/guide/vue/).

## License

YCloud Icons is released under the ISC License. It is based on [Lucide](https://github.com/lucide-icons/lucide) and keeps the required upstream license and third-party notices.
