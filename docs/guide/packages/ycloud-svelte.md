# YCloud Icons for Svelte

Svelte components for YCloud icons that work seamlessly with both Svelte 4 and Svelte 5. Each icon is a reactive Svelte component that renders as an inline SVG, providing excellent performance and integration with Svelte's reactive system and modern features.

**What you can accomplish:**

- Use icons as Svelte components with full reactivity and TypeScript support
- Bind icon properties to reactive variables and stores
- Create dynamic icon systems that respond to application state
- Build type-safe interfaces with comprehensive TypeScript definitions
- Optimize bundle sizes with direct icon imports and tree-shaking

## 安装

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

## 使用方式

YCloud Icons 基于 ES Modules 构建，因此可以完整支持 tree-shaking。

每个图标都可以作为 Svelte component 导入，并渲染为内联 SVG 元素。这样最终产物只会包含你实际导入的图标，其余未使用的图标会被构建工具移除。

### 示例

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

| 名称                  | 类型      | 默认值       |
| --------------------- | --------- | ------------ |
| `size`                | _number_  | 24           |
| `color`               | _string_  | currentColor |
| `strokeWidth`         | _number_  | 2            |
| `absoluteStrokeWidth` | _boolean_ | false        |

### 应用 props

To customize the appearance of an icon, you can pass custom properties as props directly to the component. The component accepts all SVG attributes as props, which allows flexible styling of the SVG elements. See the list of SVG Presentation Attributes on [MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation).

```svelte
<script>
  import { Phone } from '@ycloud-web/icons-svelte';
</script>

<Phone fill="#333" />
```

This results a filled phone icon.

## 类型

该包包含所有图标的类型定义。无论使用 TypeScript 还是 JSDoc，当你想通过 `svelte:component` 指令动态加载图标时，这都会很有用。

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

## 使用 YCloud Icons Lab 或自定义图标

[YCloud Icons Lab](https://github.com/TianJianJun0727/ycloud-icons-lab) 收录了一批不属于 YCloud Icons 主库的图标。

可以通过 `Icon` 组件使用它们。
和普通 YCloud Icons 一样，也可以传入各类 props 调整图标外观。

### 使用 `Icon` 组件

下面会根据传入的 iconNode 创建并渲染一个 YCloud 图标组件。

```svelte
<script>
import { Icon } from '@ycloud-web/icons-svelte';
import { pear, sausage } from '@ycloud-web/icons-lab';
</script>

<Icon iconNode={pear} />
<Icon iconNode={sausage} color="red"/>
```

## 一个通用图标组件

可以创建一个通用图标组件来加载图标，但不推荐这样做。

::: danger
下面的示例会导入所有 ES Modules，使用时需要谨慎。导入全部图标会显著增加应用构建体积，并影响性能。使用 `Webpack`、`Rollup` 或 `Vite` 等构建工具时尤其需要注意。
:::

### Icon 组件示例

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

#### 使用 Icon 组件

```svelte
<script>
  import YCloudIcon from './YCloudIcon';
</script>

<YCloudIcon name="Menu" />
```

## 无障碍

默认情况下，我们会通过 `aria-hidden="true"` 对屏幕阅读器隐藏图标。

可以通过 aria-label 添加无障碍属性。

```svelte
<script>
  import { Check } from '@ycloud-web/icons-svelte';
</script>

<Check aria-label="Task completed" />
```

For best practices on accessibility, please see our [accessibility guide](../accessibility.md).
