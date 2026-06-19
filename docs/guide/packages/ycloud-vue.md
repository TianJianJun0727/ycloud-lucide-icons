# `@ycloud-web/icons-vue`

Vue components for YCloud icons. Each icon is available as a standalone Vue component that renders an optimized inline SVG.

**What you can accomplish:**

- Use icons as Vue components with `<script setup>` or standard component registration
- Keep imports tree-shakable so unused icons stay out of your bundle
- Customize size, color, stroke width, and SVG attributes through props
- Keep component names typed and searchable in editors

## 安装

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

## 使用方式

YCloud Icons 基于 ES Modules 构建，因此可以完整支持 tree-shaking。

Each icon can be imported as a Vue component, which renders an inline SVG Element. This way only the icons that are imported into your project are included in the final bundle. The rest of the icons are tree-shaken away.

### 示例

可以传入额外 props 调整图标。

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

| 名称                  | 类型      | 默认值       |
| --------------------- | --------- | ------------ |
| `size`                | _number_  | 24           |
| `color`               | _string_  | currentColor |
| `stroke-width`        | _number_  | 2            |
| `absoluteStrokeWidth` | _boolean_ | false        |
| `default-class`       | _string_  | ycloud-icon  |

### 应用 props

To customize the appearance of an icon, you can pass custom properties as props directly to the component. The component accepts all SVG attributes as props, which allows flexible styling of the SVG elements. See the list of SVG Presentation Attributes on [MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation).

```vue
<template>
  <Camera fill="red" />
</template>
```

## 使用 YCloud Icons Lab 或自定义图标

[YCloud Icons Lab](https://github.com/TianJianJun0727/ycloud-icons-lab) 收录了一批不属于 YCloud Icons 主库的图标。

可以通过 `Icon` 组件使用它们。
和普通 YCloud Icons 一样，也可以传入各类 props 调整图标外观。

### 使用 `Icon` 组件

下面会根据传入的 iconNode 创建并渲染一个 YCloud 图标组件。

```vue
<script setup>
import { Icon } from '@ycloud-web/icons-vue';
import { baseball } from '@ycloud-web/icons-lab';
</script>

<template>
  <Icon :iconNode="baseball" />
</template>
```

## 一个通用图标组件

可以创建一个通用图标组件来加载图标，但不推荐这样做。

::: danger
下面的示例会导入所有 ES Modules，使用时需要谨慎。导入全部图标会显著增加应用构建体积，并影响性能。使用 `Webpack`、`Rollup` 或 `Vite` 等构建工具时尤其需要注意。
:::

### Icon 组件示例

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

### 使用 Icon 组件

All other props listed above also work on the `Icon` Component.

```vue
<template>
  <div id="app">
    <Icon name="Airplay" />
  </div>
</template>
```

## 无障碍

默认情况下，我们会通过 `aria-hidden="true"` 对屏幕阅读器隐藏图标。

可以通过 aria-label 添加无障碍属性。

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
