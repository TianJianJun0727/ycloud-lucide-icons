# YCloud Icons for React Native

面向 React Native 的 YCloud Icons 组件，可在 iOS 和 Android 平台一致工作。它基于 `react-native-svg` 构建，每个图标都会渲染为原生 SVG 组件，在移动设备上提供一致的视觉效果和性能。

**你可以用它完成：**

- 将图标作为 React Native 组件使用，并保持跨平台渲染一致。
- 使用可缩放矢量图标构建跨平台移动应用。
- 创建能适配不同屏幕密度的响应式界面。
- 与 React Native 的样式系统和动画库集成。
- 在 iOS 和 Android 平台保持一致的图标外观。

## 安装

首先确保已经安装 `react-native-svg`（版本 12 到 15）。然后安装图标包：

::: code-group

```sh [pnpm]
pnpm add @ycloud-web/icons-react-native@latest
```

```sh [yarn]
yarn add @ycloud-web/icons-react-native@latest
```

```sh [npm]
npm install @ycloud-web/icons-react-native@latest
```

```sh [bun]
bun add @ycloud-web/icons-react-native@latest
```

:::

## 版本要求

React `^17.0.0 || ^18.0.0 || ^19.0.0`，React Native 任意版本，`react-native-svg` `^12.0.0 || ^13.0.0 || ^14.0.0 || ^15.0.0`。

## 使用方式

每个图标都可以作为 React 组件导入。

### 示例

可以传入额外 props 调整图标：

```jsx
import { Camera } from '@ycloud-web/icons-react-native';

// 使用
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

## 属性

| 名称                  | 类型      | 默认值       |
| --------------------- | --------- | ------------ |
| `size`                | _number_  | 24           |
| `color`               | _string_  | currentColor |
| `strokeWidth`         | _number_  | 2            |
| `absoluteStrokeWidth` | _boolean_ | false        |

### 应用 props

如需自定义图标外观，可以直接向组件传入自定义 props。组件支持把所有 SVG 属性作为 props 传入，因此可以灵活设置 SVG 元素样式。

```jsx
// 使用
const App = () => {
  return <Camera fill="red" />;
};
```

## 一个通用图标组件

可以创建一个通用图标组件来加载图标，但不推荐这样做。

::: warning
下面的示例会导入所有 ES Modules，使用时需要谨慎。导入全部图标会显著增加应用构建体积，并影响性能。使用 `Webpack`、`Rollup` 或 `Vite` 等构建工具时尤其需要注意。
:::

### Icon 组件示例

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

#### 使用 Icon 组件

```tsx
import Icon from './Icon';

const App = () => {
  return <Icon name="House" />;
};

export default App;
```
