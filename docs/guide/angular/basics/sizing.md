---
title: 尺寸 - Angular
description: 了解如何在 Angular 应用中通过 `size` input 或 CSS 调整图标尺寸。
---

<script setup>
import Sandpack from '~/.vitepress/theme/components/editors/SandpackAngular.vue'
</script>

# 尺寸

默认情况下，所有图标的尺寸都是 `24px` × `24px`。可以通过绑定 `size` input 或使用 CSS 调整尺寸。

## 使用 `size` input 调整图标尺寸

::: sandpack {template=angular showTabs=false editorHeight=400 editorWidthPercentage=60 dependencies="@ycloud-web/icons-angular"}

```ts /src/app/app.component.ts [active]
import { Component, ViewEncapsulation } from '@angular/core';
import { YCloudLandmark } from '@ycloud-web/icons-angular';

@Component({
  selector: 'app',
  imports: [YCloudLandmark],
  template: `<svg
    ycloudLandmark
    [size]="64"
  />`,
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class App {}
```

:::

## 通过 CSS 调整图标尺寸

可以使用 CSS 的 `width` 和 `height` 属性调整图标尺寸。

::: sandpack {template=angular editorHeight=300 dependencies="@ycloud-web/icons-angular"}

```css /src/app/icon.css [active]
.my-beer-icon {
  /* 修改这里 */
  width: 64px;
  height: 64px;
}
```

```ts /src/app/app.component.ts
import { Component, ViewEncapsulation } from '@angular/core';
import { YCloudBeer } from '@ycloud-web/icons-angular';

@Component({
  selector: 'app',
  imports: [YCloudBeer],
  template: `<svg
    ycloudBeer
    class="my-beer-icon"
  ></svg>`,
  styleUrls: ['./app.component.css', './icon.css'],
  encapsulation: ViewEncapsulation.None,
})
export class App {}
```

:::

### 根据字体大小动态调整图标尺寸

图标也可以根据字体大小自动缩放，通常可以通过 `em` 单位实现。关于 `em` 的更多信息，可以参考这篇 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size#ems)。

::: sandpack {template=angular editorHeight=300 dependencies="@ycloud-web/icons-angular"}

```css /src/app/icon.css [active]
.my-icon {
  /* 图标尺寸会相对于 .text-wrapper 的 font-size */
  width: 1em;
  height: 1em;
}

.text-wrapper {
  /* 修改这里 */
  font-size: 96px;

  /* 布局相关 */
  display: flex;
  gap: 0.25em;
  align-items: center;
}
```

```ts /src/app/app.component.ts
import { Component, ViewEncapsulation } from '@angular/core';
import { YCloudStar } from '@ycloud-web/icons-angular';

@Component({
  selector: 'app',
  imports: [YCloudStar],
  template: `<div class="text-wrapper">
    <svg
      ycloudStar
      class="my-icon"
    ></svg>
    <div>是</div>
  </div>`,
  styleUrls: ['./app.component.css', './icon.css'],
  encapsulation: ViewEncapsulation.None,
})
export class App {}
```

:::

### 使用 Tailwind 调整尺寸

可以使用 `size-*` 工具类调整图标尺寸。关于 `size-*` 工具类的更多信息，可以参考 [Tailwind 文档](https://tailwindcss.com/docs/width#setting-both-width-and-height)。

```html [app.html]
<div>
  <svg
    ycloudPartyPopper
    class="size-24"
  ></svg>
</div>
```
