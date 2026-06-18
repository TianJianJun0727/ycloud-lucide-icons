# YCloud Solid

SolidJS components for YCloud icons that leverage Solid's fine-grained reactivity system. Each icon is a reactive Solid component that renders as an inline SVG, providing exceptional performance through Solid's compile-time optimizations and reactive primitives.

**What you can accomplish:**

- Use icons as SolidJS components with fine-grained reactivity
- Create highly performant interfaces with Solid's reactive system
- Build dynamic icon components that respond to signals and stores
- Integrate seamlessly with Solid's JSX and component patterns
- Optimize performance with direct icon imports and minimal runtime overhead

## Installation

::: code-group

```sh [pnpm]
pnpm add @ycloud-web/icons-solid
```

```sh [yarn]
yarn add @ycloud-web/icons-solid
```

```sh [npm]
npm install @ycloud-web/icons-solid
```

```sh [bun]
bun add @ycloud-web/icons-solid
```

:::

## How to use

YCloud is built with ES Modules, so it's completely tree-shakable.

Each icon can be imported as a Solid component, which renders an inline SVG element. This way, only the icons that are imported into your project are included in the final bundle. The rest of the icons are tree-shaken away.

### Example

Additional props can be passed to adjust the icon:

```jsx
import { Camera } from '@ycloud-web/icons-solid';

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

Vite loading/performing issues with the dev server can be resolved by import icons directly from the `@ycloud-web/icons-solid/icons` directory:

```jsx
import Camera from '@ycloud-web/icons-solid/icons/camera';

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

## With YCloud Icons Lab or custom icons

[YCloud Icons Lab](https://github.com/TianJianJun0727/ycloud-icons-lab) is a collection of icons that are not part of the YCloud Icons main library.

They can be used by using the `Icon` component.
All props like the regular YCloud icons can be passed to adjust the icon appearance.

### Using the `Icon` component

This creates a single icon based on the iconNode passed and renders a YCloud icon component.

```jsx
import { Icon } from '@ycloud-web/icons-solid';
import { sausage } from '@ycloud-web/icons-lab';

const App = () => (
  <Icon
    iconNode={sausage}
    color="red"
  />
);
```

## One generic icon component

It is possible to create one generic icon component to load icons. It's not recommended.

::: danger
The example below imports all ES Modules, so exercise caution when using it. Importing all icons will significantly increase the build size of the application, negatively affecting its performance. This is especially important to keep in mind when using bundlers like `Webpack`, `Rollup`, or `Vite`.
:::

### Icon Component Example

```tsx
import { icons, type YCloudIconsProps } from '@ycloud-web/icons-solid';
import { splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

interface IconProps extends YCloudIconsProps {
  name: keyof typeof icons;
}

const Icon = (props: IconProps) => {
  const [local, others] = splitProps(props, ['name']);

  return (
    <Dynamic
      component={icons[local.name]}
      {...others}
    />
  );
};

export default Icon;
```

#### Using the Icon Component

```tsx
import Icon from './Icon';

const App = () => {
  return <Icon name="home" />;
};

export default App;
```

## Accessibility

By default, we hide icons from screen readers using `aria-hidden="true"`.

You can add accessibility attributes using aria-labels.

```jsx
import { Check } from '@ycloud-web/icons-solid';

const App = () => {
  return <Check aria-label="Task completed" />;
};
```

For best practices on accessibility, please see our [accessibility guide](../accessibility.md).
