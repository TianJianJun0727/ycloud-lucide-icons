---
title: YCloud Icons Lab - Angular
description: Learn how to use icons from YCloud Icons Lab in your Angular application.
---

<script setup>
import Sandpack from '~/.vitepress/theme/components/editors/SandpackAngular.vue'
</script>

# With YCloud Icons Lab or custom icons

[YCloud Icons Lab](https://github.com/TianJianJun0727/ycloud-icons-lab) is a collection of icons that are not part of the YCloud Icons main library.

While they aren't provided as standalone components, they can be still be passed to the `YCloudIcon` component the same way as official icons:

### Directly as YCloudIconData

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

### As a provided icon by name

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

### Creating custom icon components

You can also create your own standalone icon components using `YCloudIconBase`.

Be sure to use an SVG element selector, e.g. `svg[ycloud{IconName}]`

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
