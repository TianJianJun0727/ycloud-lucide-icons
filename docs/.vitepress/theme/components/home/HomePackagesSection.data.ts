export default {
  async load() {
    return {
      packages: [
        {
          name: '@ycloud-web/icons',
          logo: '/framework-logos/js.svg',
          label: 'YCloud documentation for JavaScript',
          path: '/guide/ycloud/',
        },
        {
          name: '@ycloud-web/icons-react',
          logo: '/framework-logos/react.svg',
          label: 'YCloud documentation for React',
          path: '/guide/react/',
        },
        {
          name: '@ycloud-web/icons-vue',
          logo: '/framework-logos/vue.svg',
          label: 'YCloud documentation for Vue',
          path: '/guide/vue/',
        },
        {
          name: '@ycloud-web/icons-svelte',
          logo: '/framework-logos/svelte.svg',
          label: 'YCloud documentation for Svelte',
          path: '/guide/svelte/',
        },
        {
          name: '@ycloud-web/icons-solid',
          logo: '/framework-logos/solid.svg',
          label: 'YCloud documentation for Solid',
          path: '/guide/solid/',
        },
        {
          name: '@ycloud-web/icons-preact',
          logo: '/framework-logos/preact.svg',
          label: 'YCloud documentation for Preact',
          path: '/guide/preact/',
        },
        {
          name: '@ycloud-web/icons-angular',
          logo: '/framework-logos/angular.svg',
          label: 'YCloud documentation for Angular',
          path: '/guide/angular/',
        },
        {
          name: '@ycloud-web/icons-astro',
          logo: '/framework-logos/astro.svg',
          logoDark: '/framework-logos/astro-dark.svg',
          label: 'YCloud documentation for Astro',
          path: '/guide/astro/',
        },
        {
          name: '@ycloud-web/icons-react-native',
          logo: '/framework-logos/react-native.svg',
          label: 'YCloud documentation for React Native',
          path: '/guide/react-native/',
        },
      ],
    };
  },
};
