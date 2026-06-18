---
title: 尺寸 - React
description: 了解如何在 React 应用中通过 `size` prop 或 CSS 调整图标尺寸。
---

<script setup>
import Sandpack from '~/.vitepress/theme/components/editors/Sandpack.vue'
</script>

# 尺寸

默认情况下，所有图标的尺寸都是 `24px` x `24px`。你可以通过 `size` prop 或 CSS 调整图标尺寸。

## 使用 `size` prop 调整图标尺寸

::: sandpack {template=react showTabs=false editorHeight=300 editorWidthPercentage=60 dependencies="@ycloud-web/icons-react"}

```jsx App.js [active]
import { Landmark } from '@ycloud-web/icons-react';

function App() {
  return (
    <div className="app">
      <Landmark size={64} />
    </div>
  );
}

export default App;
```

:::

## 使用 CSS 调整图标尺寸

可以使用 CSS 的 `width` 和 `height` 属性调整图标尺寸。

::: sandpack {template=react editorHeight=300 dependencies="@ycloud-web/icons-react"}

```css icon.css [active]
.my-beer-icon {
  /* 修改这里 */
  width: 64px;
  height: 64px;
}
```

```jsx App.js
import { Beer } from '@ycloud-web/icons-react';
import './icon.css';

function App() {
  return (
    <div className="app">
      <Beer className="my-beer-icon" />
    </div>
  );
}

export default App;
```

:::

### 根据字体大小动态调整图标尺寸

图标也可以根据字体大小自动缩放。通常可以通过 `em` 单位实现。关于 `em` 的更多信息，可以参考这篇 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size#ems)。

::: sandpack {template=react editorHeight=300 dependencies="@ycloud-web/icons-react"}

```css icon.css [active]
.my-icon {
  /* 图标尺寸会相对于 .text-wrapper 的 font-size */
  width: 1em;
  height: 1em;
}

.text-wrapper {
  /* 修改这里 */
  font-size: 96px;

  /* 布局样式 */
  display: flex;
  gap: 0.25em;
  align-items: center;
}
```

```jsx App.js
import { Star } from '@ycloud-web/icons-react';
import './icon.css';

function App() {
  return (
    <div className="text-wrapper">
      <Star class="my-icon" />
      <div>是</div>
    </div>
  );
}

export default App;
```

:::

### 使用 Tailwind 调整尺寸

可以使用 `size-*` 工具类调整图标尺寸。关于 `size-*` 工具类的更多信息，可以参考 [Tailwind 文档](https://tailwindcss.com/docs/width#setting-both-width-and-height)。

::: sandpack {template=react editorHeight=300 editorWidthPercentage=60 dependencies="@ycloud-web/icons-react" externalResources="https://cdn.tailwindcss.com"}

```jsx App.js [active]
import { PartyPopper } from '@ycloud-web/icons-react';

function App() {
  return (
    <div>
      <PartyPopper className="size-24" />
    </div>
  );
}

export default App;
```

:::
