---
title: YCloud Icons Lab - Angular
description: 了解如何在 Angular 应用中使用 YCloud Icons Lab 的图标。
---

<script setup>
import Sandpack from '~/.vitepress/theme/components/editors/SandpackAngular.vue'
</script>

# 使用 YCloud Icons Lab 或自定义图标

[YCloud Icons Lab](https://github.com/TianJianJun0727/ycloud-icons-lab) 收录了一批不属于 YCloud Icons 主库的图标。

这些图标不会以独立组件形式提供，但仍可以像官方图标一样传给 `YCloudIcon` 组件：

### 直接作为 YCloudIconData 使用

::: sandpack {template=angular showTabs=false editorHeight=400 editorWidthPercentage=60 dependencies="@ycloud-web/icons-angular,@ycloud-web/icons-lab"}

```ts /src/app/app.component.ts [active]
import { Component, ViewEncapsulation, signal } from '@angular/core';
import { YCloudDynamicIcon, ycloudLegacyIcon } from '@ycloud-web/icons-angular';
import { coconut } from '@ycloud-web/icons-lab';

@Component({
  selector: 'app',
  template: ` <svg [ycloudIcon]="icon()"></svg> `,
  imports: [YCloudDynamicIcon],
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class App {
  readonly icon = signal(ycloudLegacyIcon('coconut', coconut));
}
```

:::

### 作为已注册图标按名称使用

::: sandpack {template=angular editorHeight=400 editorWidthPercentage=60 dependencies="@ycloud-web/icons-angular,@ycloud-web/icons-lab"}

```ts /src/app/app.component.ts [active]
import { Component, ViewEncapsulation } from '@angular/core';
import { YCloudDynamicIcon } from '@ycloud-web/icons-angular';

@Component({
  selector: 'app',
  template: ` <svg ycloudIcon="bat-ball"></svg> `,
  imports: [YCloudDynamicIcon],
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class App {}
```

```ts /src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { ycloudLegacyIcon, provideYCloudIcons } from '@ycloud-web/icons-angular';
import { batBall } from '@ycloud-web/icons-lab';

export const appConfig: ApplicationConfig = {
  providers: [provideYCloudIcons(ycloudLegacyIcon('bat-ball', batBall))],
};
```

:::

### 创建自定义图标组件

你也可以使用 `YCloudIconBase` 创建自己的独立图标组件。

请确保使用 SVG 元素选择器，例如 `svg[ycloud{IconName}]`。

::: sandpack {template=angular editorHeight=400 editorWidthPercentage=60 dependencies="@ycloud-web/icons-angular,@ycloud-web/icons-lab"}

```ts /src/icons/bottle-champagne.ts
import { YCloudIconBase, ycloudIconTemplate, ycloudLegacyIcon } from '@ycloud-web/icons-angular';
import { Component, signal } from '@angular/core';
import { bottleChampagne } from '@ycloud-web/icons-lab';

@Component({
  selector: 'svg[ycloudBottleChampagne]',
  template: ycloudIconTemplate,
  standalone: true,
})
export class YCloudBottleChampagne extends YCloudIconBase {
  static readonly icon = ycloudLegacyIcon('bottle-champagne', bottleChampagne);
  protected override readonly icon = signal(YCloudBottleChampagne.icon);
}
```

```ts /src/app/app.component.ts
import { Component, ViewEncapsulation, signal } from '@angular/core';
import { YCloudDynamicIcon, ycloudLegacyIcon } from '@ycloud-web/icons-angular';
import { YCloudBottleChampagne } from '../icons/bottle-champagne';

@Component({
  selector: 'app',
  template: `<svg ycloudBottleChampagne></svg>`,
  imports: [YCloudBottleChampagne],
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class App {}
```

:::
