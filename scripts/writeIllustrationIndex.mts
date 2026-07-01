import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ILLUSTRATION_DIR = 'illustration-icons';
const ILLUSTRATION_INDEX_FILE = path.join(ILLUSTRATION_DIR, 'index.json');

const toPascalCase = (value: string) =>
  value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join('');

const getComponentName = (name: string) => {
  const pascal = toPascalCase(name);
  if (/^[a-zA-Z_$]/.test(pascal)) {
    return pascal;
  }
  return `Illustration${pascal}`;
};

export async function buildIllustrationIndex() {
  try {
    const entries = await fs.readdir(ILLUSTRATION_DIR, { withFileTypes: true });
    const illustrations = entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.svg'))
      .map((entry) => {
        const name = path.basename(entry.name, '.svg');
        return {
          name,
          path: path.join(ILLUSTRATION_DIR, entry.name).split(path.sep).join('/'),
          componentName: getComponentName(name),
        };
      })
      .sort((left, right) => left.name.localeCompare(right.name));

    return { illustrations };
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return { illustrations: [] };
    }
    throw error;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const index = await buildIllustrationIndex();
  await fs.mkdir(ILLUSTRATION_DIR, { recursive: true });
  await fs.writeFile(ILLUSTRATION_INDEX_FILE, `${JSON.stringify(index, null, 2)}\n`, 'utf-8');
}
