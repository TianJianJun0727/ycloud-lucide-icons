# YCloud Icons for Solid

面向 SolidJS 的 YCloud Icons 组件，充分利用 Solid 的细粒度响应式系统。每个图标都是一个响应式 Solid 组件，并渲染为内联 SVG，可借助 Solid 的编译期优化和响应式原语获得优秀性能。

**你可以用它完成：**

- 使用具备细粒度响应能力的 SolidJS 图标组件。
- 借助 Solid 的响应式系统创建高性能界面。
- 构建可响应 signals 和 stores 的动态图标组件。
- 与 Solid 的 JSX 和组件模式自然集成。
- 通过直接导入图标和更低运行时开销优化性能。

## 安装

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

## 使用方式

YCloud Icons 基于 ES Modules 构建，因此可以完整支持 tree-shaking。

每个图标都可以作为 Solid component 导入，并渲染为内联 SVG 元素。这样最终产物只会包含你实际导入的图标，其余未使用的图标会被构建工具移除。

### 示例

可以传入额外 props 调整图标：

```jsx
import { Camera } from '@ycloud-web/icons-solid';

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

如果 Vite dev server 出现加载或性能问题，可以直接从 `@ycloud-web/icons-solid/icons` 目录导入图标：

```jsx
import Camera from '@ycloud-web/icons-solid/icons/camera';

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

## 一个通用图标组件

可以创建一个通用图标组件来加载图标，但不推荐这样做。

::: danger
下面的示例会导入所有 ES Modules，使用时需要谨慎。导入全部图标会显著增加应用构建体积，并影响性能。使用 `Webpack`、`Rollup` 或 `Vite` 等构建工具时尤其需要注意。
:::

### Icon 组件示例

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

#### 使用 Icon 组件

```tsx
import Icon from './Icon';

const App = () => {
  return <Icon name="home" />;
};

export default App;
```

## 无障碍

默认情况下，我们会通过 `aria-hidden="true"` 对屏幕阅读器隐藏图标。

可以通过 aria-label 添加无障碍属性。

```jsx
import { Check } from '@ycloud-web/icons-solid';

const App = () => {
  return <Check aria-label="Task completed" />;
};
```

无障碍最佳实践请参考[无障碍指南](../accessibility.md)。
