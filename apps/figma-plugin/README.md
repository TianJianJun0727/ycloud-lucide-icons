# YCloud Icons 图标同步助手

这是 YCloud Icons 的 Figma 插件，用于从设计稿中提取 SVG 图标，并向当前图标库创建图标审核单。

## 本地开发

```bash
pnpm figma:dev
```

## 构建插件

```bash
pnpm figma:build
```

构建产物会写入 `apps/figma-plugin/build`，Figma 本地导入插件时选择：

```text
apps/figma-plugin/manifest.json
```

## 类型检查

```bash
pnpm figma:typecheck
```

## 发布素材

Figma 社区审核用的图标和封面素材放在：

```text
apps/figma-plugin/assets/figma-publish
```
