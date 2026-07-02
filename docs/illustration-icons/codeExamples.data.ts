import { highLightCode } from '../.vitepress/lib/codeExamples/createCodeExamples';

const getIllustrationCodes = () => [
  {
    language: 'html',
    title: 'Vanilla',
    code: `<script type="module">
import illustrationUrl from '@ycloud-web/icons-static/illustration-icons/$Name.svg';

document.querySelector('#$Name').src = illustrationUrl;
</script>

<img id="$Name" alt="" width="100%">
`,
  },
  {
    language: 'tsx',
    title: 'React',
    code: `import { $PascalCase } from '@ycloud-web/icons-react/illustration';

const App = () => {
  return (
    <$PascalCase width="100%" height="auto" />
  );
};

export default App;
`,
  },
  {
    language: 'vue',
    title: 'Vue',
    code: `<script setup>
import { $PascalCase } from '@ycloud-web/icons-vue/illustration';
</script>

<template>
  <$PascalCase width="100%" height="auto" />
</template>
`,
  },
  {
    language: 'svelte',
    title: 'Svelte',
    code: `<script>
import { $PascalCase } from '@ycloud-web/icons-svelte/illustration';
</script>

<$PascalCase width="100%" height="auto" />
`,
  },
  {
    language: 'tsx',
    title: 'Preact',
    code: `import { $PascalCase } from '@ycloud-web/icons-preact/illustration';

const App = () => {
  return (
    <$PascalCase width="100%" height="auto" />
  );
};

export default App;
`,
  },
  {
    language: 'tsx',
    title: 'Solid',
    code: `import { $PascalCase } from '@ycloud-web/icons-solid/illustration';

const App = () => {
  return (
    <$PascalCase width="100%" height="auto" />
  );
};

export default App;
`,
  },
  {
    language: 'html',
    title: 'Angular',
    code: `<!-- app.component.ts -->
import illustrationUrl from '@ycloud-web/icons-static/illustration-icons/$Name.svg';

iconUrl = illustrationUrl;

<!-- app.component.html -->
<img [src]="iconUrl" alt="" />`,
  },
];

export default {
  async load() {
    const codeExamples = await Promise.all(
      getIllustrationCodes().map(async ({ title, language, code }, index) => ({
        title,
        language,
        code: await highLightCode(code, language, index === 0),
      })),
    );

    return {
      codeExamples,
    };
  },
};
