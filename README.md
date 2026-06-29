# YCloud Icons

语言：中文 | [English](./README.en.md)

YCloud Icons 是 YCloud 的多框架 SVG 图标组件库，面向产品前端、后台系统和设计工程化场景。

本项目基于 [Lucide](https://github.com/lucide-icons/lucide) 二次开发，保留上游 ISC 许可证与必要的第三方授权说明，并在此基础上调整了 YCloud 品牌、中文文档、包命名、多框架发布和图标维护流程。

它提供一致的图标源数据、可 tree-shaking 的组件包、静态资源包和图标数据包。业务项目只需要安装对应框架包，即可按需引入图标组件，并获得 TypeScript 自动补全、重构和类型检查体验。

仓库同时维护两类图标资产：

- **通用图标**：位于 `icons/`，使用 24x24 线性 SVG、`icons/*.json` 元数据和通用分类体系。
- **业务图标**：位于 `business-icons/`，按一级目录区分业务分类，保留业务图形自身几何结构，通过各包的 `business` 子入口和静态包的 `business-icons/`、`business-font/` 输出。

## 包

| 目标            | 包名                             | 源码目录                      |
| --------------- | -------------------------------- | ----------------------------- |
| Core JavaScript | `@ycloud-web/icons`              | `packages/icons`              |
| React           | `@ycloud-web/icons-react`        | `packages/icons-react`        |
| Vue             | `@ycloud-web/icons-vue`          | `packages/icons-vue`          |
| Svelte          | `@ycloud-web/icons-svelte`       | `packages/icons-svelte`       |
| Solid           | `@ycloud-web/icons-solid`        | `packages/icons-solid`        |
| Preact          | `@ycloud-web/icons-preact`       | `packages/icons-preact`       |
| React Native    | `@ycloud-web/icons-react-native` | `packages/icons-react-native` |
| Angular         | `@ycloud-web/icons-angular`      | `packages/icons-angular`      |
| Astro           | `@ycloud-web/icons-astro`        | `packages/icons-astro`        |
| 静态资源        | `@ycloud-web/icons-static`       | `packages/icons-static`       |
| 图标数据        | `@ycloud-web/icons-data`         | `packages/icons-data`         |

`@ycloud-web/icons-data` 同时提供通用图标节点数据和业务图标 SVG / data URI 数据。

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

业务图标 React：

```tsx
import { Billing } from '@ycloud-web/icons-react/business';

export function BusinessExample() {
  return <Billing size={24} />;
}
```

业务图标静态字体：

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/@ycloud-web/icons-static@latest/business-font/ycloud-business.css"
/>

<div class="business-icon-billing"></div>
```

## 设计目标

- **组件化体验**：在 React、Vue 等框架中以真实组件方式使用图标。
- **按需打包**：业务只会打包实际导入的图标，避免引入未使用资源。
- **强类型提示**：组件名、属性和图标数据都提供类型声明，便于补全、检查和重构。
- **一源多端**：通用图标和业务图标分别从源码目录生成多框架包、静态资源和图标数据。
- **可持续维护**：生成链路基于稳定的 SVG 数据、构建脚本和包发布流程。

## 风格策略

YCloud Icons 会保持稳定的公开组件名，例如 `Camera`。当前版本先提供单一线性图标集；后续如果引入 outline、filled 等多风格形态，会优先通过明确的包入口或目录区分，而不是给组件名追加风格后缀。这样可以让组件命名、图标搜索和重构体验保持一致。

## 开发

```sh
pnpm install
pnpm icons-react build
pnpm icons-vue build
pnpm docs:dev
```

常规文档命令与 Lucide 上游保持一致；GitHub Pages 使用单独的优化命令：

```sh
# 启动文档开发服务
pnpm docs:dev

# 构建文档但跳过逐页 OG 图
pnpm docs:build:no-og

# GitHub Pages 专用构建：固定 base，关闭 OG 和 llms，跳过 API 构建
pnpm docs:build:github-pages

# 构建文档并额外生成 llms.txt
pnpm docs:build:llms
```

## 许可证

YCloud Icons 使用 ISC 许可证发布。第三方来源与上游授权信息见 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)，完整许可证文本见 [LICENSE](./LICENSE)。
