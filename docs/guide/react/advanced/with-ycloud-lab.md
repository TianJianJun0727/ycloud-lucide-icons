---
title: 使用 YCloud Icons Lab 或自定义图标 - React
description: 了解如何在 React 应用中通过 Icon 组件使用 YCloud Icons Lab 或自定义图标。
---

# 使用 YCloud Icons Lab 或自定义图标

[YCloud Icons Lab](https://github.com/TianJianJun0727/ycloud-icons-lab) 收录了一批不属于 YCloud Icons 主库的图标。

这些图标可以通过 `Icon` 组件使用。
和普通 YCloud 图标一样，你也可以传入各种 props 来调整图标外观。

## 使用 `Icon` 组件

下面会根据传入的 `iconNode` 创建并渲染一个 YCloud 图标组件。

```jsx
import { Icon } from '@ycloud-web/icons-react';
import { coconut } from '@ycloud-web/icons-lab';

const App = () => <Icon iconNode={coconut} />;
```
