---
title: 描边宽度 - Angular
description: 了解如何在 Angular 应用中通过 `strokeWidth` input 调整图标描边宽度，或通过 `absoluteStrokeWidth` input 保持描边宽度恒定。
---

<script setup>
import Sandpack from '~/.vitepress/theme/components/editors/SandpackAngular.vue'
</script>

# 描边宽度

所有图标都由使用描边的 SVG 元素绘制，默认描边宽度为 `2px`。

可以调整 `strokeWidth`，让图标呈现不同的视觉效果。

## 使用 `strokeWidth` input 调整描边宽度

::: sandpack {template=angular showTabs=false editorHeight=400 editorWidthPercentage=60 dependencies="@ycloud-web/icons-angular"}

```ts /src/app/app.component.ts [active]
import { Component, ViewEncapsulation } from '@angular/core';
import { YCloudFolderLock } from '@ycloud-web/icons-angular';

@Component({
  selector: 'app',
  imports: [YCloudFolderLock],
  template: `<svg
    ycloudFolderLock
    [strokeWidth]="1"
  />`,
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class App {}
```

:::

## 固定描边宽度

绑定 `size` input 时，图标的描边宽度会随尺寸一起缩放，这是 SVG 的默认行为。`absoluteStrokeWidth` input 用来调整这一行为，让图标无论尺寸如何变化，描边宽度都保持固定。

也就是说，当启用 `absoluteStrokeWidth` 且图标 `size` 设置为 `48px` 时，屏幕上的 `strokeWidth` 仍然会保持 `2px`。

`2px` 是 YCloud Icons 的默认描边宽度，你可以根据需要调整。

![固定描边宽度对比](../../../images/absolute-stroke-width-compare.png?raw=true '固定描边宽度对比')

### 使用 `absoluteStrokeWidth` input 调整描边宽度

将 `absoluteStrokeWidth` 设置为 `true` 后，描边宽度会保持固定。

::: sandpack {template=angular showTabs=false editorHeight=400 editorWidthPercentage=60 dependencies="@ycloud-web/icons-angular"}

```ts /src/app/app.component.ts [active]
import { Component, ViewEncapsulation } from '@angular/core';
import { YCloudRollerCoaster } from '@ycloud-web/icons-angular';

@Component({
  selector: 'app',
  imports: [YCloudRollerCoaster],
  template: `
    <svg
      ycloudRollerCoaster
      [size]="96"
      [absoluteStrokeWidth]="true"
    ></svg>
  `,
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class App {}
```

:::
