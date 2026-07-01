import plugins from '@ycloud-web/rollup-plugins';
import dts from 'rollup-plugin-dts';
import pkg from './package.json' with { type: 'json' };

const packageName = 'YCloudPreact';
const outputFileName = 'icons';
const outputDir = 'dist';
const businessInput = 'src/business.ts';
const illustrationInput = 'src/illustration.ts';
const inputs = [`src/ycloud-preact.ts`, businessInput, illustrationInput];
const entryFileNameMap = {
  'ycloud-preact': 'icons',
  business: 'business-icons',
  illustration: 'illustration-icons',
};
const runtimeEntryNames = new Set([
  'Icon',
  'context',
  'createYCloudIcon',
  'defaultAttributes',
  'types',
]);
const getEntryFileName = (chunkInfo, extension) => {
  const entryName = entryFileNameMap[chunkInfo.name];

  if (entryName) {
    return `${entryName}.${extension}`;
  }

  if (runtimeEntryNames.has(chunkInfo.name)) {
    return `runtime/${chunkInfo.name}.${extension}`;
  }

  return `${chunkInfo.name}.${extension}`;
};
const bundles = [
  {
    format: 'cjs',
    inputs,
    outputDir,
    preserveModules: true,
  },
  {
    format: 'esm',
    inputs,
    outputDir,
    preserveModules: true,
    extension: 'mjs',
  },
];

const configs = bundles
  .map(({ inputs, outputDir, format, preserveModules, extension = 'js' }) =>
    inputs.map((input) => ({
      input,
      plugins: plugins({ pkg }),
      external: ['preact'],
      output: {
        name: packageName,
        ...(preserveModules
          ? {
              dir: `${outputDir}/${format}`,
              exports: format === 'cjs' ? 'named' : undefined,
              entryFileNames: (chunkInfo) => getEntryFileName(chunkInfo, extension),
            }
          : {
              file: `${outputDir}/${format}/${outputFileName}.${extension}`,
            }),
        preserveModules,
        format,
        sourcemap: true,
        preserveModulesRoot: 'src',
        globals: {
          preact: 'preact',
        },
      },
    })),
  )
  .flat();

export default [
  {
    input: inputs[0],
    output: [
      {
        file: `dist/${outputFileName}.d.ts`,
        format: 'es',
      },
    ],
    plugins: [dts()],
  },
  {
    input: businessInput,
    output: [
      {
        file: `dist/business-icons.d.ts`,
        format: 'es',
      },
    ],
    plugins: [dts()],
  },
  {
    input: illustrationInput,
    output: [
      {
        file: `dist/illustration-icons.d.ts`,
        format: 'es',
      },
    ],
    plugins: [dts()],
  },
  ...configs,
];
