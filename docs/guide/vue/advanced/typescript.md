---
title: TypeScript - Vue
description: 了解 `@ycloud-web/icons-vue` 包导出的类型，以及如何在 Vue 应用中使用它们。
---

# TypeScript 支持

下面是 `@ycloud-web/icons-vue` 包导出的类型。
在 TypeScript Vue 项目中使用 YCloud Icons 时，可以用这些类型为组件补充类型约束。

## `YCloudIconsProps`

导出图标组件支持的全部 props，以及其他 SVG 属性。可参考 [MDN 上的 SVG Presentation Attributes](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation)。

```ts
interface YCloudIconsProps {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  absoluteStrokeWidth?: boolean;
  [key: string]: any; // Any other SVG attributes
}
```

### 使用 `YCloudIconsProps`

当你封装自定义图标组件时，可以使用 `YCloudIconsProps` 接口为 props 添加类型。

::: code-group

```vue [IconWrapper.vue]
<script lang="ts" setup>
import { type YCloudIconsProps } from '@ycloud-web/icons-vue';
import { Camera } from '@ycloud-web/icons-vue';

defineProps<YCloudIconsProps>();
</script>

<template>
  <div>
    <Camera v-bind="$props" />
  </div>
</template>
```

:::

## `YCloudIcon`

单个图标组件的类型。需要为保存图标组件的变量或 prop 添加类型时，可以使用它。

```ts
type YCloudIcon = React.FC<YCloudIconsProps>;
```

### 使用 `YCloudIcon`

当你需要直接接收或传递图标组件时，可以使用 `YCloudIcon` 类型。

::: code-group

```vue [IconButton.vue]
<script lang="ts" setup>
import { type YCloudIconsProps } from '@ycloud-web/icons-vue';
import { Camera } from '@ycloud-web/icons-vue';

defineProps<{
  icon: YCloudIcon;
  label: string;
}>();
</script>

<template>
  <button :aria-label="label">
    <component
      :is="icon"
      :size="16"
    />
  </button>
</template>
```

:::

## `IconNode`

图标原始 SVG 结构的类型。它是一个由 SVG 元素及其属性组成的数组，用于渲染图标。
应用代码通常不会直接使用它，但在自定义图标或 YCloud Icons Lab 等进阶场景中会很有用。

```ts
type IconNode = [elementName: string, attrs: Record<string, string | number>][];
```

### 使用 `IconNode`

当你需要处理图标的原始 SVG 结构时，可以使用 `IconNode` 类型。

::: code-group

```vue [CustomIcon.vue]
<script lang="ts" setup>
import { type IconNode, Icon } from '@ycloud-web/icons-vue';

const customIcon: IconNode = [
  ['circle', { cx: 12, cy: 12, r: 10 }],
  ['line', { x1: 12, y1: 8, x2: 12, y2: 12 }],
  ['line', { x1: 12, y1: 16, x2: 12, y2: 16 }],
];
</script>

<template>
  <Icon
    :iconNode="customIcon"
    size="24"
    color="blue"
  />
</template>
```

:::
