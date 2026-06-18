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

type Sidebar = UserConfig<DefaultTheme.Config>['themeConfig']['sidebar'];

export const guideSidebarTop: DefaultTheme.SidebarItem[] = [
  {
    text: 'Introduction',
    items: [
      { text: 'What is YCloud?', link: '/guide/' },
      { text: 'Installation', link: '/guide/installation' },
    ],
  },
];

const sidebar: Sidebar = {
  '/guide': [{ text: '', link: '/' }],
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
  // This should be here to keep the sidebar shown on the icons page
  icons: [{ text: '', link: '/' }],
};

export default sidebar;
