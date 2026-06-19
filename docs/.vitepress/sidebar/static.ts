import { DefaultTheme } from 'vitepress';

export const ycloudStaticSidebar = [
  {
    items: [
      {
        text: '概览',
        desc: '了解如何在项目中以静态资源方式使用 YCloud Icons。',
        link: '/guide/static/',
      },
      {
        text: '快速开始',
        link: '/guide/static/getting-started',
        desc: '了解如何使用 YCloud Icons 静态资源。',
      },
    ],
  },
  {
    text: 'SVG 文件和 Sprite',
    items: [
      {
        text: '以图片方式导入 SVG',
        desc: '在项目中以图片方式使用图标。',
        link: '/guide/static/link-as-image',
      },
      {
        text: 'SVG Sprite',
        desc: '在项目中使用 SVG Sprite。',
        link: '/guide/static/svg-sprite',
      },
    ],
  },
  {
    text: 'Icon Font',
    items: [
      {
        text: '以字体方式导入',
        desc: '在项目中以 Web Font 方式使用图标。',
        link: '/guide/static/font/',
      },
      {
        text: '颜色',
        desc: '调整图标颜色。',
        link: '/guide/static/font/color',
      },
      {
        text: '尺寸',
        desc: '调整图标尺寸。',
        link: '/guide/static/font/sizing',
      },
    ],
  },
  {
    text: 'SVG 字符串 JS 模块',
    items: [
      {
        text: '在 Node.js 中使用',
        desc: '在 Node.js 项目中使用 YCloud Icons。',
        link: '/guide/static/js-modules/node',
      },
      {
        text: '在 JavaScript 项目中使用',
        desc: '在 JavaScript 项目中使用 YCloud Icons。',
        link: '/guide/static/js-modules/web',
      },
    ],
  },
  {
    text: '进阶',
    items: [
      {
        text: '架构',
        link: '/guide/architecture',
        desc: 'YCloud Icons 仓库的组织方式与设计原因。',
      },
      {
        text: '图标设计指南',
        link: '/guide/icon-design-guide',
        desc: 'YCloud Icons 的设计规则与 SVG 代码约定。',
      },
      {
        text: '图标维护',
        link: '/guide/icon-maintenance',
        desc: '添加、修改和删除图标的维护流程。',
      },
    ],
  },
] satisfies DefaultTheme.SidebarItem[] & { items: { desc?: string }[] }[];
