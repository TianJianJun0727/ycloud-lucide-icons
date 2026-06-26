---
title: 业务图标
description: 业务专有 SVG 图标的存放、校验和提交规则。
---

# 业务图标

`business-icons/` 用于存放不适合进入通用图标库的业务专有 SVG。

通用图标位于 `icons/`，要求保持 24x24、线性风格、`currentColor`、`stroke-width="2"` 和统一元数据。业务图标只做轻量清洗：清除固定颜色、样式和设计工具冗余属性，不归一尺寸、描边细节或几何结构，也不需要进入通用分类和元数据体系。

## 适用场景

把 SVG 放到 `business-icons/` 的常见情况：

- 图形包含产品、渠道、状态或业务对象的专有视觉信息
- 只作为业务源码资产维护，不需要进入通用图标包和分类页
- 需要保留业务资产自身的尺寸、描边、端点、拐角或几何细节

如果图标可以抽象成通用线性图标，应继续放到 `icons/`。

## 目录规则

```text
business-icons/<business-category>/<icon-name>.svg
```

业务分类直接由一级目录决定，目前允许：

```text
inbox
menu
chatbot
outlined
filled
basic
filter
```

业务图标目前不需要同名 JSON 元数据，也不会进入通用图标搜索或分类页。它会生成到现有包的 `business` 子入口，不混入通用图标默认入口。包内组件导出名仍按文件名生成，不拼接分类名，因此不同分类下也不能出现同名 SVG。

## 清洗和校验规则

业务图标会执行独立的业务 SVG 清洗。它不复用通用图标的 24x24 线性图标归一规则，只做轻量清理。

业务清洗会：

- 移除 `<script>`、`<foreignObject>`、事件属性和 `javascript:` URL
- 移除 `style`、`class`、未被引用的 `id`、`data-*` 这类设计工具噪声
- 将写死的 `fill`、`stroke` 转为 `currentColor` 或保留 `none`
- 保留原始 `width`、`height`、`viewBox`、`stroke-width`、`stroke-linecap`、`stroke-linejoin` 和几何结构

提交时只做基础安全和结构校验：

- 文件路径必须是 `business-icons/<business-category>/<icon-name>.svg`
- 业务分类目录必须是允许列表中的一级目录
- 文件名必须是小写 kebab-case
- 根节点必须是 `<svg>`
- `fill`、`stroke` 只能是 `currentColor` 或 `none`
- 禁止 `style`、`class`、`data-*` 这类样式和设计工具属性
- 禁止 `<script>` 和 `<foreignObject>`
- 禁止 `onclick` 等事件属性
- 禁止 `javascript:` URL

本地可以运行：

```sh
node ./scripts/optimizeBusinessSvgs.mts
node ./scripts/checkBusinessSvgSource.mts
```

## Figma 插件提交

在 Figma 插件中选择“业务图标”后，插件会：

- 通过单选下拉选择业务分类
- 提交到 `business-icons/<business-category>/*.svg`
- 按业务 SVG 规则清洗后提交
- 不生成 `icons/*.json`
- 不要求通用图标的多选分类、标签或使用场景
- 只按业务 SVG 基础规则拦截明显不安全或不可缩放的 SVG

选择“通用图标”时，插件仍沿用 `icons/*.svg` + `icons/*.json` 的通用图标流程。

## 在项目中使用

多个项目共用业务图标时，继续安装现有包，通过 `business` 子入口引入。

### Core 包

需要 SVG 字符串、data URI 或统一图标定义时安装：

```sh
pnpm add @ycloud-web/icons
```

```ts
import {
  businessIcons,
  whatsappBusinessDataUri,
  whatsappBusinessSvg,
} from '@ycloud-web/icons/business';

const svg = whatsappBusinessSvg;
const imageSrc = whatsappBusinessDataUri;
const icon = businessIcons['whatsapp-business'];
```

### React 包

React 项目可直接使用现有 React 包的业务入口：

```sh
pnpm add @ycloud-web/icons-react
```

```tsx
import { WhatsappBusiness } from '@ycloud-web/icons-react/business';

export function ChannelIcon() {
  return <WhatsappBusiness size={24} />;
}
```

React 组件底层渲染为 `<img>`，默认使用清洗后的业务 SVG data URI。

其他框架包同样使用现有包的 `business` 子入口：

```ts
import { WhatsappBusiness } from '@ycloud-web/icons-preact/business';
import { WhatsappBusiness } from '@ycloud-web/icons-vue/business';
import { WhatsappBusiness } from '@ycloud-web/icons-solid/business';
import { WhatsappBusiness } from '@ycloud-web/icons-svelte/business';
import { WhatsappBusiness } from '@ycloud-web/icons-astro/business';
import { WhatsappBusiness } from '@ycloud-web/icons-react-native/business';
```

Angular 包导出业务图标定义，可直接用 data URI 绑定图片：

```ts
import { whatsappBusinessDataUri } from '@ycloud-web/icons-angular';
```

### Static 包

需要原始 SVG 文件 URL 时安装：

```sh
pnpm add @ycloud-web/icons-static
```

```ts
import whatsappBusinessIconUrl from '@ycloud-web/icons-static/business-icons/inbox/whatsapp-business.svg';
```

业务图标只会清除固定颜色、样式和设计工具冗余属性，不会改写尺寸、描边细节或几何结构。
