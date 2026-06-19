# YCloud Icons for Astro

Astro components for YCloud icons that work perfectly with Astro's island architecture and multi-framework support. Each icon is an Astro component that renders as an inline SVG, providing excellent performance for static sites and server-side rendering scenarios.

**What you can accomplish:**

- Use icons as Astro components with zero JavaScript runtime overhead
- Build fast, static websites with optimized SVG icons
- Integrate seamlessly with Astro's component islands and partial hydration
- Create multi-framework applications where icons work across different UI libraries
- Optimize performance with direct icon imports and build-time rendering

## 安装

::: code-group

```sh [pnpm]
pnpm add @ycloud-web/icons-astro
```

```sh [yarn]
yarn add @ycloud-web/icons-astro
```

```sh [npm]
npm install @ycloud-web/icons-astro
```

```sh [bun]
bun add @ycloud-web/icons-astro
```

:::

## 使用方式

YCloud Icons 基于 ES Modules 构建，因此可以完整支持 tree-shaking。

Each icon can be imported as an Astro component, which renders an inline SVG element. This way, only the icons that are imported into your project are included in the final bundle. The rest of the icons are tree-shaken away.

### 示例

Default usage:

```astro
---
import { Skull } from '@ycloud-web/icons-astro';
---

<Skull />
```

Additional props can be passed to adjust the icon:

```astro
---
import { Camera } from '@ycloud-web/icons-astro';
---

<Camera color="#ff3e98" />
```

For faster builds and load times, you can import icons directly from the `@ycloud-web/icons-astro/icons` directory:

```astro
---
import CircleAlert from '@ycloud-web/icons-astro/icons/circle-alert';
---

<CircleAlert color="#ff3e98" />
```

## Props

| 名称                  | 类型      | 默认值       |
| --------------------- | --------- | ------------ |
| `size`                | _number_  | 24           |
| `color`               | _string_  | currentColor |
| `stroke-width`        | _number_  | 2            |
| `absoluteStrokeWidth` | _boolean_ | false        |

### 应用 props

To customize the appearance of an icon, you can pass custom properties as props directly to the component. The component accepts all SVG attributes as props, which allows flexible styling of the SVG elements. See the list of SVG Presentation Attributes on [MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation).

```astro
---
import { Phone } from '@ycloud-web/icons-astro';
---

<Phone fill="#333" />
```

This results a filled phone icon.

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

## 使用 YCloud Icons Lab 或自定义图标

[YCloud Icons Lab](https://github.com/TianJianJun0727/ycloud-icons-lab) 收录了一批不属于 YCloud Icons 主库的图标。

可以通过 `Icon` 组件使用它们。
普通 YCloud Icons 支持的所有 props 都可以传入，用于调整图标外观。

### 使用 `Icon` 组件

下面会根据传入的 iconNode 创建并渲染一个 YCloud 图标组件。

```astro
---
import { Icon } from '@ycloud-web/icons-astro';
import { burger, sausage } from '@ycloud-web/icons-lab';
---

<Icon iconNode={burger} />
<Icon iconNode={sausage} color="red"/>
```

## 一个通用图标组件

可以创建一个通用图标组件来加载图标，但不推荐这样做。

::: danger
The example below imports all ES Modules, so exercise caution when using it. Importing all icons will significantly increase the build size of the application. This may be passable if you're doing SSG and SSR in server environments. However if you're doing SSR in serverless environments, it could negatively affect your app's performance, as a bigger bundle size will translate to an increase in cold starts.
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

For best practices on accessibility, please see our [accessibility guide](../accessibility.md).
