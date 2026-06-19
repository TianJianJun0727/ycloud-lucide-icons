---
description: 在项目中使用 YCloud Icons 的 Web Font 版本，了解如何引入样式表并通过 CSS class 使用图标。
nextPage:
  - getting-started
---

<script setup>
import Sandpack from '~/.vitepress/theme/components/editors/Sandpack.vue'
</script>

# Icon Font

YCloud Icons 也提供 Web Font 版本。字体会把所有图标作为 glyph 提供，便于通过 CSS class 在项目中使用。对于偏好 Icon Font 的项目，这是一种方便的选择。

:::warning 不建议在高流量生产环境中使用
Icon Font 包含全部图标，会显著增加应用包体积和加载时间。生产环境建议使用支持 tree-shaking 的构建工具，只包含实际使用的图标。也可以考虑使用某个框架对应的 [package](../../../packages.md)。
:::

## 使用 CSS 样式表

::: code-group

```css [Vite]
@import '@ycloud-web/icons-static/font/ycloud.css';
```

```css [Webpack]
@import '~@ycloud-web/icons-static/font/ycloud.css';
```

```html [CDN]
<link
  rel="stylesheet"
  href="https://unpkg.com/@ycloud-web/icons-static@latest/font/ycloud.css"
/>
```

```html [Static asset]
<link
  rel="stylesheet"
  href="/your/path/to/ycloud.css"
/>
```

:::

## 使用 Icon Font

引入样式表后，就可以在 HTML 中通过对应的 CSS class 使用图标。每个图标都有对应的 class 名称用于显示。

例如，要显示 “home” 图标，可以使用下面的 HTML：

```html
<div class="icon-house"></div>
```

## JavaScript 示例

::: sandpack {template=vanilla showTabs=false editorHeight=480 editorWidthPercentage=60 dependencies="@ycloud-web/icons-static"}

```html /index.html [active]
<!doctype html>
<html>
  <body>
    <i class="icon-house"></i>

    <script src="index.js"></script>
  </body>
</html>
```

```js /index.js
import './styles.css';
import '@ycloud-web/icons-static/font/ycloud.css';
```

:::
