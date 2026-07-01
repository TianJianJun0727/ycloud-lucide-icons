import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

type StaticAsset =
  | {
      type: 'icon';
      name: string;
      path: string;
    }
  | {
      type: 'business-icon';
      name: string;
      colorMode: string;
      path: string;
    }
  | {
      type: 'illustration';
      name: string;
      path: string;
    };

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
          return [path.relative(packageRoot, fullPath).replaceAll(path.sep, '/')];
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

function nameFromSvgPath(svgPath: string) {
  return path.basename(svgPath, '.svg');
}

async function buildStaticAssets() {
  const iconPaths = await readSvgFiles(path.join(packageRoot, 'icons'));
  const businessIconPaths = await readSvgFiles(path.join(packageRoot, 'business-icons'));
  const illustrationPaths = await readSvgFiles(path.join(packageRoot, 'illustration-icons'));

  const assets: StaticAsset[] = [
    ...iconPaths.map(
      (svgPath): StaticAsset => ({
        type: 'icon',
        name: nameFromSvgPath(svgPath),
        path: svgPath,
      }),
    ),
    ...businessIconPaths.map((svgPath): StaticAsset => {
      const [, colorMode = ''] = svgPath.split('/');
      return {
        type: 'business-icon',
        name: nameFromSvgPath(svgPath),
        colorMode,
        path: svgPath,
      };
    }),
    ...illustrationPaths.map(
      (svgPath): StaticAsset => ({
        type: 'illustration',
        name: nameFromSvgPath(svgPath),
        path: svgPath,
      }),
    ),
  ].sort((left, right) => {
    const typeCompare = left.type.localeCompare(right.type);
    if (typeCompare !== 0) {
      return typeCompare;
    }
    return left.name.localeCompare(right.name);
  });

  return {
    assets,
  };
}

await fs.writeFile(
  path.join(packageRoot, 'assets.json'),
  `${JSON.stringify(await buildStaticAssets(), null, 2)}\n`,
);
