# YCloud Icons for React Native

React Native components for YCloud icons that work seamlessly across iOS and Android platforms. Built on top of react-native-svg, each icon renders as a native SVG component, providing consistent visual appearance and performance across mobile devices.

**What you can accomplish:**

- Use icons as React Native components with platform-consistent rendering
- Build cross-platform mobile apps with scalable vector icons
- Create responsive interfaces that adapt to different screen densities
- Integrate with React Native's styling system and animation libraries
- Maintain consistent icon appearance across iOS and Android platforms

## 安装

首先确保已经安装 `react-native-svg`（版本 12 到 15）。然后安装图标包：

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

## 使用方式

Each icon can be imported as a React component.

### 示例

Additional props can be passed to adjust the icon:

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

## Props

| 名称                  | 类型      | 默认值       |
| --------------------- | --------- | ------------ |
| `size`                | _number_  | 24           |
| `color`               | _string_  | currentColor |
| `strokeWidth`         | _number_  | 2            |
| `absoluteStrokeWidth` | _boolean_ | false        |

### 应用 props

To customize the appearance of an icon, you can pass custom properties as props directly to the component. The component accepts all SVG attributes as props, which allows flexible styling of the SVG elements.

```jsx
// 使用
const App = () => {
  return <Camera fill="red" />;
};
```

## 使用 YCloud Icons Lab 或自定义图标

[YCloud Icons Lab](https://github.com/TianJianJun0727/ycloud-icons-lab) 收录了一批不属于 YCloud Icons 主库的图标。

可以通过 `Icon` 组件使用它们。
和普通 YCloud Icons 一样，也可以传入各类 props 调整图标外观。

### 使用 `Icon` 组件

下面会根据传入的 iconNode 创建并渲染一个 YCloud 图标组件。

```jsx
import { Icon } from '@ycloud-web/icons-react-native';
import { coconut } from '@ycloud-web/icons-lab';

const App = () => <Icon iconNode={coconut} />;
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
