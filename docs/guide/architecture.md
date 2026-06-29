---
title: 架构
description: YCloud Icons 的源码组织、生成链路、包结构与发布方式。
---

# 架构

YCloud Icons 不是单一组件包，而是一套围绕同一份图标源数据组织起来的多包仓库。它的核心目标有三个：

- 图标源只维护一份
- 多框架产物共用同一套数据与命名
- 文档、包发布、版本记录都从仓库事实自动生成

如果只看一条主链路，可以理解为：

```text
icons/*.svg + icons/*.json
business-icons/<category>/*.svg + business-icons/<category>/index.json
  -> 根级校验 / 清洗脚本
  -> packages/* 生成各框架产物
  -> docs/scripts/* 生成文档数据
  -> 文档站点与 npm 包发布
```

## 一、仓库分层

当前仓库可以按职责拆成五层：

### 1. 源数据层

这层是真正的单一事实来源，主要在：

```text
icons/
categories/
business-icons/
```

- `icons/*.svg`：图标图形本体
- `icons/*.json`：图标元数据，例如分类、标签、中文信息
- `categories/*.json`：分类定义、分类标题和英文标题
- `business-icons/<category>/*.svg`：业务专有图标图形
- `business-icons/<category>/index.json`：业务分类的中英文标题和排序
- `business-icons/index.json`：生成产物，供校验、插件、文档和包生成消费

这里的原则是：通用图标和业务图标都把图形和语义落在源码仓库里，而不是分散写在文档或组件代码里。通用图标有逐图标元数据；业务图标只维护分类元数据，包导出名仍由文件名决定。

### 2. 生成与校验层

这层负责把“原始图标源”清洗成“可消费产物”，主要在：

```text
scripts/
tools/
```

典型脚本包括：

- `scripts/optimizeSvgs.mts`：清洗 SVG，移除冗余结构和不必要属性
- `scripts/checkIconsAndCategories.mts`：校验图标与分类引用关系
- `scripts/syncPackageVersions.mts`：同步包版本
- `scripts/writeChangelog.mts`：写入更新日志内容

这一层不承担 UI 职责，只做规则化、结构化和自动化。

### 3. 包产物层

这层负责把同一份图标源分发为多个 npm 包，主要在：

```text
packages/
```

它不是“每个框架各自维护一套图标”，而是“每个框架共享同一份图标数据，再按目标运行时生成不同入口”。

### 4. 文档与展示层

这层主要在：

```text
docs/
docs/scripts/
```

文档站不是手写一个静态图标墙，而是由图标源数据自动生成搜索、分类、详情、相关图标、版本信息等页面数据。

### 5. 维护流程层

这层主要在：

```text
agents/
.github/
```

- `agents/`：给自动化代理使用的仓库维护流程
- `.github/`：CI、发布、文档部署等工作流

这一层解决的是“怎么持续维护”，不是“图标长什么样”。

## 二、为什么源数据拆成 SVG + JSON

一个图标通常对应两类信息：

```text
icons/<name>.svg
icons/<name>.json
```

通用图标这样拆分有几个直接好处：

1. 图形和语义分离
   改标签、分类、中文名时，不需要改 SVG。

2. 多语言和搜索信息更好维护
   中文显示、英文搜索、标签体系都可以放进 JSON，而不是塞进组件注释里。

3. 多端共享更稳定
   React、Vue、Static、文档站都从同一份元数据读分类和名称，不需要各自复制一遍。

4. 更适合自动化校验
   脚本可以直接检查：
   - 分类是否存在
   - 分类是否存在
   - 中文信息是否缺失
   - 标签结构是否符合约定

业务图标使用不同模型：

```text
business-icons/<category>/<name>.svg
business-icons/<category>/index.json
business-icons/index.json
```

业务图标不会为每个 SVG 维护同名 JSON，分类来自一级目录，分类标题来自目录下的 `index.json`。根 `business-icons/index.json` 由脚本生成，用于 Figma 插件下拉选择、文档分类展示、重复检测和包生成。

## 三、包结构怎么分

`packages/` 里的包可以按职责看，而不是只按框架名看。

### 1. 核心运行时包

- `packages/icons`

这是不绑定具体前端框架的基础入口，面向原生 JS 或通用运行时场景。

### 2. 框架组件包

例如：

- `packages/icons-react`
- `packages/icons-vue`
- `packages/icons-svelte`
- `packages/icons-solid`
- `packages/icons-preact`
- `packages/icons-react-native`
- `packages/icons-angular`
- `packages/icons-astro`

这些包的职责是把同一份图标节点数据包装成各自框架的组件接口。

对外暴露时，保持统一命名策略，例如：

```tsx
import { Camera } from '@ycloud-web/icons-react';
```

而不是为不同来源或风格附加一堆额外前缀，确保：

- IDE 自动补全稳定
- TypeScript 类型提示稳定
- 重命名重构稳定
- 业务侧 import 足够干净

### 3. 静态资源包

- `packages/icons-static`

这个包面向通用 SVG 文件、业务 SVG 文件、Sprite、通用 Icon Font、业务 Icon Font 等非组件化消费方式。

### 4. 数据包与共享包

- `packages/icons-data`
- `packages/icons-shared`

前者更偏图标数据导出，后者更偏多个包共享的工具、类型和基础逻辑。

`packages/icons-data` 同时承担两类数据出口：

- 主入口导出通用图标的节点数据和通用 builder。
- `business` 子入口导出业务图标的 SVG 字符串、data URI 和索引数据。

这两类包的存在，是为了避免每个框架包重复维护一套相同数据和辅助方法。

## 四、为什么目录名跟 npm 包短名一致

公开包统一发布在 `@ycloud-web` scope 下，但 `packages/` 内部不再重复组织名，只保留 npm 包名去掉 scope 后的短名：

- `@ycloud-web/icons` -> `packages/icons`
- `@ycloud-web/icons-react` -> `packages/icons-react`
- `@ycloud-web/icons-vue` -> `packages/icons-vue`
- `@ycloud-web/icons-data` -> `packages/icons-data`

这样做的原因很直接：

1. 目录和发布包一一对应
   看到目录名就能判断对应的 npm 包，减少脚本、CI 和文档之间的映射成本。

2. 避免重复品牌前缀
   scope 已经表达了组织归属，目录里不再重复 `ycloud`。

3. 后续自动化更简单
   生成文档、生成源码链接、同步包版本时，都可以从 `package.json` 直接得到稳定路径。

## 五、风格入口为什么独立

当前版本先提供单一线性图标集。后续如果生成 outline、filled 等多风格形态，风格不会塞进一个运行时 `theme` 参数里临时切换，而会优先通过明确入口表达。

这样设计的原因是：

1. 更符合 Tree Shaking
   业务侧只引入实际用到的风格入口。

2. 类型更直接
   组件名仍然是稳定的 `Camera`，不会因为字符串参数丢失重构体验。

3. 生成链路更清晰
   outline、filled 可以在构建期分别生成，而不是把风格判断推迟到运行时。

前提也很明确：只有自动转换可靠时，才应该批量生成对应风格；转换不可靠的图标，应允许显式覆盖。

## 六、文档站为什么也走生成链路

文档站不是额外维护的一套“展示数据”，而是从图标源自动写出页面所需数据。

`docs/scripts/` 下的脚本主要负责生成：

- 图标节点数据
- 图标详情数据
- 分类元数据
- 业务图标分类与详情数据
- 相关图标关系
- 版本与发布信息
- 热度或排序相关数据

这样做的目的是统一事实来源：

- 图标加了分类，分类页自动变化
- 图标补了中文名，搜索和详情页自动变化
- 新版本打 tag，更新日志和首页版本信息自动变化

文档站只负责消费这些结果，不再手写维护同一份数据。

## 七、发布与版本策略

这个仓库的版本链路遵循一个原则：**Git tag / release 才是真实版本源**。

围绕这个原则，当前结构大致分成两部分：

### 1. 包发布

- npm 发布成功后，再把各包版本回写到仓库
- 包版本要和真实 release 保持一致

### 2. 文档展示

- 首页版本号从 tag / release 读取
- 更新日志优先读取 `changelogs/releases/v*.json` 中的双语版本说明
- 当前版本没有持久化说明时，才从 Git 历史与 tag 数据生成兜底内容
- 文档站部署独立于包发布，但版本展示要对齐同一来源

发布流程会在生成当前版本 release notes 后，把对应的 `changelogs/releases/vX.Y.Z.json` 提交回 `main`。这样后续文档构建即使没有 AI 能力，也会展示已经确认过的中文和英文变更说明，而不是重新回退到 commit 标题或 GitHub compare 页面。

这样可以避免文档显示一个版本、包里又是另一个版本的漂移问题。

## 八、为什么整体结构是现在这样

这套结构本质上是在平衡四件事：

1. **业务消费体验**
   组件名简单、类型稳定、按需引入成立。

2. **图标维护成本**
   源数据只维护一份，分类和中文信息有固定落点。

3. **多框架复用能力**
   React、Vue、Svelte、Solid、Static 等共用同一套图标事实来源。

4. **长期演进能力**
   可以持续引入上游修复、补充风格、扩展文档和发布链路，而不是每个层面各自散开。

如果后续继续演进，优先级也应保持一致：

- 先守住单一事实来源
- 再提升生成链路和校验能力
- 最后再考虑内部目录进一步收敛

这样调整，风险最小，也最符合这个仓库当前的真实状态。
