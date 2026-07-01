import plugins from '@ycloud-web/rollup-plugins';
import preserveDirectives from 'rollup-plugin-preserve-directives';
import pkg from './package.json' with { type: 'json' };
import dts from 'rollup-plugin-dts';

const packageName = 'YCloudReact';
const outputFileName = 'icons';
const businessInput = 'src/business.ts';
const illustrationInput = 'src/illustration.ts';
const inputs = [`src/ycloud-react.ts`, businessInput, illustrationInput];
const entryFileNameMap = {
  'ycloud-react': 'icons',
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
const getExternalModulePath = (modulePath, prefix = './') => {
  if (runtimeEntryNames.has(modulePath)) {
    return `${prefix}runtime/${modulePath}.mjs`;
  }

  return `${prefix}${modulePath}.mjs`;
};
const bundles = [
  {
    format: 'cjs',
    inputs,
    outputDir: 'dist/cjs',
    preserveModules: true,
    extension: 'js',
  },
  {
    format: 'esm',
    inputs,
    outputDir: 'dist/esm',
    preserveModules: true,
    extension: 'mjs',
  },
  {
    format: 'esm',
    inputs: ['src/dynamicIconImports.ts', 'src/DynamicIcon.ts'],
    outputDir: 'dist/esm',
    external: [/src/],
    preserveModules: true,
    extension: 'mjs',
    paths: (id) => {
      if (id.match(/src/)) {
        const [, modulePath] = id.match(/src\/(.*)\.ts/);

        return getExternalModulePath(modulePath);
      }
    },
  },
  {
    format: 'esm',
    inputs: ['src/dynamic.ts'],
    outputFile: 'dynamic.mjs',
    external: [/src/],
    extension: 'mjs',
    paths: (id) => {
      if (id.match(/src/)) {
        const [, modulePath] = id.match(/src\/(.*)\.ts/);

        return getExternalModulePath(modulePath, 'dist/esm/');
      }
    },
  },
  {
    format: 'esm',
    inputs: ['src/dynamicIconImports.ts'],
    outputFile: 'dynamicIconImports.mjs',
    external: [/src/],
    extension: 'mjs',
    paths: (id) => {
      if (id.match(/src/)) {
        const [, modulePath] = id.match(/src\/(.*)\.ts/);

        return getExternalModulePath(modulePath, 'dist/esm/');
      }
    },
  },
];

const configs = bundles
  .map(
    ({
      inputs,
      outputDir,
      outputFile,
      format,
      minify,
      preserveModules,
      entryFileNames,
      extension = 'js',
      external = [],
      paths,
    }) =>
      inputs.map((input) => ({
        input,
        plugins: [
          ...plugins({ pkg, minify }),
          // Make sure we emit "use client" directive to make it compatible with Next.js
          preserveDirectives({
            include: ['src/ycloud-react.ts', 'src/DynamicIcon.ts', 'src/context.ts', 'src/Icon.ts'],
            suppressPreserveModulesWarning: true,
          }),
        ],
        external: ['react', 'prop-types', ...external],
        output: {
          name: packageName,
          ...(preserveModules
            ? {
                dir: outputDir,
                exports: format === 'cjs' ? 'named' : undefined,
                entryFileNames:
                  entryFileNames ?? ((chunkInfo) => getEntryFileName(chunkInfo, extension)),
              }
            : {
                file: outputFile ?? `${outputDir}/${outputFileName}.${extension}`,
              }),
          paths,
          format,
          sourcemap: true,
          preserveModules,
          preserveModulesRoot: 'src',
          globals: {
            react: 'react',
            'prop-types': 'PropTypes',
          },
        },
      })),
  )
  .flat();

export default [
  {
    input: 'src/dynamicIconImports.ts',
    output: [
      {
        file: `dynamicIconImports.d.ts`,
        format: 'es',
      },
    ],
    plugins: [dts()],
  },
  {
    input: 'src/dynamic.ts',
    output: [
      {
        file: `dynamic.d.ts`,
        format: 'es',
      },
    ],
    plugins: [dts()],
  },
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
