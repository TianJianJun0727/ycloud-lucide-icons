---
title: TypeScript 支持 - Astro
description: 了解 @ycloud-web/icons-astro 包导出的 TypeScript 类型。
---

# TypeScript 支持

下面是 `@ycloud-web/icons-astro` 包导出的类型。
在 TypeScript Astro 项目中使用 YCloud Icons 时，可以用这些类型为组件补充类型约束。

## `YCloudIconsProps`

导出图标组件支持的全部 props，以及其他 SVG 属性。可参考 [MDN 上的 SVG Presentation Attributes](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation)。

```ts
interface YCloudIconsProps extends SVGAttributes<SVGSVGElement> {
  name?: string;
  color?: string;
  size?: number | string;
  'stroke-width'?: number | string;
  absoluteStrokeWidth?: boolean;
  [key: string]: any; // Any other SVG attributes
}
```

### 使用 `IconProps`

<!-- Rename this to YCloudIconsProps -->

当你封装自定义图标组件时，可以使用 `IconProps` 接口为 props 添加类型。

```astro
---
import { icons, type IconProps } from '@ycloud-web/icons-astro';

interface Props extends IconProps {
  name: keyof typeof icons;
}

const { name, ...restProps } = Astro.props;
const Icon = icons[name];
---

<Icon {...restProps} />
```

## `YCloudIcon`

单个图标组件的类型。需要为保存图标组件的变量或 prop 添加类型时，可以使用它。

```ts
import type { Component } from 'astro/types';
import type { IconProps } from '@ycloud-web/icons-astro';

type YCloudIcon = Component<IconProps>;
```

### 使用 `YCloudIcon`

当你需要直接接收或传递图标组件时，可以使用 `YCloudIcon` 类型。

```astro
---
import { House, Library, Cog, type Icon as IconType } from '@ycloud-web/icons-astro';

type MenuItem = {
  name: string;
  href: string;
  icon: typeof IconType;
};

const menuItems: MenuItem[] = [
  {
    name: 'Home',
    href: '/',
    icon: House,
  },
  {
    name: 'Blog',
    href: '/blog',
    icon: Library,
  },
  {
    name: 'Projects',
    href: '/projects',
    icon: Cog,
  },
];
---

{
  menuItems.map((item) => (
    <a href={item.href}>
      <item.icon />
      <span>{item.name}</span>
    </a>
  ))
}
```

## `IconNode`

图标原始 SVG 结构的类型。它是一个由 SVG 元素及其属性组成的数组，用于渲染图标。
应用代码通常不会直接使用它，但在自定义图标或 YCloud Icons Lab 等进阶场景中会很有用。

```ts
type IconNode = [
  elementName: 'circle' | 'ellipse' | 'g' | 'line' | 'path' | 'polygon' | 'polyline' | 'rect',
  attrs: HTMLAttributes<'svg'>,
][];
```

### 使用 `IconNode`

当你需要处理图标的原始 SVG 结构时，可以使用 `IconNode` 类型。

```astro [CustomIcon.astro]
---
import { type IconNode, Icon } from '@ycloud-web/icons-astro';

const customIcon: IconNode = [
  ['circle', { cx: 12, cy: 12, r: 10 }],
  ['line', { x1: 12, y1: 8, x2: 12, y2: 12 }],
  ['line', { x1: 12, y1: 16, x2: 12, y2: 16 }],
];
---

<Icon iconNode={customIcon} size="24" color="blue" />
```
