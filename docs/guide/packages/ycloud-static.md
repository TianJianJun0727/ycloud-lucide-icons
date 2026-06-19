# YCloud Icons Static

Static assets and utilities for YCloud icons that work without JavaScript frameworks. This package provides multiple formats including individual SVG files, SVG sprites, icon fonts, and Node.js utilities for server-side rendering and static site generation.

**What you can accomplish:**

- Use individual SVG files as images or CSS background images
- Implement icon fonts for CSS-based icon systems
- Create SVG sprites for efficient icon loading in static sites
- Import SVG strings in Node.js applications and server-side rendering
- Build static websites and applications without JavaScript framework dependencies

This package includes the following implementations of YCloud icons:

- Individual SVG files
- SVG sprite
- Icon font files
- A JavaScript library exporting SVG strings

## Who is this for?

`@ycloud-web/icons-static` is suitable for _very specific use cases_ where you want to use YCloud icons without relying on a JavaScript framework or component system. It's ideal for:

- Projects that use icon fonts with plain CSS or utility-first frameworks
- Embedding raw SVG files or sprites directly in HTML
- Using SVGs as CSS background images
- Importing SVG strings into Node.js (CommonJS) environments

::: danger

### Not recommended for production {#production-warning}

SVG sprites and icon fonts include **all icons**, which can significantly increase your app's bundle size and load time.

For production environments, we recommend using a bundler with tree-shaking support to include only the icons you actually use. Consider using one of the framework-specific [packages](../../packages.md).
:::

## 安装

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

## SVG 文件

可以通过多种方式使用独立 SVG 文件或 SVG sprite。

Check out our [codesandbox example](https://codesandbox.io/s/using-the-svg-sprite-lz1kk).

### SVG 文件作为图片

#### 在 HTML 中使用:

::: code-group

```html [Webpack]
<!-- SVG file for a single icon -->
<img src="~@ycloud-web/icons-static/icons/house.svg" />
```

```html [CDN]
<!-- SVG file for a single icon -->
<img src="https://unpkg.com/@ycloud-web/icons-static@latest/icons/house.svg" />
```

:::

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

To import an SVG as a string (e.g., for templating):

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
[Not intended for production use.](#production-warning)
:::

可能还需要额外的 SVG loader 来处理它。

#### 基础 sprite 用法 (not production-optimized):

```html
<img src="@ycloud-web/icons-static/sprite.svg#house" />
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

...and update the SVG as follows:

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
[Not intended for production use.](#production-warning)
:::

YCloud icons are also available as a web font. To use them, you first need to include the corresponding stylesheet:

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

> Note: Each icon name is in PascalCase.

#### Express app example in Node.js

```js
import express from 'express';
import { MessageSquare } from '@ycloud-web/icons-static';
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Page Title</title>
      </head>
      <body>
        <h1>YCloud Icons</h1>
        <p>这是一个 YCloud Icons 图标 ${MessageSquare}</p>

      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
```
