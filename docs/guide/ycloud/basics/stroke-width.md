---
title: 描边宽度 - YCloud
description: 了解如何在 Vanilla JavaScript 应用中通过 strokeWidth 和 absoluteStrokeWidth 属性调整 YCloud Icons 的描边宽度。
---

<script setup>
import Sandpack from '~/.vitepress/theme/components/editors/Sandpack.vue'
</script>

# 描边宽度

所有图标都由使用描边的 SVG 元素绘制，默认描边宽度为 `2px`。

可以调整 `strokeWidth`，让图标呈现不同的视觉效果。

## 使用 `strokeWidth` prop 调整描边宽度

::: sandpack {template=vanilla showTabs=false editorHeight=250 editorWidthPercentage=70 dependencies="ycloud"}

```html /index.html [active]
<!doctype html>
<html>
  <body>
    <i
      data-ycloud="folder-lock"
      stroke-width="1"
    ></i>

    <script src="index.js"></script>
  </body>
</html>
```

```js /index.js
import './styles.css';

import { createIcons, FolderLock } from 'ycloud/dist/cjs/ycloud';

createIcons({
  icons: {
    FolderLock,
  },
});
```

:::

<!-- ## 固定描边宽度

调整 `size` prop 时，描边宽度会随图标尺寸一起缩放，这是 SVG 的默认行为。`absoluteStrokeWidth` prop 用来改变这种行为，让描边宽度在不同图标尺寸下保持恒定。

也就是说，当启用 `absoluteStrokeWidth` 且图标 `size` 设置为 `48px` 时，屏幕上的 `strokeWidth` 仍然会保持 `2px`。

`2px` 是 YCloud Icons 的默认描边宽度，你可以根据需要调整。

![固定描边宽度对比](../../../images/absolute-stroke-width-compare.png?raw=true "固定描边宽度对比")

### 使用 `absoluteStrokeWidth` prop 调整描边宽度

将 `absoluteStrokeWidth` 设置为 `true` 后，描边宽度会保持固定。

::: sandpack {template=vanilla showTabs=false editorHeight=250 editorWidthPercentage=70 dependencies="ycloud"}

```html /index.html [active]
<!DOCTYPE html>
<html>
  <body>
    <i data-ycloud="roller-coaster" stroke-width="96" absolute-stroke-width="true"></i>

    <script src="index.js"></script>
  </body>
</html>
```

```js /index.js
import "./styles.css";

import { createIcons, RollerCoaster } from 'ycloud/dist/cjs/ycloud';

createIcons({
  icons: {
    RollerCoaster,
  }
});

```

::: -->
