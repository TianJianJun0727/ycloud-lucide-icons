---
description: 在项目中使用 YCloud Icons 的 Web Font 版本，了解如何引入样式表并通过 CSS class 使用图标。
nextPage:
  - getting-started
---

<script setup>
import SandpackIconFont from '~/.vitepress/theme/components/editors/SandpackIconFont.vue'
</script>

# Icon Font

YCloud Icons 也提供 Web Font 版本。通用图标和业务图标会生成到不同的字体目录，避免 `icon-*` 和 `business-icon-*` 混在同一份 CSS 中。插画不生成字体，请使用 `illustration` 组件入口或 `illustration-icons/*.svg` 静态资源。

:::warning 不建议在高流量生产环境中使用
Icon Font 会包含对应类型的全部图标，可能显著增加应用包体积和加载时间。生产环境建议使用支持 tree-shaking 的构建工具，只包含实际使用的图标。也可以考虑使用某个框架对应的 [package](../../../packages.md)。
:::

## 通用图标字体

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

引入样式表后，就可以在 HTML 中通过对应的 CSS class 使用图标。每个图标都有对应的 class 名称用于显示。

例如，要显示 “house” 通用图标，可以使用下面的 HTML：

```html
<div class="icon-house"></div>
```

## 业务图标字体

业务图标使用独立字体和 `business-icon-` class 前缀：

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

## JavaScript 示例

<SandpackIconFont />
