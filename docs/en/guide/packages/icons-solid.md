# YCloud Icons Solid

YCloud Icons for Solid provides lightweight Solid components that render optimized inline SVG icons.

**You can use it to:**

- Use icons naturally in Solid JSX.
- Customize icon props with Solid signals.
- Keep the runtime small with direct icon imports.

## Installation

::: code-group

```sh [pnpm]
pnpm add @ycloud-web/icons-solid@latest
```

```sh [npm]
npm install @ycloud-web/icons-solid@latest
```

```sh [yarn]
yarn add @ycloud-web/icons-solid@latest
```

```sh [bun]
bun add @ycloud-web/icons-solid@latest
```

:::

## Version Requirements

Solid `^1.4.7`.

## Usage

```tsx
import { House } from '@ycloud-web/icons-solid';

export function App() {
  return (
    <House
      size={32}
      color="#ff5a5f"
    />
  );
}
```

## Documentation

Read the full guide: [YCloud Icons Solid](/en/guide/solid/).

## License

YCloud Icons is released under the ISC License. It is based on [Lucide](https://github.com/lucide-icons/lucide) and keeps the required upstream license and third-party notices.
