import { fileURLToPath, URL } from 'node:url';
import { DefaultTheme, defineConfig, UserConfig } from 'vitepress';
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons';
import sidebar from './sidebar';
import snackPlayer from './markdown/snackPlayer';
import sandpackPlugin from './markdown/sandpack';
import { readFile } from 'node:fs/promises';
import llmstxt from 'vitepress-plugin-llms';
import { transformPageData } from './transformPageData';
import getHeadConfig from './getHeadConfig';

const defaultSandpackCSS = await readFile(
  fileURLToPath(new URL('./theme/sandpack-default.css', import.meta.url)),
  'utf-8',
);

const title = 'YCloud Icons';
const socialTitle = 'YCloud Icons';
const description = '面向多框架项目的企业级 SVG 图标基础设施。';
const base = process.env.DOCS_BASE ?? (process.env.GITHUB_ACTIONS ? '/ycloud-icons/' : '/');

const nav = [
  { text: '图标', link: '/icons/' },
  { text: '指南', link: '/guide/' },
  { text: '架构', link: '/architecture' },
  { text: '包', link: '/packages' },
  { text: '更新日志', link: 'https://github.com/TianJianJun0727/ycloud-icons/releases' },
];

const sidebarText: Record<string, string> = {
  Introduction: '介绍',
  'What is YCloud?': '什么是 YCloud Icons？',
  Installation: '安装',
  Framework: '框架',
  Overview: '概览',
  'Getting started': '快速开始',
  Basics: '基础',
  Color: '颜色',
  Sizing: '尺寸',
  'Stroke width': '描边宽度',
  Advanced: '进阶',
  Typescript: 'TypeScript',
  Accessibility: '无障碍',
  'Global styling': '全局样式',
  'With YCloud Icons Lab': '使用 YCloud Icons Lab',
  'Filled icons': '填充图标',
  'Aliased Names': '别名',
  'Combining icons': '组合图标',
  'Dynamic icon component': '动态图标组件',
  'Shadow DOM': 'Shadow DOM',
  'Template element': '模板元素',
  'SVG Sprite': 'SVG Sprite',
  'Link as image': '作为图片链接',
  'Icon font': '图标字体',
};

const sidebarDesc: Record<string, string> = {
  'Learn how to get started with YCloud.': '了解如何开始使用 YCloud Icons。',
  'Learn how to get started with YCloud for React.': '了解如何在 React 中使用 YCloud Icons。',
  'Learn how to get started with YCloud for Vue.': '了解如何在 Vue 中使用 YCloud Icons。',
  'Adjust the color of your icons': '调整图标颜色。',
  'Adjust the size of your icons': '调整图标尺寸。',
  'Adjust the stroke width of your icons': '调整图标描边宽度。',
  'All exported types and how to use them': '导出的类型以及使用方式。',
  'Making your icons accessible': '让图标更易访问。',
  'Apply global styles to all icons': '为所有图标应用全局样式。',
  'Using ycloud-lab with @ycloud-web/icons-react':
    '在 @ycloud-web/icons-react 中使用 YCloud Icons Lab。',
  'Using ycloud-lab with @ycloud-web/icons-vue':
    '在 @ycloud-web/icons-vue 中使用 YCloud Icons Lab。',
  'Using ycloud-lab with ycloud': '在 ycloud 中使用 YCloud Icons Lab。',
  'Using filled icons in @ycloud-web/icons-react': '在 @ycloud-web/icons-react 中使用填充图标。',
  'Using filled icons in @ycloud-web/icons-vue': '在 @ycloud-web/icons-vue 中使用填充图标。',
  'Using filled icons in ycloud': '在 ycloud 中使用填充图标。',
  'Using aliased icon names': '使用图标别名。',
  'Combine multiple icons into one': '将多个图标组合为一个图标。',
  'Dynamically import icons as needed': '按需动态导入图标。',
};

function localizeSidebarItems(
  items: DefaultTheme.SidebarItem[] | undefined,
): DefaultTheme.SidebarItem[] | undefined {
  return items?.map((item) => ({
    ...item,
    text: item.text ? sidebarText[item.text] ?? item.text : item.text,
    desc:
      sidebarDesc[(item as DefaultTheme.SidebarItem & { desc?: string }).desc ?? ''] ??
      (item as DefaultTheme.SidebarItem & { desc?: string }).desc,
    items: localizeSidebarItems(item.items),
  }));
}

function localizeSidebar(source: DefaultTheme.Sidebar): DefaultTheme.Sidebar {
  return Object.fromEntries(
    Object.entries(source).map(([key, value]) => [
      key,
      localizeSidebarItems(value as DefaultTheme.SidebarItem[]),
    ]),
  );
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title,
  titleTemplate: ':title - YCloud Icons',
  description,
  base,
  cleanUrls: true,
  outDir: '.vercel/output/static',
  srcExclude: ['**/README.md'],
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin);
      md.use(snackPlayer);
      md.use(sandpackPlugin, {
        defaultFiles: {
          '/styles.css': {
            code: defaultSandpackCSS,
            hidden: true,
          },
        },
      });
    },
  },
  vite: {
    resolve: {
      alias: [
        {
          find: /^.*\/VPIconAlignLeft\.vue$/,
          replacement: fileURLToPath(
            new URL('./theme/components/overrides/VPIconAlignLeft.vue', import.meta.url),
          ),
        },
        {
          find: /^.*\/VPFooter\.vue$/,
          replacement: fileURLToPath(
            new URL('./theme/components/overrides/VPFooter.vue', import.meta.url),
          ),
        },
        {
          find: '~/.vitepress',
          replacement: fileURLToPath(new URL('./', import.meta.url)),
        },
      ],
    },
    plugins: [
      groupIconVitePlugin(),
      llmstxt({
        ignoreFiles: [
          'index.md',
          'packages.md',
          'icons/**', // Not working, need investigation
        ],
      }) as unknown as UserConfig['vite']['plugins'][0],
    ],
  },
  head: getHeadConfig({ title, description, socialTitle, base }),
  transformPageData,
  themeConfig: {
    logo: '/favicon.ico',
    nav,
    sidebar: localizeSidebar(sidebar),
    socialLinks: [{ icon: 'github', link: 'https://github.com/TianJianJun0727/ycloud-icons' }],
    footer: {
      message: '基于 ISC 许可证发布。',
      copyright: `版权所有 © ${new Date().getFullYear()} YCloud Icons`,
    },
    editLink: {
      pattern: 'https://github.com/TianJianJun0727/ycloud-icons/edit/main/docs/:path',
      text: '编辑此页',
    },
    outline: {
      label: '本页目录',
    },
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    skipToContentLabel: '跳到内容',
    darkModeSwitchLabel: '外观',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
  },
  sitemap: {
    hostname: 'https://tianjianjun0727.github.io/ycloud-icons/',
  },
});
