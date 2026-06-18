---
title: 别名 - React
description: 了解 React 项目中 YCloud 图标支持的不同导入命名方式，以及如何选择适合你的命名风格。
---

# 别名

有些图标会有多个名称。这通常是因为我们会对图标重命名，让它和整套图标的命名更一致，或者让名称更通用。例如，`edit-2` 被重命名为 `pen`，因为它本质上只是一个更通用的笔形图标。

除了这些别名外，YCloud 还提供带前缀和后缀的名称，方便你在项目中使用。这可以避免和其他库或你自己的代码发生导入命名冲突。

```tsx
// 这些都是同一个图标
import { House, HouseIcon, YCloudHouse } from '@ycloud-web/icons-react';
```

## 选择导入命名风格

如果你希望项目里的导入方式保持一致，或者想调整 IDE 中 YCloud 图标的自动补全结果，可以选择你偏好的导入命名风格。

具体做法是创建一个自定义模块声明文件来覆盖 YCloud 的导入，同时关闭 IDE 中默认包路径的自动补全。

### 关闭 IDE 中的自动补全

```json [.vscode/settings.json]
{
  "js/ts.preferences.autoImportFileExcludePatterns": ["@ycloud-web/icons-react"]
}
```

### 创建自定义模块声明文件

创建一个自定义 TypeScript 声明文件，重新导出你偏好的命名风格：

```ts [ycloud-react.d.ts]
declare module '@ycloud-web/icons-react' {
  // 前缀命名
  export * from '@ycloud-web/icons-react/dist/ycloud-react.prefixed';
  // or
  // 后缀命名
  export * from '@ycloud-web/icons-react/dist/ycloud-react.suffixed';
}
```

把这个文件放在项目根目录，或放在 TypeScript 配置会包含的目录中。
常见做法是创建一个 `@types` 文件夹，并把文件命名为 `ycloud-react.d.ts`。

### 导入命名风格

| 导入风格 | 可用导入名                 | 声明文件导入路径      |
| -------- | -------------------------- | --------------------- |
| 默认     | Home, HomeIcon, YCloudHome |                       |
| 前缀     | YCloudHome                 | ycloud-react.prefixed |
| 后缀     | HomeIcon                   | ycloud-react.suffixed |
