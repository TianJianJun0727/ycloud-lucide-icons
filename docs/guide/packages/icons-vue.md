# `@ycloud-web/icons-vue`

面向 Vue 的 YCloud Icons 组件。每个图标都作为独立 Vue 组件提供，并渲染为优化后的内联 SVG。

**你可以用它完成：**

- 通过 `<script setup>` 或标准组件注册方式使用图标。
- 保持导入可 tree-shaking，让未使用图标不会进入最终产物。
- 通过 props 自定义尺寸、颜色、描边宽度和 SVG 属性。
- 让组件名称在编辑器中具备类型提示和可搜索性。

## 安装

::: code-group

```sh [pnpm]
pnpm add @ycloud-web/icons-vue@latest
```

```sh [yarn]
yarn add @ycloud-web/icons-vue@latest
```

```sh [npm]
npm install @ycloud-web/icons-vue@latest
```

```sh [bun]
bun add @ycloud-web/icons-vue@latest
```

:::

## 版本要求

Vue `>=3.0.1`。文档示例使用当前最新稳定版本。

## 使用方式

YCloud Icons 基于 ES Modules 构建，因此可以完整支持 tree-shaking。

每个图标都可以作为 Vue 组件导入，并渲染为内联 SVG 元素。这样最终产物只会包含你实际导入的图标，其余图标会被 tree-shaking 移除。

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

## 属性

| 名称                  | 类型      | 默认值       |
| --------------------- | --------- | ------------ |
| `size`                | _number_  | 24           |
| `color`               | _string_  | currentColor |
| `stroke-width`        | _number_  | 2            |
| `absoluteStrokeWidth` | _boolean_ | false        |
| `default-class`       | _string_  | ycloud-icon  |

### 应用 props

如需自定义图标外观，可以直接向组件传入自定义 props。组件支持把所有 SVG 属性作为 props 传入，因此可以灵活设置 SVG 元素样式。可在 [MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation) 查看 SVG Presentation Attributes 列表。

```vue
<template>
  <Camera fill="red" />
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

上面列出的其他 props 同样适用于 `Icon` 组件。

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

无障碍最佳实践请参考[无障碍指南](../accessibility.md)。
