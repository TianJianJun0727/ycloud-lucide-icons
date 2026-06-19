---
title: 组合图标 - Preact
description: 了解如何在 Preact 应用中通过嵌套 SVG 元素把多个图标组合成一个图标。
---

<script setup>
import Sandpack from '~/.vitepress/theme/components/editors/SandpackPreact.vue'
</script>

# 组合图标

你可以通过嵌套 SVG 元素，把多个图标组合成一个图标。
当你希望基于现有图标创建自定义图标时，这种方式会很有用。

::: sandpack {showTabs=false editorHeight=400 editorWidthPercentage=60 dependencies="@ycloud-web/icons-preact"}

```jsx App.js [active]
import { Scan, User } from '@ycloud-web/icons-preact';
import { h } from 'preact';

function App() {
  return (
    <div className="app">
      <Scan size={48}>
        <User
          size={12}
          x={6}
          y={6}
          absoluteStrokeWidth
        />
      </Scan>
    </div>
  );
}

export default App;
```

:::

这是合法用法，因为 [SVG 可以嵌套](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/svg#nested_svg_element)，并且图标支持所有 SVG 属性。
你可以通过调整 `x` 和 `y` 坐标，把内部图标放到需要的位置。

::: info 限制
组合图标时，需要确保 `x` 和 `y` 坐标位于外层图标的 `viewBox` 范围内（24x24）。
:::

## 与原生 SVG 元素组合

你也可以把 YCloud Icons 和原生 SVG 元素组合起来，构建自定义图标变体。

### 通知徽标示例

例如，可以通过 `circle` SVG 元素给图标添加一个通知徽标。

::: sandpack {showTabs=false editorHeight=580 editorWidthPercentage=60 dependencies="@ycloud-web/icons-preact"}

```jsx App.js [active]
import { Mail } from '@ycloud-web/icons-preact';
import { h } from 'preact';

function App() {
  const hasUnreadMessages = true;

  return (
    <div className="app">
      <Mail size={48}>
        {hasUnreadMessages && (
          <circle
            r="3"
            cx="21"
            cy="5"
            stroke="none"
            fill="#F56565"
          />
        )}
      </Mail>
    </div>
  );
}

export default App;
```

:::

### 文本元素示例

也可以使用 `text` SVG 元素给图标添加文本。

::: sandpack {showTabs=false editorHeight=400 editorWidthPercentage=60 dependencies="@ycloud-web/icons-preact"}

```jsx App.js [active]
import { File } from '@ycloud-web/icons-preact';
import { h } from 'preact';

function App() {
  return (
    <div className="app">
      <File size={48}>
        <text
          x={7.5}
          y={19}
          font-size={8}
          font-family="Verdana,sans-serif"
          stroke-width={1}
        >
          JS
        </text>
      </File>
    </div>
  );
}

export default App;
```

:::
