<script lang="ts" setup>
import { SANDBOX_TEMPLATES, type SandpackFiles } from 'sandpack-vue3';
import styledCSS from '../../sandpack-default.css?raw';
import Sandpack from './Sandpack.vue';

const props = defineProps<{
  files: SandpackFiles;
}>();

defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <Sandpack
    template="vite-svelte"
    :files="{
      ...SANDBOX_TEMPLATES['vite-svelte'].files,
      ...props.files,
      '/src/styles.css': {
        code: styledCSS,
        hidden: true,
      },
      '/src/main.js': {
        hidden: true,
        code: `import App from './App.svelte';
import './styles.css';

const app = new App({
  target: document.getElementById('app'),
});

export default app;
`,
      },
      '/vite.config.js': {
        hidden: true,
        code: `import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        compatibility: {
          componentApi: 4,
        },
      },
    }),
  ],
});
`,
      },
      '/package.json': {
        hidden: true,
        code: JSON.stringify(
          {
            type: 'module',
            scripts: {
              dev: 'vite',
            },
            dependencies: {
              svelte: '^5.38.6',
              '@ycloud-web/icons-svelte': 'latest',
            },
            devDependencies: {
              '@sveltejs/vite-plugin-svelte': '^4.0.4',
              vite: '4.2.2',
              'esbuild-wasm': '^0.17.19',
            },
          },
          null,
          2,
        ),
      },
    }"
  />
</template>
