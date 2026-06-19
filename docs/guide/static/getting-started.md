<script setup>
import OverviewLink from '../../.vitepress/theme/components/base/OverviewLink.vue'
import OverviewLinkGrid from '../../.vitepress/theme/components/base/OverviewLinkGrid.vue'
</script>

# 快速开始

本指南会帮助你在项目中开始使用 YCloud Icons 静态资源。
请先确保你已经准备好项目环境。如果还没有，可以使用 Vite、Parcel 或其他你熟悉的脚手架创建一个新项目。

## For what use cases is `@ycloud-web/icons-static` suitable?

`@ycloud-web/icons-static` is suitable for _very specific use cases_ where you want to use YCloud icons without relying on a JavaScript framework or component system. It's ideal for:

- Projects that use icon fonts with plain CSS or utility-first frameworks
- Embedding raw SVG files or sprites directly in HTML
- Using SVGs as CSS background images
- Importing SVG strings into Node.js environments

::: danger Not recommended for production high performance needs {#production-warning}
SVG sprites and icon fonts include **all icons**, which can significantly increase your app's bundle size and load time.

For production environments, we recommend using a bundler with tree-shaking support to include only the icons you actually use. Consider using one of the framework-specific [packages](../../packages.md).
:::

## 安装

### 包管理器

::: code-group

```sh [pnpm]
pnpm add @ycloud-web/icons-static
```

```sh [yarn]
yarn add @ycloud-web/icons-static
```

```sh [npm]
npm install @ycloud-web/icons-static
```

```sh [bun]
bun add @ycloud-web/icons-static
```

:::
