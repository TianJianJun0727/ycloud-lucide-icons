import plugins from '@ycloud-web/rollup-plugins';
import pkg from './package.json' with { type: 'json' };
import dts from 'rollup-plugin-dts';

const packageName = '@ycloud-web/icons-data';
const inputs = [`src/ycloud-icons.ts`];
const secondaryInputs = [
  './src/dynamic.ts',
  './src/build.ts',
  './src/business.ts',
  './src/illustration.ts',
];
const entryOutputNames = {
  'ycloud-icons': 'icons',
  business: 'business-icons',
  illustration: 'illustration-icons',
};
const getEntryFileName = (extension) => (chunkInfo) =>
  `${entryOutputNames[chunkInfo.name] ?? chunkInfo.name}.${extension}`;
const dtsEntries = [
  ['ycloud-icons', 'icons'],
  ['dynamic', 'dynamic'],
  ['build', 'build'],
  ['business', 'business-icons'],
  ['illustration', 'illustration-icons'],
];
const bundles = [
  {
    format: 'cjs',
    inputs: [...inputs, ...secondaryInputs],
    preserveModules: true,
    extension: 'cjs',
  },
  {
    format: 'esm',
    inputs: [...inputs, ...secondaryInputs],
    preserveModules: true,
    extension: 'mjs',
  },
];

const configs = bundles
  .map(
    ({
      inputs,
      outputDir = 'dist',
      outputFile,
      format,
      minify,
      preserveModules,
      entryFileNames,
      external = [],
      paths,
      extension = 'js',
    }) =>
      inputs.map((input) => ({
        input,
        treeshake: preserveModules ? false : undefined,
        plugins: [...plugins({ pkg, minify })],
        external,
        output: {
          name: packageName,
          entryFileNames,
          ...(preserveModules
            ? {
                dir: `${outputDir}/${format}`,
                entryFileNames: getEntryFileName(extension),
              }
            : {
                file: outputFile,
              }),
          paths,
          format,
          sourcemap: true,
          preserveModules,
          exports: 'named',
          globals: {},
          preserveModulesRoot: 'src',
        },
      })),
  )
  .flat();

export default [
  ...dtsEntries.map(([sourceName, outputName]) => ({
    input: `./src/${sourceName}.ts`,
    output: [
      {
        file: `dist/esm/${outputName}.d.ts`,
        format: 'esm',
      },
      {
        file: `dist/cjs/${outputName}.d.cts`,
        format: 'cjs',
      },
    ],
    plugins: [dts()],
  })),
  ...configs,
];
