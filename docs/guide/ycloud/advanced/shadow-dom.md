---
title: Shadow DOM - YCloud
description: 了解如何在 Vanilla JavaScript 应用的 Shadow DOM 中使用 YCloud Icons。
---

<script setup>
import Sandpack from '~/.vitepress/theme/components/editors/Sandpack.vue'
</script>

# Shadow DOM

YCloud Icons 可以在 Shadow DOM 中使用。

## 使用 `createElement` 函数的示例

使用 `createElement` 函数创建单个图标，并将它追加到 Shadow DOM 中。

::: sandpack {template=vanilla editorHeight=300 editorWidthPercentage=60 dependencies="ycloud"}

```html /index.html
<!doctype html>
<html>
  <body>
    <div id="container"></div>

    <script src="index.js"></script>
  </body>
</html>
```

```js /index.js [active]
import './styles.css';
import { Home, createElement } from 'ycloud/dist/cjs/ycloud';

const container = document.getElementById('container');
const shadowRoot = container.attachShadow({ mode: 'open' });

const iconElement = createElement(Home);
shadowRoot.appendChild(iconElement);
```

:::

## 使用 `createIcons` 函数的示例

如果想在 Shadow DOM 中创建多个图标，可以使用 `createIcons` 函数。
通过 `root` 选项，可以把 shadow root 指定为图标渲染的根元素。

::: sandpack {template=vanilla editorHeight=420 editorWidthPercentage=60 dependencies="ycloud"}

```html /index.html
<!doctype html>
<html>
  <body>
    <div id="container"></div>

    <script src="index.js"></script>
  </body>
</html>
```

```js /index.js [active]
import './styles.css';
import { TreePalm, Volleyball, Waves, createIcons } from 'ycloud/dist/cjs/ycloud';

const container = document.getElementById('container');
const shadowRoot = container.attachShadow({ mode: 'open' });

const iconWrapper = document.createElement('div');
iconWrapper.innerHTML = `
<i data-ycloud="tree-palm"></i>
<i data-ycloud="volleyball"></i>
<i data-ycloud="waves"></i>
`;
shadowRoot.appendChild(iconWrapper);

createIcons({
  root: shadowRoot,
  icons: {
    TreePalm,
    Volleyball,
    Waves,
  },
});
```

:::
