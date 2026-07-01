import plugins from '@ycloud-web/rollup-plugins';
import replace from '@rollup/plugin-replace';
import dts from 'rollup-plugin-dts';
import pkg from './package.json' with { type: 'json' };

const umdName = pkg.amdName ?? 'ycloud';
const rootEntryName = 'icons';
const outputDir = 'dist';
const inputs = ['src/ycloud.ts'];
const businessInput = 'src/business.ts';
const illustrationInput = 'src/illustration.ts';
const preserveModuleInputs = [...inputs, businessInput, illustrationInput];
const entryInputs = [...inputs, businessInput, illustrationInput];
const entryOutputNames = {
  ycloud: 'icons',
  business: 'business-icons',
  illustration: 'illustration-icons',
};
const runtimeEntryNames = new Set([
  'createElement',
  'defaultAttributes',
  'iconsAndAliases',
  'replaceElement',
  'replaceElementUtils',
  'types',
]);
const umdOutputNames = {
  ycloud: umdName,
  business: 'ycloudBusinessIcons',
  illustration: 'ycloudIllustrationIcons',
};
const getEntryName = (input) => input.replace(/^src\//, '').replace(/\.[^.]+$/, '');
const getEntryFileName = (extension) => (chunkInfo) => {
  const entryName = entryOutputNames[chunkInfo.name];

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
    format: 'umd',
    inputs: entryInputs,
    outputDir,
    minify: true,
  },
  {
    format: 'umd',
    inputs: entryInputs,
    outputDir,
  },
  {
    format: 'cjs',
    inputs: preserveModuleInputs,
    outputDir,
    preserveModules: true,
  },
  {
    format: 'esm',
    inputs: preserveModuleInputs,
    outputDir,
    preserveModules: true,
    extension: 'mjs',
  },
];

const configs = bundles
  .map(({ inputs, outputDir, format, minify, preserveModules, extension = 'js' }) =>
    inputs.map((input) => ({
      input,
      treeshake: preserveModules ? false : undefined,
      plugins: [
        // This is for ycloud plugin to replace an argument in createIcons so it is easier to use with UMD.
        ...(format === 'umd'
          ? [
              replace({
                'icons = {}': 'icons = iconAndAliases',
                delimiters: ['', ''],
                preventAssignment: false,
              }),
            ]
          : []),
        ...plugins({ pkg, minify }),
      ],
      output: {
        name: umdOutputNames[getEntryName(input)] ?? umdName,
        ...(preserveModules
          ? {
              dir: `${outputDir}/${format}`,
              entryFileNames: getEntryFileName(extension),
            }
          : {
              file: `${outputDir}/${format}/${entryOutputNames[getEntryName(input)] ?? rootEntryName}${minify ? '.min' : ''}.js`,
            }),
        format,
        sourcemap: true,
        preserveModules,
        preserveModulesRoot: 'src',
        ...(format === 'cjs' ? { exports: 'named' } : {}),
      },
    })),
  )
  .flat();

const typesFileConfig = {
  input: inputs[0],
  output: [
    {
      file: `${outputDir}/${rootEntryName}.d.ts`,
      format: 'esm',
    },
  ],
  plugins: [
    dts({
      include: ['src'],
    }),
  ],
};

const secondaryEntryTypesConfig = (input, name) => ({
  input,
  output: [
    {
      file: `${outputDir}/${name}.d.ts`,
      format: 'esm',
    },
  ],
  plugins: [dts()],
});

/** @type {import('rollup').RollupOptions[]} */
const config = [
  ...configs,
  typesFileConfig,
  secondaryEntryTypesConfig(businessInput, 'business-icons'),
  secondaryEntryTypesConfig(illustrationInput, 'illustration-icons'),
];

export default config;
