# YCloud Icons for Svelte

面向 Svelte 5 的 YCloud Icons 组件。每个图标都是响应式 Svelte 组件，并渲染为内联 SVG，能很好地融入 Svelte 的响应式系统和现代能力。

**你可以用它完成：**

- 使用具备完整响应式能力和 TypeScript 支持的 Svelte 图标组件。
- 将图标属性绑定到响应式变量和 stores。
- 创建可响应应用状态变化的动态图标系统。
- 借助完整 TypeScript 类型定义构建类型安全的界面。
- 通过直接导入图标和 tree-shaking 优化包体积。

## 安装

::: code-group

```sh [pnpm]
pnpm add @ycloud-web/icons-svelte@latest
```

```sh [yarn]
yarn add @ycloud-web/icons-svelte@latest
```

```sh [npm]
npm install @ycloud-web/icons-svelte@latest
```

```sh [bun]
bun add @ycloud-web/icons-svelte@latest
```

:::

## 版本要求

`@ycloud-web/icons-svelte` 与 Lucide 官方保持一致，要求 Svelte `^5`。文档中的交互示例使用当前最新 Svelte 5 版本。

## 使用方式

YCloud Icons 基于 ES Modules 构建，因此可以完整支持 tree-shaking。

每个图标都可以作为 Svelte component 导入，并渲染为内联 SVG 元素。这样最终产物只会包含你实际导入的图标，其余未使用的图标会被构建工具移除。

### 示例

默认用法：

```svelte
<script>
  import { Skull } from '@ycloud-web/icons-svelte';
</script>

<Skull />
```

可以传入额外 props 调整图标：

```svelte
<script>
  import { Camera } from '@ycloud-web/icons-svelte';
</script>

<Camera color="#ff3e98" />
```

为了获得更快的构建和加载速度，可以直接从 `@ycloud-web/icons-svelte/icons` 目录导入图标：

```svelte
<script>
  import CircleAlert from '@ycloud-web/icons-svelte/icons/circle-alert';
</script>

<CircleAlert color="#ff3e98" />
```

## 属性

| 名称                  | 类型      | 默认值       |
| --------------------- | --------- | ------------ |
| `size`                | _number_  | 24           |
| `color`               | _string_  | currentColor |
| `strokeWidth`         | _number_  | 2            |
| `absoluteStrokeWidth` | _boolean_ | false        |

### 应用 props

如需自定义图标外观，可以直接向组件传入自定义 props。组件支持把所有 SVG 属性作为 props 传入，因此可以灵活设置 SVG 元素样式。可在 [MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation) 查看 SVG Presentation Attributes 列表。

```svelte
<script>
  import { Phone } from '@ycloud-web/icons-svelte';
</script>

<Phone fill="#333" />
```

这样会得到一个填充效果的电话图标。

## 类型

该包包含所有图标的类型定义。无论使用 TypeScript 还是 JSDoc，当你想动态加载图标时，这都会很有用。

### TypeScript 示例

```svelte
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

### JSDoc 示例

```svelte
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

## 一个通用图标组件

可以创建一个通用图标组件来加载图标，但不推荐这样做。

::: danger
下面的示例会导入所有 ES Modules，使用时需要谨慎。导入全部图标会显著增加应用构建体积，并影响性能。使用 `Webpack`、`Rollup` 或 `Vite` 等构建工具时尤其需要注意。
:::

### Icon 组件示例

```svelte
<script>
  import * as icons from '@ycloud-web/icons-svelte';
  let { name, ...props } = $props();

  const Icon = icons[name];
</script>

<Icon {...props} />
```

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

无障碍最佳实践请参考[无障碍指南](../accessibility.md)。
