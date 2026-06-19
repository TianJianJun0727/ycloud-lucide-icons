---
title: 组合图标 - Angular
description: 了解如何在 Angular 应用中通过嵌套 SVG 元素把多个图标组合成一个图标。
---

<script setup>
import Sandpack from '~/.vitepress/theme/components/editors/SandpackAngular.vue'
</script>

# 组合图标

可以通过在 SVG 中嵌套 SVG，把多个图标组合成一个图标。
如果你想基于现有图标做组合，创建自己的自定义图标，这种方式会很有用。

::: sandpack {template=angular showTabs=false editorHeight=400 editorWidthPercentage=60 dependencies="@ycloud-web/icons-angular"}

```ts /src/app/app.component.ts [active]
import { Component, ViewEncapsulation } from '@angular/core';
import { YCloudScan, YCloudUser } from '@ycloud-web/icons-angular';

@Component({
  selector: 'app',
  imports: [YCloudScan, YCloudUser],
  template: ` <svg
    ycloudScan
    [size]="48"
  >
    <svg
      ycloudUser
      [size]="12"
      x="6"
      y="6"
      [strokeWidth]="4"
      [absoluteStrokeWidth]="true"
    />
  </svg>`,
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class App {}
```

:::

这是合法的 SVG 写法，图标也支持所有 SVG 属性。
可以通过调整 `x` 和 `y` 坐标，把图标放到需要的位置。

::: info 限制
组合图标时，需要确保 `x` 和 `y` 坐标位于外层图标的 `viewBox` 范围内（24x24）。
:::

## 与自定义 SVG 元素组合

也可以使用 SVG 元素创建自己的图标。

### 通知徽标示例

例如，可以通过 `circle` SVG 元素给图标添加一个通知徽标。

::: sandpack {template=angular showTabs=false editorHeight=400 editorWidthPercentage=60 dependencies="@ycloud-web/icons-angular"}

```ts /src/app/app.component.ts [active]
import { Component, ViewEncapsulation, signal } from '@angular/core';
import { YCloudMail } from '@ycloud-web/icons-angular';

@Component({
  selector: 'app',
  imports: [YCloudMail],
  template: ` <svg
    ycloudMail
    [size]="48"
  >
    @if (hasUnreadMessages()) {
      <circle
        r="3"
        cx="21"
        cy="5"
        stroke="none"
        fill="#F56565"
      />
    }
  </svg>`,
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class App {
  protected readonly hasUnreadMessages = signal<boolean>(true);
}
```

:::

### 文本元素示例

也可以使用 `text` SVG 元素给图标添加文本。

::: sandpack {template=angular showTabs=false editorHeight=400 editorWidthPercentage=60 dependencies="@ycloud-web/icons-angular"}

```ts /src/app/app.component.ts [active]
import { Component, ViewEncapsulation } from '@angular/core';
import { YCloudFile } from '@ycloud-web/icons-angular';

@Component({
  selector: 'app',
  imports: [YCloudFile],
  template: ` <svg
    ycloudFile
    [size]="48"
  >
    <text
      x="7.5"
      y="19"
      font-size="8"
      font-family="Verdana,sans-serif"
      stroke-width="1"
    >
      JS
    </text>
  </svg>`,
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class App {}
```

:::
