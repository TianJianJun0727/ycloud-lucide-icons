# `@ycloud-web/icons-angular`

A standalone, signal-based, zoneless implementation of YCloud icons for Angular.

**What you can accomplish:**

- Use icons as standalone Angular components with full dependency injection support
- Configure icons globally through modern Angular providers
- Integrate with Angular's reactive forms and data binding
- Build scalable applications with tree-shaken icons and lazy loading support

## Prerequisites

This package requires Angular 17+ and uses standalone components, signals, and zoneless change detection.

## Installation

::: code-group

```sh [pnpm]
pnpm add @ycloud-web/icons-angular
```

```sh [yarn]
yarn add @ycloud-web/icons-angular
```

```sh [npm]
npm install @ycloud-web/icons-angular
```

```sh [bun]
bun add @ycloud-web/icons-angular
```

:::

## How to use

### Standalone icons

Every icon can be imported as a ready-to-use standalone component:

```html
<svg ycloudFileText></svg>
```

```ts{2,7}
import { Component } from '@angular/core';
import { YCloudFileText } from '@ycloud-web/icons-angular';

@Component({
  selector: 'app-foobar',
  templateUrl: './foobar.html',
  imports: [YCloudFileText],
})
export class Foobar { }
```

::: tip
Standalone icon components use the selector `svg[ycloud{PascalCaseIconName}]`.

This ensures minimal bloating of the DOM and the ability to directly manipulate all attributes of the resulting SVG element.
:::

### Dynamic icon component

You may also use the dynamic `YCloudIcon` component to dynamically render icons.

#### With tree-shaken imports

You may pass imported icons directly to the component:

```html{3}
@for (item of items) {
  <a navbarItem [routerLink]="item.routerLink">
    <svg [ycloudIcon]="item.icon"></svg>
    {{ item.title }}
  </a>
}
```

```ts{2,8,14,19}
import { Component } from '@angular/core';
import { YCloudIcon, YCloudHouse, YCloudUsersRound } from '@ycloud-web/icons-angular';
import { NavbarItem, NavbarItemModel } from './navbar-item';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  imports: [YCloudIcon, NavbarItem],
})
export class Navbar {
  readonly items: NavbarItemModel[] = [
    {
      title: 'Home',
      icon: YCloudHouse,
      routerLink: [''],
    },
    {
      title: 'Users',
      icon: YCloudUsersRound,
      routerLink: ['admin/users'],
    },
  ];
}
```

#### With icons provided via dependency injection

Alternatively, the component also accepts string inputs.

To use icons this way, first, you have to provide icons via `provideYCloudIcons`:

:::code-group

```ts{7-10} [app.config.ts]
import { ApplicationConfig } from '@angular/core';
import { provideYCloudIcons, YCloudCircleCheck, YCloudCircleX } from '@ycloud-web/icons-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    provideYCloudIcons(
      YCloudCircleCheck,
      YCloudCircleX,
    ),
  ]
};
```

```html [foobar.html]
<svg ycloudIcon="circle-check"></svg>
```

```ts{7} [foobar.ts]
import { Component } from '@angular/core';
import { YCloudIcon } from '@ycloud-web/icons-angular';

@Component({
  selector: 'app-foobar',
  templateUrl: './template-url',
  imports: [YCloudIcon],
})
export class Foobar { }
```

:::

::: tip
For optimal bundle size, provide icons at the highest appropriate level in your application.

Providing all icons at the root level may increase your initial bundle size, while providing them at feature module level enables better code splitting.
:::

::: warning
While you may provide your icons at any level of the dependency injection tree, be aware that [Angular's DI system is hierarchical](https://angular.dev/guide/di/defining-dependency-providers#injector-hierarchy-in-angular): `YCloudIcon` will only have access to the icons provided closest to it in the tree.
:::

## Accessible labels

You can use the `title` input property to set the [accessible name element](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/title) on the SVG:

```html
<svg
  ycloudIcon="house"
  title="Go to dashboard"
></svg>
```

This will result in the following output:

```html{2}
<svg class="ycloud ycloud-house" ...>
  <title>Go to dashboard</title>
  <!-- SVG paths -->
</svg>
```

## Props

You can pass additional props to adjust the icon appearance.

| name                  | type      | default      |
| --------------------- | --------- | ------------ |
| `size`                | _number_  | 24           |
| `color`               | _string_  | currentColor |
| `strokeWidth`         | _number_  | 2            |
| `absoluteStrokeWidth` | _boolean_ | false        |

```html
<svg
  ycloudHouse
  size="48"
  color="red"
  strokeWidth="1"
></svg>
```

## Global configuration

You can use `provideYCloudConfig` to configure the default property values as defined above:

```ts{2,7-9}
import { ApplicationConfig } from '@angular/core';
import { provideYCloudConfig } from '@ycloud-web/icons-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    provideYCloudConfig({
      strokeWidth: 1.5
    }),
  ]
};
```

## Styling via CSS

Icons can also be styled by using custom CSS classes:

```html
<svg
  ycloudHousePlus
  class="my-icon"
></svg>
```

```css
svg.my-icon {
  width: 12px;
  height: 12px;
  stroke-width: 3;
}
```

## With YCloud lab or custom icons

[YCloud lab](https://github.com/TianJianJun0727/ycloud-icons-lab) is a collection of icons that are not part of the YCloud Icons main library.

While they aren't provided as standalone components, they can be still be passed to the `YCloudIcon` component the same way as official icons:

```html
<!-- Directly as YCloudIconData: -->
<svg [ycloudIcon]="CoconutIcon"></svg>

<!-- As a provided icon by name: -->
<svg ycloudIcon="coconut"></svg>
```

```ts{2,6-7,11-12}
import { provideYCloudIcons } from '@ycloud-web/icons-angular';
import { coconut } from '@ycloud-web/icons-lab';

@Component({
  templateUrl: './foobar.html',
  // For using by name via provider:
  providers: [provideYCloudIcons({ coconut })],
  imports: [YCloudIcon]
})
export class Foobar {
  // For passing directly as YCloudIconData:
  readonly CoconutIcon = coconut;
}
```

## Troubleshooting

### The icon is not being displayed

If using per-icon-components:

1. Ensure that the icon component is being imported, if using per-icon-components
2. Check that the icon name matches exactly (case-sensitive)

If using the dynamic component:

1. Ensure the icon is provided via `provideYCloudIcons()` if using string names
2. Verify the icon is imported from `@ycloud-web/icons-angular`.

### TypeScript errors?

Make sure you're importing from `@ycloud-web/icons-angular`.

### Icons render with wrong defaults

Ensure `provideYCloudConfig()` is used at the right level.
