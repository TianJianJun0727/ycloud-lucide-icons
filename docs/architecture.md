---
title: 架构
description: YCloud Icons 的包命名、组件命名和风格入口设计。
---

# 架构

YCloud Icons 以多包 monorepo 的方式维护。当前仓库保留与上游相近的包形态，便于后续评估和合并上游修复；对外包名、文档和品牌统一归属 YCloud。

## 包命名

公开包统一使用 `@ycloud-web` scope：

- `@ycloud-web/icons` 用于与框架无关的 JavaScript 使用方式。
- `@ycloud-web/icons-react` 用于 React。
- `@ycloud-web/icons-vue` 用于 Vue。
- `@ycloud-web/icons-data` 用于标准化图标数据。
- `@ycloud-web/icons-svelte`、`@ycloud-web/icons-solid`、`@ycloud-web/icons-preact`、`@ycloud-web/icons-react-native`、`@ycloud-web/icons-angular`、`@ycloud-web/icons-astro` 和 `@ycloud-web/icons-static` 用于其他支持的包类型。

内部构建工具可以在公开包稳定前继续保留既有内部目录名，避免一次性重命名带来额外风险。

## 组件命名

组件名保持简单且强类型：

```tsx
import { Camera } from '@ycloud-web/icons-react';
```

生成组件不额外追加 `Outline` 或 `Filled` 后缀。这样可以保持 IDE 自动补全、重命名重构和 import 整理足够直观。

## 风格变体

风格变体通过源目录和包入口表达：

```tsx
import { Camera } from '@ycloud-web/icons-react/outline';
import { Camera as FilledCamera } from '@ycloud-web/icons-react/filled';
```

当转换逻辑可靠时，可以从同一份标准化图标源生成多个入口。如果某个图标无法可靠自动转换，流水线应允许显式提供特定风格的 SVG 覆盖。

## 上游同步

大型结构重命名应与包品牌改造拆开处理。例如目录名可以暂时保留为 `packages/ycloud-react`，同时发布包名使用 `@ycloud-web/icons-react`。
