---
title: 全局样式 - React Native
description: 了解如何在 React Native 应用中通过 CSS 或 YCloud context provider 为所有 YCloud Icons 设置全局样式。
---

# 全局样式

图标可以通过 [颜色](../basics/color.md)、[尺寸](../basics/sizing.md) 和 [描边宽度](../basics/stroke-width.md) 进行调整。
如果要为所有图标设置全局样式，可以使用 context provider。

## Context Provider

如果要通过 context provider 设置全局样式，可以使用 `@ycloud-web/icons-react-native` 包提供的 `YCloudIconsProvider` 组件。

```tsx
import { YCloudIconsProvider, Home } from '@ycloud-web/icons-react-native';

const App = () => (
  <YCloudIconsProvider
    color="red"
    size={48}
    strokeWidth={2}
  >
    <Home />
  </YCloudIconsProvider>
);
```

这会把 `color`、`size` 和 `strokeWidth` props 应用到 `YCloudIconsProvider` 下的所有图标。
