import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import pkg from '../package.json' with { type: 'json' };

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcRoot = path.join(packageRoot, 'src');

type AssetFamily = {
  sourceDir: string;
  moduleDir: string;
  indexFile: string;
  cssClassPrefix: string;
};

const families: AssetFamily[] = [
  {
    sourceDir: path.join(packageRoot, 'business-icons'),
    moduleDir: path.join(srcRoot, 'business-icons'),
    indexFile: path.join(srcRoot, 'business-static.ts'),
    cssClassPrefix: 'ycloud-business',
  },
  {
    sourceDir: path.join(packageRoot, 'illustration-icons'),
    moduleDir: path.join(srcRoot, 'illustration-icons'),
    indexFile: path.join(srcRoot, 'illustration-static.ts'),
    cssClassPrefix: 'ycloud-illustration',
  },
];

const license = `@license ${pkg.name} v${pkg.version} - ${pkg.license}`;

function toPascalCase(value: string) {
  return value
    .split(/[^a-zA-Z0-9]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function addRootClass(svg: string, className: string) {
  return svg.replace('<svg', `<svg\n  class="${className}"`);
}

async function readSvgFiles(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          return readSvgFiles(fullPath);
        }
        if (entry.isFile() && entry.name.endsWith('.svg')) {
          return [fullPath];
        }
        return [];
      }),
    );
    return files.flat();
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

function buildModule(name: string, exportName: string, svg: string) {
  return `/**
 * ${license}
 */

const ${exportName}: string = ${JSON.stringify(svg)};

export default ${exportName};
`;
}

async function writeFamily(family: AssetFamily) {
  await fs.rm(family.moduleDir, { recursive: true, force: true });
  await fs.mkdir(family.moduleDir, { recursive: true });

  const svgFiles = (await readSvgFiles(family.sourceDir)).sort((left, right) =>
    left.localeCompare(right),
  );

  const names = new Set<string>();
  const exports: string[] = [];

  await Promise.all(
    svgFiles.map(async (svgFile) => {
      const name = path.basename(svgFile, '.svg');
      if (names.has(name)) {
        throw new Error(`Duplicate static SVG module name: ${name}`);
      }
      names.add(name);

      const exportName = toPascalCase(name);
      const svg = addRootClass(
        await fs.readFile(svgFile, 'utf-8'),
        `${family.cssClassPrefix} ${family.cssClassPrefix}-${name}`,
      );

      await fs.writeFile(path.join(family.moduleDir, `${name}.ts`), buildModule(name, exportName, svg));
      exports.push(`export { default as ${exportName}, default as ${exportName}Icon, default as YCloud${exportName} } from './${name}';`);
    }),
  );

  exports.sort((left, right) => left.localeCompare(right));
  await fs.writeFile(path.join(family.moduleDir, 'index.ts'), `${exports.join('\n')}\n`);
  await fs.writeFile(family.indexFile, `export * from './${path.basename(family.moduleDir)}';\n`);
}

await Promise.all(families.map(writeFamily));
