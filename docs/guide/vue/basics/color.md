---
title: 颜色 - Vue
description: 了解如何在 Vue 应用中通过 `color` prop 或父元素文本颜色调整图标颜色。
---

<script setup>
import Sandpack from '~/.vitepress/theme/components/editors/SandpackVue.vue'
</script>

# 颜色

默认情况下，所有图标的颜色值都是 `currentColor`。这个关键字会使用元素计算后的文本 `color` 值作为图标颜色。

可以在 [MDN 的 `currentColor` 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#currentcolor_keyword)中了解更多。

## 使用 `color` prop 调整颜色

可以直接向图标组件传入 color prop 来调整颜色。

::: sandpack {template=vue showTabs=false editorHeight=295 editorWidthPercentage=60 dependencies="@ycloud-web/icons-vue"}

```vue src/App.vue [active]
<script setup>
import { Smile } from '@ycloud-web/icons-vue';
</script>

<template>
  <Smile color="#3e9392" />
</template>
```

:::

## 使用父元素文本颜色

因为 YCloud Icons 使用 `currentColor`，所以图标颜色取决于当前元素计算后的 `color`，也可以从父元素继承。

例如，如果父元素的颜色值是 `#fff`，其中一个子元素是 YCloud Icons 图标，那么图标会渲染为 `#fff`。这是浏览器原生行为。

::: sandpack {template=vue showTabs=false editorHeight=320 editorWidthPercentage=60 dependencies="@ycloud-web/icons-vue"}

```vue src/App.vue [active]
<script setup>
import { ThumbsUp } from '@ycloud-web/icons-vue';
</script>

<template>
  <button :style="{ color: '#fff' }">
    <ThumbsUp />
    赞
  </button>
</template>
```

:::
