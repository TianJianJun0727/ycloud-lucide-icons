import { DefaultTheme } from 'vitepress';

export const ycloudStaticSidebar = [
  {
    items: [
      {
        text: 'Overview',
        desc: 'Overview of using YCloud icons as static assets in your projects',
        link: '/guide/static/',
      },
      {
        text: 'Getting started',
        link: '/guide/static/getting-started',
        desc: 'Learn how to get started with YCloud static.',
      },
    ],
  },
  {
    text: 'SVG Files & Sprite',
    items: [
      {
        text: 'Import SVG files as images',
        desc: 'Use icons as images in your project',
        link: '/guide/static/link-as-image',
      },
      {
        text: 'SVG Sprite',
        desc: 'Use SVG sprites in your project',
        link: '/guide/static/svg-sprite',
      },
    ],
  },
  {
    text: 'Icon Font',
    items: [
      {
        text: 'Import as font',
        desc: 'Use icons as a web font in your project',
        link: '/guide/static/font/',
      },
      {
        text: 'Color',
        desc: 'Adjust the color of your icons',
        link: '/guide/static/font/color',
      },
      {
        text: 'Sizing',
        desc: 'Adjust the size of your icons',
        link: '/guide/static/font/sizing',
      },
    ],
  },
  {
    text: 'SVG String JS modules',
    items: [
      {
        text: 'Use in Node.js',
        desc: 'Use YCloud in your Node.js projects',
        link: '/guide/static/js-modules/node',
      },
      {
        text: 'Use in JS projects',
        desc: 'Use YCloud in your JavaScript projects',
        link: '/guide/static/js-modules/web',
      },
    ],
  }
] satisfies DefaultTheme.SidebarItem[] & { items: { desc?: string }[] }[];
