---
title: 别名 - Solid
description: 了解 Solid 项目中可用的 YCloud Icons 导入命名风格，以及如何选择适合项目的方式。
---

# 别名

部分图标会有多个名称。这通常是因为我们会为了和整套图标保持一致而重命名图标，或者原名称不够通用。例如，`edit-2` 会被重命名为更通用的 `pen`，因为它本质上就是一个笔图标。

除了这些别名，YCloud Icons 也提供带前缀和后缀的名称，方便在项目中使用，避免和其他库或你自己的代码发生导入命名冲突。

```tsx
// 这些都是同一个图标
import { House, HouseIcon, YCloudHouse } from '@ycloud-web/icons-solid';
```

### 关闭 IDE 自动补全

```json [.vscode/settings.json]
{
  "js/ts.preferences.autoImportFileExcludePatterns": ["@ycloud-web/icons-solid"]
}
```
