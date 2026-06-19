---
title: 全局样式 - Angular
description: 了解如何在 Angular 应用中通过 CSS 或 provideYCloudConfig provider 为所有图标设置全局样式。
---

<script setup>
import Sandpack from '~/.vitepress/theme/components/editors/SandpackAngular.vue'
</script>

# 全局样式

YCloud Icons 可以通过 [颜色](../basics/color.md)、[尺寸](../basics/sizing.md) 和 [描边宽度](../basics/stroke-width.md) input 进行调整。

如果要为所有图标设置全局样式，可以使用 CSS，也可以通过 `provideYCloudConfig` 配置全局默认值。

我们推荐使用 CSS 设置全局样式，因为这是最直接的方式。不过 CSS 规则可能会覆盖单个图标上的 `size`、`color` 和 `strokeWidth` input。如果仍希望单个图标可以继续通过 input 单独配置，请改用 `provideYCloudConfig`。

## 配置全局默认值

YCloud Icons for Angular 提供了 `provideYCloudConfig` provider，用于为所有图标设置默认属性。

你可以定义全局默认值（例如 `size`、`color` 或 `strokeWidth`），同时仍允许单个图标通过 input 覆盖这些默认值。

Register the provider in your application configuration or in a top-level component:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideYCloudConfig } from '@ycloud-web/icons-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideYCloudConfig({
      strokeWidth: 1.5,
    }),
  ],
};
```

## 使用 CSS 设置样式

可以使用 CSS 为图标设置全局样式。

所有 YCloud Icons 都包含 `ycloud` class。你可以在样式中使用这个 class 选中应用里的每个图标。

- 图标的**颜色**可以通过 [`color`](https://developer.mozilla.org/en-US/docs/Web/CSS/color) 属性修改。
- 图标的**尺寸**可以通过 [`width`](https://developer.mozilla.org/en-US/docs/Web/CSS/width) 和 [`height`](https://developer.mozilla.org/en-US/docs/Web/CSS/height) 修改。
- 图标的**描边宽度**可以通过 [`stroke-width`](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-width) 修改。

::: sandpack {template=angular editorHeight=300 dependencies="@ycloud-web/icons-angular"}

```css /src/app/icon.css [active]
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

```ts /src/app/app.component.ts
import { Component, ViewEncapsulation } from '@angular/core';
import {
  YCloudCakeSlice,
  YCloudCandy,
  YCloudApple,
  YCloudCookie,
  YCloudMartini,
  YCloudIceCream2,
  YCloudSandwich,
  YCloudWine,
  YCloudDessert,
} from '@ycloud-web/icons-angular';

@Component({
  selector: 'app',
  imports: [
    YCloudCakeSlice,
    YCloudCandy,
    YCloudApple,
    YCloudCookie,
    YCloudMartini,
    YCloudIceCream2,
    YCloudSandwich,
    YCloudWine,
    YCloudDessert,
  ],
  template: `<div class="grid">
    <svg ycloudCakeSlice />
    <svg ycloudCandy />
    <svg ycloudApple />
    <svg ycloudCookie />
    <svg ycloudMartini />
    <svg ycloudIceCream2 />
    <svg ycloudSandwich />
    <svg ycloudWine />
    <svg ycloudDessert />
  </div>`,
  styleUrls: ['./app.component.css', './icon.css'],
  encapsulation: ViewEncapsulation.None,
})
export class App {}
```

:::

### 固定描边宽度

要让描边宽度不随图标尺寸变化，可以给图标的子元素应用 `vector-effect: non-scaling-stroke`。更多细节请参考[固定描边宽度](../basics/stroke-width.md#固定描边宽度)。

::: sandpack {template=angular editorHeight=300 dependencies="@ycloud-web/icons-angular"}

```css /src/app/icon.css [active]
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

```ts /src/app/app.component.ts
import { Component, ViewEncapsulation } from '@angular/core';
import {
  YCloudTentTree,
  YCloudCaravan,
  YCloudFlameKindling,
  YCloudMountainSnow,
  YCloudTrees,
  YCloudAxe,
  YCloudMap,
  YCloudCloudMoon,
  YCloudSparkles,
} from '@ycloud-web/icons-angular';

@Component({
  selector: 'app',
  imports: [
    YCloudTentTree,
    YCloudCaravan,
    YCloudFlameKindling,
    YCloudMountainSnow,
    YCloudTrees,
    YCloudAxe,
    YCloudMap,
    YCloudCloudMoon,
    YCloudSparkles,
  ],
  template: `<div class="grid">
    <svg ycloudTentTree />
    <svg ycloudCaravan />
    <svg ycloudFlameKindling />
    <svg ycloudMountainSnow />
    <svg ycloudTrees />
    <svg ycloudAxe />
    <svg ycloudMap />
    <svg ycloudCloudMoon />
    <svg ycloudSparkles />
  </div>`,
  styleUrls: ['./app.component.css', './icon.css'],
  encapsulation: ViewEncapsulation.None,
})
export class App {}
```

:::
