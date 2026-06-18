---
title: TypeScript Support - Astro
description: Learn about the TypeScript types exported by the @ycloud-web/icons-astro package.
---

# TypeScript Support

List of exported types from the `@ycloud-web/icons-astro` package.
These can be used to type your components when using YCloud icons in a TypeScript Astro project.

## `YCloudIconsProps`

Exports all props that can be passed to an icon component and any other SVG attributes, see: [SVG Presentation Attributes on MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation).

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

### Using `IconProps`

<!-- Rename this to YCloudIconsProps -->

You can use the `IconProps` interface to type props for your custom icon components.

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

Type for individual icon components, this is use full when you want to type a variable or prop that holds an icon component.

```ts
import type { Component } from 'astro/types';
import type { IconProps } from '@ycloud-web/icons-astro';

type YCloudIcon = Component<IconProps>;
```

### Using `YCloudIcon`

You can use the `YCloudIcon` type when you need to work with icon components directly.

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

Type for the raw SVG structure of an icon. This is an array of SVG elements and their attributes to render the icon.
Not commonly used directly in application code. But can be useful for advanced use cases, such as using custom icons or with YCloud Icons Lab.

```ts
type IconNode = [
  elementName: 'circle' | 'ellipse' | 'g' | 'line' | 'path' | 'polygon' | 'polyline' | 'rect',
  attrs: HTMLAttributes<'svg'>,
][];
```

### Using `IconNode`

You can use the `IconNode` type when you need to work with the raw SVG structure of an icon.

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
