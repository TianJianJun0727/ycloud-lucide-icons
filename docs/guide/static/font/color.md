---
title: 设置 YCloud Icon font 的颜色
description: 了解如何在静态项目中通过 CSS 调整 YCloud Icon font 的颜色。
---

# 设置 Icon font 颜色

使用 CSS 设置 YCloud Icon font 样式很直接。你可以通过 CSS 的 `color` 属性修改图标颜色，让图标更容易匹配你的设计。

## 修改图标颜色

要修改图标颜色，只需要把 `color` 属性应用到包含图标的元素上。例如，如果想把图标改成红色，可以使用下面的 CSS：

```css
.icon-house {
  color: red;
}
```

这会把 `icon-house` 类对应的图标颜色改为红色。你可以使用任意合法的 CSS 颜色值，例如十六进制、RGB 或命名颜色。

## 继承父元素颜色

默认情况下，图标会继承父元素颜色。也就是说，如果你在父元素上设置了颜色，子图标会自动使用这个颜色，除非你为图标单独覆盖。和 HTML 文本元素一样，Icon font 使用 `color` 属性决定颜色，方便在项目中保持一致的样式。
