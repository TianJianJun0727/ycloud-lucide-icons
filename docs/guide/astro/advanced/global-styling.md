---
title: 全局样式 - Astro
description: 了解如何在 Astro 应用中通过 CSS 为 YCloud Icons 设置全局样式。
---

# 全局样式

图标可以通过 [颜色](../basics/color.md)、[尺寸](../basics/sizing.md) 和 [描边宽度](../basics/stroke-width.md) 进行调整。
To style all icons globally you can use CSS.

## 使用 CSS 设置样式

使用 CSS 设置图标样式很简单。

每个图标都会带有名为 `ycloud` 的 class。你可以在 CSS 文件中通过这个 class 选中应用内使用的所有图标。

- 图标的**颜色**可以通过 [`color`](https://developer.mozilla.org/en-US/docs/Web/CSS/color) CSS 属性修改。
- 图标的**尺寸**可以通过 [`width`](https://developer.mozilla.org/en-US/docs/Web/CSS/width) 和 [`height`](https://developer.mozilla.org/en-US/docs/Web/CSS/height) CSS 属性修改。
- 图标的**描边宽度**可以通过 [`stroke-width`](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-width) CSS 属性修改。

```css
.ycloud {
  color: #ffadff;
  width: 56px;
  height: 56px;
  stroke-width: 1px;
}
```

### 固定描边宽度

如需全局固定描边宽度，可以给图标的子元素应用 `vector-effect: non-scaling-stroke` CSS 属性。这样无论图标尺寸如何变化，描边宽度都会保持不变。更多信息请参考[固定描边宽度](../basics/stroke-width.md#固定描边宽度)。

```css
.ycloud {
  width: 48px;
  height: 48px;
  stroke-width: 1.5;
}

.ycloud * {
  vector-effect: non-scaling-stroke;
}
```
