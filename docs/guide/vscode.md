---
title: Visual Studio Code
description: 了解如何在 Visual Studio Code 中使用 YCloud Icons，包括调整自动补全、查看 JS docs 和图标预览。
---

# Visual Studio Code

Visual Studio Code（VS Code）是常用代码编辑器，提供了丰富功能和扩展来提升开发体验。

## 关闭 IDE 自动补全

所有图标都会从主模块导出，这可能会让 IDE 自动补全建议变得很嘈杂。
可以在 VS Code 设置中添加下面的配置关闭它。

```json [.vscode/settings.json]
{
  "js/ts.preferences.autoImportFileExcludePatterns": [
    "@ycloud-web/icons-react", // or
    "@ycloud-web/icons-preact", // or
    "@ycloud-web/icons-react-native", // or
    "@ycloud-web/icons-vue"
  ]
}
```

## JS Docs 和图标预览

每个图标都带有 JS docs。在 VS Code 中，把鼠标悬停到图标组件上即可查看 JS docs。

同时也会显示一个小的图标预览。

![VS Code JS Docs](./images/vscode-hover.png)

## 扩展

YCloud Icons 目前没有官方 VS Code 扩展。可以使用 TypeScript 自动导入和 package exports 来获得组件名补全与重命名支持。
