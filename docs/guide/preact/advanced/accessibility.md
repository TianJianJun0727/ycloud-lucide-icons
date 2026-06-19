---
title: 无障碍 - Preact
description: Preact 应用中图标无障碍使用的最佳实践。
---

<script setup>
import OverviewLink from '~/.vitepress/theme/components/base/OverviewLink.vue'
</script>

# 无障碍

YCloud Icons 默认带有 `aria-hidden="true"`。在绝大多数情况下，这正是你需要的行为。

## 图标是否应该被辅助技术读取？

大多数时候，图标只是装饰或视觉强化。把装饰性图标暴露给辅助技术，可能会给屏幕阅读器用户带来不必要的干扰。

关于这一点的更完整说明，以及在应用中无障碍使用图标的更多最佳实践，请参考无障碍指南：

<OverviewLink href="/guide/accessibility" title="无障碍图标" desc="应用中图标无障碍使用的最佳实践。"/>

只有当图标本身**承载了必要含义**时，才应该让它被辅助技术读取。下面会说明在 Preact 中如何做到这一点。

## 让图标可被辅助技术读取

如果需要把图标暴露给辅助技术，可以通过子元素传入 `title`，或给图标组件传入 `aria-label` prop，为图标提供可访问名称。

这样会移除 `aria-hidden` 属性，让屏幕阅读器可以读取这个图标。

```tsx
<House>
  <title>这是我的房子</title>
</House>

// or

<House aria-label="这是我的房子" />
```

请根据应用上下文选择清晰的标签，描述图标含义或它代表的操作。

## 可访问的图标按钮

当图标用于按钮内部时，通常应该把可访问标签放在按钮上，而不是放在图标上。

```tsx
<button aria-label="返回首页">
  <House />
</button>
```

这样可以确保辅助技术描述的是可交互元素本身，而不是按钮里的装饰性图形。
