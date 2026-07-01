import path from 'path';
import fs from 'fs';
import { babel } from '@rollup/plugin-babel';
import esbuild from 'esbuild';
import plugins from '@ycloud-web/rollup-plugins';
import ts from 'typescript';

import pkg from './package.json' with { type: 'json' };

const packageName = 'YCloudSolid';
const outputFileName = 'icons';
const outputDir = 'dist';
const businessInput = 'src/business.ts';
const illustrationInput = 'src/illustration.ts';
const inputs = ['src/ycloud-solid.ts', businessInput, illustrationInput];
const entryFileNameMap = {
  'ycloud-solid': 'icons',
  business: 'business-icons',
  illustration: 'illustration-icons',
};
const runtimeEntryNames = new Set([
  'Icon',
  'businessTypes',
  'context',
  'defaultAttributes',
  'illustrationTypes',
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
const renameIfExists = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });

  if (fs.existsSync(from)) {
    fs.renameSync(from, to);
  }
  const mapFrom = `${from}.map`;
  if (fs.existsSync(mapFrom)) {
    fs.renameSync(mapFrom, `${to}.map`);
  }
};
const runtimeImportMap = new Map(
  [...runtimeEntryNames]
    .filter((name) => name !== 'Icon')
    .flatMap((name) => [
      [`"./${name}"`, `"./runtime/${name}"`],
      [`"../${name}"`, `"../runtime/${name}"`],
      [`'./${name}'`, `'./runtime/${name}'`],
      [`'../${name}'`, `'../runtime/${name}'`],
    ]),
);
runtimeImportMap.set('"./Icon"', '"./runtime/Icon"');
runtimeImportMap.set('"../Icon"', '"../runtime/Icon"');
runtimeImportMap.set("'./Icon'", "'./runtime/Icon'");
runtimeImportMap.set("'../Icon'", "'../runtime/Icon'");

const rewriteRuntimeImports = (dir) => {
  if (!fs.existsSync(dir)) {
    return;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const filePath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      rewriteRuntimeImports(filePath);
      continue;
    }

    if (!filePath.endsWith('.jsx') && !filePath.endsWith('.d.ts')) {
      continue;
    }

    const source = fs.readFileSync(filePath, 'utf8');
    let nextSource = source;

    for (const [from, to] of runtimeImportMap) {
      nextSource = nextSource.replaceAll(from, to);
    }

    if (nextSource !== source) {
      fs.writeFileSync(filePath, nextSource);
    }
  }
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
      plugins: [
        babel({
          extensions: ['.ts', '.tsx', '.js', '.jsx'],
          babelHelpers: 'bundled',
          presets: [
            'babel-preset-solid',
            '@babel/preset-typescript',
            ['@babel/preset-env', { bugfixes: true, targets: 'last 2 years' }],
          ],
        }),
        ...plugins({
          pkg,
          withEsbuild: false,
        }),
        format === 'esm'
          ? {
              name: 'ts',
              async buildEnd() {
                // Transpile typescript to './dist/source'
                await esbuild.build({
                  entryPoints: ['./src/**/*.tsx', './src/**/*.ts'],
                  outdir: './dist/source',
                  entryNames: '[dir]/[name]',
                  outExtension: {
                    '.js': '.jsx',
                  },
                  loader: {
                    '.js': 'jsx',
                  },
                  jsx: 'preserve',
                  jsxImportSource: 'solid-js',
                  bundle: true,
                  format: 'esm',
                  sourcemap: true,
                  target: ['esnext'],
                  banner: {
                    js: `/**
* @license ${pkg.name} v${pkg.version} - ${pkg.license}
*
* This source code is licensed under the ${pkg.license} license.
* See the LICENSE file in the root directory of this source tree.
*/`,
                  },
                  plugins: [
                    {
                      name: 'externalize-everything-except-own-dependencies',
                      setup(build) {
                        build.onResolve({ filter: /(.*)/ }, (args) => {
                          const modulePath = path.join(args.resolveDir, args.path);
                          if (
                            args.kind === 'import-statement' &&
                            args.path !== '@ycloud-web/shared' &&
                            !modulePath.includes('packages/icons-shared')
                          ) {
                            return { path: args.path, external: true };
                          }
                        });
                      },
                    },
                  ],
                  external: ['solid-js'],
                });

                // Generate types
                const program = ts.createProgram(
                  ['src/ycloud-solid.ts', businessInput, illustrationInput],
                  {
                    target: ts.ScriptTarget.ESNext,
                    module: ts.ModuleKind.ESNext,
                    moduleResolution: ts.ModuleResolutionKind.NodeJs,
                    jsx: ts.JsxEmit.Preserve,
                    jsxImportSource: 'solid-js',
                    allowSyntheticDefaultImports: true,
                    esModuleInterop: true,
                    declarationDir: `dist/types`,
                    declaration: true,
                    emitDeclarationOnly: true,
                  },
                );
                program.emit();
                renameIfExists('./dist/source/ycloud-solid.jsx', './dist/source/icons.jsx');
                renameIfExists('./dist/source/business.jsx', './dist/source/business-icons.jsx');
                renameIfExists(
                  './dist/source/illustration.jsx',
                  './dist/source/illustration-icons.jsx',
                );
                renameIfExists('./dist/types/ycloud-solid.d.ts', './dist/types/icons.d.ts');
                renameIfExists('./dist/types/business.d.ts', './dist/types/business-icons.d.ts');
                renameIfExists(
                  './dist/types/illustration.d.ts',
                  './dist/types/illustration-icons.d.ts',
                );
                for (const name of runtimeEntryNames) {
                  renameIfExists(`./dist/source/${name}.jsx`, `./dist/source/runtime/${name}.jsx`);
                  renameIfExists(`./dist/types/${name}.d.ts`, `./dist/types/runtime/${name}.d.ts`);
                }
                rewriteRuntimeImports('./dist/source');
                rewriteRuntimeImports('./dist/types');
              },
            }
          : null,
      ],
      external: ['solid-js', 'solid-js/web', 'solid-js/store'],
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
        format: format === 'source' ? 'esm' : format,
        preserveModules,
        preserveModulesRoot: 'src',
        sourcemap: true,
      },
    })),
  )
  .flat();

export default configs;
