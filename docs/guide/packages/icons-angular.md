# `@ycloud-web/icons-angular`

面向 Angular 的 YCloud Icons 实现，基于 standalone components、signals 和 zoneless 设计。

**你可以用它完成：**

- 将图标作为 standalone Angular 组件使用，并完整支持依赖注入。
- 通过现代 Angular providers 进行全局图标配置。
- 与 Angular 的响应式表单和数据绑定集成。
- 构建支持 tree-shaking 和懒加载的可扩展应用。

## 版本要求

Angular `>=17.0.0`。文档示例使用当前最新稳定版本，并使用 standalone components、signals 和 zoneless change detection。

## 安装

::: code-group

```sh [pnpm]
pnpm add @ycloud-web/icons-angular@latest
```

```sh [yarn]
yarn add @ycloud-web/icons-angular@latest
```

```sh [npm]
npm install @ycloud-web/icons-angular@latest
```

```sh [bun]
bun add @ycloud-web/icons-angular@latest
```

:::

## 使用方式

### 独立图标

每个图标都可以作为可直接使用的 standalone component 导入：

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
独立图标组件使用 `svg[ycloud{PascalCaseIconName}]` 作为 selector。

这样可以尽量减少 DOM 体积，同时让你能够直接操作最终 SVG 元素上的所有属性。
:::

### 动态图标组件

也可以使用动态 `YCloudIcon` 组件来动态渲染图标。

#### 使用支持 tree-shaking 的导入

可以把导入的图标直接传给组件：

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

#### 通过依赖注入提供图标

另外，这个组件也支持字符串输入。

如果要用这种方式渲染图标，需要先通过 `provideYCloudIcons` 提供图标：

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
为了获得更理想的包体积，请在应用中合适的最高层级提供图标。

如果在根层级提供所有图标，可能会增加初始包体积；按功能模块层级提供图标，则更利于代码分割。
:::

::: warning
虽然你可以在依赖注入树的任意层级提供图标，但需要注意 [Angular 的 DI 系统是分层的](https://angular.dev/guide/di/defining-dependency-providers#injector-hierarchy-in-angular)：`YCloudIcon` 只能访问距离它最近的那一层所提供的图标。
:::

## 无障碍标签

可以使用 `title` input 属性在 SVG 上设置[无障碍名称元素](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/title)：

```html
<svg
  ycloudIcon="house"
  title="Go to dashboard"
></svg>
```

输出结果如下：

```html{2}
<svg class="ycloud ycloud-house" ...>
  <title>Go to dashboard</title>
  <!-- SVG paths -->
</svg>
```

## 属性

可以传入额外 props 调整图标外观。

| 名称                  | 类型      | 默认值       |
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

## 全局配置

可以使用 `provideYCloudConfig` 配置上面定义的默认属性值：

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

## 通过 CSS 设置样式

也可以使用自定义 CSS class 设置图标样式：

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

## 故障排查

### 图标未显示

如果使用单图标组件：

1. 确保已经导入对应的图标组件。
2. 检查图标名称是否完全匹配（区分大小写）。

如果使用动态组件：

1. 如果使用字符串名称，请确保图标已经通过 `provideYCloudIcons()` 提供。
2. 确认图标是从 `@ycloud-web/icons-angular` 导入的。

### TypeScript 报错？

请确保从 `@ycloud-web/icons-angular` 导入。

### 图标使用了错误的默认值

请确保在正确层级使用了 `provideYCloudConfig()`。
