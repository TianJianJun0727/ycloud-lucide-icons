---
title: YCloud Icons for Preact
---

# YCloud Icons for Preact

Preact components for YCloud icons that provide React-like development experience with a smaller footprint. Each icon is a lightweight Preact component that renders as an inline SVG, perfect for applications that need React compatibility with minimal bundle size.

**What you can accomplish:**

- Use icons as Preact components with React-like syntax and patterns
- Build lightweight applications with Preact's smaller runtime
- Create fast, responsive interfaces with minimal JavaScript overhead
- Maintain React compatibility while reducing bundle size
- Integrate with existing Preact applications and component libraries

## 安装

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

## 使用方式

YCloud Icons 基于 ES Modules 构建，因此可以完整支持 tree-shaking。

每个图标都可以作为 Preact component 导入，并渲染为内联 SVG 元素。这样最终产物只会包含你实际导入的图标，其余未使用的图标会被构建工具移除。

### 示例

Additional props can be passed to adjust the icon:

```jsx
import { Camera } from '@ycloud-web/icons-preact';

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

To customize the appearance of an icon, you can pass custom properties as props directly to the component. The component accepts all SVG attributes as props, which allows flexible styling of the SVG elements. See the list of SVG Presentation Attributes on [MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation).

```jsx
// 使用
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

## 使用 YCloud Icons Lab 或自定义图标

[YCloud Icons Lab](https://github.com/TianJianJun0727/ycloud-icons-lab) 收录了一批不属于 YCloud Icons 主库的图标。

可以通过 `Icon` 组件使用它们。
和普通 YCloud Icons 一样，也可以传入各类 props 调整图标外观。

### 使用 `Icon` 组件

下面会根据传入的 iconNode 创建并渲染一个 YCloud 图标组件。

```jsx
import { Icon } from '@ycloud-web/icons-preact';
import { coconut } from '@ycloud-web/icons-lab';

const App = () => <Icon iconNode={coconut} />;
```

## 一个通用图标组件

可以创建一个通用图标组件来加载图标，但不推荐这样做。

::: danger
下面的示例会导入所有 ES Modules，使用时需要谨慎。导入全部图标会显著增加应用构建体积，并影响性能。使用 `Webpack`、`Rollup` 或 `Vite` 等构建工具时尤其需要注意。
:::

### Icon 组件示例

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

#### 使用 Icon 组件

```jsx
import Icon from './Icon';

const App = () => {
  return <Icon name="house" />;
};

export default App;
```

## 无障碍

默认情况下，我们会通过 `aria-hidden="true"` 对屏幕阅读器隐藏图标。

可以通过 aria-label 添加无障碍属性。

```jsx
import { Check } from '@ycloud-web/icons-preact';

const App = () => {
  return <Check aria-label="Task completed" />;
};
```

For best practices on accessibility, please see our [accessibility guide](../accessibility.md).
