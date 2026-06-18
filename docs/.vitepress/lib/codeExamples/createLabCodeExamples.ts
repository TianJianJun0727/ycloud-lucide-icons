import { highLightCode } from './createCodeExamples';

type CodeExampleType = {
  title: string;
  language: string;
  code: string;
}[];

const getIconCodes = (): CodeExampleType => {
  return [
    {
      language: 'html',
      title: 'Vanilla',
      code: `\
<script>
import { createIcons } from '@ycloud-web/icons';
import { $CamelCase } from '@ycloud-web/icons-lab';

createIcons({
  icons: {
    $CamelCase
  }
});
</script>

<i data-ycloud="$Name"></i>\
  `,
    },
    {
      language: 'tsx',
      title: 'React',
      code: `import { Icon } from '@ycloud-web/icons-react';
import { $CamelCase } from '@ycloud-web/icons-lab';

const App = () => {
  return (
    <Icon iconNode={$CamelCase} />
  );
};

export default App;
`,
    },
    {
      language: 'vue',
      title: 'Vue',
      code: `<script setup>
import { Icon } from '@ycloud-web/icons-vue';
import { $CamelCase } from '@ycloud-web/icons-lab';
</script>

<template>
  <Icon :iconNode="$CamelCase" />
</template>
`,
    },
    {
      language: 'svelte',
      title: 'Svelte',
      code: `<script>
import { Icon } from '@ycloud-web/icons-svelte';
import { $CamelCase } from '@ycloud-web/icons-lab';
</script>

<Icon iconNode={$CamelCase} />
`,
    },
    {
      language: 'tsx',
      title: 'Preact',
      code: `import { Icon } from '@ycloud-web/icons-preact';
import { $CamelCase } from '@ycloud-web/icons-lab';

const App = () => {
  return (
    <Icon iconNode={$CamelCase} />
  );
};

export default App;
`,
    },
    {
      language: 'tsx',
      title: 'Solid',
      code: `import { Icon } from '@ycloud-web/icons-solid';
import { $CamelCase } from '@ycloud-web/icons-lab';

const App = () => {
  return (
    <Icon iconNode={$CamelCase} />
  );
};

export default App;
`,
    },
    {
      language: 'tsx',
      title: 'Angular',
      code: `// app.module.ts
import { YCloudAngularModule } from '@ycloud-web/icons-angular';
import { $CamelCase } from '@ycloud-web/icons-lab';

@NgModule({
  imports: [
    YCloudAngularModule.pick({ $PascalCase: $CamelCase })
  ],
})

// app.component.html
<ycloud-icon name="$PascalCase"></ycloud-icon>
`,
    },
  ];
};

export default async function createCodeExamples() {
  const codes = getIconCodes();

  const codeExamplePromises = codes.map(async ({ title, language, code }, index) => {
    const isFirst = index === 0;

    const codeString = await highLightCode(code, language, isFirst);

    return {
      title,
      language: language,
      code: codeString,
    };
  });

  return Promise.all(codeExamplePromises);
}
