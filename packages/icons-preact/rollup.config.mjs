import plugins from '@ycloud-web/rollup-plugins';
import dts from 'rollup-plugin-dts';
import pkg from './package.json' with { type: 'json' };

const packageName = 'YCloudPreact';
const outputFileName = 'ycloud-preact';
const outputDir = 'dist';
const inputs = [`src/ycloud-preact.ts`];
const businessInput = 'src/business.ts';
const bundles = [
  {
    format: 'cjs',
    inputs,
    outputDir,
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
              entryFileNames: `[name].${extension}`,
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
        file: `dist/business.d.ts`,
        format: 'es',
      },
    ],
    plugins: [dts()],
  },
  {
    input: `src/${outputFileName}.suffixed.ts`,
    output: [
      {
        file: `dist/${outputFileName}.suffixed.d.ts`,
        format: 'es',
      },
    ],
    plugins: [dts()],
  },
  {
    input: `src/${outputFileName}.prefixed.ts`,
    output: [
      {
        file: `dist/${outputFileName}.prefixed.d.ts`,
        format: 'es',
      },
    ],
    plugins: [dts()],
  },
  ...['cjs', 'esm'].map((format) => ({
    input: businessInput,
    plugins: plugins({ pkg }),
    external: ['preact', '@ycloud-web/icons/business'],
    output: {
      name: `${packageName}Business`,
      file: `dist/${format}/business.${format === 'esm' ? 'mjs' : 'js'}`,
      format,
      sourcemap: true,
      globals: {
        preact: 'preact',
        '@ycloud-web/icons/business': 'YCloudBusinessIcons',
      },
    },
  })),
  ...configs,
];
