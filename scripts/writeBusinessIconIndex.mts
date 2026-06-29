import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BUSINESS_ICONS_DIR = 'business-icons';
const BUSINESS_ICON_INDEX_FILE = path.join(BUSINESS_ICONS_DIR, 'index.json');
const BUSINESS_CATEGORY_CONFIG_FILE = 'index.json';

type BusinessCategoryConfig = {
  $schema?: string;
  title: string;
  weight?: number;
  i18n: {
    en: {
      title: string;
    };
  };
};

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

async function readBusinessCategories() {
  try {
    const entries = await fs.readdir(BUSINESS_ICONS_DIR, { withFileTypes: true });
    const categories = await Promise.all(
      entries
        .filter((entry) => entry.isDirectory())
        .map(async (entry) => {
          const configPath = path.join(
            BUSINESS_ICONS_DIR,
            entry.name,
            BUSINESS_CATEGORY_CONFIG_FILE,
          );
          const config = JSON.parse(
            await fs.readFile(configPath, 'utf-8'),
          ) as BusinessCategoryConfig;

          return {
            name: entry.name,
            title: config.title,
            weight: config.weight,
            i18n: config.i18n,
          };
        }),
    );

    return categories
      .sort(
        (left, right) =>
          (left.weight ?? Number.MAX_SAFE_INTEGER) - (right.weight ?? Number.MAX_SAFE_INTEGER) ||
          left.name.localeCompare(right.name),
      )
      .map(({ name, title, i18n }) => ({ name, title, i18n }));
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function readBusinessSvgFiles(categoryNames: Set<string>) {
  try {
    const categories = await fs.readdir(BUSINESS_ICONS_DIR, { withFileTypes: true });
    const files = await Promise.all(
      categories
        .filter((entry) => entry.isDirectory() && categoryNames.has(entry.name))
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
  const categories = await readBusinessCategories();
  const categoryNames = new Set(categories.map((category) => category.name));
  const icons = (await readBusinessSvgFiles(categoryNames)).map((icon) => ({
    ...icon,
    componentName: getComponentName(icon.name),
  }));

  return {
    categories,
    icons,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const index = await buildBusinessIconIndex();
  await fs.writeFile(BUSINESS_ICON_INDEX_FILE, `${JSON.stringify(index, null, 2)}\n`, 'utf-8');
}
