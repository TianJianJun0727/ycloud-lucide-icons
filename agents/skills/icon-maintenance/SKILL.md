# YCloud Icons 图标维护 Skill

## 适用对象

这份 Skill 只给会直接修改仓库的 AI / 代理使用。目标是让图标增删改流程尽量确定、可复现、低歧义。

## 执行原则

默认遵守下面几条：

1. 先判断目标是通用图标、业务图标还是插画，不要混用三套规则。
2. 通用图标不要只改 SVG，不同步元数据。
3. 通用图标不要只删 `.svg` 或只删 `.json`。
4. 默认不要发明新的分类名；通用图标的 `categories` 应优先复用现有 `categories/*.json`，业务图标应优先复用现有 `business-icons/<color-mode>/index.json`，插画不维护分类。
5. 通用图标元数据默认使用中文，英文信息必须补齐到 `i18n.en`，不要只保留单语言标签。
6. 除非用户明确要求，不要顺手批量改无关图标。
7. 修改完成后至少运行最小验证命令，再决定是否提交。

把通用图标的 `icons/*.svg` 和 `icons/*.json` 视为同一个实体的两部分。任何通用图标增删改都先检查它们是否仍然成对存在。

业务图标不维护逐图标 JSON；它的元数据来自目录级 `business-icons/<color-mode>/index.json` 和生成产物 `business-icons/index.json`。业务图标数据同时需要进入各包的 `business` 子入口。

插画不维护逐图标 JSON；它的索引来自生成产物 `illustration-icons/index.json`。插画数据同时需要进入各包的 `illustration` 子入口。

## 目录约定

- `icons/*.svg`：图标 SVG 源文件
- `icons/*.json`：图标元数据，主字段为中文展示信息，`i18n.en` 为英文展示信息
- `categories/*.json`：分类定义，决定左侧分类展示、分类标题和英文标题
- `business-icons/<color-mode>/*.svg`：业务图标 SVG 源文件；一级目录只能是 `mono`、`duotone`、`multicolor`
- `business-icons/<color-mode>/index.json`：业务颜色模式定义，包含中文标题和英文标题
- `business-icons/index.json`：生成产物，供校验、Figma 插件、文档和包生成消费
- `illustration-icons/*.svg`：插画 SVG 源文件
- `illustration-icons/index.json`：生成产物，供校验、Figma 插件、文档和包生成消费
- `docs/`：文档站点，图标详情页、分类页和搜索数据都由构建脚本自动生成

一个通用图标必须同时具备：

```text
icons/<icon-name>.svg
icons/<icon-name>.json
```

否则 `pnpm checkIcons` 会报错。

一个业务图标必须位于：

```text
business-icons/<color-mode>/<icon-name>.svg
```

并且对应颜色模式目录必须存在：

```text
business-icons/<color-mode>/index.json
```

这里的 `<color-mode>` 只能是 `mono`、`duotone` 或 `multicolor`。

业务图标文件名在所有颜色模式目录中必须全局唯一，因为包内组件导出名不拼接颜色模式名。

一个插画必须位于：

```text
illustration-icons/<illustration-name>.svg
```

插画文件名必须全局唯一，因为包内组件导出名直接来自文件名。

## SVG 规范

AI 在处理 SVG 时，除了保证文件存在，还要遵守这些约束：

1. 文件名使用 kebab-case。
2. 不保留无意义的编辑器残留和元数据。
3. 通用图标不随意引入与现有线性图标风格明显不一致的形状语言；业务图标可以保留产品、渠道、状态或业务对象的专有视觉信息；插画可以保留页面级视觉、固定颜色和复杂图形层次。
4. 路径结构尽量简单，避免明显冗余的 group、style 和无用属性。
5. 如果只是修元数据，不要顺手改 SVG 形状。
6. 修改后的图标默认应能在 24px 视口下保持清晰可辨。

如果 SVG 来自外部设计工具，优先先执行：

```sh
pnpm optimize
```

然后再做后续维护。

业务图标来自外部设计工具时，优先执行：

```sh
node ./scripts/optimizeBusinessSvgs.mts
node ./scripts/writeBusinessIconIndex.mts
```

业务清洗只清除固定颜色、样式和设计工具冗余属性，不自动补 `stroke-width="2"`，也不强制改成通用 24x24 线性风格。

插画来自外部设计工具时，不执行颜色转换或尺寸清洗，只更新索引并做基础安全校验：

```sh
node ./scripts/writeIllustrationIndex.mts
node ./scripts/checkIllustrationSvgSource.mts
```

## 最小决策树

收到“新增 / 删除 / 修改图标”的需求时，先做这个判断：

### 新增通用图标

- 新增 `icons/<name>.svg`
- 新增 `icons/<name>.json`
- 如果任务明确需要新增分类，再新增 `categories/<category>.json`

### 新增业务图标

- 新增 `business-icons/<color-mode>/<name>.svg`
- 如果是新颜色模式目录，再新增 `business-icons/<color-mode>/index.json`
- 运行 `node ./scripts/writeBusinessIconIndex.mts` 更新根索引
- 不新增 `icons/<name>.json`

### 新增插画

- 新增 `illustration-icons/<name>.svg`
- 运行 `node ./scripts/writeIllustrationIndex.mts` 更新根索引
- 不新增 `icons/<name>.json`

### 删除通用图标

- 同时删除 `icons/<name>.svg` 和 `icons/<name>.json`
- 检查别名、弃用迁移信息、文档示例是否仍引用该图标

### 删除业务图标

- 删除 `business-icons/<color-mode>/<name>.svg`
- 运行 `node ./scripts/writeBusinessIconIndex.mts` 更新根索引
- 如果颜色模式目录变空，除非用户明确要求删除，否则仍保留目录级 `index.json` 作为允许颜色模式配置
- 检查文档示例、业务字体 class、包导入示例是否仍引用该图标

### 删除插画

- 删除 `illustration-icons/<name>.svg`
- 运行 `node ./scripts/writeIllustrationIndex.mts` 更新根索引
- 检查文档示例、静态资源路径、包导入示例是否仍引用该插画

### 修改通用图标

- 只改形状：改 `.svg`
- 只改标签 / 分类 / 中文名称：改 `.json`
- 改名字：同步重命名 `.svg`、`.json`，必要时增加 `aliases`

### 修改业务图标

- 只改形状：改 `business-icons/<color-mode>/<name>.svg`
- 改颜色模式：移动 SVG 到目标颜色模式目录，确保目标目录有 `index.json`
- 改名字：重命名 SVG；同步检查业务包导入示例、业务字体 class 和文档引用
- 改颜色模式标题：改 `business-icons/<color-mode>/index.json`
- 每次改完业务 SVG 或颜色模式配置后运行 `node ./scripts/writeBusinessIconIndex.mts`

### 修改插画

- 只改形状：改 `illustration-icons/<name>.svg`
- 改名字：重命名 SVG；同步检查插画包导入示例、静态资源路径和文档引用
- 每次改完插画 SVG 后运行 `node ./scripts/writeIllustrationIndex.mts`

## 最小验证命令

除非用户明确要求跳过，否则至少执行：

```sh
pnpm checkIcons
pnpm lint:json
node ./scripts/checkBusinessSvgSource.mts
node ./scripts/checkIllustrationSvgSource.mts
pnpm --dir docs docs:build:no-og
```

含义：

- `pnpm checkIcons`：检查 `.svg` / `.json` 是否一一对应，分类是否有效
- `pnpm lint:json`：校验图标和分类 JSON 是否符合 schema
- `node ./scripts/checkBusinessSvgSource.mts`：校验业务 SVG、业务颜色模式配置和根索引是否同步
- `node ./scripts/checkIllustrationSvgSource.mts`：校验插画 SVG 和根索引是否同步
- `pnpm --dir docs docs:build:no-og`：验证文档站点、图标页、分类页和搜索索引是否都能生成

如果改动影响某个具体包的导出或构建，再补对应包构建，例如：

```sh
pnpm --filter @ycloud-web/icons-react build
pnpm --filter @ycloud-web/icons-vue build
pnpm --filter @ycloud-web/icons-data build
```

如果只是批量清洗 SVG，可以先运行：

```sh
pnpm optimize
```

如果只是批量清洗业务 SVG，可以先运行：

```sh
node ./scripts/optimizeBusinessSvgs.mts
node ./scripts/writeBusinessIconIndex.mts
node ./scripts/checkBusinessSvgSource.mts
```

如果只是维护插画 SVG，可以先运行：

```sh
node ./scripts/writeIllustrationIndex.mts
node ./scripts/checkIllustrationSvgSource.mts
```

## 添加一个通用图标

### 1. 放入 SVG 源文件

把新图标放到 `icons/` 目录，文件名使用 kebab-case，例如：

```text
icons/circle-arrow-up.svg
```

如果 SVG 来自设计工具导出，先执行：

```sh
pnpm optimize
```

如果新增图标本身不符合现有风格，应先停下来说明偏差，而不是直接强行入库。

### 2. 新建元数据 JSON

为图标补齐同名的 JSON 文件，例如：

```json
{
  "$schema": "../icon.schema.json",
  "use-cases": [],
  "name": "圆形上箭头",
  "tags": ["箭头", "向上", "圆形"],
  "categories": ["arrows", "navigation"],
  "i18n": {
    "en": {
      "name": "circle arrow up",
      "tags": ["arrow", "up", "circle"],
      "use-cases": []
    }
  }
}
```

最低要求看 `icon.schema.json`：

- 必填：`$schema`、`name`、`categories`、`tags`、`use-cases`、`i18n.en`
- `name`、`tags`、顶层 `use-cases` 使用中文，`i18n.en.name`、`i18n.en.tags`、`i18n.en.use-cases` 使用英文
- `categories` 使用稳定分类 slug；分类展示名来自 `categories/*.json`，不要在 `i18n.en` 里重复维护分类

额外约束：

- `tags` 不要只写一个宽泛词，且默认写中文
- `categories` 最好控制在 1 到 3 个
- `name` 应该是用户界面可直接展示的中文名，`i18n.en.name` 应该是英文界面可直接展示的英文名

### 3. 校验分类是否存在

`categories` 字段里的每个值都必须满足下面两种情况之一：

- 已存在于 `categories/*.json`
- 或者在本次改动里同步新增对应的 `categories/<category>.json`

如果需要新增分类，同步增加分类文件即可，例如：

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

如果新增了分类，建议同时补：

- `title`：中文分类名
- `i18n.en.title`：英文分类名
- 如有必要再补 `description` 和 `i18n.en.description`

新增分类时再额外遵守：

1. 分类名保持现有命名风格，使用 kebab-case。
2. 分类文件必须符合 `category.schema.json`。
3. `icon` 必须指向一个已存在的图标。
4. 图标元数据里的 `categories` 只能引用“已存在”或“本次同时新增”的分类。

### 4. 自检结果

新增图标完成后，至少确认：

- 图标能在 `/icons/<name>` 页面生成详情
- 图标能被搜索到
- 图标能出现在对应分类页
- 中文名称和中文标签显示正确
- 没有出现孤立的 `.svg` 或 `.json`

## 删除一个图标

删除通用图标时必须成对清理：

```text
icons/<icon-name>.svg
icons/<icon-name>.json
```

然后继续检查：

- 其他图标的 `aliases`、弃用迁移信息是否还引用它
- 文档里的示例代码是否还在使用这个图标

建议额外执行：

```sh
rg -n "<icon-name>" docs icons categories packages
```

这样可以尽量避免遗漏：

- 文档示例
- 旧别名
- 包级示例导入

## 修改一个图标

### 1. 只改 SVG 形状

只更新：

```text
icons/<icon-name>.svg
```

然后执行：

```sh
pnpm optimize
pnpm checkIcons
pnpm --dir docs docs:build:no-og
```

如果只是确认“结构没坏”，这一组命令已经足够，不要默认顺手重建所有包。

额外检查：

- 路径是否明显冗余
- 是否残留无意义属性
- 是否破坏现有线性图标风格
- 在 24px 下是否仍然可读

### 2. 只改名称、标签、分类或中文文案

只更新：

```text
icons/<icon-name>.json
```

常见修改包括：

- 调整 `tags`
- 调整 `categories`
- 补齐或修正中文主字段和 `i18n.en`
- 增加 `aliases`

这类改动会直接影响：

- 图标搜索结果
- 图标详情页中文显示
- 分类页归属

### 3. 重命名图标

重命名不是单纯改文件名，至少同步下面四处：

- `icons/<old-name>.svg` -> `icons/<new-name>.svg`
- `icons/<old-name>.json` -> `icons/<new-name>.json`
- 如果要兼容旧名字，在新 JSON 里补 `aliases`
- 相关文档示例、别名引用、包导入示例一起更新

如果只是保留旧名字兼容，建议用 `aliases` 标记，而不是继续保留两份图标源。

重命名时建议额外执行：

```sh
rg -n "<old-name>|<new-name>" docs icons categories packages
```

目的是确认：

- 没有遗漏旧名字引用
- 没有把新旧名字混用到不一致状态

## 添加一个业务图标

### 1. 选择业务颜色模式目录

业务图标必须放在一级颜色模式目录中，例如：

```text
business-icons/mono/billing.svg
```

当前允许颜色模式由 `business-icons/<color-mode>/index.json` 决定。目录只能是 `mono`、`duotone`、`multicolor`；新增目录时必须同步写入目录级 `index.json`。

目录级配置示例：

```json
{
  "$schema": "../category.schema.json",
  "title": "单色",
  "i18n": {
    "en": {
      "title": "Mono"
    }
  }
}
```

### 2. 放入 SVG 源文件

业务图标文件名使用 kebab-case。业务图标不要求和通用图标一致的 `stroke-width="2"`、`stroke-linecap="round"`、`stroke-linejoin="round"`。

颜色规则：

- `mono`：固定颜色会转为 `currentColor`
- `duotone`：白色会转为 secondary token，其他颜色会转为 primary token
- `multicolor`：保留固定颜色

建议执行：

```sh
node ./scripts/optimizeBusinessSvgs.mts
node ./scripts/writeBusinessIconIndex.mts
node ./scripts/checkBusinessSvgSource.mts
```

### 3. 检查导出名

业务包导出名按 SVG 文件名生成，不拼接颜色模式名：

```text
business-icons/mono/billing.svg -> Billing
```

所以不同颜色模式目录下不能出现同名 SVG。重复名称会导致包生成和 Figma 提交校验失败。

### 4. 自检结果

新增业务图标完成后，至少确认：

- 图标能在 `/business-icons/` 列表展示
- 图标能在 `/business-icons/<name>` 页面生成详情
- 所属颜色模式能在文档和 Figma 插件下拉中展示
- 根 `business-icons/index.json` 是由脚本生成的最新内容
- `@ycloud-web/icons-data/business` 能导出对应 SVG / data URI 数据
- 业务字体示例可使用 `business-icon-<name>`

## 添加一个插画

### 1. 放入 SVG 源文件

把新插画放到 `illustration-icons/` 目录，文件名使用 kebab-case，例如：

```text
illustration-icons/empty-page.svg
```

插画不需要逐图标 JSON，不进入通用图标分类，也不按业务图标颜色模式归类。

### 2. 保留源 SVG 视觉

插画不做颜色转换、不做尺寸清洗。可以保留固定颜色、渐变、透明度、宽高和复杂图形层次，但仍必须通过基础安全校验。

建议执行：

```sh
node ./scripts/writeIllustrationIndex.mts
node ./scripts/checkIllustrationSvgSource.mts
```

如果插画来自 Figma 插件提交，后续自动链路必须和通用图标、业务图标一致：

- 自动修复工作流需要刷新并提交 `illustration-icons/index.json`
- PR lint 需要运行 `pnpm lint:svg:illustration`
- 自动合并白名单需要允许 `illustration-icons/*.svg` 和 `illustration-icons/index.json`
- 合并到 `main` 后，Figma PR 中的 `illustration-icons/*.svg` 变更需要触发 release / npm 发布流程

### 3. 检查导出名

插画包导出名按 SVG 文件名生成：

```text
illustration-icons/empty-page.svg -> EmptyPage
```

### 4. 自检结果

新增插画完成后，至少确认：

- 插画能在 `/illustration-icons/` 列表展示
- 插画能在 `/illustration-icons/<name>` 页面生成详情
- 根 `illustration-icons/index.json` 是由脚本生成的最新内容
- `@ycloud-web/icons-data/illustration` 能导出对应 SVG / data URI 数据
- 静态资源路径可使用 `@ycloud-web/icons-static/illustration-icons/<name>.svg`

## 提交前检查

提交前建议执行：

```sh
git status --short
git diff --check
```

理想状态下，本次图标任务的 diff 应主要集中在：

- `icons/`
- `categories/`
- `business-icons/`
- `illustration-icons/`
- `docs/` 中与图标展示或说明直接相关的文件

如果 diff 扩散到了大量无关文件，应先解释原因，再决定是否继续提交。业务图标变更通常还会触发 `packages/icons-static/business-font/`、Figma 插件或业务图标文档相关文件；插画变更通常会触发插画索引、包入口和文档列表相关文件。

## 一句话摘要

> 先判断是通用图标、业务图标还是插画；通用图标保证 `icons/*.svg` 与 `icons/*.json` 成对一致；业务图标保证 `business-icons/<color-mode>/*.svg`、目录级 `index.json` 和根 `business-icons/index.json` 同步；插画保证 `illustration-icons/*.svg` 和根 `illustration-icons/index.json` 同步；最后至少运行对应校验和文档构建。
