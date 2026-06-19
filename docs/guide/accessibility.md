---
title: 无障碍
description: 了解如何让图标对所有用户可访问，包括有障碍的用户。
---

# 深入理解无障碍

图标是在不使用文字的情况下表达含义的图形。它们可以快速传递信息，因此很有帮助。

但并不是每个人都能轻松理解图标。使用图标时，需要重点考虑以下无障碍因素。

::: info
默认情况下，我们会通过 `aria-hidden="true"` 对屏幕阅读器隐藏图标。
你可以按照下面的指南自行为图标补充无障碍能力。
:::

## 提供可见标签

图标有助于提升识别效率，但不能替代文字。

大多数情况下，最好同时提供能说明图标功能的文字。

<!--@include: ../../docs/images/a11y/visible-labels.svg -->

## 对比度

确保图标与背景之间有足够的对比度，让低视力或色觉障碍用户也能看清。

建议遵循 [WCAG 2.1 SC 1.4.3](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)。

<!--@include: ../../docs/images/a11y/contrast.svg -->

## 颜色使用

不要只依赖颜色传达图标含义，因为部分用户可能存在色觉障碍。可以结合形状、阴影或文字等额外视觉线索。

<!--@include: ../../docs/images/a11y/use-of-color.svg -->

## 交互性

确保可交互图标能通过键盘访问，并在触发时提供清晰反馈。

<!--@include: ../../docs/images/a11y/interactivity.svg -->

大多数情况下，将图标包在图标按钮中即可做到这一点。

## 最小点击区域

过小的目标很难点击或触摸。如果图标可交互，建议最小目标区域为 44×44 像素。

<!--@include: ../../docs/images/a11y/target-size.svg -->

实际使用中，这并不意味着图标本身必须这么大，只要交互容器达到这个尺寸即可。

## 表意清晰

图标应该以普遍易懂的方式表示概念或动作。避免使用抽象、含糊或强文化语境的符号，以免让部分用户困惑。

<!--@include: ../../docs/images/a11y/meaningfulness.svg -->

## 一致性

在界面中保持图标设计和使用方式一致，可以帮助用户更快学习并理解图标含义。

<!--@include: ../../docs/images/a11y/consistency.svg -->

## 文本替代

你可能需要为图标提供文本标签或替代文本说明，尤其是面向视障用户使用的屏幕阅读器时。

不过，说明应只提供给非纯装饰性的独立图标。给非功能性元素提供无障碍名称，只会增加屏幕阅读器中的噪音。

### 独立图标

图标通常不会在没有语义容器的情况下单独出现。大多数情况下，它们会作为徽标、按钮（包括图标按钮）、导航项或其他交互式 UI 元素的一部分。

::: warning
如果某些图标确实是独立出现，并且承担非装饰性功能，请确保为它们提供合适的无障碍标签。
:::

<!--@include: ../../docs/images/a11y/alttext-standalone.svg -->

一般来说，应尽量避免使用没有交互能力的功能性图标。建议：

1. 在图标旁边添加可见说明；或
2. 将图标放在徽标、标签或按钮中，并至少提供 tooltip。

在这些情况下，最好只为交互元素（徽标、按钮、导航项等）提供无障碍名称，而不是为图标本身提供。

### 按钮中的图标

图标用于按钮中时，不要给图标本身提供无障碍标签，因为屏幕阅读器会读出这个标签，导致文本语义混乱。

<!--@include: ../../docs/images/a11y/alttext-buttons.svg -->

::: details 代码示例

```tsx
// 不推荐
<button>
  <Plus aria-label="Plus icon"/>
  Add document
</button>

// Do this, just leave it
<button>
  <Plus/>
  Add document
</button>
```

:::

### 图标按钮

Icon buttons are buttons that do not contain any visible text apart from the icon itself (think of
the close button of a dialog for example).

As previously stated, you should provide your accessible label on the icon button itself, not the
contained icon.

<!--@include: ../../docs/images/a11y/alttext-iconbuttons.svg -->

::: details 代码示例

```tsx
// 不推荐
<button class="btn-icon">
  <House/>
</button>

// 不推荐 either
<button class="btn-icon">
  <House aria-label="Home icon"/>
</button>

// This works but might not be the best solution, see below
<button aria-label="返回首页" class="btn-icon">
  <House/>
</button>

// 推荐
<button class="btn-icon">
  <House/>
  <span class="visually-hidden">Go to home</span>
</button>
```

:::

## 关于 `aria-label`

虽然可以通过 `aria-label` 属性为元素提供无障碍标签，但一般建议避免这样做。
更推荐尽可能使用所选 CSS 框架提供的 “visually hidden” 工具类。
可以[进一步了解为什么 `aria-label` 可能不是最佳方案](https://gomakethings.com/revisting-aria-label-versus-a-visually-hidden-class/)。

### 示例 - Radix UI

使用 [Radix UI 内置的 Accessible Icon 工具组件](https://www.radix-ui.com/primitives/docs/utilities/accessible-icon)。

```tsx
import { ArrowRightIcon } from '@ycloud-web/icons-react';
import { AccessibleIcon } from '@radix-ui/react-accessible-icon';

<AccessibleIcon label="Next item">
  <ArrowRightIcon />
</AccessibleIcon>;
```

### 示例 - Bootstrap

```html
<div>
  <i
    data-ycloud="phone"
    aria-hidden="true"
  ></i>
  <span class="visually-hidden">Phone number</span>
</div>
```

### 示例 - Tailwind CSS

```html
<div>
  <i
    data-ycloud="phone"
    aria-hidden="true"
  ></i>
  <span class="sr-only">Phone number</span>
</div>
```

如果不确定，可以进一步了解
about [how to hide content.](https://www.a11yproject.com/posts/how-to-hide-content/)

## 更多资源

We also recommend checking out the following resources about accessibility:

- [Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/TR/WCAG21/)
- [Web Accessibility Initiative (WAI)](https://www.w3.org/WAI/)
- [Learn accessibility on web.dev](https://web.dev/learn/accessibility)
- [Inclusive Components](https://inclusive-components.design/)
- [A11yTalks](https://www.a11ytalks.com/)
- [A11y automation tracker](https://a11y-automation.dev/)
- [The A11Y Project](https://www.a11yproject.com/)

<style>
svg.a11y-example {
  max-width: calc(100% + 48px);
  margin: 0 -24px;
}
@media (min-width: 480px) {
  svg.a11y-example {
    margin: 0;
    max-width: 100%;
  }
}
</style>
