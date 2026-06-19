import { DefaultTheme } from 'vitepress';

export const preactSidebar = [
  {
    items: [
      {
        text: 'Overview',
        link: '/guide/preact/',
      },
      {
        text: 'Getting started',
        link: '/guide/preact/getting-started',
        desc: 'Learn how to get started with YCloud for PReact.',
      },
    ],
  },
  {
    text: 'Basics',
    items: [
      {
        text: 'Color',
        desc: 'Adjust the color of your icons',
        link: '/guide/preact/basics/color',
      },
      {
        text: 'Sizing',
        desc: 'Adjust the size of your icons',
        link: '/guide/preact/basics/sizing',
      },
      {
        text: 'Stroke width',
        desc: 'Adjust the stroke width of your icons',
        link: '/guide/preact/basics/stroke-width',
      },
    ],
  },
  {
    text: 'Advanced',
    items: [
      {
        text: 'Typescript',
        link: '/guide/preact/advanced/typescript',
        desc: 'All exported types and how to use them',
      },
      {
        text: 'Accessibility',
        link: '/guide/preact/advanced/accessibility',
        desc: 'Making your icons accessible',
      },
      {
        text: 'Global styling',
        link: '/guide/preact/advanced/global-styling',
        desc: 'Apply global styles to all icons',
      },
      // {
      //   text: 'Animations',
      //   link: '/guide/preact/advanced/animations',
      //   desc: 'Add animations to your icons',
      // },
      {
        text: 'Filled icons',
        link: '/guide/preact/advanced/filled-icons',
        desc: 'Using filled icons in @ycloud-web/icons-preact',
      },
      {
        text: 'Aliased Names',
        link: '/guide/preact/advanced/aliased-names',
        desc: 'Using aliased icon names',
      },
      {
        text: 'Combining icons',
        link: '/guide/preact/advanced/combining-icons',
        desc: 'Combine multiple icons into one',
      },
    ],
  },
] satisfies DefaultTheme.SidebarItem[] & { items: { desc?: string }[] }[];
