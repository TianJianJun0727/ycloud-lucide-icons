# YCloud Icons

YCloud Icons 是 YCloud 的多框架 SVG 图标组件库，面向产品前端、后台系统和设计工程化场景。

它提供一致的图标源数据、可 tree-shaking 的组件包、静态资源包和图标数据包。业务项目只需要安装对应框架包，即可按需引入图标组件，并获得 TypeScript 自动补全、重构和类型检查体验。

## 包

| 目标            | 包名                             | 源码目录                       |
| --------------- | -------------------------------- | ------------------------------ |
| Core JavaScript | `@ycloud-web/icons`              | `packages/icons`               |
| React           | `@ycloud-web/icons-react`        | `packages/icons-react`         |
| Vue             | `@ycloud-web/icons-vue`          | `packages/icons-vue`           |
| Svelte          | `@ycloud-web/icons-svelte`       | `packages/icons-svelte`        |
| Solid           | `@ycloud-web/icons-solid`        | `packages/icons-solid`         |
| Preact          | `@ycloud-web/icons-preact`       | `packages/icons-preact`        |
| React Native    | `@ycloud-web/icons-react-native` | `packages/icons-react-native`  |
| Angular         | `@ycloud-web/icons-angular`      | `packages/icons-angular`       |
| Astro           | `@ycloud-web/icons-astro`        | `packages/icons-astro`         |
| 静态资源        | `@ycloud-web/icons-static`       | `packages/icons-static`        |
| 图标数据        | `@ycloud-web/icons-data`         | `packages/icons-data`          |

## 使用示例

React：

```tsx
import { Camera } from '@ycloud-web/icons-react';

export function Example() {
  return (
    <Camera
      size={24}
      color="currentColor"
    />
  );
}
```

Vue：

```vue
<script setup lang="ts">
import { Camera } from '@ycloud-web/icons-vue';
</script>

<template>
  <Camera
    :size="24"
    color="currentColor"
  />
</template>
```

Core JavaScript：

```ts
import { createIcons, Camera } from '@ycloud-web/icons';

createIcons({
  icons: {
    Camera,
  },
});
```

## 设计目标

- **组件化体验**：在 React、Vue 等框架中以真实组件方式使用图标。
- **按需打包**：业务只会打包实际导入的图标，避免引入未使用资源。
- **强类型提示**：组件名、属性和图标数据都提供类型声明，便于补全、检查和重构。
- **一源多端**：同一份图标源生成多框架包、静态资源和图标数据。
- **可持续维护**：生成链路基于稳定的 SVG 数据、构建脚本和包发布流程。

## 风格策略

YCloud Icons 会保持稳定的公开组件名，例如 `Camera`。后续如果引入 outline、filled 等多风格形态，优先通过包入口或目录区分，而不是给组件名追加风格后缀：

```tsx
import { Camera } from '@ycloud-web/icons-react/outline';
import { Camera as FilledCamera } from '@ycloud-web/icons-react/filled';
```

这样可以让组件命名、图标搜索和重构体验保持一致。

## 开发

```sh
pnpm install
pnpm icons-react build
pnpm icons-vue build
pnpm docs:dev
```

文档站支持一键开关 OG 图生成：

```sh
# 默认开发模式：关闭 OG 图生成，加快启动和重建
pnpm docs:dev

# 显式开启 OG 图生成
pnpm docs:dev:og

# 构建文档但跳过逐页 OG 图
pnpm docs:build:no-og
```

## 许可证

YCloud Icons 使用 ISC 许可证发布。第三方来源与上游授权信息见 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)，完整许可证文本见 [LICENSE](./LICENSE)。
