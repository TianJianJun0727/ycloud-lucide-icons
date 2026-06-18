---
title: 全局样式 - React
description: 了解如何在 React 应用中通过 CSS 或 YCloud context provider 为所有 YCloud 图标设置全局样式。
---

<script setup>
import Sandpack from '~/.vitepress/theme/components/editors/Sandpack.vue';
</script>

# 全局样式

图标可以通过 [颜色](../basics/color.md)、[尺寸](../basics/sizing.md) 和 [描边宽度](../basics/stroke-width.md) 进行调整。
如果要为所有图标设置全局样式，可以使用 CSS，也可以使用 context provider。

我们推荐使用 CSS 设置全局样式，因为这是最直接的方式。
但如果使用 CSS，单个图标上的 `size`、`color` 和 `strokeWidth` 等 props 可能会被 CSS 优先级覆盖。若你仍希望单独图标可以继续通过 props 调整样式，可以使用 YCloud context provider。

## Context Provider

如果要通过 context provider 设置全局样式，可以使用 `@ycloud-web/icons-react` 包提供的 `YCloudIconsProvider` 组件。

<!-- TODO: Add codesandbox example -->

```tsx
import { YCloudIconsProvider, Home } from '@ycloud-web/icons-react';

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

## 使用 CSS 设置样式

使用 CSS 设置图标样式很简单。

每个图标都会带有名为 `ycloud` 的 class。你可以在 CSS 文件中通过这个 class 选中应用内使用的所有图标。

- 图标的**颜色**可以通过 [`color`](https://developer.mozilla.org/en-US/docs/Web/CSS/color) CSS 属性修改。
- 图标的**尺寸**可以通过 [`width`](https://developer.mozilla.org/en-US/docs/Web/CSS/width) 和 [`height`](https://developer.mozilla.org/en-US/docs/Web/CSS/height) CSS 属性修改。
- 图标的**描边宽度**可以通过 [`stroke-width`](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-width) CSS 属性修改。

::: sandpack {template=react editorHeight=300 dependencies="@ycloud-web/icons-react"}

```css icon.css [active]
.ycloud {
  /* 修改这里 */
  color: #ffadff;
  width: 56px;
  height: 56px;
  stroke-width: 1px;
}

.app {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 6px;
}
```

```jsx App.js
import {
  CakeSlice,
  Candy,
  Apple,
  Cookie,
  Martini,
  IceCream2,
  Sandwich,
  Wine,
  Dessert,
} from '@ycloud-web/icons-react';
import './icon.css';

function App() {
  return (
    <div className="app">
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
  );
}

export default App;
```

:::

### 固定描边宽度

如果要设置全局固定描边宽度，可以给子元素应用 `vector-effect: non-scaling-stroke` CSS 属性。无论图标尺寸如何变化，它都会让描边宽度保持一致。更多信息见[固定描边宽度](../basics/stroke-width.md#固定描边宽度)。

::: sandpack {template=react editorHeight=300 dependencies="@ycloud-web/icons-react"}

```css icon.css [active]
.ycloud {
  width: 48px;
  height: 48px;
  stroke-width: 1.5;
}

.ycloud * {
  vector-effect: non-scaling-stroke;
}

.app {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 6px;
}
```

```jsx App.js
import {
  TentTree,
  Caravan,
  FlameKindling,
  MountainSnow,
  Trees,
  Axe,
  Map,
  CloudMoon,
  Sparkles,
} from '@ycloud-web/icons-react';
import './icon.css';

function App() {
  return (
    <div className="app">
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
  );
}

export default App;
```

:::
