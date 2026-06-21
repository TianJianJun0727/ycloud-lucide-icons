# YCloud Icons SVG 来源管理 Portal 设计方案

## 背景

当前 `ycloud-icons` 已经具备从 SVG 源文件构建多框架图标包的完整链路：

- `icons/*.svg` 保存图标 SVG 源文件。
- `icons/*.json` 保存图标元数据，主字段为中文，`i18n.en` 为英文。
- `categories/*.json` 保存分类定义。
- `tools/build-icons`、`tools/build-font`、各 `packages/icons-*` 负责构建组件、字体、静态资源和文档数据。

缺口在于 SVG 来源侧：设计师或维护者如何批量上传、预览、补全元数据、执行清洗校验，并以可审查的方式进入 GitHub 仓库。

Icona 的价值点是：

- 从设计工具采集 SVG。
- 在 UI 中预览图标。
- 使用 GitHub API 创建分支、提交文件并发起 PR。

Icona 不适合直接作为最终构建器接入，因为它的 `@icona/generator` 会与当前 YCloud Icons 的多框架构建链路重复，并且它默认输出 `.icona/icons.json`，不是当前仓库的 `icons/*.svg` + `icons/*.json` 源格式。

## 目标

新建独立仓库 `ycloud-icons-portal`，基于 `daangn/icona` fork 改造，作为 YCloud Icons 的 SVG 来源管理 Portal。

Portal 由两个入口组成：Figma 插件作为主入口，Web 上传作为补充入口。它们都只负责把外部 SVG 来源转换成当前仓库认可的源数据变更，并通过 GitHub PR 写回 `ycloud-icons`。组件构建、文档构建、npm 发布仍由 `ycloud-icons` 完成。

## 非目标

- 不在 Portal 中构建 React、Vue、Svelte 等图标包。
- 不在 Portal 中发布 npm。
- 不引入独立数据库作为图标源事实。
- 不把 Portal 合入当前 `ycloud-icons` monorepo。
- 不把 `.icona/icons.json` 作为长期源数据格式。

## 总体架构

```text
Figma frame / 本地 SVG / 批量上传
  -> ycloud-icons-portal
    -> SVG 预览
    -> 名称、分类、标签、中文、英文元数据编辑
    -> SVGO 清洗预检
    -> YCloud Icons schema 预校验
    -> 生成 GitHub PR
      -> icons/<name>.svg
      -> icons/<name>.json
      -> categories/<category>.json 可选
  -> ycloud-icons CI
    -> pnpm checkIcons
    -> pnpm lint:json
    -> package build
    -> docs build
    -> release / deploy
```

## 仓库职责划分

### ycloud-icons

继续作为权威源仓库：

- 保存最终 SVG 和元数据。
- 校验 schema。
- 生成所有框架包。
- 生成文档和搜索数据。
- 发布 npm。

### ycloud-icons-portal

作为来源工作台：

- 从 Figma frame 提取 SVG。
- 从本地导入 SVG。
- 清洗和预览 SVG。
- 编辑元数据。
- 对齐当前仓库的分类和 schema。
- 发起 GitHub PR。

Portal 不持久化权威图标数据。可使用浏览器本地缓存保存草稿，但最终以 GitHub PR 为准。

## 基于 Icona 的改造范围

### 保留

- Figma 插件的 SVG 提取能力。
- Web 上传 UI 的 SVG 导入能力。
- 图标预览墙。
- GitHub API 创建 blob、tree、commit、branch、pull request 的流程。
- GitHub Enterprise base URL 的扩展点。

### 修改

- 输出路径从 `.icona/icons.json` 改为当前仓库格式：
  - `icons/<name>.svg`
  - `icons/<name>.json`
  - `categories/<category>.json`
- PR 标题和提交信息改为 YCloud Icons 语义，例如：
  - `feat(icons): add camera-plus`
  - `fix(icons): update arrow-down metadata`
- UI 文案改为中文优先，保留必要英文术语。
- 元数据表单按当前 `icon.schema.json` 和 `category.schema.json` 生成。
- 预检逻辑使用当前仓库的规则：
  - 文件名 kebab-case。
  - SVG 和 JSON 必须成对。
  - 主字段中文，`i18n.en` 英文且必填。
  - 分类必须来自现有分类，或本次同步新增分类。

### 移除

- `@icona/generator` 作为最终产物生成器的定位。
- PDF、PNG、Drawable、React、Vue 生成入口。
- `.icona/icons.json` 长期存储格式。
- Figma `icona-frame` 作为唯一来源的强约束，改为 `ycloud-icons-frame`，同时保留 Web 上传入口。

## 数据模型

Portal 内部可以使用临时 draft 格式，但导出前必须转换为当前仓库格式。

### DraftIcon

```ts
interface DraftIcon {
  name: string;
  svg: string;
  chineseName: string;
  englishName: string;
  tagsZh: string[];
  tagsEn: string[];
  categories: string[];
  contributor: string;
  useCases: string[];
  source?: {
    type: 'figma' | 'upload' | 'paste';
    fileName?: string;
    figmaNodeId?: string;
    figmaNodeName?: string;
  };
}
```

### 导出后的 `icons/<name>.json`

```json
{
  "$schema": "../icon.schema.json",
  "use-cases": [],
  "name": "中文名称",
  "tags": ["中文标签"],
  "categories": ["arrows"],
  "i18n": {
    "en": {
      "name": "english name",
      "tags": ["english tag"]
    }
  }
}
```

## 主要工作流

### 1. 新增图标

1. 上传或从设计工具导入 SVG。
2. Portal 自动生成候选 `name`。
3. 维护者补齐：
   - 中文名称
   - 英文名称
   - 中文标签
   - 英文标签
   - 分类，支持选择已有分类或新增分类。
   - contributor
4. 分类选择区提供两种模式：
   - 选择已有分类：从 `categories/*.json` 读取分类列表，按中文标题展示，可搜索中文标题、英文标题和分类 key。
   - 新增分类：在当前新增图标流程内创建一个或多个新分类，并和图标一起提交。
5. 如果需要新增分类，Portal 同步补齐分类信息：
   - 分类 key，使用 kebab-case。
   - 中文分类名。
   - 英文分类名。
   - 分类图标，必须指向已存在图标或本次同时新增的图标。
   - 可选分类描述和排序权重。
6. Portal 运行 SVG 清洗预检和 schema 预检。
7. Portal 创建 PR，包含 `.svg`、`.json`，以及必要的 `categories/<category>.json`。
8. `ycloud-icons` CI 做最终校验。

### 1.1 新增分类

新增分类不是默认路径，但 Portal 必须支持。分类仍然以 `categories/*.json` 为唯一源数据，不能只保存在 Portal 本地。

在新增图标时，分类字段的交互规则如下：

- 默认展示已有分类多选。
- 每个分类展示中文标题，辅助显示英文标题和分类 key。
- 搜索输入同时匹配中文标题、英文标题、分类 key。
- 如果没有合适分类，可以点击“新增分类”进入内联表单。
- 新增分类保存后立即出现在当前图标的分类选择中。
- 同一个 PR 中允许同时新增图标和新增分类。

新增分类时必须生成：

```json
{
  "$schema": "../category.schema.json",
  "title": "中文分类名",
  "icon": "existing-or-new-icon-name",
  "i18n": {
    "en": {
      "title": "English category title"
    }
  }
}
```

如果本次新增的图标引用了新分类，PR 必须同时包含：

```text
icons/<icon-name>.svg
icons/<icon-name>.json
categories/<category>.json
```

Portal 需要在提交前检查：

- 分类 key 不与已有 `categories/*.json` 冲突。
- 分类 key 使用 kebab-case。
- `icon` 字段指向有效图标。
- 中文 `title` 和英文 `i18n.en.title` 都不为空。
- 新图标的 `categories` 字段引用的是已存在或本次同步新增的分类。

### 2. 修改图标

1. Portal 从 GitHub 读取当前 `icons/<name>.svg` 和 `icons/<name>.json`。
2. 维护者修改 SVG 或元数据。
3. Portal 展示变更前后预览和 JSON diff。
4. Portal 创建 PR。

### 3. 删除图标

1. Portal 选择已有图标。
2. 显示引用检查建议：
   - 分类图标是否引用。
   - 文档示例是否引用。
   - alias 是否引用。
3. Portal 创建删除 `.svg` 和 `.json` 的 PR。
4. CI 做最终引用校验。

## 校验策略

Portal 预检负责快速反馈，CI 负责最终裁决。

### Portal 预检

- 文件名合法。
- SVG 可解析。
- SVG 有 `viewBox`。
- SVG 尺寸符合 24x24 风格预期。
- 元数据必填。
- 分类存在或本次同步新增。
- 中文字段不为空。
- 英文字段不为空。

### CI 终检

沿用当前仓库命令：

```sh
pnpm checkIcons
pnpm lint:json
pnpm --dir docs docs:build:github-pages
```

必要时补充包构建：

```sh
pnpm --filter @ycloud-web/icons build
pnpm --filter @ycloud-web/icons-react build
pnpm --filter @ycloud-web/icons-vue build
```

## GitHub 权限

第一阶段使用 fine-grained token：

- Contents: Read and write
- Pull requests: Read and write
- Metadata: Read-only

后续稳定后再评估 GitHub App，避免长期让用户在浏览器里保存 PAT。

## 安全边界

- Token 只存浏览器本地，不进入仓库。
- Portal 不保存数据库凭证。
- PR 默认写入 feature branch，不直接写 main。
- 所有变更必须经过 GitHub PR 和当前仓库 CI。

## 第一阶段实现范围

第一阶段只做最小闭环：

1. fork Icona 到 `ycloud-icons-portal`。
2. 改造为 pnpm + 当前 Node 版本。
3. 保留上传 / 预览 / GitHub PR。
4. 新增 YCloud Icons 元数据表单。
5. 输出 `icons/*.svg` 和 `icons/*.json`。
6. 能向 `ycloud-icons` 创建新增图标 PR。

暂不做：

- 登录系统。
- 数据库。
- 批量 AI 翻译。
- 自动发布。
- 复杂权限模型。

## 后续阶段

### 第二阶段

- 支持编辑和删除已有图标。
- 从 `ycloud-icons` 拉取已有分类、图标列表和 schema。
- 支持批量上传。
- 支持 duplicate name 检测。

### 第三阶段

- 支持 GitHub App。
- 支持 AI 辅助生成中英文名称和标签。
- 支持 SVG 风格评分和自动修复建议。
- 支持 PR 预览链接和 CI 状态回读。

## 待确认事项

1. Portal 仓库名是否使用 `ycloud-icons-portal`。
2. 第一阶段是否只支持上传 SVG，还是同时保留 Figma 插件入口。
3. PR 目标仓库是否固定为 `TianJianJun0727/ycloud-icons`，还是 UI 可配置。
