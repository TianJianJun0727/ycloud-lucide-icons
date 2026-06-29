# @ycloud-web/icons-data

`@ycloud-web/icons-data` 是一个辅助库，用 tree-shakable 的形式导出 YCloud **图标数据**，并提供动态导入图标的工具方法。

它刻意**不包含真实渲染逻辑或组件**，其他包（例如 [`@ycloud-web/icons-angular`](http://npmjs.com/package/@ycloud-web/icons-angular)）可以消费这些数据，在各自框架中渲染图标。你也可以使用这个包为暂未支持的框架构建第三方集成。

这个包同时覆盖两类图标数据：

- 通用图标：从主入口 `@ycloud-web/icons-data` 导出标准节点数据，可配合 builder 设置颜色、尺寸、描边宽度等。
- 业务图标：从 `@ycloud-web/icons-data/business` 导出原始 SVG、data URI 和索引数据，不经过通用 stroke builder。

## 安装

::: code-group

```sh [pnpm]
pnpm add @ycloud-web/icons-data@latest
```

```sh [yarn]
yarn add @ycloud-web/icons-data@latest
```

```sh [npm]
npm install @ycloud-web/icons-data@latest
```

```sh [bun]
bun add @ycloud-web/icons-data@latest
```

:::

## 版本要求

`@ycloud-web/icons-data` 无框架 peer dependency，适合被各框架包或自定义渲染器消费。

## 图标数据格式

每个图标都由下面的接口描述：

```typescript
export type YCloudIconData = {
  name: string;
  node: YCloudIconNode[];
} & ({ size: number } | { width: number; height: number });
```

| 名称                         | 类型               | 说明                                              |
| ---------------------------- | ------------------ | ------------------------------------------------- |
| `name`                       | `string`           | 图标名称。                                        |
| `node`                       | `YCloudIconNode[]` | SVG 子节点，格式为 `[tagName, attributes]` 元组。 |
| `size` or `width` & `height` | `number`           | 图标尺寸（`size` 是正方形图标的简写）。           |

## 使用方式

通用图标可以单独导入。只有你导入的图标会被应用代码引用，其余图标会被 tree-shaking 移除。

```ts
import { House } from '@ycloud-web/icons-data';
// House 是图标数据，不是已经渲染好的组件。
```

业务图标使用单独子入口：

```ts
import { billingDataUri, businessIconNames, getBusinessIcon } from '@ycloud-web/icons-data/business';

const billing = getBusinessIcon('billing');
const imageSource = billingDataUri;
const availableBusinessIcons = businessIconNames;
```

业务图标导出的是已经清洗后的 SVG 字符串和 data URI，适合自定义渲染器、图片标签、Canvas 或后台生成场景。它们不支持 `strokeWidth`、`absoluteStrokeWidth` 等只属于通用图标节点构建的参数。

## 构建图标

`@ycloud-web/icons-data` 提供了一组小工具，可以把 YCloud 图标数据转换成不同的可渲染输出。
所有 builder 都接收相同的 `params` 对象（`YCloudBuildParams`），用于自定义生成的 SVG。

### 构建参数

当前支持以下参数（名称与当前实现保持一致）：

| 参数                  | 类型                     | 作用                                                                                                                                      |
| --------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `color`               | `string`                 | 设置 `stroke`，默认值为 `currentColor`。                                                                                                  |
| `size`                | `number`                 | 同时设置 `width` 和 `height`，默认值为 24。                                                                                               |
| `width`               | `number`                 | 只设置 `width`。                                                                                                                          |
| `height`              | `number`                 | 只设置 `height`。                                                                                                                         |
| `strokeWidth`         | `number`                 | 设置 `stroke-width`，默认值为 2。                                                                                                         |
| `absoluteStrokeWidth` | `boolean`                | 向子元素添加 [`vector-effect="non-scaling-stroke"`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/vector-effect)。 |
| `className`           | `string`                 | 追加到生成的 `class` 属性中。                                                                                                             |
| `attributes`          | `Record<string, string>` | 添加或覆盖任意生成的 SVG 属性，包括 `class`、`viewBox` 等。                                                                               |

::: info
builder 生成的 SVG 属性包含默认的 YCloud 配置（`xmlns`、`viewBox`、`fill="none"`、`stroke="currentColor"`、`stroke-width="2"`、`stroke-linecap="round"`、`stroke-linejoin="round"`），以及形如 `ycloud ycloud-{iconName}` 的 class 字符串。
:::

### `buildYCloudIconNode`

创建一个 svgson-like 格式的根 SVG 节点：

```ts
import { buildYCloudIconNode } from '@ycloud-web/icons-data/build';
import { House } from '@ycloud-web/icons-data';

const node = buildYCloudIconNode(House, {
  size: 32,
  strokeWidth: 1.5,
  className: 'my-icon',
});

// -> ['svg', attributes, children]
```

如果你想把 YCloud Icons 接入自己的渲染器、模板系统或框架集成，这会很有用。

### `buildYCloudSvg`

创建 SVG 字符串：

```ts
import { buildYCloudSvg } from '@ycloud-web/icons-data/build';
import { House } from '@ycloud-web/icons-data';

const svg = buildYCloudSvg(House, { size: 24, color: '#111' });
```

### `buildYCloudIconElement`

在传入的 document 中创建真实 DOM 元素（SVG）：

```ts
import { buildYCloudIconElement } from '@ycloud-web/icons-data/build';
import { House } from '@ycloud-web/icons-data';

const el = buildYCloudIconElement(document, House, { size: 24 });
document.body.appendChild(el);
```

### `buildYCloudDataUri`

基于 YCloud 图标对象创建 base64 编码的 SVG data URI。

这个辅助函数同时适用于浏览器和 Node.js：

- 在浏览器中使用 `btoa`，并正确处理 UTF-8。
- 在 Node.js 中回退使用 `Buffer`。

```ts
import { buildYCloudDataUri } from '@ycloud-web/icons-data/build';
import { House } from '@ycloud-web/icons-data';

const uri = buildYCloudDataUri(House, { size: 24 });
```

返回值可以直接用于以下场景：

- `<img src="...">`
- CSS `background-image`
- Canvas 绘制
- HTML 或 SVG 中的内联 data URL

::: tip 环境说明

- SVG 会先按 UTF-8 编码再转换为 base64，以确保能正确处理非 ASCII 字符。
- 不需要运行时配置，函数会自动选择合适的编码策略。
- 如果当前环境既没有 `btoa` 也没有 `Buffer`，会抛出错误。

:::

## 动态导入

当图标名称只能在运行时确定时，动态导入会很有用，例如图标名称存储在数据库或 CMS 中。对于完全静态的使用场景，优先使用直接导入，以获得最佳 tree-shaking 效果。

::: tip
在访问映射表前先校验 `iconName`，并提供兜底图标，以避免运行时错误。
:::

```ts
import { ycloudDynamicIconImports } from '@ycloud-web/icons-data/dynamic';

const name = 'house';
const icon = await ycloudDynamicIconImports[name]?.();

if (!icon) {
  // 处理未知图标名称，例如使用兜底图标。
}
```
