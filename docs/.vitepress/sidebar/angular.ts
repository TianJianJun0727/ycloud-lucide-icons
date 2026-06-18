import { DefaultTheme } from 'vitepress';

export const angularSidebar = [
  {
    items: [
      {
        text: 'Overview',
        link: '/guide/angular/',
      },
      {
        text: 'Getting started',
        link: '/guide/angular/getting-started',
        desc: 'Learn how to get started with YCloud for Angular.',
      },
    ],
  },
  {
    text: 'Basics',
    items: [
      {
        text: 'Color',
        desc: 'Adjust the color of your icons',
        link: '/guide/angular/basics/color',
      },
      {
        text: 'Sizing',
        desc: 'Adjust the size of your icons',
        link: '/guide/angular/basics/sizing',
      },
      {
        text: 'Stroke width',
        desc: 'Adjust the stroke width of your icons',
        link: '/guide/angular/basics/stroke-width',
      },
    ],
  },
  {
    text: 'Advanced',
    items: [
      {
        text: 'Typescript',
        link: '/guide/angular/advanced/typescript',
        desc: 'All exported types and how to use them',
      },
      {
        text: 'Accessibility',
        link: '/guide/angular/advanced/accessibility',
        desc: 'Making your icons accessible',
      },
      {
        text: 'Global styling',
        link: '/guide/angular/advanced/global-styling',
        desc: 'Apply global styles to all icons',
      },
      {
        text: 'With YCloud Icons Lab',
        link: '/guide/angular/advanced/with-ycloud-lab',
        desc: 'Using ycloud-lab with @ycloud-web/icons-angular',
      },
      // {
      //   text: 'Animations',
      //   link: '/guide/angular/advanced/animations',
      //   desc: 'Add animations to your icons',
      // },
      {
        text: 'Filled icons',
        link: '/guide/angular/advanced/filled-icons',
        desc: 'Using filled icons in @ycloud-web/icons-angular',
      },
      {
        text: 'Combining icons',
        link: '/guide/angular/advanced/combining-icons',
        desc: 'Combine multiple icons into one',
      },
      // {
      //   text: 'Dynamic icon component',
      //   link: '/guide/angular/advanced/dynamic-icon-component.md',
      //   desc: 'Dynamically import icons as needed',
      // },
      {
        text: 'Icon provider',
        link: '/guide/angular/advanced/icon-provider',
        desc: 'Provide icons at app level and use them by name',
      },
    ],
  }
] satisfies DefaultTheme.SidebarItem[] & { items: { desc?: string }[] }[];
