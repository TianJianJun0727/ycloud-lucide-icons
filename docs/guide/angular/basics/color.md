---
title: 颜色 - Angular
description: 了解如何在 Angular 应用中通过 `color` input 或父元素文本颜色调整图标颜色。
---

<script setup>
import Sandpack from '~/.vitepress/theme/components/editors/SandpackAngular.vue'
</script>

# 颜色

默认情况下，所有图标的颜色值都是 `currentColor`。这个关键字会使用元素计算后的文本 `color` 值作为图标颜色。

可以在 [MDN 的 `currentColor` 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#currentcolor_keyword)中了解更多。

## 使用 `color` input 调整颜色

The color can be adjusted by binding the `color` input of the element.

::: sandpack {template=angular showTabs=false editorHeight=400 editorWidthPercentage=60 dependencies="@ycloud-web/icons-angular"}

```ts /src/app/app.component.ts [active]
import { Component, ViewEncapsulation } from '@angular/core';
import { YCloudSmile } from '@ycloud-web/icons-angular';

@Component({
  selector: 'app',
  imports: [YCloudSmile],
  template: `<svg
    ycloudSmile
    color="#3e9392"
  />`,
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class App {}
```

:::

## 使用父元素文本颜色

因为 YCloud Icons 使用 `currentColor`，所以图标颜色取决于当前元素计算后的 `color`，也可以从父元素继承。

例如，如果父元素的颜色值是 `#fff`，其中一个子元素是 YCloud Icons 图标，那么图标会渲染为 `#fff`。这是浏览器原生行为。

::: sandpack {template=angular showTabs=false editorHeight=400 editorWidthPercentage=60 dependencies="@ycloud-web/icons-angular"}

```ts /src/app/app.component.ts [active]
import { Component, ViewEncapsulation } from '@angular/core';
import { YCloudThumbsUp } from '@ycloud-web/icons-angular';

@Component({
  selector: 'app',
  imports: [YCloudThumbsUp],
  template: `
    <button style="color:#fff">
      <svg ycloudThumbsUp></svg>
      赞
    </button>
  `,
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class App {}
```

:::
