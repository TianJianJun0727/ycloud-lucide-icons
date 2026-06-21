<script setup>
import OverviewLink from '../../.vitepress/theme/components/base/OverviewLink.vue'
import OverviewLinkGrid from '../../.vitepress/theme/components/base/OverviewLinkGrid.vue'
</script>

# 快速开始

本指南会帮助你在项目中开始使用 YCloud Icons 静态资源。
请先确保你已经准备好项目环境。如果还没有，可以使用 Vite、Parcel 或其他你熟悉的脚手架创建一个新项目。

## `@ycloud-web/icons-static` 适合哪些场景？

`@ycloud-web/icons-static` 适合一些*非常具体的场景*：你希望使用 YCloud Icons，但不想依赖 JavaScript 框架或组件系统。它适合：

- 使用纯 CSS 或 utility-first 框架消费 Icon font 的项目。
- 直接在 HTML 中嵌入原始 SVG 文件或 sprites。
- 将 SVG 作为 CSS 背景图使用。
- 在 Node.js 环境中导入 SVG 字符串。

::: danger 不建议用于高性能生产环境 {#production-warning}
SVG sprites 和 Icon font 会包含**全部图标**，可能显著增加应用包体积和加载时间。

生产环境中，建议使用支持 tree-shaking 的构建工具，只包含你实际使用的图标。也可以考虑使用对应框架的[专用包](../../packages.md)。
:::

## 版本要求

`@ycloud-web/icons-static` 无框架 peer dependency。

## 安装

### 包管理器

::: code-group

```sh [pnpm]
pnpm add @ycloud-web/icons-static@latest
```

```sh [yarn]
yarn add @ycloud-web/icons-static@latest
```

```sh [npm]
npm install @ycloud-web/icons-static@latest
```

```sh [bun]
bun add @ycloud-web/icons-static@latest
```

:::
