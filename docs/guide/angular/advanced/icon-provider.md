---
title: Icon provider - Angular
description: 了解如何使用 provideYCloudIcons 全局注册图标，包括自定义图标和兼容旧数据的图标。
---

# Icon provider

可以使用 `YCloudDynamicIcon` 组件按名称渲染图标。按名称使用图标前，需要先通过 `provideYCloudIcons` 注册它。

建议先了解 [Angular 依赖注入的工作方式](https://angular.dev/guide/di)。

## 注册图标

在应用的 providers 中使用 `provideYCloudIcons` 注册图标。

```ts [app.config.ts]
import { ApplicationConfig } from '@angular/core';
import {
  provideYCloudIcons,
  YCloudSquareCheck,
  YCloudCircleAlert,
} from '@ycloud-web/icons-angular';

export const appConfig: ApplicationConfig = {
  providers: [provideYCloudIcons(YCloudSquareCheck, YCloudCircleAlert)],
};
```

之后就可以通过名称引用已注册的图标：

```html [app.html]
<svg ycloudIcon="square-check"></svg> <svg ycloudIcon="circle-alert"></svg>
```

## 名称如何解析

每个注册图标都会按图标名称保存。对于内置 YCloud Icons，通常是 kebab-case 格式的图标名称。

例如，注册 `YCloudSquareCheck` 后，可以这样使用：

```html
<svg ycloudIcon="square-check"></svg>
```

如果图标定义了别名，这些别名也会自动注册。

## 注册自定义图标

`provideYCloudIcons` 也可以注册自定义图标数据对象。

```ts [custom-icon.ts]
import { YCloudIconData } from '@ycloud-web/icons-angular';

export const MyCustomIcon: YCloudIconData = {
  name: 'my-custom-icon',
  node: [['circle', { cx: 12, cy: 12, r: 8 }]],
};
```

```ts [app.config.ts]
import { ApplicationConfig } from '@angular/core';
import { provideYCloudIcons } from '@ycloud-web/icons-angular';
import { MyCustomIcon } from './custom-icon';

export const appConfig: ApplicationConfig = {
  providers: [provideYCloudIcons(MyCustomIcon)],
};
```

```html [app.html]
<svg ycloudIcon="my-custom-icon"></svg>
```

## 使用自定义图标节点

如果你有来自本地来源或 `@ycloud-web/icons-lab` 的自定义图标节点，可以使用 `ycloudLegacyIcon` 将它们转换为图标数据对象。

```ts [app.config.ts]
import { ApplicationConfig } from '@angular/core';
import { CirclePlayIcon, provideYCloudIcons, ycloudLegacyIcon } from '@ycloud-web/icons-angular';
import { burger } from '@ycloud-web/icons-lab';

export const appConfig: ApplicationConfig = {
  providers: [
    provideYCloudIcons(
      ycloudLegacyIcon('circle-play', CirclePlayIcon, ['play-circle']),
      ycloudLegacyIcon('burger', burger, ['hamburger']),
    ),
  ],
};
```

之后可以同时使用主名称和任意别名：

```html [app.html]
<svg ycloudIcon="circle-play"></svg>
<svg ycloudIcon="play-circle"></svg>
<svg ycloudIcon="burger"></svg>
<svg ycloudIcon="hamburger"></svg>
```

## 转换自定义图标映射

如果已经有一组自定义图标节点映射，可以使用 `ycloudLegacyIconMap` 将其转换为图标数据对象。

```ts [app.config.ts]
import { ApplicationConfig } from '@angular/core';
import {
  Circle,
  provideYCloudIcons,
  UserRoundX,
  ycloudLegacyIconMap,
} from '@ycloud-web/icons-angular';
import { burger } from '@ycloud-web/icons-lab';

export const appConfig: ApplicationConfig = {
  providers: [provideYCloudIcons(Circle, ...ycloudLegacyIconMap({ UserRoundX, burger }))],
};
```

它会把对象 key 转换为 kebab-case 格式的图标名称：

- `UserRoundX` → `user-round-x`
- `burger` → `burger`

原始对象 key 也会作为别名添加，因此下面两种写法都可以使用：

```html
<svg ycloudIcon="UserRoundX"></svg> <svg ycloudIcon="user-round-x"></svg>
```
