import { fileURLToPath, URL } from 'node:url';
import { defineConfig, UserConfig } from 'vitepress';
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
const description = 'A multi-framework icon toolkit based on the YCloud Icons ecosystem.';
const base = process.env.DOCS_BASE ?? (process.env.GITHUB_ACTIONS ? '/ycloud-icons/' : '/');

const nav = (prefix = '') => [
  { text: 'Icons', link: '/icons/' },
  { text: 'Guide', link: `${prefix}/guide/` },
  { text: 'Architecture', link: `${prefix}/architecture` },
  { text: 'Packages', link: `${prefix}/packages` },
  { text: 'GitHub', link: 'https://github.com/TianJianJun0727/ycloud-icons' },
];

const zhNav = [
  { text: '图标', link: '/icons/' },
  { text: '指南', link: '/zh/guide/' },
  { text: '架构', link: '/zh/architecture' },
  { text: '包', link: '/zh/packages' },
  { text: 'GitHub', link: 'https://github.com/TianJianJun0727/ycloud-icons' },
];

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'en-US',
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
    nav: nav(),
    sidebar,
    socialLinks: [{ icon: 'github', link: 'https://github.com/TianJianJun0727/ycloud-icons' }],
    footer: {
      message: 'Released under the ISC License.',
      copyright: `Copyright © ${new Date().getFullYear()} YCloud Icons`,
    },
    editLink: {
      pattern: 'https://github.com/TianJianJun0727/ycloud-icons/edit/main/docs/:path',
    },
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      title,
      description,
      themeConfig: {
        nav: nav(),
        sidebar,
      },
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'YCloud Icons',
      description: '面向多框架项目的企业级 SVG 图标基础设施。',
      themeConfig: {
        nav: zhNav,
        sidebar: {
          '/zh/guide': [
            {
              text: '指南',
              items: [
                { text: '介绍', link: '/zh/guide/' },
                { text: '安装', link: '/zh/guide/installation' },
              ],
            },
          ],
          '/zh/architecture': [
            {
              text: '架构',
              items: [{ text: '架构', link: '/zh/architecture' }],
            },
          ],
          '/zh/packages': [
            {
              text: '包',
              items: [{ text: '包', link: '/zh/packages' }],
            },
          ],
        },
        outline: {
          label: '本页目录',
        },
        docFooter: {
          prev: '上一页',
          next: '下一页',
        },
        darkModeSwitchLabel: '外观',
        sidebarMenuLabel: '菜单',
        returnToTopLabel: '返回顶部',
        langMenuLabel: '切换语言',
        footer: {
          message: '基于 ISC 协议发布。',
          copyright: `Copyright © ${new Date().getFullYear()} YCloud Icons`,
        },
      },
    },
  },
  sitemap: {
    hostname: 'https://tianjianjun0727.github.io/ycloud-icons/',
  },
});
