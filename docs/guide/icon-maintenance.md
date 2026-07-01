---
title: 图标维护
description: 给人工维护者看的 YCloud Icons 图标增删改说明。
---

# 图标维护

这份文档给人工维护者使用，目的是快速说明这个仓库里图标是如何组织和维护的。

## 图标由哪些文件组成

在这个仓库里，一个图标通常由两部分组成：

```text
icons/<icon-name>.svg
icons/<icon-name>.json
```

- `.svg` 负责图形本体
- `.json` 负责分类、标签，以及中文默认展示信息和英文 `i18n.en`

除此之外，还有一类文件与图标展示有关：

- `categories/*.json`：定义分类名称、中文分类标题和英文分类标题
- `docs/`：文档站点，图标详情页、搜索和分类页都由构建脚本自动生成

业务专有图标放在 `business-icons/<color-mode>/*.svg`，一级目录只能是 `mono`、`duotone`、`multicolor`，用于区分单色、双色和多色清洗/打包规则。颜色模式显示名维护在 `business-icons/<color-mode>/index.json`，根 `business-icons/index.json` 由脚本生成索引。业务图标不需要每个图标的同名 JSON；详细规则见 [业务图标](/guide/business-icons)。

插画资源放在 `illustration-icons/*.svg`，不做颜色转换、不做尺寸清洗，组件默认 `width="100%"`、`height="auto"`。根 `illustration-icons/index.json` 由脚本生成索引。插画不需要每个 SVG 的同名 JSON；包入口使用 `@ycloud-web/icons-*/illustration`，静态资源路径使用 `@ycloud-web/icons-static/illustration-icons/<name>.svg`。

## 图标规范

在真正修改图标之前，先看一遍公开规范页：

- [图标设计指南](/guide/icon-design-guide)

这页更偏设计与 SVG 代码规范。日常维护时，至少记住下面几点：

- 图标文件名使用 kebab-case
- 视觉风格应保持和现有线性图标一致
- 不要保留无意义的导出垃圾，例如多余分组、编辑器残留属性、无用元数据
- 图标应尽量保持简洁、对齐和可读，避免过度复杂的路径结构
- 如果只是补元数据，不要顺手改 SVG 形状

如果 SVG 来自外部设计工具，建议先清洗再继续维护：

```sh
pnpm optimize
```

## 添加一个图标

新增图标时，通常按这个顺序操作：

1. 把 SVG 放进 `icons/`
2. 新建同名的 JSON 元数据
3. 检查分类是否已经存在
4. 运行校验命令

示例：

```text
icons/circle-arrow-up.svg
icons/circle-arrow-up.json
```

如果 SVG 来自设计工具导出，建议先执行：

```sh
pnpm optimize
```

元数据至少要包含：

- `categories`
- `tags`
- `use-cases`

元数据必须同时包含中文主字段和英文 `i18n.en`：

- `name`：中文图标名
- `tags`：中文搜索标签
- `use-cases`：中文使用场景，暂无时写空数组
- `categories`：稳定分类 slug，不是展示文案
- `i18n.en.name`：英文图标名
- `i18n.en.tags`：英文搜索标签
- `i18n.en.use-cases`：英文使用场景，暂无时写空数组

分类的中文与英文展示名统一维护在 `categories/*.json`，不要在图标 JSON 的 `i18n.en` 中重复写分类。

## 删除一个图标

删除图标时，不要只删 SVG。应当同时删除：

```text
icons/<icon-name>.svg
icons/<icon-name>.json
```

然后确认下面几类引用是否也要一起调整：

- 其他图标的 `aliases` 或弃用迁移是否还引用它
- 文档示例是否还在使用这个图标

## 修改一个图标

修改图标通常分为三种：

### 修改 SVG 形状

只改：

```text
icons/<icon-name>.svg
```

修改 SVG 时，除了关注视觉效果，也要确认：

- 路径没有明显冗余
- 不存在无意义的编辑器残留属性
- 图标在 24px 视口下仍然清晰可辨
- 改动没有破坏现有风格一致性

### 修改分类、标签或中文文案

只改：

```text
icons/<icon-name>.json
```

这类改动会影响搜索、分类页和详情页的展示。

### 重命名图标

重命名时至少需要同步：

- `.svg` 文件名
- `.json` 文件名
- 文档示例中的引用
- 必要时在新 JSON 中补 `aliases`

## 新增或修改分类

分类定义在 `categories/*.json` 中，例如：

```json
{
  "$schema": "../category.schema.json",
  "title": "导航与地点",
  "i18n": {
    "en": {
      "title": "Navigation & Places"
    }
  }
}
```

这里需要注意两点：

1. `icon` 必须指向一个已存在的图标
2. 图标元数据里的 `categories` 值必须是“已存在分类”或“本次同时新增的分类”

默认应优先复用现有分类，不要随意新造分类名。只有在任务明确需要时，才新增新的 `categories/<name>.json`。

## 建议执行的校验命令

无论是新增、删除还是修改图标，至少建议执行：

```sh
pnpm checkIcons
pnpm lint:json
pnpm --dir docs docs:build:no-og
```

如果改动影响具体包的导出行为，再补对应包构建，例如：

```sh
pnpm --filter @ycloud-web/icons-react build
pnpm --filter @ycloud-web/icons-vue build
```

## 发布与版本

日常维护图标时，不需要手动改包版本。

当前仓库的版本策略是：

1. 版本以 Git tag / release 为真实来源
2. 文档首页和更新日志都从 tag 数据读取版本
3. 真正发布成功后，workflow 会把各个 `packages/*/package.json` 的版本自动回写到 `main`
