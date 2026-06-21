---
description: YCloud Icons 图标设计规范与 SVG 代码约定。
---

# 图标设计指南

这份指南用于约束 YCloud Icons 的图标绘制、命名和 SVG 源码格式，目标是让不同设计师、不同批次提交的图标在视觉体积、线宽、圆角和代码结构上保持一致。

## 图标设计原则

### 1. 使用 24 × 24 像素画布

所有图标都应绘制在 `24 × 24` 的画布中。

![24 × 24 像素画布](../images/24px-24px.svg?raw=true)

### 2. 至少保留 1 像素安全边距

图标主体不应贴住画布边缘，至少保留 `1px` 内边距。

![1 像素安全边距](../images/1px-padding.svg?raw=true)

### 3. 默认描边宽度为 2 像素

线性图标默认使用 `2px` 描边，避免同一套图标出现明显粗细差异。

![2 像素描边](../images/2px-stroke.svg?raw=true)

### 4. 使用圆角连接

线段连接处使用 round join，避免尖锐转角造成视觉噪声。

![圆角连接](../images/round-joints.svg?raw=true)

### 5. 使用圆角端点

线段端点使用 round cap，让图标在小尺寸下更稳定、更柔和。

![圆角端点](../images/round-caps.svg?raw=true)

### 6. 使用居中描边

描边应位于路径中心，避免内外偏移导致尺寸和对齐不一致。

![居中描边](../images/centered-strokes.svg?raw=true)

### 7. 形状圆角规则

矩形等基础形状需要保持统一圆角。

#### A. 尺寸不小于 8 像素时，圆角为 2 像素

![2 像素圆角](../images/2px-border-radius.svg?raw=true)

#### B. 尺寸小于 8 像素时，圆角为 1 像素

![1 像素圆角](../images/1px-border-radius.svg?raw=true)

### 8. 独立元素之间保留 2 像素间距

相互独立的图形元素之间建议保留 `2px` 间距，避免小尺寸下粘连。

![2 像素元素间距](../images/2px-element-spacing.svg?raw=true)

![连接元素间距](../images/2px-element-spacing-connected.svg?raw=true)

![突兀截断示例](../images/2px-element-spacing-abrupt-cut.svg?raw=true)

### 9. 视觉体积接近 circle 和 square

图标应与基础 `circle`、`square` 图标保持接近的视觉重量。

![理想视觉体积](../images/optical-volume-ideal.svg?raw=true)

![视觉体积过轻](../images/optical-volume-low.svg?raw=true)

![视觉体积过重](../images/optical-volume-high.svg?raw=true)

提示：可以把图标放在 `circle` 或 `square` 旁边并一起模糊查看。如果图标明显更黑或更浅，说明视觉体积需要调整。

### 10. 按视觉重心居中

图标需要根据视觉重心居中，而不仅是几何边界居中。

![视觉居中](../images/visually-centered.svg?raw=true)

![未视觉居中](../images/visually-centered-bad.svg?raw=true)

提示：把图标分别放在 `square` 或 `circle` 的上下、左右位置对比，检查它是否显得偏移。对称图标应严格居中。

### 11. 保持相近的视觉密度和细节层级

同一套图标不应有的过于复杂、有的过于稀疏。

![理想视觉密度](../images/density-ideal.svg?raw=true)

![视觉密度过高](../images/density-high.svg?raw=true)

提示：复杂对象需要适当抽象。把图标模糊后观察，如果局部明显发黑，通常代表细节过密。

### 12. 连续曲线应平滑衔接

曲线应尽量使用圆弧或二次贝塞尔曲线。使用三次贝塞尔曲线时，控制点角度应尽量镜像，保证曲线顺滑。

![平滑曲线](../images/curvature-smooth.svg?raw=true)

![不平滑曲线](../images/curvature-uneven.svg?raw=true)

### 13. 尽量做到像素级对齐

图标应在低 DPI 屏幕上保持清晰。能对齐网格的位置，尽量对齐到网格。

![像素级对齐](../images/pixel-perfection-ideal.svg?raw=true)

![未对齐示例](../images/pixel-perfection-bad.svg?raw=true)

### 14. 复用通用形状

同组图标或变体图标应尽量复用统一结构。例如 `-off` 系列图标应保持相似的斜线处理方式，除非会破坏视觉体积、识别性或其他更高优先级规则。

## 命名规范

1. 图标名称使用小写 kebab-case，例如 `arrow-up`，不要使用 `Arrow Up`。
2. 图标名称使用国际英语拼写，例如 `color`，不要使用 `colour`。
3. 图标应按“画面描绘的对象”命名，而不是按业务用途命名。例如优先使用 `floppy-disk`，而不是 `save`。
4. 同组图标使用 `<group>-<variant>` 命名，例如 `badge-plus` 基于 `badge`。
5. 替代版本应描述差异点，不要用编号命名，例如使用 `send-horizontal`，不要使用 `send-2`。
6. 除非图标本身表达数字，否则名称中不要包含数字。例如 `arrow-down-0-to-1` 可以使用数字，因为数字就是图形含义的一部分。
7. 多元素图标按元素大小从大到小命名。例如圆更大时使用 `circle-person`，人物更大时使用 `person-circle`。
8. 多个元素大小接近时，如果存在前后层级，按前景到背景命名；否则按英文阅读顺序从上到下、从左到右命名。
9. 元素变体使用 `[element]-[modifier]` 形式。例如虚线圆应命名为 `circle-dashed`，不要命名为 `dashed-circle`。

## SVG 代码约定

图标进入组件库前，SVG 源码应保持可读、稳定且便于自动化处理。

### 全局属性

每个图标最终都会遵循以下基础属性：

```xml
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <!-- SVGElements -->
</svg>
```

### 压缩路径

路径数据可能很长，应在不影响视觉结果的前提下做适度精简。建议把 path 精度控制在 3 位小数以内，减少包体积并降低 diff 噪音。

### 允许的 SVG 元素

SVG 文件只应包含简单路径和基础形状元素，并且属性仅保留尺寸与位置相关信息。通常只允许：

- `<path d>`
- `<line x1 x2>`
- `<polygon points>`
- `<polyline points>`
- `<circle cx cy r>`
- `<ellipse cx cy rx ry>`
- `<rect x y width height rx>`

不要使用 `transform`、`filter`、`fill` 或显式 `stroke`。这些属性会削弱统一清洗、主题色控制和多框架生成的一致性。

不要使用 `<use>`。SVG 被内联到 HTML 后，无法保证引用 ID 在页面中唯一，容易引入难以排查的渲染问题。

## JSON 元数据

每个图标都需要对应的 JSON 描述文件，用于记录标签、分类和多语言展示信息。推荐结构如下：

```json
{
  "$schema": "../icon.schema.json",
  "name": "加号",
  "tags": ["添加", "创建"],
  "categories": ["tools"],
  "i18n": {
    "en": {
      "name": "plus",
      "tags": ["add", "create"]
    }
  }
}
```

中文 `name` 和 `tags` 是默认展示与中文搜索数据；英文图标名称与英文搜索标签必须写入 `i18n.en`。`categories` 是稳定分类 slug，用于构建和校验；分类展示名统一维护在 `categories/*.json`。
