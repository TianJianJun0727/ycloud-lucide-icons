import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BUSINESS_ICONS_DIR = 'business-icons';
const BUSINESS_ICON_INDEX_FILE = path.join(BUSINESS_ICONS_DIR, 'index.json');

const BUSINESS_CATEGORY_NAMES = new Set([
  'inbox',
  'menu',
  'chatbot',
  'outlined',
  'filled',
  'basic',
  'filter',
]);

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
  return `Business${pascal}`;
};

async function readBusinessSvgFiles() {
  try {
    const categories = await fs.readdir(BUSINESS_ICONS_DIR, { withFileTypes: true });
    const files = await Promise.all(
      categories
        .filter((entry) => entry.isDirectory() && BUSINESS_CATEGORY_NAMES.has(entry.name))
        .map(async (category) => {
          const categoryDir = path.join(BUSINESS_ICONS_DIR, category.name);
          const entries = await fs.readdir(categoryDir, { withFileTypes: true });
          return entries
            .filter((entry) => entry.isFile() && entry.name.endsWith('.svg'))
            .map((entry) => ({
              category: category.name,
              name: path.basename(entry.name, '.svg'),
              path: path
                .join(BUSINESS_ICONS_DIR, category.name, entry.name)
                .split(path.sep)
                .join('/'),
            }));
        }),
    );
    return files.flat().sort((left, right) => left.path.localeCompare(right.path));
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

export async function buildBusinessIconIndex() {
  const icons = (await readBusinessSvgFiles()).map((icon) => ({
    ...icon,
    componentName: getComponentName(icon.name),
  }));

  return {
    categories: Array.from(BUSINESS_CATEGORY_NAMES),
    icons,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const index = await buildBusinessIconIndex();
  await fs.writeFile(BUSINESS_ICON_INDEX_FILE, `${JSON.stringify(index, null, 2)}\n`, 'utf-8');
}
