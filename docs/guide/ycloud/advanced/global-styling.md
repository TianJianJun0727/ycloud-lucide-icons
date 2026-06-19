---
title: 全局样式 - YCloud
description: 了解如何在 Vanilla JavaScript 应用中通过 CSS 或 createIcons 的 attrs 选项为 YCloud Icons 设置全局样式。
---

<script setup>
import Sandpack from '~/.vitepress/theme/components/editors/Sandpack.vue';
</script>

# 全局样式

图标可以通过 [颜色](../basics/color.md)、[尺寸](../basics/sizing.md) 和 [描边宽度](../basics/stroke-width.md) 进行调整。
如果要为所有图标设置全局样式，可以使用 CSS，也可以使用 `createIcons` 的 `attrs` 选项。

我们推荐使用 CSS 设置全局样式，因为这是最直接的方式。

<!-- Local overwrite NOT working -->
<!-- But using CSS prevents you from using props like `size`, `color` and `strokeWidth` on individual icons, since CSS specificity will override these props, to be able to use the props on individual ones you need to adjust the global styles using `attrs` in `createIcons`. -->

这会把 `color`、`size` 和 `strokeWidth` props 应用到所有图标。

### 通过 `createIcons` 的 attrs 设置样式

你也可以通过向 `createIcons` 函数传入 attributes 来应用全局样式。

::: sandpack {template=vanilla showTabs=false editorHeight=295 editorWidthPercentage=60 dependencies="ycloud"}

```html /index.html [active]
<!doctype html>
<html>
  <body>
    <i data-ycloud="building"></i>

    <script src="index.js"></script>
  </body>
</html>
```

```js /index.js
import './styles.css';

import { createIcons, Building } from 'ycloud/dist/cjs/ycloud';

createIcons({
  attrs: {
    'stroke-width': 1,
    stroke: 'lightblue',
  },
  icons: {
    Building,
  },
});
```

:::

### 使用 CSS 设置样式

使用 CSS 设置图标样式很简单。

每个图标都会带有名为 `ycloud` 的 class。你可以在 CSS 文件中通过这个 class 选中应用内使用的所有图标。

- 图标的**颜色**可以通过 [`color`](https://developer.mozilla.org/en-US/docs/Web/CSS/color) CSS 属性修改。
- 图标的**尺寸**可以通过 [`width`](https://developer.mozilla.org/en-US/docs/Web/CSS/width) 和 [`height`](https://developer.mozilla.org/en-US/docs/Web/CSS/height) CSS 属性修改。
- 图标的**描边宽度**可以通过 [`stroke-width`](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-width) CSS 属性修改。

::: sandpack {template=vanilla showTabs=false editorHeight=295 editorWidthPercentage=60 dependencies="ycloud"}

```css icon.css [active]
.ycloud {
  /* 修改这里 */
  color: #ffadff;
  width: 48px;
  height: 48px;
  stroke-width: 1px;
}

.app {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 6px;
}
```

```html /index.html
<!doctype html>
<html>
  <body>
    <div class="app">
      <i data-ycloud="cake-slice"></i>
      <i data-ycloud="candy"></i>
      <i data-ycloud="apple"></i>
      <i data-ycloud="cookie"></i>
      <i data-ycloud="martini"></i>
      <i data-ycloud="ice-cream-2"></i>
      <i data-ycloud="sandwich"></i>
      <i data-ycloud="wine"></i>
      <i data-ycloud="dessert"></i>
    </div>

    <script src="index.js"></script>
  </body>
</html>
```

```js /index.js
import './styles.css';
import './icon.css';

import {
  createIcons,
  CakeSlice,
  Candy,
  Apple,
  Cookie,
  Martini,
  IceCream2,
  Sandwich,
  Wine,
  Dessert,
} from 'ycloud/dist/cjs/ycloud';

createIcons({
  icons: {
    CakeSlice,
    Candy,
    Apple,
    Cookie,
    Martini,
    IceCream2,
    Sandwich,
    Wine,
    Dessert,
  },
});
```

:::
