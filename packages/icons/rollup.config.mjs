import plugins from '@ycloud-web/rollup-plugins';
import replace from '@rollup/plugin-replace';
import dts from 'rollup-plugin-dts';
import pkg from './package.json' with { type: 'json' };

const outputFileName = pkg.name;
const outputDir = 'dist';
const inputs = ['src/ycloud.ts'];
const businessInput = 'src/business.ts';
const bundles = [
  {
    format: 'umd',
    inputs,
    outputDir,
    minify: true,
  },
  {
    format: 'umd',
    inputs,
    outputDir,
  },
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
  },
];

const configs = bundles
  .map(({ inputs, outputDir, format, minify, preserveModules }) =>
    inputs.map((input) => ({
      input,
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
        name: outputFileName,
        ...(preserveModules
          ? {
              dir: `${outputDir}/${format}`,
              entryFileNames: '[name].mjs',
            }
          : {
              file: `${outputDir}/${format}/${outputFileName}${minify ? '.min' : ''}.js`,
            }),
        format,
        sourcemap: true,
        preserveModules,
        preserveModulesRoot: 'src',
      },
    })),
  )
  .flat();

const typesFileConfig = {
  input: inputs[0],
  output: [
    {
      file: `${outputDir}/${outputFileName}.d.ts`,
      format: 'esm',
    },
  ],
  plugins: [
    dts({
      include: ['src'],
    }),
  ],
};

const businessConfigs = [
  {
    input: businessInput,
    plugins: plugins({ pkg }),
    output: {
      file: `${outputDir}/cjs/business.js`,
      format: 'cjs',
      sourcemap: true,
    },
  },
  {
    input: businessInput,
    plugins: plugins({ pkg }),
    output: {
      file: `${outputDir}/esm/business.mjs`,
      format: 'esm',
      sourcemap: true,
    },
  },
  {
    input: businessInput,
    output: [
      {
        file: `${outputDir}/business.d.ts`,
        format: 'esm',
      },
    ],
    plugins: [dts()],
  },
];

export default [...configs, typesFileConfig, ...businessConfigs];
