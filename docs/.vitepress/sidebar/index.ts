import { DefaultTheme, UserConfig } from 'vitepress';
import { reactSidebar } from './react';
import { vueSidebar } from './vue';
import { svelteSidebar } from './svelte';
import { ycloudSidebar } from './ycloud';
import { solidSidebar } from './solid';
import { preactSidebar } from './preact';
import { reactNativeSidebar } from './react-native';
import { astroSidebar } from './astro';
import { angularSidebar } from './angular';
import { ycloudStaticSidebar } from './static';
import changelogSidebarItems from '../data/changelogSidebar';

export type DocsLocale = 'zh' | 'en';

type Sidebar = UserConfig<DefaultTheme.Config>['themeConfig']['sidebar'];
type SidebarItemWithDesc = DefaultTheme.SidebarItem & { desc?: string };

const localePrefix: Record<DocsLocale, string> = {
  zh: '',
  en: '/en',
};

const zhText: Record<string, string> = {
  Introduction: '介绍',
  'What is YCloud Icons?': '什么是 YCloud Icons？',
  Installation: '安装',
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
  'Filled icons': '填充图标',
  'Aliased Names': '别名',
  'Combining icons': '组合图标',
  'Dynamic icon component': '动态图标组件',
  'Icon provider': '图标 Provider',
  'SVG Files & Sprite': 'SVG 文件和 Sprite',
  'Import SVG files as images': '以图片方式导入 SVG',
  'SVG Sprite': 'SVG Sprite',
  'Icon Font': 'Icon Font',
  'Import as font': '以字体方式导入',
  'SVG String JS modules': 'SVG 字符串 JS 模块',
  'Use in Node.js': '在 Node.js 中使用',
  'Use in JS projects': '在 JavaScript 项目中使用',
  'Shadow DOM': 'Shadow DOM',
  'Template element': '模板元素',
  'Icon design guide': '图标设计指南',
  'Icon maintenance': '图标维护',
  'Business icons': '业务图标',
  Architecture: '架构',
  Changelog: '版本记录',
};

const zhDesc: Record<string, string> = {
  'Learn how to get started with YCloud Icons.': '了解如何开始使用 YCloud Icons。',
  'Learn how to get started with YCloud for Angular.': '了解如何在 Angular 中使用 YCloud Icons。',
  'Learn how to get started with YCloud for Astro.': '了解如何在 Astro 中使用 YCloud Icons。',
  'Learn how to get started with YCloud for Preact.': '了解如何在 Preact 中使用 YCloud Icons。',
  'Learn how to get started with YCloud React Native':
    '了解如何在 React Native 中使用 YCloud Icons。',
  'Learn how to get started with YCloud for React.': '了解如何在 React 中使用 YCloud Icons。',
  'Learn how to get started with YCloud for Svelte.': '了解如何在 Svelte 中使用 YCloud Icons。',
  'Learn how to get started with YCloud for Vue.': '了解如何在 Vue 中使用 YCloud Icons。',
  'Learn how to get started with YCloud static assets.': '了解如何使用 YCloud Icons 静态资源。',
  'Adjust the color of your icons.': '调整图标颜色。',
  'Adjust the size of your icons.': '调整图标尺寸。',
  'Adjust the stroke width of your icons.': '调整图标描边宽度。',
  'All exported types and how to use them.': '导出的类型以及使用方式。',
  'Making your icons accessible.': '让图标更易访问。',
  'Apply global styles to all icons.': '为所有图标应用全局样式。',
  'Apply options and styles globally.': '全局应用选项和样式。',
  'Using filled icons in @ycloud-web/icons-angular.':
    '在 @ycloud-web/icons-angular 中使用填充图标。',
  'Using filled icons in @ycloud-web/icons-preact.': '在 @ycloud-web/icons-preact 中使用填充图标。',
  'Using filled icons in @ycloud-web/icons-react-native.':
    '在 @ycloud-web/icons-react-native 中使用填充图标。',
  'Using filled icons in @ycloud-web/icons-react.': '在 @ycloud-web/icons-react 中使用填充图标。',
  'Using filled icons in @ycloud-web/icons-solid.': '在 @ycloud-web/icons-solid 中使用填充图标。',
  'Using filled icons in @ycloud-web/icons-svelte.': '在 @ycloud-web/icons-svelte 中使用填充图标。',
  'Using filled icons in @ycloud-web/icons-vue.': '在 @ycloud-web/icons-vue 中使用填充图标。',
  'Using filled icons in ycloud.': '在 ycloud 中使用填充图标。',
  'Using aliased icon names.': '使用图标别名。',
  'Combine multiple icons into one.': '将多个图标组合为一个图标。',
  'Dynamically import icons as needed.': '按需动态导入图标。',
  'Provide icons at app level and use them by name.': '在应用层提供图标并按名称使用。',
  'Overview of using YCloud Icons as static assets in your projects.':
    '了解如何在项目中以静态资源方式使用 YCloud Icons。',
  'Use icons as images in your project.': '在项目中以图片方式使用图标。',
  'Use SVG sprites in your project.': '在项目中使用 SVG Sprite。',
  'Use icons as a web font in your project.': '在项目中以 Web Font 方式使用图标。',
  'Use YCloud Icons in your Node.js projects.': '在 Node.js 项目中使用 YCloud Icons。',
  'Use YCloud Icons in your JavaScript projects.': '在 JavaScript 项目中使用 YCloud Icons。',
  'Using content template element with YCloud Icons.': '在 YCloud Icons 中使用内容模板元素。',
  'Design rules and SVG conventions for YCloud Icons.': 'YCloud Icons 的设计规则与 SVG 代码约定。',
  'How the YCloud Icons repository is organized and why.':
    'YCloud Icons 仓库的组织方式与设计原因。',
  'Add, update, and remove icons in the repository.': '添加、修改和删除图标的维护流程。',
  'Source, validation, and submission rules for business-specific SVG icons.':
    '业务专有 SVG 图标的存放、校验和提交规则。',
};

const baseGuideSidebarTop: DefaultTheme.SidebarItem[] = [
  {
    text: 'Introduction',
    items: [
      { text: 'What is YCloud Icons?', link: '/guide/' },
      { text: 'Installation', link: '/guide/installation' },
    ],
  },
];

const baseGuideRootSidebar: DefaultTheme.SidebarItem[] = [...baseGuideSidebarTop];

function getChangelogSidebar(locale: DocsLocale): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Changelog',
      items: changelogSidebarItems.map((item) => ({
        ...item,
        link: item.link,
      })),
    },
  ];
}

function withGuideMaintenanceItems(source: Sidebar): Sidebar {
  return Object.fromEntries(
    Object.entries(source).map(([key, value]) => [
      key,
      (value as DefaultTheme.SidebarItem[]).map((item) => {
        if (item.text !== 'Advanced') return item;

        const items = item.items ?? [];
        const hasGuide = items.some((child) => child.link === '/guide/icon-design-guide');
        const hasMaintenance = items.some((child) => child.link === '/guide/icon-maintenance');
        const hasArchitecture = items.some((child) => child.link === '/guide/architecture');
        const hasBusinessIcons = items.some((child) => child.link === '/guide/business-icons');

        return {
          ...item,
          items: [
            ...items,
            ...(!hasArchitecture
              ? [
                  {
                    text: 'Architecture',
                    link: '/guide/architecture',
                    desc: 'How the YCloud Icons repository is organized and why.',
                  },
                ]
              : []),
            ...(!hasGuide
              ? [
                  {
                    text: 'Icon design guide',
                    link: '/guide/icon-design-guide',
                    desc: 'Design rules and SVG conventions for YCloud Icons.',
                  },
                ]
              : []),
            ...(!hasMaintenance
              ? [
                  {
                    text: 'Icon maintenance',
                    link: '/guide/icon-maintenance',
                    desc: 'Add, update, and remove icons in the repository.',
                  },
                ]
              : []),
            ...(!hasBusinessIcons
              ? [
                  {
                    text: 'Business icons',
                    link: '/guide/business-icons',
                    desc: 'Source, validation, and submission rules for business-specific SVG icons.',
                  },
                ]
              : []),
          ],
        };
      }),
    ]),
  );
}

function localizeSidebarItems(
  items: DefaultTheme.SidebarItem[] | undefined,
  locale: DocsLocale,
): DefaultTheme.SidebarItem[] | undefined {
  return items?.map((item) => ({
    ...item,
    text: item.text && locale === 'zh' ? (zhText[item.text] ?? item.text) : item.text,
    desc:
      locale === 'zh'
        ? (zhDesc[(item as SidebarItemWithDesc).desc ?? ''] ?? (item as SidebarItemWithDesc).desc)
        : (item as SidebarItemWithDesc).desc,
    items: localizeSidebarItems(item.items, locale),
  }));
}

function prefixSidebarItems(
  items: DefaultTheme.SidebarItem[] | undefined,
  prefix: string,
): DefaultTheme.SidebarItem[] | undefined {
  return items?.map((item) => ({
    ...item,
    link: item.link?.startsWith('/') ? `${prefix}${item.link}` : item.link,
    items: prefixSidebarItems(item.items, prefix),
  }));
}

function prefixSidebar(source: Sidebar, locale: DocsLocale): Sidebar {
  const prefix = localePrefix[locale];

  if (!prefix) return source;

  return Object.fromEntries(
    Object.entries(source).map(([key, value]) => [
      key.startsWith('/') ? `${prefix}${key}` : key,
      prefixSidebarItems(value as DefaultTheme.SidebarItem[], prefix),
    ]),
  );
}

function getBaseSidebar(locale: DocsLocale): Sidebar {
  return withGuideMaintenanceItems({
    '/guide/': baseGuideRootSidebar,
    '/guide/ycloud/': ycloudSidebar,
    '/guide/react/': reactSidebar,
    '/guide/vue/': vueSidebar,
    '/guide/svelte/': svelteSidebar,
    '/guide/solid/': solidSidebar,
    '/guide/astro/': astroSidebar,
    '/guide/preact/': preactSidebar,
    '/guide/react-native/': reactNativeSidebar,
    '/guide/angular/': angularSidebar,
    '/guide/static/': ycloudStaticSidebar,
    '/changelog': getChangelogSidebar(locale),
    '/icons/': [{ text: '', link: '/icons/' }],
  });
}

export function createGuideSidebarTop(locale: DocsLocale): DefaultTheme.SidebarItem[] {
  const localized = localizeSidebarItems(baseGuideSidebarTop, locale) ?? [];
  return prefixSidebarItems(localized, localePrefix[locale]) ?? [];
}

export function createSidebar(locale: DocsLocale): Sidebar {
  const localized = Object.fromEntries(
    Object.entries(getBaseSidebar(locale)).map(([key, value]) => [
      key,
      localizeSidebarItems(value as DefaultTheme.SidebarItem[], locale),
    ]),
  );

  return prefixSidebar(localized, locale);
}

const sidebar = createSidebar('zh');

export const guideSidebarTop = createGuideSidebarTop('zh');
export const sidebars = {
  zh: sidebar,
  en: createSidebar('en'),
};

export default sidebar;
