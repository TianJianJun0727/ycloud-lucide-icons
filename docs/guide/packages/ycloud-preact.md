---
title: YCloud Icons for Preact
---

# YCloud Icons for Preact

面向 Preact 的 YCloud Icons 组件，在更小体积下提供接近 React 的开发体验。每个图标都是轻量 Preact 组件，并渲染为内联 SVG，适合需要 React 兼容性且关注包体积的应用。

**你可以用它完成：**

- 使用接近 React 语法和模式的 Preact 图标组件。
- 借助 Preact 更小的运行时构建轻量应用。
- 以更低 JavaScript 开销创建快速响应的界面。
- 在保持 React 兼容性的同时降低包体积。
- 集成到现有 Preact 应用和组件库中。

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

可以传入额外 props 调整图标：

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

如需自定义图标外观，可以直接向组件传入自定义 props。组件支持把所有 SVG 属性作为 props 传入，因此可以灵活设置 SVG 元素样式。可在 [MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation) 查看 SVG Presentation Attributes 列表。

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

> Preact 不会转换 SVG 属性名。因此如果要修改 `stroke-linejoin` 这类属性，需要按 kebab-case 传入，也就是 SVG 规范中的写法。可参考 [Preact 文档](https://preactjs.com/guide/v10/differences-to-react/#svg-inside-jsx)中的相关说明。

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

无障碍最佳实践请参考[无障碍指南](../accessibility.md)。
