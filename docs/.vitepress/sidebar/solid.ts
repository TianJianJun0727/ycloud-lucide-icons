import { DefaultTheme } from 'vitepress';

export const solidSidebar = [
  {
    items: [
      {
        text: 'Overview',
        link: '/guide/solid/',
      },
      {
        text: 'Getting started',
        link: '/guide/solid/getting-started',
        desc: 'Learn how to get started with YCloud.',
      },
    ],
  },
  {
    text: 'Basics',
    items: [
      {
        text: 'Color',
        desc: 'Adjust the color of your icons',
        link: '/guide/solid/basics/color',
      },
      {
        text: 'Sizing',
        desc: 'Adjust the size of your icons',
        link: '/guide/solid/basics/sizing',
      },
      {
        text: 'Stroke width',
        desc: 'Adjust the stroke width of your icons',
        link: '/guide/solid/basics/stroke-width',
      },
    ],
  },
  {
    text: 'Advanced',
    items: [
      {
        text: 'Typescript',
        link: '/guide/solid/advanced/typescript',
        desc: 'All exported types and how to use them',
      },
      {
        text: 'Accessibility',
        link: '/guide/solid/advanced/accessibility',
        desc: 'Making your icons accessible',
      },
      {
        text: 'Global styling',
        link: '/guide/solid/advanced/global-styling',
        desc: 'Apply global styles to all icons',
      },
      {
        text: 'With YCloud Lab',
        link: '/guide/solid/advanced/with-ycloud-lab',
        desc: 'Using ycloud-lab with @ycloud-web/icons-solid',
      },
      // {
      //   text: 'Animations',
      //   link: '/guide/solid/advanced/animations',
      //   desc: 'Add animations to your icons',
      // },
      {
        text: 'Filled icons',
        link: '/guide/solid/advanced/filled-icons',
        desc: 'Using filled icons in @ycloud-web/icons-solid',
      },
      {
        text: 'Aliased Names',
        link: '/guide/solid/advanced/aliased-names',
        desc: 'Using aliased icon names',
      },
      // Add support for this later
      // {
      //   text: 'Combining icons',
      //   link: '/guide/solid/advanced/combining-icons',
      //   desc: 'Combine multiple icons into one',
      // },
    ],
  }
] satisfies DefaultTheme.SidebarItem[] & { items: { desc?: string }[] }[];
