import { highLightCode } from './createCodeExamples';

type CodeExampleType = {
  title: string;
  language: string;
  code: string;
}[];

const getBusinessIconCodes = (): CodeExampleType => [
  {
    language: 'html',
    title: 'Vanilla',
    code: `<script type="module">
import { $CamelCaseDataUri } from '@ycloud-web/icons/business';

document.querySelector('#$Name').src = $CamelCaseDataUri;
</script>

<img id="$Name" alt="" width="24" height="24">`,
  },
  {
    language: 'tsx',
    title: 'React',
    code: `import { $PascalCase } from '@ycloud-web/icons-react/business';

const App = () => {
  return (
    <$PascalCase size={24} />
  );
};

export default App;
`,
  },
  {
    language: 'vue',
    title: 'Vue',
    code: `<script setup>
import { $PascalCase } from '@ycloud-web/icons-vue/business';
</script>

<template>
  <$PascalCase :size="24" />
</template>
`,
  },
  {
    language: 'svelte',
    title: 'Svelte',
    code: `<script>
import { $PascalCase } from '@ycloud-web/icons-svelte/business';
</script>

<$PascalCase size={24} />
`,
  },
  {
    language: 'tsx',
    title: 'Preact',
    code: `import { $PascalCase } from '@ycloud-web/icons-preact/business';

const App = () => {
  return (
    <$PascalCase size={24} />
  );
};

export default App;
`,
  },
  {
    language: 'tsx',
    title: 'Solid',
    code: `import { $PascalCase } from '@ycloud-web/icons-solid/business';

const App = () => {
  return (
    <$PascalCase size={24} />
  );
};

export default App;
`,
  },
  {
    language: 'html',
    title: 'Angular',
    code: `<!-- app.component.ts -->
import { $CamelCaseDataUri } from '@ycloud-web/icons-angular';

iconSrc = $CamelCaseDataUri;

<!-- app.component.html -->
<img [src]="iconSrc" alt="" width="24" height="24">`,
  },
  {
    language: 'html',
    title: 'Icon font',
    code: `<div class="business-icon-$Name"></div>`,
  },
];

export default async function createBusinessCodeExamples() {
  const codes = getBusinessIconCodes();

  const codeExamplePromises = codes.map(async ({ title, language, code }, index) => {
    const isFirst = index === 0;
    const codeString = await highLightCode(code, language, isFirst);

    return {
      title,
      language,
      code: codeString,
    };
  });

  return Promise.all(codeExamplePromises);
}
