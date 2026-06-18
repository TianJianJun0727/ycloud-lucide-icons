---
title: 架构
description: YCloud Icons 的包命名、组件命名和多风格入口设计。
---

# 架构

YCloud Icons 是一个多包 monorepo。当前保留 Lucide 兼容的工程形态，便于后续吸收上游修复；公开包名、文档和品牌统一使用 YCloud。

## 包命名

公开包统一使用 `@ycloud-web` scope。当前支持 10 类包：

- `@ycloud-web/icons`
- `@ycloud-web/icons-react`
- `@ycloud-web/icons-vue`
- `@ycloud-web/icons-svelte`
- `@ycloud-web/icons-solid`
- `@ycloud-web/icons-preact`
- `@ycloud-web/icons-react-native`
- `@ycloud-web/icons-angular`
- `@ycloud-web/icons-astro`
- `@ycloud-web/icons-static`

`@ycloud-web/icons-data` 用于规范化图标数据。

## 组件命名

组件名保持简单、可重构：

```tsx
import { Camera } from '@ycloud-web/icons-react';
```

不在组件名上追加 `Outline` 或 `Filled`，避免破坏 IDE 自动补全和重构体验。

## 风格入口

风格应由目录和包入口表达：

```tsx
import { Camera } from '@ycloud-web/icons-react/outline';
import { Camera as FilledCamera } from '@ycloud-web/icons-react/filled';
```

当自动转换可靠时，可由同一份规范化 SVG 源生成多个风格；否则允许保留显式风格覆盖。
