---
title: TypeScript - Preact
description: 了解 `@ycloud-web/icons-preact` 包导出的类型，以及如何在 Preact 应用中使用它们。
---

# TypeScript 支持

下面是 `@ycloud-web/icons-preact` 包导出的类型。
在 TypeScript React 项目中使用 YCloud Icons 时，可以用这些类型为组件补充类型约束。

## `YCloudIconsProps`

导出图标组件支持的全部 props，以及其他 SVG 属性。可参考 [MDN 上的 SVG Presentation Attributes](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation)。

```ts
interface YCloudIconsProps {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  absoluteStrokeWidth?: boolean;
  [key: string]: any; // Any other SVG attributes
}
```

### 使用 `YCloudIconsProps`

当你封装自定义图标组件，或需要处理图标 props 时，可以使用 `YCloudIconsProps` 接口。

```tsx
import { type YCloudIconsProps } from '@ycloud-web/icons-preact';
import { Camera } from '@ycloud-web/icons-preact';

const WrapIcon = (props: YCloudIconsProps) => {
  return <Camera {...props} />;
};

export default WrapIcon;
```

## `YCloudIcon`

单个图标组件的类型。

```ts
type YCloudIcon = React.FC<YCloudIconsProps>;
```

### 使用 `YCloudIcon`

当你需要直接接收或传递图标组件时，可以使用 `YCloudIcon` 类型。

```tsx
import { type YCloudIcon } from '@ycloud-web/icons-preact';

interface ButtonProps {
  icon: YCloudIcon;
  label: string;
}

const IconButton = ({ icon: Icon, label }: ButtonProps) => {
  return (
    <button aria-label={label}>
      <Icon size={16} />
    </button>
  );
};

export default IconButton;
```

## `IconNode`

图标原始 SVG 结构的类型。它是一个由 SVG 元素及其属性组成的数组，用于渲染图标。
应用代码通常不会直接使用它，但在自定义图标等进阶场景中会很有用。

```ts
type IconNode = [elementName: string, attrs: Record<string, string | number>][];
```

### 使用 `IconNode`

当你需要处理图标的原始 SVG 结构时，可以使用 `IconNode` 类型。

```tsx
import { type IconNode, Icon } from '@ycloud-web/icons-preact';

const customIcon: IconNode = [
  ['circle', { cx: 12, cy: 12, r: 10 }],
  ['line', { x1: 12, y1: 8, x2: 12, y2: 12 }],
  ['line', { x1: 12, y1: 16, x2: 12, y2: 16 }],
];

const MyCustomIcon = () => {
  return (
    <Icon
      iconNode={customIcon}
      size={24}
      color="blue"
    />
  );
};

export default MyCustomIcon;
```
