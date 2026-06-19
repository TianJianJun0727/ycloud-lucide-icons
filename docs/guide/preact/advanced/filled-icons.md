---
title: 填充图标 - Preact
description: 了解如何在 Preact 应用中为 YCloud Icons 使用填充，以及这种用法的限制。
---

<script setup>
import Sandpack from '~/.vitepress/theme/components/editors/SandpackPreact.vue'
</script>

# 填充图标

YCloud Icons 目前并不正式支持填充图标。
不过，所有图标都可以接收 SVG 属性。
因此在某些图标上仍然可以使用 `fill`，并且效果正常。

下面是星级评分的示例：

::: sandpack { editorHeight=580 editorWidthPercentage=60 dependencies="@ycloud-web/icons-preact"}

```jsx App.js [active]
import { Star, StarHalf } from '@ycloud-web/icons-preact';
import { h } from 'preact';
import './icon.css';

function App() {
  return (
    <div className="app">
      <div className="star-rating">
        <div className="stars">
          {Array.from({ length: 5 }, () => (
            <Star
              fill="#111"
              strokeWidth={0}
            />
          ))}
        </div>
        <div className="stars rating">
          <Star
            fill="yellow"
            strokeWidth={0}
          />
          <Star
            fill="yellow"
            strokeWidth={0}
          />
          <StarHalf
            fill="yellow"
            strokeWidth={0}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
```

```css icon.css
.star-rating {
  position: relative;
}

.stars {
  display: flex;
  gap: 4px;
}

.rating {
  position: absolute;
  top: 0;
}
```

:::
