# YCloud Icons Static

无需 JavaScript 框架即可使用的 YCloud Icons 静态资源和工具。这个包提供多种格式，包括通用 SVG 文件、业务 SVG 文件、插画 SVG 文件、SVG sprites、通用 Icon Font、业务 Icon Font，以及用于服务端渲染和静态站点生成的 Node.js 工具。

**你可以用它完成：**

- 将独立 SVG 文件作为图片或 CSS 背景图使用。
- 将插画 SVG 文件作为图片或页面插画使用。
- 为基于 CSS 的图标系统实现通用和业务 Icon Font。
- 创建 SVG sprites，让静态站点能更高效地加载图标。
- 在 Node.js 应用和服务端渲染中导入 SVG 字符串。
- 构建不依赖 JavaScript 框架的静态网站和应用。

这个包包含以下 YCloud Icons 实现形式：

- 独立 SVG 文件
- 插画 SVG 文件
- SVG sprite
- 通用 Icon Font 文件
- 业务 Icon Font 文件
- 导出 SVG 字符串的 JavaScript 库

## 适用场景

`@ycloud-web/icons-static` 适合一些*非常具体的场景*：你希望使用 YCloud Icons，但不想依赖 JavaScript 框架或组件系统。它适合：

- 使用纯 CSS 或 utility-first 框架消费 Icon font 的项目。
- 直接在 HTML 中嵌入原始 SVG 文件或 sprites。
- 直接消费业务 SVG 文件或业务字体 class 的项目。
- 直接消费插画 SVG 文件的空状态、结果页或说明页。
- 将 SVG 作为 CSS 背景图使用。
- 在 Node.js（CommonJS）环境中导入 SVG 字符串。

::: danger

### 不推荐用于生产环境 {#production-warning}

SVG sprites 和 Icon font 会包含**全部图标**，可能显著增加应用包体积和加载时间。

生产环境中，建议使用支持 tree-shaking 的构建工具，只包含你实际使用的图标。也可以考虑使用对应框架的[专用包](../../packages.md)。
:::

## 安装

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

## 版本要求

`@ycloud-web/icons-static` 无框架 peer dependency。

## SVG 文件

可以通过多种方式使用独立 SVG 文件或 SVG sprite。

可以查看这个 [CodeSandbox 示例](https://codesandbox.io/s/using-the-svg-sprite-lz1kk)。

### SVG 文件作为图片

#### 在 HTML 中使用:

::: code-group

```html [Webpack]
<!-- 单个图标的 SVG 文件 -->
<img src="~@ycloud-web/icons-static/icons/house.svg" />
```

```html [CDN]
<!-- 单个图标的 SVG 文件 -->
<img src="https://unpkg.com/@ycloud-web/icons-static@latest/icons/house.svg" />
```

:::

插画 SVG 使用 `illustration-icons/` 路径：

```html
<img src="~@ycloud-web/icons-static/illustration-icons/empty-page.svg" />
```

#### 在 CSS 中使用:

::: code-group

```css [Webpack]
.house-icon {
  background-image: url(~@ycloud-web/icons-static/icons/house.svg);
}
```

```css [CDN]
.house-icon {
  background-image: url(https://unpkg.com/@ycloud-web/icons-static@latest/icons/house.svg);
}
```

:::

请确保已配置正确的 Webpack loader，例如 [`url-loader`](https://v4.webpack.js.org/loaders/url-loader/)。

### SVG 文件作为字符串

如需把 SVG 作为字符串导入（例如用于模板渲染）：

::: code-group

```js [Webpack]
import arrowRightIcon from '@ycloud-web/icons-static/icons/arrow-right';
```

```js [Vite]
import arrowRightIcon from '@ycloud-web/icons-static/icons/arrow-right.svg?raw';
```

:::

你需要类似 [`svg-inline-loader`](https://v4.webpack.js.org/loaders/svg-inline-loader/) 的 SVG loader。

### 使用 SVG sprite

:::danger
[不适合生产环境使用。](#production-warning)
:::

可能还需要额外的 SVG loader 来处理它。

#### 基础 sprite 用法（未针对生产环境优化）：

```html
<svg
  width="24"
  height="24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <use href="@ycloud-web/icons-static/sprite.svg#house" />
</svg>
```

#### 内联用法:

```html
<svg
  width="24"
  height="24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <use href="#alert-triangle" />
</svg>

<!-- sprite SVG -->
<svg>...</svg>
```

#### 使用 CSS 辅助 class 内联

如果更偏好统一管理，也可以用 CSS 保存基础 SVG 属性：

```css
.ycloud-icon {
  width: 24px;
  height: 24px;
  stroke: currentColor;
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
```

然后按如下方式更新 SVG：

```xml
<svg
  xmlns="http://www.w3.org/2000/svg"
  class="ycloud-icon"
>
  <use href="#triangle-alert" />
</svg>

<!-- sprite SVG -->
<svg>...</svg>
```

## Icon Font

:::danger
[不适合生产环境使用。](#production-warning)
:::

YCloud Icons 也提供 web font。使用前需要先引入对应样式表：

::: code-group

```css [Vite]
@import '@ycloud-web/icons-static/font/ycloud.css';
```

```css [Webpack]
@import ('~@ycloud-web/icons-static/font/ycloud.css');
```

```html [CDN]
<link
  rel="stylesheet"
  href="https://unpkg.com/@ycloud-web/icons-static@latest/font/ycloud.css"
/>
```

```html [Static asset]
<link
  rel="stylesheet"
  href="/your/path/to/ycloud.css"
/>
```

:::

引入后，使用 `icon-{kebab-case-name}` 格式。可以从 [YCloud Icons 页面](https://tianjianjun0727.github.io/ycloud-icons/icons)复制图标名称。

```html
<div class="icon-house"></div>
```

如果没有使用包管理器，可以直接从 [latest release](https://github.com/TianJianJun0727/ycloud-icons/releases/latest) 下载字体文件。

## Node.js

也可以在 Node.js 项目中导入 YCloud Icons：

::: code-group

```js [ESM]
import { MessageSquare } from '@ycloud-web/icons-static';
```

```js [CommonJs]
const { MessageSquare } = require('@ycloud-web/icons-static');
```

:::

> 注意：每个图标名称都是 PascalCase。

#### Node.js 中的 Express 应用示例

```js
import express from 'express';
import { MessageSquare } from '@ycloud-web/icons-static';
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`
    <!DOCTYPE html>
    <html lang="zh-CN">
      <head>
        <meta charset="utf-8" />
        <title>YCloud Icons</title>
      </head>
      <body>
        <h1>YCloud Icons</h1>
        <p>这是一个 YCloud Icons 图标 ${MessageSquare}</p>

      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`示例应用正在监听 http://localhost:${port}`);
});
```
