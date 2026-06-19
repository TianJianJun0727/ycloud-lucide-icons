---
title: 颜色 - Preact
description: 了解如何在 Preact 应用中通过 `color` prop 或父元素文本颜色调整图标颜色。
---

<script setup>
import Sandpack from '~/.vitepress/theme/components/editors/SandpackPreact.vue'
</script>

# 颜色

默认情况下，所有图标的颜色值都是 `currentColor`。这个关键字会使用元素计算后的文本 `color` 值作为图标颜色。

可以在 [MDN 的 `currentColor` 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#currentcolor_keyword)中了解更多。

## 使用 `color` prop 调整颜色

可以直接向图标组件传入 color prop 来调整颜色。

::: sandpack {showTabs=false editorHeight=295 editorWidthPercentage=60 dependencies="@ycloud-web/icons-preact"}

```js App.js [active]
import { h } from 'preact';
import { Smile } from '@ycloud-web/icons-preact';

function App() {
  return (
    <div className="app">
      <Smile color="#3e9392" />
    </div>
  );
}

export default App;
```

:::

## 使用父元素文本颜色

因为 YCloud Icons 使用 `currentColor`，所以图标颜色取决于当前元素计算后的 `color`，也可以从父元素继承。

例如，如果父元素的颜色值是 `#fff`，其中一个子元素是 YCloud Icons 图标，那么图标会渲染为 `#fff`。这是浏览器原生行为。

::: sandpack {showTabs=false editorHeight=340 editorWidthPercentage=60 dependencies="@ycloud-web/icons-preact"}

```jsx Button.jsx [active]
import { h } from 'preact';
import { ThumbsUp } from '@ycloud-web/icons-preact';

function LikeButton() {
  return (
    <button style={{ color: '#fff' }}>
      <ThumbsUp />
      赞
    </button>
  );
}

export default LikeButton;
```

```js App.js [hidden]
import { h } from 'preact';
import Button from './Button';

export default function App() {
  return <Button />;
}
```

:::
