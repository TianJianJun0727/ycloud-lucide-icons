---
title: 快速开始 - Angular
description: 本指南会帮助你在 Angular 项目中开始使用 YCloud Icons。
---

<script setup>
import OverviewLink from '../../.vitepress/theme/components/base/OverviewLink.vue'
import OverviewLinkGrid from '../../.vitepress/theme/components/base/OverviewLinkGrid.vue'
import { angularSidebar } from '../../.vitepress/sidebar/angular'
</script>

# 快速开始

本指南会帮助你在 Angular 项目中开始使用 YCloud Icons。
请先确保你已经准备好 Angular 开发环境。如果还没有，可以使用 `@angular/cli` [创建一个新的 Angular 项目](https://angular.dev/installation#create-a-new-project)。

## 版本要求

`@ycloud-web/icons-angular` 的最低版本要求：Angular `>=17.0.0`。

该包使用 standalone components、signals 和 zoneless change detection。
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

## 导入第一个图标

这个库基于 standalone components 构建，因此可以完整支持 tree-shaking。

每个图标都可以作为可直接使用的 standalone component 导入，并渲染为内联 SVG 元素。这样最终产物只会包含你实际导入的图标，其余未使用的图标会被构建工具移除。

### 独立图标

```ts
import { Component } from '@angular/core';
import { YCloudFileText } from '@ycloud-web/icons-angular';

@Component({
  selector: 'app',
  template: '<svg ycloudFileText></svg>',
  imports: [YCloudFileText],
})
export class App {}
```

### 动态图标组件

当你需要动态渲染图标时（例如菜单列表或基于 boolean signal 切换图标），可以使用 `YCloudDynamicIcon` 组件：

```ts
import { Component, computed, signal } from '@angular/core';
import { YCloudDynamicIcon, YCloudCircleCheck, YCloudCircleX } from '@ycloud-web/icons-angular';

@Component({
  selector: 'app',
  template: `<svg [ycloudIcon]="icon()"></svg>`,
  imports: [YCloudDynamicIcon],
})
export class App {
  protected readonly model = signal<boolean>(true);
  protected readonly icon = computed(() => (this.model() ? YCloudCircleCheck : YCloudCircleX));
}
```

## 组件输入

你可以通过以下 inputs 调整图标外观：

| 名称                  | 类型      | 默认值       |
| --------------------- | --------- | ------------ |
| `size`                | _number_  | 24           |
| `color`               | _string_  | currentColor |
| `strokeWidth`         | _number_  | 2            |
| `absoluteStrokeWidth` | _boolean_ | false        |
| `title`               | _string_  | null         |

由于图标最终会渲染为 SVG 元素，所有标准 SVG 属性也可以传入。可参考 [MDN 上的 SVG Presentation Attributes 列表](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation)。

```html
<svg
  ycloudHouse
  [size]="48"
  color="red"
  [strokeWidth]="1"
  title="Home"
></svg>
```

继续阅读下面的内容，了解更多 inputs 用法和示例：

<OverviewLinkGrid>
  <OverviewLink v-for="item in angularSidebar[1].items" :key="item.link" :href="item.link" :title="item.text" :desc="item.desc"/>
</OverviewLinkGrid>
