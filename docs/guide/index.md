---
title: 什么是 YCloud Icons？
description: 了解 YCloud Icons：面向 React、Vue 以及其他前端技术栈的多框架 SVG 图标工具集。
nextPage:
  - installation
---

# 什么是 YCloud Icons？

YCloud Icons 是 YCloud 品牌下的多框架 SVG 图标工具集，基于 [Lucide](https://github.com/lucide-icons/lucide) 二次开发，并保留上游 ISC 许可证与必要的第三方授权说明。

它延续了 Lucide 清晰、统一、可组合的线性图标体系，同时结合 YCloud 当前工程实际，调整了品牌资产、中文文档、包命名、发布流程和多框架消费方式。项目基于同一份图标源，提供可 Tree-shaking 的图标数据、强类型 React 组件、Vue 组件，以及面向常见前端运行时的包。

YCloud Icons 的目标不是重新发明一套图标格式，而是在成熟开源实现的基础上，形成一套可长期维护、可发布、可被业务项目稳定消费的图标基础设施。

## 可用图标

YCloud Icons 当前提供通用 outline 图标集、业务图标、插画和多框架包基础设施。filled 等风格变体属于后续路线，应在转换足够可靠后从标准化 SVG 源自动生成。

### 完整图标集

图标源保存在仓库中，并由构建流水线进行标准化处理。各框架包消费生成后的图标数据和组件，从而保持一致。

通用图标适合按钮、菜单和控件里的 24px 线性图标；业务图标适合产品、渠道、状态或业务对象的专有视觉；插画适合空状态、引导页、结果页和异常页等页面级视觉表达。

YCloud Icons 会持续跟随自身业务需求维护图标源。新增、修改或删除图标时，应优先保证 SVG 结构简洁、命名稳定、分类清晰，并通过生成脚本同步更新各框架包。

## 代码优化

除了设计，代码体积同样重要。图标这类资源可能显著增加 Web 项目的带宽和包体积。YCloud Icons 使用 SVG 优化和 ES Module 入口；经过 Tree-shaking 后，应用只会携带实际导入的图标。

## 无障碍

图标可以在不依赖文字的情况下传达含义，帮助用户快速理解界面信息。

但并不是所有用户都能轻松理解图标。更多说明请阅读[如何以无障碍方式使用 YCloud Icons](./accessibility.md)。

## 官方包

YCloud Icons 覆盖 10 种包类型：[Core JavaScript](./ycloud/index.md)、[React](./react/index.md)、[Vue](./vue/index.md)、[Svelte](./svelte/index.md)、[Solid](./solid/index.md)、[Preact](./preact/index.md)、[React Native](./react-native/index.md)、[Angular](./angular/index.md)、[Astro](./astro/index.md) 和 [Static assets](./static/index.md)。
