export default defineNitroConfig({
  compatibilityDate: '2026-02-26',
  preset: 'vercel',
  srcDir: '.vitepress',
  ignore: ['.vitepress/plugins'],
  routeRules: {
    '/api/**': { cors: false },
  },
  esbuild: {
    options: {
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
    },
  },
  rollupConfig: {
    onwarn(warning, rollupWarn) {
      const message = warning.message ?? '';
      const id = warning.id ?? '';
      const isYCloudReactSource =
        id.includes('packages/ycloud-react/src/') || message.includes('packages/ycloud-react/src/');

      if (
        warning.code === 'MODULE_LEVEL_DIRECTIVE' &&
        message.includes('"use client"') &&
        isYCloudReactSource
      ) {
        return;
      }

      if (
        warning.code === 'SOURCEMAP_ERROR' &&
        message.includes("Can't resolve original location") &&
        isYCloudReactSource
      ) {
        return;
      }

      if (
        ['CIRCULAR_DEPENDENCY', 'EVAL'].includes(warning.code || '') ||
        message.includes('Unsupported source map comment')
      ) {
        return;
      }

      rollupWarn(warning);
    },
  },
});
