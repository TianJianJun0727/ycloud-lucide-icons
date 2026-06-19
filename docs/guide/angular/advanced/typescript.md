---
title: TypeScript - Angular
description: 了解 `@ycloud-web/icons-angular` 包导出的全部类型，以及如何在 Angular 项目中使用它们。
---

# TypeScript 支持

下面是 `@ycloud-web/icons-angular` 包导出的类型。
在 TypeScript Angular 项目中使用 YCloud Icons 时，可以用这些类型为组件补充类型约束。

## 类型

### `YCloudIcon`

表示一个自包含的 YCloud Icons 组件类型，并带有静态 `icon` 属性。声明包含图标属性的 schema 时可以使用这个类型。

```ts
export interface YCloudIcon extends Type<YCloudIconProps> {
  icon: YCloudIconData;
}
```

### `YCloudIconData`

完整描述待显示图标的 YCloud Icons 数据对象。

```ts
export type YCloudIconData = {
  name: string;
  node: YCloudIconNode[];
  aliases?: string[];
};
```

## 类型守卫

### `isYCloudIconData`

```ts
export function isYCloudIconData(icon: unknown): icon is YCloudIconData {
  return true | false;
}
```

### `isYCloudIconComponent`

```ts
export function isYCloudIconComponent(icon: unknown): icon is YCloudIcon {
  return true | false;
}
```
