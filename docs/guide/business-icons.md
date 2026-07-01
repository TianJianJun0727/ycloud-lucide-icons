---
title: 业务图标
description: 业务专有 SVG 图标的存放、校验和提交规则。
---

# 业务图标

`business-icons/` 用于存放不适合进入通用图标库的业务专有 SVG。

通用图标位于 `icons/`，要求保持 24x24、线性风格、`currentColor`、`stroke-width="2"` 和统一元数据。业务图标按颜色模式拆分为单色、双色和多色，使用独立清洗与校验规则，不需要进入通用分类和元数据体系。

## 适用场景

把 SVG 放到 `business-icons/` 的常见情况：

- 图形包含产品、渠道、状态或业务对象的专有视觉信息
- 只作为业务源码资产维护，不需要进入通用图标包和分类页
- 需要保留业务资产自身的尺寸、描边、端点、拐角或几何细节

如果图标可以抽象成通用线性图标，应继续放到 `icons/`。

## 目录规则

```text
business-icons/<color-mode>/<icon-name>.svg
business-icons/<color-mode>/index.json
business-icons/index.json
```

业务图标的一级目录是颜色模式，不再表达业务分类。目录的中文名、英文名维护在 `business-icons/<color-mode>/index.json`。根 `business-icons/index.json` 是生成产物，用于给校验、Figma 插件、文档站和包生成流程消费。

当前允许目录：

```text
mono
duotone
multicolor
```

业务图标不需要每个 SVG 配一份同名 JSON 元数据，也不会进入通用图标分类元数据。`business-icons/<color-mode>/index.json` 只维护颜色模式显示配置；根 `business-icons/index.json` 由脚本生成颜色模式、多语言显示名和图标索引，用于校验、Figma 插件下拉选择、文档展示和重复检测。

它会生成到现有包的 `business` 子入口，不混入通用图标默认入口。包内组件导出名仍按文件名生成，不拼接颜色模式名，因此不同颜色模式目录下也不能出现同名 SVG。

## 清洗和校验规则

业务图标会执行独立的业务 SVG 清洗。它不复用通用图标的 24x24 线性图标归一规则，也不会改写尺寸、描边细节或几何结构。

业务清洗会：

- 移除 `<script>`、`<foreignObject>`、事件属性和 `javascript:` URL
- 移除 `style`、`class`、未被引用的 `id`、`data-*` 这类设计工具噪声
- `mono`：将写死的 `fill`、`stroke` 转为 `currentColor` 或保留 `none`
- `duotone`：将白色填充/描边转为 `var(--business-icon-secondary-color)`，其他颜色转为 `var(--business-icon-primary-color)`，不按路径顺序判断
- `multicolor`：不清洗固定颜色，保留源 SVG 的多色视觉
- 保留原始 `width`、`height`、`viewBox`、`stroke-width`、`stroke-linecap`、`stroke-linejoin` 和几何结构

提交时只做基础安全和结构校验：

- 文件路径必须是 `business-icons/<color-mode>/<icon-name>.svg`
- 颜色模式目录必须有 `business-icons/<color-mode>/index.json`
- 根 `business-icons/index.json` 必须由 `node ./scripts/writeBusinessIconIndex.mts` 生成并保持同步
- 文件名必须是小写 kebab-case
- 根节点必须是 `<svg>`
- `mono` 的 `fill`、`stroke` 只能是 `currentColor` 或 `none`
- `duotone` 的 `fill`、`stroke` 只能是 `var(--business-icon-primary-color)`、`var(--business-icon-secondary-color)` 或 `none`
- `multicolor` 允许固定颜色，但仍执行安全检查
- 禁止 `style`、`class`、`data-*` 这类样式和设计工具属性
- 禁止 `<script>` 和 `<foreignObject>`
- 禁止 `onclick` 等事件属性
- 禁止 `javascript:` URL

本地可以运行：

```sh
node ./scripts/optimizeBusinessSvgs.mts
node ./scripts/writeBusinessIconIndex.mts
node ./scripts/checkBusinessSvgSource.mts
```

## Figma 插件提交

在 Figma 插件中选择“业务图标”后，插件会：

- 通过单选控件选择单色、双色或多色
- 提交到 `business-icons/<color-mode>/*.svg`
- 按业务 SVG 规则清洗后提交
- 不生成 `icons/*.json`
- 不要求通用图标的多选分类、标签或使用场景
- 只按业务 SVG 基础规则拦截明显不安全或不可缩放的 SVG

选择“通用图标”时，插件仍沿用 `icons/*.svg` + `icons/*.json` 的通用图标流程。

## 在项目中使用

多个项目共用业务图标时，继续安装现有包，通过 `business` 子入口引入。

### Core 包

需要结构化 SVG 定义或统一图标索引时安装：

```sh
pnpm add @ycloud-web/icons
```

```ts
import {
  businessIcons,
  getBusinessIcon,
} from '@ycloud-web/icons/business';

const icon = getBusinessIcon('billing');
const rootAttrs = icon.attrs;
const children = icon.node;
const sameIcon = businessIcons['billing'];
```

### React 包

React 项目可直接使用现有 React 包的业务入口：

```sh
pnpm add @ycloud-web/icons-react
```

```tsx
import { Billing } from '@ycloud-web/icons-react/business';

export function ChannelIcon() {
  return (
    <Billing
      size={24}
      color="#111827"
    />
  );
}
```

React 业务图标组件底层渲染为内联 `<svg>`。`mono` 和 `duotone` 支持 `size`、`color`；`duotone` 额外支持 `secondaryColor`，默认值为 `#fff`。`multicolor` 保留固定色，不暴露 `color`，仅支持调整尺寸。

```tsx
import { Shopify } from '@ycloud-web/icons-react/business';

export function DuotoneIcon() {
  return (
    <Shopify
      size={24}
      color="#111827"
      secondaryColor="#fff"
    />
  );
}
```

其他框架包同样使用现有包的 `business` 子入口：

```ts
import { Billing } from '@ycloud-web/icons-preact/business';
import { Billing } from '@ycloud-web/icons-vue/business';
import { Billing } from '@ycloud-web/icons-solid/business';
import { Billing } from '@ycloud-web/icons-svelte/business';
import { Billing } from '@ycloud-web/icons-astro/business';
import { Billing } from '@ycloud-web/icons-react-native/business';
```

Angular 包导出业务图标定义，可按 `attrs + node` 渲染为内联 SVG 或自行序列化：

```ts
import { getBusinessIcon } from '@ycloud-web/icons-angular';

const billing = getBusinessIcon('billing');
```

### Static 包

需要原始 SVG 文件 URL 时安装：

```sh
pnpm add @ycloud-web/icons-static
```

```ts
import billingIconUrl from '@ycloud-web/icons-static/business-icons/mono/billing.svg';
```

业务图标也会生成独立 Icon Font，不和通用 `font/ycloud.css` 混在一起：

```css
@import '@ycloud-web/icons-static/business-font/ycloud-business.css';
```

```html
<div class="business-icon-billing"></div>
```

静态 SVG 与数据包会保留清洗后的颜色 token。使用 `duotone` 源时，打包到组件阶段会把 primary/secondary token 转为对应框架的可传入颜色参数；多色图标始终保留源 SVG 固定色。
