import { DefaultTheme } from 'vitepress';

export const reactNativeSidebar = [
  {
    items: [
      {
        text: 'Overview',
        link: '/guide/react-native/',
      },
      {
        text: 'Getting started',
        link: '/guide/react-native/getting-started',
        desc: 'Learn how to get started with YCloud React Native',
      },
    ],
  },
  {
    text: 'Basics',
    items: [
      {
        text: 'Color',
        desc: 'Adjust the color of your icons',
        link: '/guide/react-native/basics/color',
      },
      {
        text: 'Sizing',
        desc: 'Adjust the size of your icons',
        link: '/guide/react-native/basics/sizing',
      },
      {
        text: 'Stroke width',
        desc: 'Adjust the stroke width of your icons',
        link: '/guide/react-native/basics/stroke-width',
      },
    ],
  },
  {
    text: 'Advanced',
    items: [
      {
        text: 'Typescript',
        link: '/guide/react-native/advanced/typescript',
        desc: 'All exported types and how to use them',
      },
      {
        text: 'Global styling',
        link: '/guide/react-native/advanced/global-styling',
        desc: 'Apply global styles to all icons',
      },
      {
        text: 'With YCloud Icons Lab',
        link: '/guide/react-native/advanced/with-ycloud-lab',
        desc: 'Using ycloud-lab with @ycloud-web/icons-react-native',
      },
      {
        text: 'Filled icons',
        link: '/guide/react-native/advanced/filled-icons',
        desc: 'Using filled icons in @ycloud-web/icons-react-native',
      },
      {
        text: 'Aliased Names',
        link: '/guide/react-native/advanced/aliased-names',
        desc: 'Using aliased icon names',
      },
      {
        text: 'Combining icons',
        link: '/guide/react-native/advanced/combining-icons',
        desc: 'Combine multiple icons into one',
      },
    ],
  }
] satisfies DefaultTheme.SidebarItem[] & { items: { desc?: string }[] }[];
