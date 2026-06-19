---
title: 尺寸 - Svelte
description: 了解如何在 Svelte 应用中通过 `size` prop 或 CSS 调整图标尺寸。
---

<script setup>
import Sandpack from '~/.vitepress/theme/components/editors/SandpackSvelte.vue'
</script>

# 尺寸

默认情况下，所有图标的尺寸都是 `24px` x `24px`。你可以通过 `size` prop 或 CSS 调整图标尺寸。

## 使用 `size` prop 调整图标尺寸

::: sandpack {template=vite-svelte showTabs=false editorHeight=240 editorWidthPercentage=60}

```svelte src/App.svelte [active]
<script>
import Landmark from '@ycloud-web/icons-svelte/icons/landmark';
</script>

<Landmark size={64} />
```

:::

## 通过 CSS 调整图标尺寸

可以使用 CSS 的 `width` 和 `height` 属性调整图标尺寸。

::: sandpack {template=vite-svelte editorHeight=240 editorWidthPercentage=60}

```css src/icon.css [active]
.my-beer-icon {
  /* 修改这里 */
  width: 64px;
  height: 64px;
}
```

```svelte src/App.svelte
<script>
import Beer from "@ycloud-web/icons-svelte/icons/beer";
import './icon.css'
</script>

<Beer class="my-beer-icon" />
```

:::

### 根据字体大小动态调整图标尺寸

图标也可以根据字体大小自动缩放，通常可以通过 `em` 单位实现。关于 `em` 的更多信息，可以参考这篇 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size#ems)。

::: sandpack {template=vite-svelte editorHeight=300}

```css src/icon.css [active]
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

```svelte src/App.svelte
<script>
import Star from "@ycloud-web/icons-svelte/icons/star";
import "./icon.css";
</script>

<div class="text-wrapper">
  <Star class="my-icon" />
  <div>是</div>
</div>
```

:::

### 使用 Tailwind 调整尺寸

可以使用 `size-*` 工具类调整图标尺寸。关于 `size-*` 工具类的更多信息，可以参考 [Tailwind 文档](https://tailwindcss.com/docs/width#setting-both-width-and-height)。

::: sandpack {template=vite-svelte showTabs=false editorHeight=240 editorWidthPercentage=60}

```svelte src/App.svelte [active]
<script>
import PartyPopper from "@ycloud-web/icons-svelte/icons/party-popper";
</script>

<PartyPopper class="size-24" />
```

```html /index.html [hidden]
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>

    <title>Vite App</title>
  </head>
  <body>
    <div id="app"></div>
    <script
      type="module"
      src="/src/main.js"
    ></script>
  </body>
</html>
```

:::
