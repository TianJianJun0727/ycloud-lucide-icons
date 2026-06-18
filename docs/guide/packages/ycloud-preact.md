---
title: YCloud Preact
---

# YCloud Preact

Preact components for YCloud icons that provide React-like development experience with a smaller footprint. Each icon is a lightweight Preact component that renders as an inline SVG, perfect for applications that need React compatibility with minimal bundle size.

**What you can accomplish:**

- Use icons as Preact components with React-like syntax and patterns
- Build lightweight applications with Preact's smaller runtime
- Create fast, responsive interfaces with minimal JavaScript overhead
- Maintain React compatibility while reducing bundle size
- Integrate with existing Preact applications and component libraries

## Installation

::: code-group

```sh [pnpm]
pnpm add @ycloud-web/icons-preact
```

```sh [yarn]
yarn add @ycloud-web/icons-preact
```

```sh [npm]
npm install @ycloud-web/icons-preact
```

```sh [bun]
bun add @ycloud-web/icons-preact
```

:::

## How to use

YCloud is built with ES Modules, so it's completely tree-shakable.

Each icon can be imported as a Preact component, which renders an inline SVG element. This way, only the icons that are imported into your project are included in the final bundle. The rest of the icons are tree-shaken away.

### Example

Additional props can be passed to adjust the icon:

```jsx
import { Camera } from '@ycloud-web/icons-preact';

// Usage
const App = () => {
  return (
    <Camera
      color="red"
      size={48}
    />
  );
};

export default App;
```

## Props

| name                  | type      | default      |
| --------------------- | --------- | ------------ |
| `size`                | _number_  | 24           |
| `color`               | _string_  | currentColor |
| `strokeWidth`         | _number_  | 2            |
| `absoluteStrokeWidth` | _boolean_ | false        |

### Applying props

To customize the appearance of an icon, you can pass custom properties as props directly to the component. The component accepts all SVG attributes as props, which allows flexible styling of the SVG elements. See the list of SVG Presentation Attributes on [MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation).

```jsx
// Usage
const App = () => {
  return (
    <Camera
      fill="red"
      stroke-linejoin="bevel"
    />
  );
};
```

> SVG attributes in Preact aren't transformed, so if you want to change for example the `stroke-linejoin` you need to pass it in kebabcase. Basically how the SVG spec want you to write it. See this topic in the [Preact documentation](https://preactjs.com/guide/v10/differences-to-react/#svg-inside-jsx).

## With YCloud Icons Lab or custom icons

[YCloud Icons Lab](https://github.com/TianJianJun0727/ycloud-icons-lab) is a collection of icons that are not part of the YCloud Icons main library.

They can be used by using the `Icon` component.
All props like regular YCloud icons can be passed to adjust the icon appearance.

### Using the `Icon` component

This creates a single icon based on the iconNode passed and renders a YCloud icon component.

```jsx
import { Icon } from '@ycloud-web/icons-preact';
import { coconut } from '@ycloud-web/icons-lab';

const App = () => <Icon iconNode={coconut} />;
```

## One generic icon component

It is possible to create one generic icon component to load icons, but it is not recommended.

::: danger
The example below imports all ES Modules, so exercise caution when using it. Importing all icons will significantly increase the build size of the application, negatively affecting its performance. This is especially important when using bundlers like `Webpack`, `Rollup`, or `Vite`.
:::

### Icon Component Example

```jsx
import { icons } from '@ycloud-web/icons-preact';

const Icon = ({ name, color, size }) => {
  const YCloudIcon = icons[name];

  return (
    <YCloudIcon
      color={color}
      size={size}
    />
  );
};

export default Icon;
```

#### Using the Icon Component

```jsx
import Icon from './Icon';

const App = () => {
  return <Icon name="house" />;
};

export default App;
```

## Accessibility

By default, we hide icons from screen readers using `aria-hidden="true"`.

You can add accessibility attributes using aria-labels.

```jsx
import { Check } from '@ycloud-web/icons-preact';

const App = () => {
  return <Check aria-label="Task completed" />;
};
```

For best practices on accessibility, please see our [accessibility guide](../accessibility.md).
