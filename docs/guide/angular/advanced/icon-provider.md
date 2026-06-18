---
title: Icon provider - Angular
description: Learn how to register icons globally using provideYCloudIcons, including custom and legacy icons.
---

# Icon provider

You can use the `YCloudDynamicIcon` component to render icons by name. To use an icon by name, you must first register it with `provideYCloudIcons`.

Make sure you are well acquainted with [how dependency injection in Angular works](https://angular.dev/guide/di).

## Registering icons

Use `provideYCloudIcons` in your application providers to register icons.

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

You can then reference the registered icons by name:

```html [app.html]
<svg ycloudIcon="square-check"></svg> <svg ycloudIcon="circle-alert"></svg>
```

## How names are resolved

Each registered icon is stored by its icon name. For built-in YCloud icons, this is typically the kebab-case icon name.

For example, registering `YCloudSquareCheck` makes it available as:

```html
<svg ycloudIcon="square-check"></svg>
```

If an icon defines aliases, those aliases are also registered automatically.

## Registering custom icons

`provideYCloudIcons` can also register custom icon data objects.

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

## Using custom icon nodes

If you have custom icon nodes from a local source or `@ycloud-web/icons-lab`, you can convert them using `ycloudLegacyIcon`.

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

You can then use both the primary name and any aliases:

```html [app.html]
<svg ycloudIcon="circle-play"></svg>
<svg ycloudIcon="play-circle"></svg>
<svg ycloudIcon="burger"></svg>
<svg ycloudIcon="hamburger"></svg>
```

## Converting a map of custom icons

If you already have a map of custom icon nodes, use `ycloudLegacyIconMap` to convert them into icon data objects.

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

This converts the object keys to kebab-case icon names:

- `UserRoundX` → `user-round-x`
- `burger` → `burger`

The original object key is also added as an alias, so both of these will work:

```html
<svg ycloudIcon="UserRoundX"></svg> <svg ycloudIcon="user-round-x"></svg>
```
