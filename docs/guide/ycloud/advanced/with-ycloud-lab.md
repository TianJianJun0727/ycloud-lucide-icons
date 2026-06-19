---
title: 使用 YCloud Icons Lab 或自定义图标 - YCloud
description: 了解如何在 Vanilla JavaScript 应用中使用 YCloud Icons Lab 或自定义图标。
---

<script setup>
import Sandpack from '~/.vitepress/theme/components/editors/Sandpack.vue'
</script>

# 使用 YCloud Icons Lab 或自定义图标

[YCloud Icons Lab](https://github.com/TianJianJun0727/ycloud-icons-lab) 收录了一批不属于 YCloud Icons 主库的图标。

你可以把 `@ycloud-web/icons-lab` 包添加到项目中使用这些图标。
和普通 YCloud Icons 图标一样，你也可以传入各种 props 来调整图标外观。

## 使用 YCloud Icons Lab 图标

下面会根据传入的 iconNode 创建并渲染一个 YCloud 图标组件。

::: sandpack {template=vanilla editorHeight=295 editorWidthPercentage=60 dependencies="ycloud,@ycloud-web/icons-lab"}

```html /index.html [active]
<!doctype html>
<html>
  <body>
    <i data-ycloud="avocado"></i>

    <script src="index.js"></script>
  </body>
</html>
```

```js /index.js
import './styles.css';

import { createIcons, Smile } from 'ycloud/dist/cjs/ycloud';
import { avocado as Avocado } from '@ycloud-web/icons-lab';

createIcons({
  icons: {
    Avocado,
  },
});
```

:::
