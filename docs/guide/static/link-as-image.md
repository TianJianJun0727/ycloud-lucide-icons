---
description: 了解如何在项目中把 YCloud Icons 作为图片使用。
---

<script setup>
import Sandpack from '~/.vitepress/theme/components/editors/Sandpack.vue'
</script>

# 作为图片链接

某些情况下，你可能希望把 YCloud Icons 作为图片使用，而不是内联 SVG。出于性能原因，或在不支持内联 SVG 的场景中，这会很有用。

## 在 HTML 中使用

可以在 HTML 中使用 `<img>` 标签直接链接 SVG 文件。SVG 文件路径取决于你的项目配置方式。

::: code-group

```html [Vite]
<html>
  <body>
    <img
      src="node_modules/@ycloud-web/icons-static/icons/smile.svg"
      alt="Smile Icon"
    />
  </body>
</html>
```

```html [Webpack]
<html>
  <body>
    <img
      src="~/@ycloud-web/icons-static/icons/smile.svg"
      alt="Smile Icon"
    />
  </body>
</html>
```

```html [CDN]
<html>
  <body>
    <img
      src="https://cdn.jsdelivr.net/npm/@ycloud-web/icons-static@latest/icons/smile.svg"
      alt="Smile Icon"
    />
  </body>
</html>
```

:::

::: warning CDN 用户注意
图标名称可能会在后续版本中变化。请确保在 URL 中指定明确版本，避免破坏性变更。\
`https://cdn.jsdelivr.net/npm/@ycloud-web/icons-static@{version}/icons/smile.svg`
:::

## 在 CSS 中使用

也可以在 CSS 中把图标作为背景图片使用，适合给按钮、链接或其他元素添加图标。

::: code-group

```css [Vite]
.button {
  background-image: url('node_modules/@ycloud-web/icons-static/icons/smile.svg');
}
```

```css [Webpack]
.button {
  background-image: url('~/@ycloud-web/icons-static/icons/smile.svg');
}
```

```css [CDN]
.button {
  background-image: url('https://cdn.jsdelivr.net/npm/@ycloud-web/icons-static@latest/icons/smile.svg');
}
```

:::

::: warning CDN 用户注意
图标名称可能会在后续版本中变化。请确保在 URL 中指定明确版本，避免破坏性变更。\
`https://cdn.jsdelivr.net/npm/@ycloud-web/icons-static@{version}/icons/smile.svg`
:::

<style>
.vp-code-group + .warning{
  display: none;
}
/* TODO: Find a better way to select this input selector */
.vp-code-group:has(.tabs input:nth-child(5):checked) + .warning {
  display: block;
}
</style>
