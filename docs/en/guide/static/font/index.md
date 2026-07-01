---
description: Using the web font version of YCloud icons in your project. Learn how to include the stylesheet and use the icons with CSS classes.
nextPage:
  - getting-started
---

<script setup>
import Sandpack from '~/.vitepress/theme/components/editors/Sandpack.vue'
</script>

# Icon Font

YCloud icons are also available as web fonts. Generic icons and business icons are generated into separate font directories so `icon-*` and `business-icon-*` classes are not mixed in the same stylesheet. Illustrations are not generated as fonts; use the `illustration` component entry or `illustration-icons/*.svg` static assets instead.

:::warning Not recommended for high traffic production use
Each icon font includes all icons for that asset family, which can significantly increase your app's bundle size and load time. For production environments, we recommend using a bundler with tree-shaking support to include only the icons you actually use. Consider using one of the framework-specific [packages](../../../packages.md).
:::

## Generic Icon Font

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

Once you have included the stylesheet, you can use the icons in your HTML by applying the appropriate CSS classes. Each icon has a corresponding class name that you can use to display it.

For example, to display the generic "house" icon, you would use the following HTML:

```html
<div class="icon-house"></div>
```

## Business Icon Font

Business icons use a separate font and the `business-icon-` class prefix:

::: code-group

```css [Vite]
@import '@ycloud-web/icons-static/business-font/ycloud-business.css';
```

```css [Webpack]
@import '~@ycloud-web/icons-static/business-font/ycloud-business.css';
```

```html [CDN]
<link
  rel="stylesheet"
  href="https://unpkg.com/@ycloud-web/icons-static@latest/business-font/ycloud-business.css"
/>
```

```html [Static asset]
<link
  rel="stylesheet"
  href="/your/path/to/ycloud-business.css"
/>
```

:::

```html
<div class="business-icon-billing"></div>
```

## Example with JavaScript

<!-- TODO: Fix this example -->

::: sandpack {template=vanilla showTabs=false editorHeight=480 editorWidthPercentage=60 dependencies="@ycloud-web/icons-static"}

```html /index.html [active]
<!doctype html>
<html>
  <body>
    <i class="icon-home"></i>

    <script src="index.js"></script>
  </body>
</html>
```

```js /index.js
import './styles.css';
import '@ycloud-web/icons-static/font/ycloud.css';
```

:::
