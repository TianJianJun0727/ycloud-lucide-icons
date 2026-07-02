import { highLightCode } from './createCodeExamples';

type CodeExampleType = {
  title: string;
  language: string;
  code: string;
}[];

type BusinessIconColorMode = 'mono' | 'duotone' | 'multicolor';

const getSharedImageComponentCodes = (): CodeExampleType => [
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
import { $CamelCaseDataUri } from '@ycloud-web/icons/business';

iconUrl = $CamelCaseDataUri;

<!-- app.component.html -->
<img [src]="iconUrl" alt="" />`,
  },
];

const getMonoBusinessIconCodes = (): CodeExampleType => [
  {
    language: 'html',
    title: 'Vanilla',
    code: `<script type="module">
import { $CamelCaseSvg } from '@ycloud-web/icons/business';

const icon = document.querySelector('#$Name');
icon.innerHTML = $CamelCaseSvg;
icon.style.color = '#128C7E';
</script>

<span id="$Name" aria-hidden="true"></span>`,
  },
  {
    language: 'tsx',
    title: 'React',
    code: `import { $PascalCase } from '@ycloud-web/icons-react/business';

const App = () => {
  return (
    <$PascalCase size={24} color="#128C7E" />
  );
};

export default App;
`,
  },
  ...getSharedImageComponentCodes(),
];

const getDuotoneBusinessIconCodes = (): CodeExampleType => [
  {
    language: 'html',
    title: 'Vanilla',
    code: `<script type="module">
import { $CamelCaseSvg } from '@ycloud-web/icons/business';

const icon = document.querySelector('#$Name');
icon.innerHTML = $CamelCaseSvg;
icon.style.setProperty('--business-icon-primary-color', '#128C7E');
icon.style.setProperty('--business-icon-secondary-color', '#FFFFFF');
</script>

<span id="$Name" aria-hidden="true"></span>`,
  },
  {
    language: 'tsx',
    title: 'React',
    code: `import { $PascalCase } from '@ycloud-web/icons-react/business';

const App = () => {
  return (
    <$PascalCase
      size={24}
      color="#128C7E"
      secondaryColor="#FFFFFF"
    />
  );
};

export default App;
`,
  },
  ...getSharedImageComponentCodes(),
];

const getMulticolorBusinessIconCodes = (): CodeExampleType => [
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
  ...getSharedImageComponentCodes(),
];

const getBusinessIconCodes = (colorMode: BusinessIconColorMode): CodeExampleType => {
  if (colorMode === 'duotone') {
    return getDuotoneBusinessIconCodes();
  }

  if (colorMode === 'multicolor') {
    return getMulticolorBusinessIconCodes();
  }

  return getMonoBusinessIconCodes();
};

export default async function createBusinessCodeExamples() {
  const codeExampleEntries = await Promise.all(
    (['mono', 'duotone', 'multicolor'] as const).map(async (colorMode) => {
      const codes = getBusinessIconCodes(colorMode);

      const codeExamples = await Promise.all(
        codes.map(async ({ title, language, code }, index) => {
          const isFirst = index === 0;
          const codeString = await highLightCode(code, language, isFirst);

          return {
            title,
            language,
            code: codeString,
          };
        }),
      );

      return [colorMode, codeExamples] as const;
    }),
  );

  return Object.fromEntries(codeExampleEntries) as Record<BusinessIconColorMode, CodeExampleType>;
}
