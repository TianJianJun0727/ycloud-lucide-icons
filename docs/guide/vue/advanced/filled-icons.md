---
title: 填充图标 - Vue
description: 了解如何在 Vue 应用中为 YCloud Icons 使用填充，以及这种用法的限制。
---

<script setup>
import Sandpack from '~/.vitepress/theme/components/editors/SandpackVue.vue'
</script>

# 填充图标

YCloud Icons 目前并不正式支持填充图标。
不过，所有图标都可以接收 SVG 属性。
因此在某些图标上仍然可以使用 `fill`，并且效果正常。

下面是星级评分的示例：

::: sandpack {template=vue editorHeight=580 editorWidthPercentage=60 dependencies="@ycloud-web/icons-vue"}

```vue src/App.vue [active]
<script setup>
import { Star, StarHalf } from '@ycloud-web/icons-vue';
import './icon.css';
</script>

<template>
  <div class="app">
    <div class="star-rating">
      <div class="stars">
        <Star
          v-for="i in 5"
          fill="#111"
          strokeWidth="0"
        />
      </div>
      <div class="stars rating">
        <Star
          fill="yellow"
          strokeWidth="0"
        />
        <Star
          fill="yellow"
          strokeWidth="0"
        />
        <StarHalf
          fill="yellow"
          strokeWidth="0"
        />
      </div>
    </div>
  </div>
</template>
```

```css src/icon.css
.star-rating {
  position: relative;
}

.stars {
  display: flex;
  gap: 4px;
}

.rating {
  position: absolute;
  top: 0;
}
```

:::
