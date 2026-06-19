---
title: 尺寸 - Astro
description: 了解如何在 Astro 应用中通过 size prop 和 CSS 调整 YCloud Icons 的尺寸。
---

# 尺寸

默认情况下，所有图标的尺寸都是 `24px` x `24px`。你可以通过 `size` prop 或 CSS 调整图标尺寸。

## 使用 `size` prop 调整图标尺寸

```astro
---
import Landmark from '@ycloud-web/icons-astro/icons/landmark';
---

<Landmark size={64} />
```

## 通过 CSS 调整图标尺寸

可以使用 CSS 的 `width` 和 `height` 属性调整图标尺寸。

::: code-group

```css [icon.css]
.my-beer-icon {
  width: 64px;
  height: 64px;
}
```

```astro [page.astro]
---
import Beer from '@ycloud-web/icons-astro/icons/beer';
import './icon.css'
---

<Beer class="my-beer-icon" />
```

:::

### 根据字体大小动态调整图标尺寸

图标也可以根据字体大小自动缩放，通常可以通过 `em` 单位实现。关于 `em` 的更多信息，可以参考这篇 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size#ems)。

::: code-group

```css [icon.css]
.my-icon {
  /* 图标尺寸会相对于 .text-wrapper 的 font-size */
  width: 1em;
  height: 1em;
}

.text-wrapper {
  font-size: 96px;

  /* 布局相关 */
  display: flex;
  gap: 0.25em;
  align-items: center;
}
```

```astro [page.astro]
---
import Star from '@ycloud-web/icons-astro/icons/star';
import './icon.css'
---

<div class="text-wrapper">
  <Star class="my-icon" />
  <div>是</div>
</div>
```

:::

### 使用 Tailwind 调整尺寸

可以使用 `size-*` 工具类调整图标尺寸。关于 `size-*` 工具类的更多信息，可以参考 [Tailwind 文档](https://tailwindcss.com/docs/width#setting-both-width-and-height)。

```astro
---
import PartyPopper from '@ycloud-web/icons-astro/icons/party-popper';
---

<PartyPopper class="size-24" />
```
