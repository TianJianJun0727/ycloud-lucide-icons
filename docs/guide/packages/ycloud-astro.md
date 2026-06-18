# YCloud Astro

Astro components for YCloud icons that work perfectly with Astro's island architecture and multi-framework support. Each icon is an Astro component that renders as an inline SVG, providing excellent performance for static sites and server-side rendering scenarios.

**What you can accomplish:**

- Use icons as Astro components with zero JavaScript runtime overhead
- Build fast, static websites with optimized SVG icons
- Integrate seamlessly with Astro's component islands and partial hydration
- Create multi-framework applications where icons work across different UI libraries
- Optimize performance with direct icon imports and build-time rendering

## Installation

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

## How to use

YCloud is built with ES Modules, so it's completely tree-shakable.

Each icon can be imported as an Astro component, which renders an inline SVG element. This way, only the icons that are imported into your project are included in the final bundle. The rest of the icons are tree-shaken away.

### Example

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

| name                  | type      | default      |
| --------------------- | --------- | ------------ |
| `size`                | _number_  | 24           |
| `color`               | _string_  | currentColor |
| `stroke-width`        | _number_  | 2            |
| `absoluteStrokeWidth` | _boolean_ | false        |

### Applying props

To customize the appearance of an icon, you can pass custom properties as props directly to the component. The component accepts all SVG attributes as props, which allows flexible styling of the SVG elements. See the list of SVG Presentation Attributes on [MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation).

```astro
---
import { Phone } from '@ycloud-web/icons-astro';
---

<Phone fill="#333" />
```

This results a filled phone icon.

## Types

The package includes type definitions for all icons. This is useful if you want to dynamically render icons.

### Example

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

## With YCloud Icons Lab or custom icons

[YCloud Icons Lab](https://github.com/TianJianJun0727/ycloud-icons-lab) is a collection of icons that are not part of the YCloud Icons main library.

They can be used by using the `Icon` component.
All props of the regular YCloud icons can be passed to adjust the icon appearance.

### Using the `Icon` component

This creates a single icon based on the iconNode passed and renders a YCloud icon component.

```astro
---
import { Icon } from '@ycloud-web/icons-astro';
import { burger, sausage } from '@ycloud-web/icons-lab';
---

<Icon iconNode={burger} />
<Icon iconNode={sausage} color="red"/>
```

## One generic icon component

It is possible to create one generic icon component to load icons, but it is not recommended.

::: danger
The example below imports all ES Modules, so exercise caution when using it. Importing all icons will significantly increase the build size of the application. This may be passable if you're doing SSG and SSR in server environments. However if you're doing SSR in serverless environments, it could negatively affect your app's performance, as a bigger bundle size will translate to an increase in cold starts.
:::

### Icon Component Example

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

### Using the Icon Component

```astro
---
import YCloudIcon from './YCloudIcon.astro';
---

<YCloudIcon name="Menu" />
```

## Accessibility

By default, we hide icons from screen readers using `aria-hidden="true"`.

You can add accessibility attributes using aria-labels.

```jsx
---
import { Check } from '@ycloud-web/icons-astro';
---

<Check aria-label="Task completed" />
```

For best practices on accessibility, please see our [accessibility guide](../accessibility.md).
