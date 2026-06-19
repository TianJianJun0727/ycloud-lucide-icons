# YCloud Icons for Solid

SolidJS components for YCloud icons that leverage Solid's fine-grained reactivity system. Each icon is a reactive Solid component that renders as an inline SVG, providing exceptional performance through Solid's compile-time optimizations and reactive primitives.

**What you can accomplish:**

- Use icons as SolidJS components with fine-grained reactivity
- Create highly performant interfaces with Solid's reactive system
- Build dynamic icon components that respond to signals and stores
- Integrate seamlessly with Solid's JSX and component patterns
- Optimize performance with direct icon imports and minimal runtime overhead

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

Additional props can be passed to adjust the icon:

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

Vite loading/performing issues with the dev server can be resolved by import icons directly from the `@ycloud-web/icons-solid/icons` directory:

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

## 使用 YCloud Icons Lab 或自定义图标

[YCloud Icons Lab](https://github.com/TianJianJun0727/ycloud-icons-lab) 收录了一批不属于 YCloud Icons 主库的图标。

可以通过 `Icon` 组件使用它们。
和普通 YCloud Icons 一样，也可以传入各类 props 调整图标外观。

### 使用 `Icon` 组件

下面会根据传入的 iconNode 创建并渲染一个 YCloud 图标组件。

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

For best practices on accessibility, please see our [accessibility guide](../accessibility.md).
