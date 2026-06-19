---
title: Content Template element - YCloud
description: 了解如何通过 inTemplates 选项在 HTML template 元素中使用 YCloud Icons。
---

<script setup>
import Sandpack from '~/.vitepress/theme/components/editors/Sandpack.vue'
</script>

# Content Template element

默认情况下，`<template>` 标签内的图标不会被添加。
将 `inTemplates` 选项设置为 `true` 后，template 中的图标也会被替换。

可以在 [MDN 的 Content Template element 文档](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/template)中了解更多。

## 在 `template` 元素中使用 `createIcons` 函数的示例

::: sandpack {template=vanilla editorHeight=420 editorWidthPercentage=60 dependencies="ycloud"}

```js /index.js [active]
import { createIcons, Backpack } from 'ycloud/dist/cjs/ycloud';
import './styles.css';

createIcons({
  icons: {
    Backpack,
  },
  inTemplates: true,
});

const container = document.getElementById('container');
const template = document.getElementById('template');

const firstClone = document.importNode(template.content, true);
container.appendChild(firstClone);

const secondClone = document.importNode(template.content, true);
container.appendChild(secondClone);
```

```html /index.html
<!doctype html>
<html>
  <body>
    <template id="template">
      <i data-ycloud="backpack"></i>
    </template>

    <div id="container"></div>

    <script src="index.js"></script>
  </body>
</html>
```

:::
