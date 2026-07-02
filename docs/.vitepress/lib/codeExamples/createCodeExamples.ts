import { bundledLanguages, createHighlighter, type ThemeRegistration } from 'shiki';

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
import { createIcons, $CamelCase } from '@ycloud-web/icons';

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
      code: `import { $PascalCase } from '@ycloud-web/icons-react';

const App = () => {
  return (
    <$PascalCase />
  );
};

export default App;
`,
    },
    {
      language: 'vue',
      title: 'Vue',
      code: `<script setup>
import { $PascalCase } from '@ycloud-web/icons-vue';
</script>

<template>
  <$PascalCase />
</template>
`,
    },
    {
      language: 'svelte',
      title: 'Svelte',
      code: `<script>
import { $PascalCase } from '@ycloud-web/icons-svelte';
</script>

<$PascalCase />
`,
    },
    {
      language: 'tsx',
      title: 'Preact',
      code: `import { $PascalCase } from '@ycloud-web/icons-preact';

const App = () => {
  return (
    <$PascalCase />
  );
};

export default App;
`,
    },
    {
      language: 'tsx',
      title: 'Solid',
      code: `import { $PascalCase } from '@ycloud-web/icons-solid';

const App = () => {
  return (
    <$PascalCase />
  );
};

export default App;
`,
    },
    {
      language: 'tsx',
      title: 'Angular',
      code: `// app.config.ts
import { provideYCloudIcons, $PascalCase } from '@ycloud-web/icons-angular';

export const appConfig = {
  providers: [
    provideYCloudIcons($PascalCase)
  ],
};

// app.component.ts
import { Component } from '@angular/core';
import { YCloudDynamicIcon } from '@ycloud-web/icons-angular';

@Component({
  standalone: true,
  imports: [YCloudDynamicIcon],
  template: '<ycloud-icon name="$Name" />',
})
export class AppComponent {}
`,
    },
    {
      language: 'html',
      title: 'Icon font',
      code: `<div class="icon-$Name"></div>`,
    },
  ];
};

const highlighter = await createHighlighter({
  themes: ['github-light', 'github-dark'],
  langs: Object.keys(bundledLanguages),
});

export type ThemeOptions =
  | ThemeRegistration
  | { light: ThemeRegistration; dark: ThemeRegistration };

export const highLightCode = async (code: string, lang: string, active?: boolean) => {
  const highlightedCode = highlighter
    .codeToHtml(code, {
      lang,
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
    })
    .replace('shiki-themes', 'shiki-themes vp-code');

  return `<div class="language-${lang} ${active ? 'active' : ''}">
  <button title="复制代码" class="copy"></button>
  <span class="lang">${lang}</span>
  ${highlightedCode}
  </div>`;
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
