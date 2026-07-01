import { fileURLToPath, URL } from 'node:url';
import { DefaultTheme, defineConfig, UserConfig } from 'vitepress';
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons';
import { createSidebar } from './sidebar';
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
const zhDescription = '面向多框架项目的企业级 SVG 图标基础设施。';
const enDescription = 'Enterprise-grade SVG icon infrastructure for multi-framework projects.';
const base = process.env.DOCS_BASE ?? (process.env.GITHUB_ACTIONS ? '/ycloud-icons/' : '/');

const zhNav = [
  { text: '图标', link: '/icons/' },
  { text: '业务图标', link: '/business-icons/' },
  { text: '插画', link: '/illustration-icons/' },
  { text: '指南', link: '/guide/' },
  { text: '包', link: '/packages' },
  { text: '更新日志', link: '/changelog' },
];

const enNav = [
  { text: 'Icons', link: '/en/icons/' },
  { text: 'Business icons', link: '/en/business-icons/' },
  { text: 'Illustrations', link: '/en/illustration-icons/' },
  { text: 'Guide', link: '/en/guide/' },
  { text: 'Packages', link: '/en/packages' },
  { text: 'Changelog', link: '/en/changelog' },
];

function filterLlmsSidebarItems(
  items: DefaultTheme.SidebarItem[] | undefined,
): DefaultTheme.SidebarItem[] | undefined {
  const filtered = items
    ?.filter((item) => !(item.link?.includes('#') ?? false))
    .map((item) => ({
      ...item,
      items: filterLlmsSidebarItems(item.items),
    }))
    .filter((item) => item.link || (item.items?.length ?? 0) > 0);

  return filtered?.length ? filtered : undefined;
}

function createLlmsSidebar(source: DefaultTheme.Sidebar): DefaultTheme.Sidebar {
  return Object.fromEntries(
    Object.entries(source).flatMap(([key, value]) => {
      const filtered = filterLlmsSidebarItems(value as DefaultTheme.SidebarItem[]);

      return filtered ? [[key, filtered]] : [];
    }),
  );
}

const zhSidebar = createSidebar('zh') as DefaultTheme.Sidebar;
const enSidebar = createSidebar('en') as DefaultTheme.Sidebar;
const llmsSidebar = createLlmsSidebar(zhSidebar);
const isLlmsEnabled = process.env.DOCS_LLMS === '1';
const isMetaChunkEnabled = process.env.DOCS_META_CHUNK === '1';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title,
  titleTemplate: ':title - YCloud Icons',
  description: zhDescription,
  base,
  cleanUrls: true,
  metaChunk: isMetaChunkEnabled,
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
        {
          find: '@theme',
          replacement: fileURLToPath(new URL('./theme', import.meta.url)),
        },
        {
          find: '@data',
          replacement: fileURLToPath(new URL('./data', import.meta.url)),
        },
        {
          find: '@lib',
          replacement: fileURLToPath(new URL('./lib', import.meta.url)),
        },
        {
          find: '@tools',
          replacement: fileURLToPath(new URL('../../tools', import.meta.url)),
        },
        {
          find: '@packages',
          replacement: fileURLToPath(new URL('../../packages', import.meta.url)),
        },
      ],
    },
    build: {
      chunkSizeWarningLimit: 1800,
      rollupOptions: {
        onwarn(warning, defaultHandler) {
          const message = warning.message ?? '';
          const id = warning.id ?? '';

          if (
            warning.code === 'MODULE_LEVEL_DIRECTIVE' &&
            message.includes('"use client"') &&
            (id.includes('packages/icons-react/src/') ||
              message.includes('packages/icons-react/src/'))
          ) {
            return;
          }

          if (
            warning.code === 'SOURCEMAP_ERROR' &&
            message.includes("Can't resolve original location") &&
            (id.includes('packages/icons-react/src/') ||
              message.includes('packages/icons-react/src/'))
          ) {
            return;
          }

          if (
            warning.code === 'INVALID_ANNOTATION' &&
            message.includes('#__PURE__') &&
            id.includes('/node_modules/') &&
            id.includes('@vueuse/core')
          ) {
            return;
          }

          defaultHandler(warning);
        },
      },
    },
    plugins: [
      groupIconVitePlugin(),
      ...(isLlmsEnabled
        ? [
            llmstxt({
              ignoreFiles: [
                'index.md',
                'packages.md',
                'icons/**', // Not working, need investigation
                'en/icons/**',
              ],
              sidebar: llmsSidebar,
            }) as unknown as UserConfig['vite']['plugins'][0],
          ]
        : []),
    ],
  },
  head: getHeadConfig({ title, socialTitle, base }),
  transformPageData,
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title,
      description: zhDescription,
      themeConfig: {
        nav: zhNav,
        sidebar: zhSidebar,
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
        langMenuLabel: '切换语言',
        search: {
          provider: 'local',
          options: {
            translations: {
              button: {
                buttonText: '搜索',
                buttonAriaLabel: '搜索',
              },
              modal: {
                displayDetails: '显示详细列表',
                resetButtonTitle: '重置搜索',
                backButtonTitle: '关闭搜索',
                noResultsText: '没有结果',
                footer: {
                  selectText: '选择',
                  selectKeyAriaLabel: '输入',
                  navigateText: '导航',
                  navigateUpKeyAriaLabel: '上箭头',
                  navigateDownKeyAriaLabel: '下箭头',
                  closeText: '关闭',
                  closeKeyAriaLabel: 'esc',
                },
              },
            },
          },
        },
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      title,
      description: enDescription,
      themeConfig: {
        nav: enNav,
        sidebar: enSidebar,
        footer: {
          message: 'Released under the ISC License.',
          copyright: `Copyright © ${new Date().getFullYear()} YCloud Icons`,
        },
        editLink: {
          pattern: 'https://github.com/TianJianJun0727/ycloud-icons/edit/main/docs/:path',
          text: 'Edit this page',
        },
        outline: {
          label: 'On this page',
        },
        docFooter: {
          prev: 'Previous page',
          next: 'Next page',
        },
        skipToContentLabel: 'Skip to content',
        darkModeSwitchLabel: 'Appearance',
        sidebarMenuLabel: 'Menu',
        returnToTopLabel: 'Return to top',
        langMenuLabel: 'Change language',
      },
    },
  },
  themeConfig: {
    logo: '/logo-icon.svg',
    nav: zhNav,
    sidebar: zhSidebar,
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
