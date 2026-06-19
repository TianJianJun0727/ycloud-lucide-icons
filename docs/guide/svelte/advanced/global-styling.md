---
title: 全局样式 - Svelte
description: 了解如何在 Svelte 应用中通过 CSS 或 YCloud context provider 为所有 YCloud Icons 设置全局样式。
---

<script setup>
import Sandpack from '~/.vitepress/theme/components/editors/SandpackSvelte.vue';
</script>

# 全局样式

图标可以通过 [颜色](../basics/color.md)、[尺寸](../basics/sizing.md) 和 [描边宽度](../basics/stroke-width.md) 进行调整。
如果要为所有图标设置全局样式，可以使用 CSS，也可以使用 context provider。

我们推荐使用 CSS 设置全局样式，因为这是最直接的方式。
但如果使用 CSS，单个图标上的 `size`、`color` 和 `strokeWidth` 等 props 可能会被 CSS 优先级覆盖。若你仍希望单独图标可以继续通过 props 调整样式，可以使用 YCloud context provider。

## Context Provider

YCloud Icons for Svelte 提供了名为 `setYCloudIconsProps` 的 context API，可用于为应用中的所有 YCloud Icons 设置全局默认属性。
当你希望所有图标默认共享相同的尺寸、颜色或描边宽度时，这会很有用。

### 设置全局默认值

你可以在主入口文件或顶层组件中调用 `setYCloudIconsProps`，为所有图标设置默认属性。

```js
import { setYCloudIconsProps } from '@ycloud-web/icons-svelte';

setYCloudIconsProps({
  size: 32,
  color: '#4f46e5',
  strokeWidth: 1.5,
});
```

## 使用 CSS 设置样式

使用 CSS 设置图标样式很简单。

每个图标都会带有名为 `ycloud` 的 class。你可以在 CSS 文件中通过这个 class 选中应用内使用的所有图标。

- 图标的**颜色**可以通过 [`color`](https://developer.mozilla.org/en-US/docs/Web/CSS/color) CSS 属性修改。
- 图标的**尺寸**可以通过 [`width`](https://developer.mozilla.org/en-US/docs/Web/CSS/width) 和 [`height`](https://developer.mozilla.org/en-US/docs/Web/CSS/height) CSS 属性修改。
- 图标的**描边宽度**可以通过 [`stroke-width`](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-width) CSS 属性修改。

::: sandpack {template=vite-svelte editorHeight=420 editorWidthPercentage=55}

```css src/icon.css [active]
.ycloud {
  /* 修改这里 */
  color: #ffadff;
  width: 56px;
  height: 56px;
  stroke-width: 1px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 6px;
}
```

```svelte src/App.svelte
<script>
import CakeSlice from '@ycloud-web/icons-svelte/icons/cake-slice';
import Candy from '@ycloud-web/icons-svelte/icons/candy';
import Apple from '@ycloud-web/icons-svelte/icons/apple';
import Cookie from '@ycloud-web/icons-svelte/icons/cookie';
import Martini from '@ycloud-web/icons-svelte/icons/martini';
import IceCream2 from '@ycloud-web/icons-svelte/icons/ice-cream-2';
import Sandwich from '@ycloud-web/icons-svelte/icons/sandwich';
import Wine from '@ycloud-web/icons-svelte/icons/wine';
import Dessert from '@ycloud-web/icons-svelte/icons/dessert';

import "./icon.css";
</script>

<div class="grid">
  <CakeSlice />
  <Candy />
  <Apple />
  <Cookie />
  <Martini />
  <IceCream2 />
  <Sandwich />
  <Wine />
  <Dessert />
</div>
```

:::

### 固定描边宽度

如需全局固定描边宽度，可以给图标的子元素应用 `vector-effect: non-scaling-stroke` CSS 属性。这样无论图标尺寸如何变化，描边宽度都会保持不变。更多信息请参考[固定描边宽度](../basics/stroke-width.md#固定描边宽度)。

::: sandpack {template=vite-svelte editorHeight=420 editorWidthPercentage=55}

```css src/icon.css [active]
.ycloud {
  width: 48px;
  height: 48px;
  stroke-width: 1.5;
}

.ycloud * {
  vector-effect: non-scaling-stroke;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 6px;
}
```

```svelte src/App.svelte
<script>
import TentTree from '@ycloud-web/icons-svelte/icons/tent-tree';
import Caravan from '@ycloud-web/icons-svelte/icons/caravan';
import FlameKindling from '@ycloud-web/icons-svelte/icons/flame-kindling';
import MountainSnow from '@ycloud-web/icons-svelte/icons/mountain-snow';
import Trees from '@ycloud-web/icons-svelte/icons/trees';
import Axe from '@ycloud-web/icons-svelte/icons/axe';
import Map from '@ycloud-web/icons-svelte/icons/map';
import CloudMoon from '@ycloud-web/icons-svelte/icons/cloud-moon';
import Sparkles from '@ycloud-web/icons-svelte/icons/sparkles';

import "./icon.css";
</script>

<div class="grid">
  <TentTree />
  <Caravan />
  <FlameKindling />
  <MountainSnow />
  <Trees />
  <Axe />
  <Map />
  <CloudMoon />
  <Sparkles />
</div>
```

:::
