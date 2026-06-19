---
title: 填充图标 - YCloud
description: YCloud Icons 目前并不正式支持填充图标，但你仍可以在部分图标上使用 fill 属性创建填充效果。
---

<script setup>
import Sandpack from '~/.vitepress/theme/components/editors/Sandpack.vue'
</script>

# 填充图标

YCloud Icons 目前并不正式支持填充图标。
不过，所有图标都可以接收 SVG 属性。
因此在某些图标上仍然可以使用 `fill`，并且效果正常。

下面是星级评分的示例：

::: sandpack {template=vanilla editorHeight=480 editorWidthPercentage=60 dependencies="ycloud"}

```html /index.html [active]
<!doctype html>
<html>
  <body>
    <div class="app">
      <div class="star-rating">
        <div class="stars">
          <i
            data-ycloud="star"
            fill="#111"
            stroke-width="0"
          ></i>
          <i
            data-ycloud="star"
            fill="#111"
            stroke-width="0"
          ></i>
          <i
            data-ycloud="star"
            fill="#111"
            stroke-width="0"
          ></i>
          <i
            data-ycloud="star"
            fill="#111"
            stroke-width="0"
          ></i>
          <i
            data-ycloud="star"
            fill="#111"
            stroke-width="0"
          ></i>
        </div>
        <div class="stars rating">
          <i
            data-ycloud="star"
            fill="yellow"
            stroke-width="0"
          ></i>
          <i
            data-ycloud="star"
            fill="yellow"
            stroke-width="0"
          ></i>
          <i
            data-ycloud="star-half"
            fill="yellow"
            stroke-width="0"
          ></i>
        </div>
      </div>
    </div>

    <script src="index.js"></script>
  </body>
</html>
```

```js /index.js
import { createIcons, Star, StarHalf } from 'ycloud/dist/cjs/ycloud';
import './styles.css';
import './icon.css';

createIcons({
  icons: {
    Star,
    StarHalf,
  },
});
```

```css icon.css
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
