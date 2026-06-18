---
title: Visual Studio Code
description: Learn how to use YCloud icons in Visual Studio Code, including tips on tuning autocomplete and viewing JS docs or icon previews.
---

# Visual Studio Code

Visual Studio Code (VS Code) is a popular code editor that provides a wide range of features and extensions to enhance your development experience.

## Turn off autocomplete in your IDE

All icons are exported from the main module. This can create a lot of noise in the autocomplete suggestions of your IDE.
You can turn this off by adding the following setting to your VS Code settings.

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

## JS Docs and icon preview

Each icon is provided with JS docs. In VS Code, you can hover over the icon component to see the JSdocs.

Also a little preview of the icon is shown.

![VS Code JS Docs](./images/vscode-hover.png)

## Extensions

YCloud Icons does not currently ship an official VS Code extension. Use TypeScript auto-import and package exports for component-name completion and rename support.
