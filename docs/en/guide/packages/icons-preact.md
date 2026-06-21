# YCloud Icons Preact

YCloud Icons for Preact provides small Preact components with React-like ergonomics.

**You can use it to:**

- Use icons in Preact JSX.
- Benefit from a small runtime footprint.
- Customize icons through props and standard SVG attributes.

## Installation

::: code-group

```sh [pnpm]
pnpm add @ycloud-web/icons-preact@latest
```

```sh [npm]
npm install @ycloud-web/icons-preact@latest
```

```sh [yarn]
yarn add @ycloud-web/icons-preact@latest
```

```sh [bun]
bun add @ycloud-web/icons-preact@latest
```

:::

## Version Requirements

Preact `^10.27.2`.

## Usage

```tsx
import { House } from '@ycloud-web/icons-preact';

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

Read the full guide: [YCloud Icons Preact](/en/guide/preact/).

## License

YCloud Icons is released under the ISC License. It is based on [Lucide](https://github.com/lucide-icons/lucide) and keeps the required upstream license and third-party notices.
