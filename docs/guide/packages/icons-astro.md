# YCloud Icons for Astro

面向 Astro 的 YCloud Icons 组件，适配 Astro 的 Islands 架构和多框架能力。每个图标都是一个 Astro 组件，并渲染为内联 SVG，适合静态站点和服务端渲染场景。

**你可以用它完成：**

- 将图标作为 Astro 组件使用，不增加 JavaScript 运行时开销。
- 使用优化后的 SVG 图标构建快速的静态网站。
- 与 Astro 的 component islands 和 partial hydration 自然集成。
- 在多框架应用中跨不同 UI 库复用图标。
- 通过直接导入图标和构建时渲染优化性能。

## 安装

::: code-group

```sh [pnpm]
pnpm add @ycloud-web/icons-astro@latest
```

```sh [yarn]
yarn add @ycloud-web/icons-astro@latest
```

```sh [npm]
npm install @ycloud-web/icons-astro@latest
```

```sh [bun]
bun add @ycloud-web/icons-astro@latest
```

:::

## 版本要求

Astro `^4 || ^5 || ^6`。文档示例使用当前最新稳定版本。

## 使用方式

YCloud Icons 基于 ES Modules 构建，因此可以完整支持 tree-shaking。

每个图标都可以作为 Astro 组件导入，并渲染为内联 SVG 元素。这样最终产物只会包含你实际导入的图标，其余图标会被 tree-shaking 移除。

### 示例

默认用法：

```astro
---
import { Skull } from '@ycloud-web/icons-astro';
---

<Skull />
```

可以传入额外 props 调整图标：

```astro
---
import { Camera } from '@ycloud-web/icons-astro';
---

<Camera color="#ff3e98" />
```

为了获得更快的构建和加载速度，可以直接从 `@ycloud-web/icons-astro/icons` 目录导入图标：

```astro
---
import CircleAlert from '@ycloud-web/icons-astro/icons/circle-alert';
---

<CircleAlert color="#ff3e98" />
```

## 属性

| 名称                  | 类型      | 默认值       |
| --------------------- | --------- | ------------ |
| `size`                | _number_  | 24           |
| `color`               | _string_  | currentColor |
| `stroke-width`        | _number_  | 2            |
| `absoluteStrokeWidth` | _boolean_ | false        |

### 应用 props

如需自定义图标外观，可以直接向组件传入自定义 props。组件支持把所有 SVG 属性作为 props 传入，因此可以灵活设置 SVG 元素样式。可在 [MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation) 查看 SVG Presentation Attributes 列表。

```astro
---
import { Phone } from '@ycloud-web/icons-astro';
---

<Phone fill="#333" />
```

这样会得到一个填充效果的电话图标。

## 类型

该包包含所有图标的类型定义。需要动态渲染图标时会很有用。

### 示例

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

## 一个通用图标组件

可以创建一个通用图标组件来加载图标，但不推荐这样做。

::: danger
下面的示例会导入所有 ES Modules，使用时需要谨慎。导入全部图标会显著增加应用构建体积。如果是在服务器环境中做 SSG 或 SSR，这可能还能接受；但如果是在 serverless 环境中做 SSR，更大的包体积会增加冷启动时间，从而影响应用性能。
:::

### Icon 组件示例

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

### 使用 Icon 组件

```astro
---
import YCloudIcon from './YCloudIcon.astro';
---

<YCloudIcon name="Menu" />
```

## 无障碍

默认情况下，我们会通过 `aria-hidden="true"` 对屏幕阅读器隐藏图标。

可以通过 aria-label 添加无障碍属性。

```jsx
---
import { Check } from '@ycloud-web/icons-astro';
---

<Check aria-label="Task completed" />
```

无障碍最佳实践请参考[无障碍指南](../accessibility.md)。
