---
title: 安装
description: 安装 YCloud Icons 支持的框架包和静态资源包。
---

# 安装

YCloud Icons 当前覆盖 10 种包类型，可以按项目所用框架选择安装。

## 版本要求

各框架包的最低版本要求与 Lucide 官方当前包保持一致。文档中的交互示例会优先使用对应框架的最新稳定主版本。

| 包                               | 最低版本要求           |
| -------------------------------- | ---------------------- | --- | ------- | --- | ------- | --- | ------------------------------------------------------------ | --- | ------- | --- | ------- | --- | -------- |
| `@ycloud-web/icons`              | 无框架 peer dependency |
| `@ycloud-web/icons-react`        | React `^16.5.1         |     | ^17.0.0 |     | ^18.0.0 |     | ^19.0.0`                                                     |
| `@ycloud-web/icons-vue`          | Vue `>=3.0.1`          |
| `@ycloud-web/icons-svelte`       | Svelte `^5`            |
| `@ycloud-web/icons-solid`        | Solid `^1.4.7`         |
| `@ycloud-web/icons-preact`       | Preact `^10.27.2`      |
| `@ycloud-web/icons-react-native` | React `^16.5.1         |     | ^17.0.0 |     | ^18.0.0 |     | ^19.0.0`，React Native 任意版本，`react-native-svg` `^12.0.0 |     | ^13.0.0 |     | ^14.0.0 |     | ^15.0.0` |
| `@ycloud-web/icons-angular`      | Angular `>=17.0.0`     |
| `@ycloud-web/icons-astro`        | Astro `^4              |     | ^5      |     | ^6`     |
| `@ycloud-web/icons-static`       | 无框架 peer dependency |

## 核心 JavaScript

与框架无关的图标数据和辅助方法。

::: code-group

```sh [pnpm]
pnpm add @ycloud-web/icons@latest
```

```sh [npm]
npm install @ycloud-web/icons@latest
```

```sh [yarn]
yarn add @ycloud-web/icons@latest
```

```sh [bun]
bun add @ycloud-web/icons@latest
```

:::

查看 [Core JavaScript 指南](./ycloud/index.md)。

## React

支持命名导入的强类型 React SVG 组件。

::: code-group

```sh [pnpm]
pnpm add @ycloud-web/icons-react@latest
```

```sh [npm]
npm install @ycloud-web/icons-react@latest
```

```sh [yarn]
yarn add @ycloud-web/icons-react@latest
```

```sh [bun]
bun add @ycloud-web/icons-react@latest
```

:::

查看 [React 指南](./react/index.md)。

## Vue

从同一份图标源生成的 Vue 组件。

::: code-group

```sh [pnpm]
pnpm add @ycloud-web/icons-vue@latest
```

```sh [npm]
npm install @ycloud-web/icons-vue@latest
```

```sh [yarn]
yarn add @ycloud-web/icons-vue@latest
```

```sh [bun]
bun add @ycloud-web/icons-vue@latest
```

:::

查看 [Vue 指南](./vue/index.md)。

## Svelte

面向应用项目的 Svelte 组件。

::: code-group

```sh [pnpm]
pnpm add @ycloud-web/icons-svelte@latest
```

```sh [npm]
npm install @ycloud-web/icons-svelte@latest
```

```sh [yarn]
yarn add @ycloud-web/icons-svelte@latest
```

```sh [bun]
bun add @ycloud-web/icons-svelte@latest
```

:::

查看 [Svelte 指南](./svelte/index.md)。

## Solid

从共享图标源生成的 Solid 组件。

::: code-group

```sh [pnpm]
pnpm add @ycloud-web/icons-solid@latest
```

```sh [npm]
npm install @ycloud-web/icons-solid@latest
```

```sh [yarn]
yarn add @ycloud-web/icons-solid@latest
```

```sh [bun]
bun add @ycloud-web/icons-solid@latest
```

:::

查看 [Solid 指南](./solid/index.md)。

## Preact

面向轻量 React 兼容应用的 Preact 组件。

::: code-group

```sh [pnpm]
pnpm add @ycloud-web/icons-preact@latest
```

```sh [npm]
npm install @ycloud-web/icons-preact@latest
```

```sh [yarn]
yarn add @ycloud-web/icons-preact@latest
```

```sh [bun]
bun add @ycloud-web/icons-preact@latest
```

:::

查看 [Preact 指南](./preact/index.md)。

## React Native

面向移动应用的 React Native 组件。

::: code-group

```sh [pnpm]
pnpm add @ycloud-web/icons-react-native@latest
```

```sh [npm]
npm install @ycloud-web/icons-react-native@latest
```

```sh [yarn]
yarn add @ycloud-web/icons-react-native@latest
```

```sh [bun]
bun add @ycloud-web/icons-react-native@latest
```

:::

查看 [React Native 指南](./react-native/index.md)。

## Angular

Angular 组件和 provider API。

::: code-group

```sh [pnpm]
pnpm add @ycloud-web/icons-angular@latest
```

```sh [npm]
npm install @ycloud-web/icons-angular@latest
```

```sh [yarn]
yarn add @ycloud-web/icons-angular@latest
```

```sh [bun]
bun add @ycloud-web/icons-angular@latest
```

:::

查看 [Angular 指南](./angular/index.md)。

## Astro

面向内容站点和应用站点的 Astro 组件。

::: code-group

```sh [pnpm]
pnpm add @ycloud-web/icons-astro@latest
```

```sh [npm]
npm install @ycloud-web/icons-astro@latest
```

```sh [yarn]
yarn add @ycloud-web/icons-astro@latest
```

```sh [bun]
bun add @ycloud-web/icons-astro@latest
```

:::

查看 [Astro 指南](./astro/index.md)。

## 静态资源

静态 SVG 文件、SVG Sprite、Icon Font 和 SVG 字符串模块。

::: code-group

```sh [pnpm]
pnpm add @ycloud-web/icons-static@latest
```

```sh [npm]
npm install @ycloud-web/icons-static@latest
```

```sh [yarn]
yarn add @ycloud-web/icons-static@latest
```

```sh [bun]
bun add @ycloud-web/icons-static@latest
```

:::

查看 [静态资源指南](./static/index.md)。
