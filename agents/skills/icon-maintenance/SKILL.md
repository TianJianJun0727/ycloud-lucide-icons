# YCloud Icons 图标维护 Skill

## 适用对象

这份 Skill 只给会直接修改仓库的 AI / 代理使用。目标是让图标增删改流程尽量确定、可复现、低歧义。

## 执行原则

默认遵守下面几条：

1. 不要只改 SVG，不同步元数据。
2. 不要只删 `.svg` 或只删 `.json`。
3. 默认不要发明新的分类名，图标的 `categories` 应优先复用现有 `categories/*.json`。
4. 中文信息优先补齐到 `i18n.zh`，不要只保留英文标签。
5. 除非用户明确要求，不要顺手批量改无关图标。
6. 修改完成后至少运行最小验证命令，再决定是否提交。

把 `icons/*.svg` 和 `icons/*.json` 视为同一个实体的两部分。任何增删改都先检查它们是否仍然成对存在。

## 目录约定

- `icons/*.svg`：图标 SVG 源文件
- `icons/*.json`：图标元数据，包含分类、标签、贡献者和中文信息
- `categories/*.json`：分类定义，决定左侧分类展示、分类标题和分类图标
- `docs/`：文档站点，图标详情页、分类页和搜索数据都由构建脚本自动生成

一个图标必须同时具备：

```text
icons/<icon-name>.svg
icons/<icon-name>.json
```

否则 `pnpm checkIcons` 会报错。

## SVG 规范

AI 在处理 SVG 时，除了保证文件存在，还要遵守这些约束：

1. 文件名使用 kebab-case。
2. 不保留无意义的编辑器残留和元数据。
3. 不随意引入与现有线性图标风格明显不一致的形状语言。
4. 路径结构尽量简单，避免明显冗余的 group、style 和无用属性。
5. 如果只是修元数据，不要顺手改 SVG 形状。
6. 修改后的图标默认应能在 24px 视口下保持清晰可辨。

如果 SVG 来自外部设计工具，优先先执行：

```sh
pnpm optimize
```

然后再做后续维护。

## 最小决策树

收到“新增 / 删除 / 修改图标”的需求时，先做这个判断：

### 新增图标

- 新增 `icons/<name>.svg`
- 新增 `icons/<name>.json`
- 如果任务明确需要新增分类，再新增 `categories/<category>.json`

### 删除图标

- 同时删除 `icons/<name>.svg` 和 `icons/<name>.json`
- 检查分类图标、别名、文档示例是否仍引用该图标

### 修改图标

- 只改形状：改 `.svg`
- 只改标签 / 分类 / 中文名称：改 `.json`
- 改名字：同步重命名 `.svg`、`.json`，必要时增加 `aliases`

## 最小验证命令

除非用户明确要求跳过，否则至少执行：

```sh
pnpm checkIcons
pnpm lint:json
pnpm --dir docs docs:build:no-og
```

含义：

- `pnpm checkIcons`：检查 `.svg` / `.json` 是否一一对应，分类是否有效
- `pnpm lint:json`：校验图标和分类 JSON 是否符合 schema
- `pnpm --dir docs docs:build:no-og`：验证文档站点、图标页、分类页和搜索索引是否都能生成

如果改动影响某个具体包的导出或构建，再补对应包构建，例如：

```sh
pnpm --filter @ycloud-web/icons-react build
pnpm --filter @ycloud-web/icons-vue build
```

如果只是批量清洗 SVG，可以先运行：

```sh
pnpm optimize
```

## 添加一个图标

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
  "contributors": ["your-github-id"],
  "use-cases": [],
  "tags": ["arrow", "up", "circle"],
  "categories": ["arrows", "navigation"],
  "i18n": {
    "zh": {
      "name": "圆形上箭头",
      "tags": ["箭头", "向上", "圆形"],
      "categories": ["箭头", "导航与地点"]
    }
  }
}
```

最低要求看 `icon.schema.json`：

- 必填：`$schema`、`contributors`、`categories`、`tags`、`use-cases`
- 推荐补齐：`i18n.zh.name`、`i18n.zh.tags`、`i18n.zh.categories`

额外约束：

- `contributors` 不要留空
- `tags` 不要只写一个宽泛词
- `categories` 最好控制在 1 到 3 个
- `i18n.zh.name` 应该是用户界面可直接展示的中文名

### 3. 校验分类是否存在

`categories` 字段里的每个值都必须满足下面两种情况之一：

- 已存在于 `categories/*.json`
- 或者在本次改动里同步新增对应的 `categories/<category>.json`

如果需要新增分类，除了增加分类文件，还要保证 `icon` 指向一个已存在的图标，例如：

```json
{
  "$schema": "../category.schema.json",
  "title": "Navigation & Places",
  "icon": "compass",
  "i18n": {
    "zh": {
      "title": "导航与地点"
    }
  }
}
```

如果新增了分类，建议同时补：

- `title`
- `i18n.zh.title`
- 如有必要再补 `description` 和 `i18n.zh.description`

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

删除图标时必须成对清理：

```text
icons/<icon-name>.svg
icons/<icon-name>.json
```

然后继续检查：

- 其他图标的 `aliases`、弃用迁移信息是否还引用它
- `categories/*.json` 的 `icon` 字段是否把它当作分类图标
- 文档里的示例代码是否还在使用这个图标

建议额外执行：

```sh
rg -n "<icon-name>" docs icons categories packages
```

这样可以尽量避免遗漏：

- 文档示例
- 分类图标引用
- 旧别名
- 包级示例导入

如果删除的是分类图标，先把对应分类切换到别的已存在图标，否则分类页会直接报错。

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
- 补齐或修正 `i18n.zh`
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
- 相关文档示例、分类图标引用、包导入示例一起更新

如果只是保留旧名字兼容，建议用 `aliases` 标记，而不是继续保留两份图标源。

重命名时建议额外执行：

```sh
rg -n "<old-name>|<new-name>" docs icons categories packages
```

目的是确认：

- 没有遗漏旧名字引用
- 没有把新旧名字混用到不一致状态

## 提交前检查

提交前建议执行：

```sh
git status --short
git diff --check
```

理想状态下，本次图标任务的 diff 应主要集中在：

- `icons/`
- `categories/`
- `docs/` 中与图标展示或说明直接相关的文件

如果 diff 扩散到了大量无关文件，应先解释原因，再决定是否继续提交。

## 一句话摘要

> 先判断是新增、删除还是修改；保证 `icons/*.svg` 与 `icons/*.json` 成对一致；分类只引用已存在的 `categories/*.json`；中文信息写入 `i18n.zh`；最后至少运行 `pnpm checkIcons`、`pnpm lint:json` 和 `pnpm --dir docs docs:build:no-og`。
