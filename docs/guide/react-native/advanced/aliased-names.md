---
title: 别名 - React Native
description: 了解 React Native 项目中可用的 YCloud Icons 导入命名风格，以及如何选择适合项目的方式。
---

# 别名

部分图标会有多个名称。这通常是因为我们会为了和整套图标保持一致而重命名图标，或者原名称不够通用。例如，`edit-2` 会被重命名为更通用的 `pen`，因为它本质上就是一个笔图标。

除了这些别名，YCloud Icons 也提供带前缀和后缀的名称，方便在项目中使用，避免和其他库或你自己的代码发生导入命名冲突。

```tsx
// 这些都是同一个图标
import { House, HouseIcon, YCloudHouse } from '@ycloud-web/icons-react-native';
```

## 选择导入命名风格

如果希望整个项目中的导入方式保持一致，或者想调整 IDE 中 YCloud Icons 的自动补全，可以选择自己偏好的导入命名风格。

可以通过创建自定义模块声明文件覆盖 YCloud Icons 的导入，并在 IDE 中关闭默认自动补全来实现。

### 关闭 IDE 自动补全

```json [.vscode/settings.json]
{
  "js/ts.preferences.autoImportFileExcludePatterns": ["@ycloud-web/icons-react-native"]
}
```

### 创建自定义模块声明文件

创建一个自定义 TypeScript 声明文件，重新导出你偏好的命名风格：

```ts [@ycloud-web/icons-react-native.d.ts]
declare module '@ycloud-web/icons-react-native' {
  // 前缀导入名称
  export * from '@ycloud-web/icons-react-native/dist/@ycloud-web/icons-react-native.prefixed';
  // or
  // 后缀导入名称
  export * from '@ycloud-web/icons-react-native/dist/@ycloud-web/icons-react-native.suffixed';
}
```

将这个文件放在项目根目录，或放在 TypeScript 配置会包含的目录中。
A common approach is to create a `@types` folder and name the file `@ycloud-web/icons-react-native.d.ts`.

### 导入命名风格

| 导入风格 | 可用导入          | Declaration file import                 |
| ------------ | -------------------------- | --------------------------------------- |
| 默认      | Home, HomeIcon, YCloudHome |                                         |
| 前缀      | YCloudHome                 | @ycloud-web/icons-react-native.prefixed |
| 后缀      | HomeIcon                   | @ycloud-web/icons-react-native.suffixed |
