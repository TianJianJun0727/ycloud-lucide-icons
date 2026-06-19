---
description: 了解如何在项目中使用 YCloud Icons 的 SVG sprite，包括基础用法和内联用法。
---

<script setup>
import Sandpack from '~/.vitepress/theme/components/editors/Sandpack.vue'
</script>

# 使用 SVG sprite

了解如何在项目中使用 YCloud Icons 的 SVG sprite，包括基础用法和内联用法。

:::warning 不建议在高流量生产环境中使用
SVG sprite 包含全部图标，会显著增加应用包体积和加载时间。生产环境建议使用支持 tree-shaking 的构建工具，只包含实际使用的图标。也可以考虑使用某个框架对应的 [package](../../packages.md)。
:::

SVG sprite 可以作为单独图片加载，也可以通过 `<use>` 元素内联使用。
项目中可能还需要额外的 SVG loader 来处理 node_modules 导入。可参考这个 [codesandbox 示例](https://codesandbox.io/s/using-the-svg-sprite-lz1kk)。

## 基础 sprite 用法

可以直接在 img 标签中导入 SVG sprite，并通过 <br>`#{icon-name}` 语法选择图标：

```html
<img src="@ycloud-web/icons-static/sprite.svg#house" />
```

## 内联用法

也可以通过 `<use>` 元素内联使用 sprite，这样可以直接给 SVG 元素应用 CSS 样式。

::: sandpack {template=vanilla showTabs=false editorHeight=480 editorWidthPercentage=60 dependencies="@ycloud-web/icons-static"}

```html /index.html [active]
<!doctype html>
<html>
  <body>
    <svg
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <use href="#alarm-clock-check" />
    </svg>

    <div
      id="sprite"
      style="display: none;"
    ></div>

    <script src="index.js"></script>
  </body>
</html>
```

```js /index.js
import './styles.css';
import sprite from '@ycloud-web/icons-static/sprite.svg';

document.getElementById('sprite').innerHTML = sprite;
```

:::

## 使用 CSS 辅助 class 内联

如果更偏好统一管理，也可以用 CSS 保存基础 SVG 属性：

::: sandpack {template=vanilla editorHeight=320 editorWidthPercentage=60 dependencies="@ycloud-web/icons-static"}

```css /icon.css [active]
.ycloud-icon {
  width: 24px;
  height: 24px;
  stroke: currentColor;
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
```

```html /index.html
<!doctype html>
<html>
  <body>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="ycloud-icon"
    >
      <use href="#alarm-clock-check" />
    </svg>

    <div
      id="sprite"
      style="display: none;"
    ></div>

    <script src="index.js"></script>
  </body>
</html>
```

```js /index.js
import './styles.css';
import './icon.css';
import sprite from '@ycloud-web/icons-static/sprite.svg';

document.getElementById('sprite').innerHTML = sprite;
```

:::
