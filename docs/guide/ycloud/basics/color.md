---
title: 颜色 - YCloud
description: 了解如何在 Vanilla JavaScript 应用中通过 color 属性和 CSS 调整 YCloud Icons 的颜色。
---

<script setup>
import Sandpack from '~/.vitepress/theme/components/editors/Sandpack.vue'
</script>

# 颜色

默认情况下，所有图标的颜色值都是 `currentColor`。这个关键字会使用元素计算后的文本 `color` 值作为图标颜色。

可以在 [MDN 的 `currentColor` 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#currentcolor_keyword)中了解更多。

## 使用 `color` 属性调整颜色

可以直接向图标元素传入 color 属性来调整颜色。

::: sandpack {template=vanilla showTabs=false editorHeight=295 editorWidthPercentage=60 dependencies="ycloud"}

```html /index.html [active]
<!doctype html>
<html>
  <body>
    <i
      data-ycloud="smile"
      color="#3e9392"
    ></i>

    <script src="index.js"></script>
  </body>
</html>
```

```js /index.js
import './styles.css';

import { createIcons, Smile } from 'ycloud/dist/cjs/ycloud';

createIcons({
  icons: {
    Smile,
  },
});
```

:::

## 使用父元素文本颜色

因为 YCloud Icons 使用 `currentColor`，所以图标颜色取决于当前元素计算后的 `color`，也可以从父元素继承。

例如，如果父元素的颜色值是 `#fff`，其中一个子元素是 YCloud Icons 图标，那么图标会渲染为 `#fff`。这是浏览器原生行为。

::: sandpack {template=vanilla showTabs=false editorHeight=300 editorWidthPercentage=60 dependencies="ycloud"}

```html /index.html [active]
<!doctype html>
<html>
  <body>
    <button style="color: white">
      <i data-ycloud="thumbs-up"></i>
      赞
    </button>

    <script src="index.js"></script>
  </body>
</html>
```

```js /index.js [hidden]
import './styles.css';

import { createIcons, ThumbsUp } from 'ycloud/dist/cjs/ycloud';

createIcons({
  icons: {
    ThumbsUp,
  },
});
```

:::
