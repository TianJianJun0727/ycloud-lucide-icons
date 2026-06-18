---
title: Typescript - Svelte
description: Learn about the different types exported by the `@ycloud-web/icons-svelte` package and how to use them in your Svelte application.
---

# TypeScript Support

List of exported types from the `@ycloud-web/icons-svelte` package.
These can be used to type your components when using YCloud icons in a TypeScript Svelte project.

## `YCloudIconsProps`

Exports all props that can be passed to an icon component and any other SVG attributes, see: [SVG Presentation Attributes on MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation).

```ts
interface YCloudIconsProps extends SVGAttributes<SVGSVGElement> {
  name?: string;
  color?: string;
  size?: number | string;
  strokeWidth?: number | string;
  absoluteStrokeWidth?: boolean;
  children?: Snippet;
  [key: string]: any; // Any other SVG attributes
}
```

### Using `YCloudIconsProps`

You can use the `YCloudIconsProps` interface to type props for your custom icon components.

::: code-group

```svelte [IconWrapper.svelte]
<script lang="ts">
import { Camera, type YCloudIconsProps } from '@ycloud-web/icons-svelte';

let props: YCloudIconsProps = $props();
</script>

<template>
  <div>
    <Camera {...props} />
  </div>
</template>
```

:::

## `YCloudIcon`

Type for individual icon components, this is use full when you want to type a variable or prop that holds an icon component.

```ts
import type { Component } from 'svelte';

type YCloudIcon = Component<YCloudIconsProps>;
```

### Using `YCloudIcon`

You can use the `YCloudIcon` type when you need to work with icon components directly.

::: code-group

```svelte [Svelte 5]
<script lang="ts">
  import { Home, Library, Cog, type YCloudIcon } from '@ycloud-web/icons-svelte';

  type MenuItem = {
    name: string;
    href: string;
    icon: YCloudIcon;
  };

  const menuItems: MenuItem[] = [
    {
      name: 'Home',
      href: '/',
      icon: Home
    },
    {
      name: 'Blog',
      href: '/blog',
      icon: Library
    },
    {
      name: 'Projects',
      href: '/projects',
      icon: Cog
    }
  ];
</script>

{#each menuItems as item}
  {@const Icon = item.icon}
  <a href={item.href}>
    <Icon />
    <span>{item.name}</span>
  </a>
{/each}
```

```svelte [Svelte 4]
<script lang="ts">
  import { Home, Library, Cog, type Icon } from '@ycloud-web/icons-svelte';
  import type { ComponentType } from 'svelte';

  type MenuItem = {
    name: string;
    href: string;
    icon: ComponentType<Icon>;
  };

  const menuItems: MenuItem[] = [
    {
      name: 'Home',
      href: '/',
      icon: Home
    },
    {
      name: 'Blog',
      href: '/blog',
      icon: Library
    },
    {
      name: 'Projects',
      href: '/projects',
      icon: Cog
    }
  ];
</script>

{#each menuItems as item}
  {@const Icon = item.icon}
  <a href={item.href}>
    <Icon />
    <span>{item.name}</span>
  </a>
{/each}

```

:::

## `IconNode`

Type for the raw SVG structure of an icon. This is an array of SVG elements and their attributes to render the icon.
Not commonly used directly in application code. But can be useful for advanced use cases, such as using custom icons or with YCloud Icons Lab.

```ts
type IconNode = [
  elementName: 'circle' | 'ellipse' | 'g' | 'line' | 'path' | 'polygon' | 'polyline' | 'rect',
  attrs: SVGAttributes<SVGSVGElement>,
][];
```

### Using `IconNode`

You can use the `IconNode` type when you need to work with the raw SVG structure of an icon.

::: code-group

```svelte [CustomIcon.svelte]
<script lang="ts">
import { type IconNode, Icon } from '@ycloud-web/icons-svelte';

const customIcon: IconNode = [
  ['circle', { cx: 12, cy: 12, r: 10 }],
  ['line', { x1: 12, y1: 8, x2: 12, y2: 12 }],
  ['line', { x1: 12, y1: 16, x2: 12, y2: 16 }],
];
</script>

<Icon iconNode={customIcon} size="24" color="blue" />
```

:::
