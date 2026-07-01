import plugins from '@ycloud-web/rollup-plugins';
import dts from 'rollup-plugin-dts';
import pkg from './package.json' with { type: 'json' };

const packageName = pkg.name;
const outputDir = 'dist';
const inputs = ['src/ycloud-static.ts', 'src/business-static.ts', 'src/illustration-static.ts'];
const entryOutputNames = {
  'ycloud-static': 'icons',
  'business-static': 'business-icons',
  'illustration-static': 'illustration-icons',
};
const getEntryFileName = (extension) => (chunkInfo) =>
  `${entryOutputNames[chunkInfo.name] ?? chunkInfo.name}.${extension}`;
const dtsEntries = [
  ['ycloud-static', 'icons'],
  ['business-static', 'business-icons'],
  ['illustration-static', 'illustration-icons'],
];
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
  .map(({ inputs, outputDir, format, minify, preserveModules, extension = 'js' }) =>
    inputs.map((input) => ({
      input,
      plugins: plugins({ pkg, minify }),
      output: {
        name: packageName,
        ...(preserveModules
          ? {
              dir: `${outputDir}/${format}`,
              entryFileNames: getEntryFileName(extension),
            }
          : {
              file: undefined,
            }),
        format,
        sourcemap: true,
        preserveModules,
        preserveModulesRoot: 'src',
      },
    })),
  )
  .flat();

/** @type {import('rollup').RollupOptions[]} */
const config = [
  ...configs,
  ...dtsEntries.map(([sourceName, outputName]) => ({
    input: `src/${sourceName}.ts`,
    output: [
      {
        file: `${outputDir}/${outputName}.d.ts`,
        format: 'esm',
      },
    ],
    plugins: [
      dts({
        include: ['src'],
      }),
    ],
  })),
];

export default config;
