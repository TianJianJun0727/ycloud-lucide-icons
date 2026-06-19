---
title: 尺寸 - YCloud
description: 了解如何在 Vanilla JavaScript 应用中通过 width、height 属性和 CSS 调整 YCloud Icons 的尺寸。
---

<script setup>
import Sandpack from '~/.vitepress/theme/components/editors/Sandpack.vue'
</script>

# 尺寸

默认情况下，所有图标的尺寸都是 `24px` x `24px`。你可以通过 `width`、`height` 属性或 CSS 调整图标尺寸。

## 使用 `width` 和 `height` 属性调整图标尺寸

::: sandpack {template=vanilla showTabs=false editorHeight=295 editorWidthPercentage=60 dependencies="ycloud"}

```html /index.html [active]
<!doctype html>
<html>
  <body>
    <i
      data-ycloud="landmark"
      width="64"
      height="64"
    ></i>

    <script src="index.js"></script>
  </body>
</html>
```

```js /index.js
import './styles.css';

import { createIcons, Landmark } from 'ycloud/dist/cjs/ycloud';

createIcons({
  icons: {
    Landmark,
  },
});
```

:::

## 通过 CSS 调整图标尺寸

可以使用 CSS 的 `width` 和 `height` 属性调整图标尺寸。

::: sandpack {template=vanilla editorHeight=300 editorWidthPercentage=60 dependencies="ycloud"}

```css icon.css [active]
.my-beer-icon {
  /* 修改这里 */
  width: 64px;
  height: 64px;
}
```

```html /index.html
<!doctype html>
<html>
  <body>
    <i
      data-ycloud="beer"
      class="my-beer-icon"
    ></i>

    <script src="index.js"></script>
  </body>
</html>
```

```js /index.js
import { createIcons, Beer } from 'ycloud/dist/cjs/ycloud';
import './styles.css';
import './icon.css';

createIcons({
  icons: {
    Beer,
  },
});
```

:::

### 根据字体大小动态调整图标尺寸

图标也可以根据字体大小自动缩放，通常可以通过 `em` 单位实现。关于 `em` 的更多信息，可以参考这篇 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size#ems)。

::: sandpack {template=vanilla editorHeight=320 dependencies="ycloud"}

```css icon.css [active]
.my-icon {
  /* 图标尺寸会相对于 .text-wrapper 的 font-size */
  width: 1em;
  height: 1em;
}

.text-wrapper {
  /* 修改这里 */
  font-size: 96px;

  /* 布局相关 */
  display: flex;
  gap: 0.25em;
  align-items: center;
}
```

```js /index.js
import { createIcons, Star } from 'ycloud/dist/cjs/ycloud';
import './styles.css';
import './icon.css';

createIcons({
  icons: {
    Star,
  },
});
```

```html /index.html
<!doctype html>
<html>
  <body>
    <div class="text-wrapper">
      <i
        data-ycloud="star"
        class="my-icon"
      ></i>
      <div>是</div>
    </div>

    <script src="index.js"></script>
  </body>
</html>
```

:::

### 使用 Tailwind 调整尺寸

可以使用 `size-*` 工具类调整图标尺寸。关于 `size-*` 工具类的更多信息，可以参考 [Tailwind 文档](https://tailwindcss.com/docs/width#setting-both-width-and-height)。

::: sandpack {template=vanilla editorHeight=300 editorWidthPercentage=60 dependencies="ycloud" externalResources="https://cdn.tailwindcss.com"}

```html /index.html
<!doctype html>
<html>
  <body>
    <i
      data-ycloud="party-popper"
      class="size-24"
    ></i>

    <script src="index.js"></script>
  </body>
</html>
```

```js /index.js [hidden]
import { createIcons, PartyPopper } from 'ycloud/dist/cjs/ycloud';
import './styles.css';

createIcons({
  icons: {
    PartyPopper,
  },
});
```

:::
