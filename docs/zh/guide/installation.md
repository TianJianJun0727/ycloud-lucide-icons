---
title: 安装
description: 安装 YCloud Icons 的 10 类官方包。
---

# 安装

YCloud Icons 当前按 10 类包维护。根据项目技术栈选择对应包即可。

| 类型 | 包名 | 文档 |
| --- | --- | --- |
| Core JavaScript | `@ycloud-web/icons` | [Core JS](/guide/ycloud/) |
| React | `@ycloud-web/icons-react` | [React](/guide/react/) |
| Vue | `@ycloud-web/icons-vue` | [Vue](/guide/vue/) |
| Svelte | `@ycloud-web/icons-svelte` | [Svelte](/guide/svelte/) |
| Solid | `@ycloud-web/icons-solid` | [Solid](/guide/solid/) |
| Preact | `@ycloud-web/icons-preact` | [Preact](/guide/preact/) |
| React Native | `@ycloud-web/icons-react-native` | [React Native](/guide/react-native/) |
| Angular | `@ycloud-web/icons-angular` | [Angular](/guide/angular/) |
| Astro | `@ycloud-web/icons-astro` | [Astro](/guide/astro/) |
| Static assets | `@ycloud-web/icons-static` | [Static](/guide/static/) |

::: code-group

```sh [pnpm]
pnpm add @ycloud-web/icons-react
```

```sh [npm]
npm install @ycloud-web/icons-react
```

```sh [yarn]
yarn add @ycloud-web/icons-react
```

```sh [bun]
bun add @ycloud-web/icons-react
```

:::

React 示例：

```tsx
import { Camera } from '@ycloud-web/icons-react';

export function App() {
  return <Camera size={24} />;
}
```

Vue 示例：

```vue
<script setup lang="ts">
import { Camera } from '@ycloud-web/icons-vue';
</script>

<template>
  <Camera :size="24" />
</template>
```
