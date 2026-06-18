# YCloud React Native

React Native components for YCloud icons that work seamlessly across iOS and Android platforms. Built on top of react-native-svg, each icon renders as a native SVG component, providing consistent visual appearance and performance across mobile devices.

**What you can accomplish:**

- Use icons as React Native components with platform-consistent rendering
- Build cross-platform mobile apps with scalable vector icons
- Create responsive interfaces that adapt to different screen densities
- Integrate with React Native's styling system and animation libraries
- Maintain consistent icon appearance across iOS and Android platforms

## Installation

First, ensure that you have `react-native-svg` (version between 12 and 15) installed. Then, install the package:

::: code-group

```sh [pnpm]
pnpm add @ycloud-web/icons-react-native
```

```sh [yarn]
yarn add @ycloud-web/icons-react-native
```

```sh [npm]
npm install @ycloud-web/icons-react-native
```

```sh [bun]
bun add @ycloud-web/icons-react-native
```

:::

## How to use

Each icon can be imported as a React component.

### Example

Additional props can be passed to adjust the icon:

```jsx
import { Camera } from '@ycloud-web/icons-react-native';

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

To customize the appearance of an icon, you can pass custom properties as props directly to the component. The component accepts all SVG attributes as props, which allows flexible styling of the SVG elements.

```jsx
// Usage
const App = () => {
  return <Camera fill="red" />;
};
```

## With YCloud Icons Lab or custom icons

[YCloud Icons Lab](https://github.com/TianJianJun0727/ycloud-icons-lab) is a collection of icons that are not part of the YCloud Icons main library.

They can be used by using the `Icon` component.
All props like regular YCloud icons can be passed to adjust the icon appearance.

### Using the `Icon` component

This creates a single icon based on the iconNode passed and renders a YCloud icon component.

```jsx
import { Icon } from '@ycloud-web/icons-react-native';
import { coconut } from '@ycloud-web/icons-lab';

const App = () => <Icon iconNode={coconut} />;
```

## One generic icon component

It is possible to create one generic icon component to load icons, but it is not recommended.

::: warning
The example below imports all ES Modules, so exercise caution when using it. Importing all icons will significantly increase the build size of the application, negatively affecting its performance. This is especially important to keep in mind when using bundlers like `Webpack`, `Rollup`, or `Vite`.
:::

### Icon Component Example

```tsx
import * as icons from '@ycloud-web/icons-react-native/icons';

interface IconProps {
  name: keyof typeof icons;
  color?: string;
  size?: number;
}

const Icon = ({ name, color, size }: IconProps) => {
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

```tsx
import Icon from './Icon';

const App = () => {
  return <Icon name="House" />;
};

export default App;
```
