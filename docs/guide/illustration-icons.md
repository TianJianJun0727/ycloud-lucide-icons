---
title: 插画
description: 插画 SVG 资产的存放、校验和使用规则。
---

# 插画

`illustration-icons/` 用于存放不适合进入通用图标或业务图标体系的插画类 SVG。

插画通常面积更大、细节更多、包含固定颜色，适合空状态、引导页、结果页、异常页等页面级视觉表达。它不参与通用图标的 24x24 线性规范，也不参与业务图标的单色、双色、多色颜色清洗规则。

## 适用场景

把 SVG 放到 `illustration-icons/` 的常见情况：

- 图形是页面级插画，而不是按钮、菜单或列表里的小图标
- 需要保留固定颜色、渐变、透明度或复杂图形层次
- 只需要调整展示宽高，不需要通过 `color` 属性换色
- 不适合放入通用 `icons/` 或业务 `business-icons/`

如果图形需要作为 24px 图标反复用于控件，应优先放到 `icons/` 或 `business-icons/`。

## 目录规则

```text
illustration-icons/<illustration-name>.svg
illustration-icons/index.json
```

插画不需要每个 SVG 配一份同名 JSON 元数据。根 `illustration-icons/index.json` 是生成产物，用于校验、Figma 插件、文档站和包生成流程消费。

文件名必须使用小写 kebab-case，并且会直接决定包内导出名：

```text
illustration-icons/empty-page.svg -> EmptyPage
```

## 清洗和校验规则

插画提交时不做颜色转换，也不做尺寸清洗。源 SVG 的固定颜色、渐变、宽高和 viewBox 会尽量保留。

基础校验会检查：

- 文件路径必须是 `illustration-icons/<illustration-name>.svg`
- 文件名必须是小写 kebab-case
- 根节点必须是 `<svg>`
- 禁止 `<script>` 和 `<foreignObject>`
- 禁止 `onclick` 等事件属性
- 禁止 `javascript:` URL
- 根 `illustration-icons/index.json` 必须由 `node ./scripts/writeIllustrationIndex.mts` 生成并保持同步

本地可以运行：

```sh
node ./scripts/writeIllustrationIndex.mts
node ./scripts/checkIllustrationSvgSource.mts
```

## Figma 插件提交

在 Figma 插件中选择“插画”后，插件会：

- 提交到 `illustration-icons/*.svg`
- 不做颜色转换
- 不做大小清洗
- 不生成 `icons/*.json`
- 不要求通用图标的多选分类、标签或使用场景
- 只按插画 SVG 基础安全规则拦截明显不安全的 SVG

插件提交生成 PR 后，GitHub 工作流会和通用图标、业务图标一样处理插画：

- `fix-icon-source` 会自动刷新并格式化 `illustration-icons/index.json`
- PR lint 会运行 `pnpm lint:svg:illustration`
- 允许同仓库 Figma 插画 PR 进入自动合并流程
- 合并到 `main` 后，如果 PR 来自 Figma 且包含 `illustration-icons/*.svg`，会触发图标 release 流程并发布新的 npm 版本

选择“通用图标”时仍沿用 `icons/*.svg` + `icons/*.json` 流程；选择“业务图标”时仍沿用 `business-icons/<color-mode>/*.svg` 流程。

## 在项目中使用

插画会生成到现有包的 `illustration` 子入口，不混入通用图标默认入口。

### React 包

```sh
pnpm add @ycloud-web/icons-react
```

```tsx
import { EmptyPage } from '@ycloud-web/icons-react/illustration';

export function EmptyState() {
  return (
    <EmptyPage
      width="100%"
      height="auto"
      alt="No data"
    />
  );
}
```

插画组件默认 `width="100%"`、`height="auto"`。它们不支持 `color`，因为插画保留源 SVG 固定颜色。

其他框架包同样使用 `illustration` 子入口：

```ts
import { EmptyPage } from '@ycloud-web/icons-preact/illustration';
import { EmptyPage } from '@ycloud-web/icons-vue/illustration';
import { EmptyPage } from '@ycloud-web/icons-solid/illustration';
import { EmptyPage } from '@ycloud-web/icons-svelte/illustration';
import { EmptyPage } from '@ycloud-web/icons-astro/illustration';
import { EmptyPage } from '@ycloud-web/icons-react-native/illustration';
```

Angular 包导出插画定义，可按 `attrs + node` 渲染为内联 SVG 或自行序列化：

```ts
import { getIllustration } from '@ycloud-web/icons-angular/illustration';

const emptyPage = getIllustration('empty-page');
```

### Static 包

需要原始 SVG 文件 URL 时安装：

```sh
pnpm add @ycloud-web/icons-static
```

```ts
import emptyPageUrl from '@ycloud-web/icons-static/illustration-icons/empty-page.svg';
```

### Data 包

需要结构化 SVG 定义或 data URI 时安装：

```sh
pnpm add @ycloud-web/icons-data
```

```ts
import {
  getIllustration,
  illustrations,
} from '@ycloud-web/icons-data/illustration';

const emptyPage = getIllustration('empty-page');
const sameIllustration = illustrations['empty-page'];
```
