# YCloud Icons Static

YCloud Icons Static provides framework-agnostic assets, including generic SVG files, business SVG files, illustration SVG files, SVG sprites, generic Icon Font files, business Icon Font files, and SVG string modules.

**You can use it to:**

- Use generic, business, or illustration SVG files as images or CSS backgrounds.
- Use SVG sprites, generic Icon Font, or business Icon Font in static sites.
- Import SVG strings in Node.js or JavaScript projects.

## Installation

::: code-group

```sh [pnpm]
pnpm add @ycloud-web/icons-static@latest
```

```sh [npm]
npm install @ycloud-web/icons-static@latest
```

```sh [yarn]
yarn add @ycloud-web/icons-static@latest
```

```sh [bun]
bun add @ycloud-web/icons-static@latest
```

:::

## Version Requirements

No framework peer dependency.

## Usage

```html
<img
  src="./node_modules/@ycloud-web/icons-static/icons/house.svg"
  alt="House"
/>
```

```html
<img
  src="./node_modules/@ycloud-web/icons-static/business-icons/mono/billing.svg"
  alt="Billing"
/>
```

```html
<img
  src="./node_modules/@ycloud-web/icons-static/illustration-icons/empty-page.svg"
  alt="Empty page"
/>
```

## Documentation

Read the full guide: [YCloud Icons Static](/en/guide/static/).

## License

YCloud Icons is released under the ISC License. It is based on [Lucide](https://github.com/lucide-icons/lucide) and keeps the required upstream license and third-party notices.
