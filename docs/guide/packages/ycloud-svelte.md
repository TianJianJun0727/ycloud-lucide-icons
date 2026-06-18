# YCloud Svelte

Svelte components for YCloud icons that work seamlessly with both Svelte 4 and Svelte 5. Each icon is a reactive Svelte component that renders as an inline SVG, providing excellent performance and integration with Svelte's reactive system and modern features.

**What you can accomplish:**

- Use icons as Svelte components with full reactivity and TypeScript support
- Bind icon properties to reactive variables and stores
- Create dynamic icon systems that respond to application state
- Build type-safe interfaces with comprehensive TypeScript definitions
- Optimize bundle sizes with direct icon imports and tree-shaking

## Installation

::: code-group

```sh [pnpm]
pnpm add @ycloud-web/icons-svelte
```

```sh [yarn]
yarn add @ycloud-web/icons-svelte
```

```sh [npm]
npm install @ycloud-web/icons-svelte
```

```sh [bun]
bun add @ycloud-web/icons-svelte
```

:::

> `@ycloud-web/icons-svelte` is only for Svelte 5, for Svelte 4 use the `@ycloud-web/icons-svelte` package.

## How to use

YCloud is built with ES Modules, so it's completely tree-shakable.

Each icon can be imported as a Svelte component, which renders an inline SVG element. This way, only the icons that are imported into your project are included in the final bundle. The rest of the icons are tree-shaken away.

### Example

Default usage:

```svelte
<script>
  import { Skull } from '@ycloud-web/icons-svelte';
</script>

<Skull />
```

Additional props can be passed to adjust the icon:

```svelte
<script>
  import { Camera } from '@ycloud-web/icons-svelte';
</script>

<Camera color="#ff3e98" />
```

For faster builds and load times, you can import icons directly from the `@ycloud-web/icons-svelte/icons` directory:

```svelte
<script>
  import CircleAlert from '@ycloud-web/icons-svelte/icons/circle-alert';
</script>

<CircleAlert color="#ff3e98" />
```

## Props

| name                  | type      | default      |
| --------------------- | --------- | ------------ |
| `size`                | _number_  | 24           |
| `color`               | _string_  | currentColor |
| `strokeWidth`         | _number_  | 2            |
| `absoluteStrokeWidth` | _boolean_ | false        |

### Applying props

To customize the appearance of an icon, you can pass custom properties as props directly to the component. The component accepts all SVG attributes as props, which allows flexible styling of the SVG elements. See the list of SVG Presentation Attributes on [MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation).

```svelte
<script>
  import { Phone } from '@ycloud-web/icons-svelte';
</script>

<Phone fill="#333" />
```

This results a filled phone icon.

## Types

The package includes type definitions for all icons. This is useful if you want to dynamically load icons with the `svelte:component` directive whether you are using TypeScript or JSDoc.

### TypeScript Example

::: code-group

```svelte [Svelte 5]
<script lang="ts">
  import { Home, Library, Cog, type Icon as IconType } from '@ycloud-web/icons-svelte';

  type MenuItem = {
    name: string;
    href: string;
    icon: typeof IconType;
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

### JSDoc Example

::: code-group

```svelte [Svelte 5]
<script>
  import { Home, Library, Cog } from '@ycloud-web/icons-svelte';

  /**
   * @typedef {Object} MenuItem
   * @property {string} name
   * @property {string} href
   * @property {typeof import('@ycloud-web/icons-svelte').Icon} icon
   */

  /** @type {MenuItem[]} */
  const menuItems = [
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
<script>
  import { Home, Library, Cog } from '@ycloud-web/icons-svelte';

  /**
   * @typedef {Object} MenuItem
   * @property {string} name
   * @property {string} href
   * @property {import('svelte').ComponentType<import('@ycloud-web/icons-svelte').Icon>} icon
   */

  /** @type {MenuItem[]} */
  const menuItems = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
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

For more details about typing the `svelte:component` directive, see the [Svelte documentation](https://svelte.dev/docs/typescript#types-componenttype).

## With YCloud Icons Lab or custom icons

[YCloud Icons Lab](https://github.com/TianJianJun0727/ycloud-icons-lab) is a collection of icons that are not part of the YCloud Icons main library.

They can be used by using the `Icon` component.
All props like the regular YCloud icons can be passed to adjust the icon appearance.

### Using the `Icon` component

This creates a single icon based on the iconNode passed and renders a YCloud icon component.

```svelte
<script>
import { Icon } from '@ycloud-web/icons-svelte';
import { pear, sausage } from '@ycloud-web/icons-lab';
</script>

<Icon iconNode={pear} />
<Icon iconNode={sausage} color="red"/>
```

## One generic icon component

It is possible to create one generic icon component to load icons, but it is not recommended.

::: danger
The example below imports all ES Modules, so exercise caution when using it. Importing all icons will significantly increase the build size of the application, negatively affecting its performance. This is especially important when using bundlers like `Webpack`, `Rollup`, or `Vite`.
:::

### Icon Component Example

::: code-group

```svelte [Svelte 5]
<script>
  import * as icons from '@ycloud-web/icons-svelte';
  let { name, ...props } = $props();

  const Icon = icons[name];
</script>

<Icon {...props} />
```

```svelte [Svelte 4]
<script>
  import * as icons from '@ycloud-web/icons-svelte';
  export let name;
</script>

<svelte:component this={icons[name]} {...$$props} />
```

:::

#### Using the Icon Component

```svelte
<script>
  import YCloudIcon from './YCloudIcon';
</script>

<YCloudIcon name="Menu" />
```

## Accessibility

By default, we hide icons from screen readers using `aria-hidden="true"`.

You can add accessibility attributes using aria-labels.

```svelte
<script>
  import { Check } from '@ycloud-web/icons-svelte';
</script>

<Check aria-label="Task completed" />
```

For best practices on accessibility, please see our [accessibility guide](../accessibility.md).
