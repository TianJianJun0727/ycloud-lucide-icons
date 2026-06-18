# `@ycloud-web/icons-vue`

Vue components for YCloud icons. Each icon is available as a standalone Vue component that renders an optimized inline SVG.

**What you can accomplish:**

- Use icons as Vue components with `<script setup>` or standard component registration
- Keep imports tree-shakable so unused icons stay out of your bundle
- Customize size, color, stroke width, and SVG attributes through props
- Keep component names typed and searchable in editors

## Installation

::: code-group

```sh [pnpm]
pnpm add @ycloud-web/icons-vue
```

```sh [yarn]
yarn add @ycloud-web/icons-vue
```

```sh [npm]
npm install @ycloud-web/icons-vue
```

```sh [bun]
bun add @ycloud-web/icons-vue
```

:::

## How to use

YCloud is built with ES Modules, so it's completely tree-shakable.

Each icon can be imported as a Vue component, which renders an inline SVG Element. This way only the icons that are imported into your project are included in the final bundle. The rest of the icons are tree-shaken away.

### Example

You can pass additional props to adjust the icon.

```vue
<script setup>
import { Camera } from '@ycloud-web/icons-vue';
</script>

<template>
  <Camera
    color="red"
    :size="32"
  />
</template>
```

## Props

| name                  | type      | default      |
| --------------------- | --------- | ------------ |
| `size`                | _number_  | 24           |
| `color`               | _string_  | currentColor |
| `stroke-width`        | _number_  | 2            |
| `absoluteStrokeWidth` | _boolean_ | false        |
| `default-class`       | _string_  | ycloud-icon  |

### Applying props

To customize the appearance of an icon, you can pass custom properties as props directly to the component. The component accepts all SVG attributes as props, which allows flexible styling of the SVG elements. See the list of SVG Presentation Attributes on [MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation).

```vue
<template>
  <Camera fill="red" />
</template>
```

## With YCloud Icons Lab or custom icons

[YCloud Icons Lab](https://github.com/TianJianJun0727/ycloud-icons-lab) is a collection of icons that are not part of the YCloud Icons main library.

They can be used by using the `Icon` component.
All props like regular YCloud icons can be passed to adjust the icon appearance.

### Using the `Icon` component

This creates a single icon based on the iconNode passed and renders a YCloud icon component.

```vue
<script setup>
import { Icon } from '@ycloud-web/icons-vue';
import { baseball } from '@ycloud-web/icons-lab';
</script>

<template>
  <Icon :iconNode="baseball" />
</template>
```

## One generic icon component

It is possible to create one generic icon component to load icons, but it is not recommended.

::: danger
The example below imports all ES Modules, so exercise caution when using it. Importing all icons will significantly increase the build size of the application, negatively affecting its performance. This is especially important when using bundlers like `Webpack`, `Rollup`, or `Vite`.
:::

### Icon Component Example

```vue
<script setup>
import { computed } from 'vue';
import * as icons from '@ycloud-web/icons-vue';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  size: Number,
  color: String,
  strokeWidth: Number,
  defaultClass: String,
});

const icon = computed(() => icons[props.name]);
</script>

<template>
  <component
    :is="icon"
    :size="size"
    :color="color"
    :stroke-width="strokeWidth"
    :default-class="defaultClass"
  />
</template>
```

### Using the Icon Component

All other props listed above also work on the `Icon` Component.

```vue
<template>
  <div id="app">
    <Icon name="Airplay" />
  </div>
</template>
```

## Accessibility

By default, we hide icons from screen readers using `aria-hidden="true"`.

You can add accessibility attributes using aria-labels.

```vue
<script setup>
import { Check } from '@ycloud-web/icons-vue';
</script>

<template>
  <Check
    color="red"
    :size="32"
    aria-label="Task completed"
  />
</template>
```

For best practices on accessibility, please see our [accessibility guide](../accessibility.md).
