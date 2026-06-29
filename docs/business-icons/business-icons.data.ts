import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { BusinessIconCategory, BusinessIconEntity } from '../.vitepress/theme/types';

type BusinessIconIndex = {
  categories: Array<{
    name: string;
    title: string;
    i18n: {
      en: {
        title: string;
      };
    };
  }>;
  icons: {
    category: string;
    name: string;
    path: string;
    componentName: string;
  }[];
};

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, '../..');
const indexPath = path.resolve(repoRoot, 'business-icons/index.json');
const businessIconsDir = path.resolve(repoRoot, 'business-icons');

function toDisplayName(name: string) {
  return name
    .split('-')
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ');
}

export default {
  async load() {
    const index = JSON.parse(fs.readFileSync(indexPath, 'utf8')) as BusinessIconIndex;
    const categories: BusinessIconCategory[] = index.categories.map((category) => {
      const categoryDir = path.resolve(businessIconsDir, category.name);
      const iconCount = fs.existsSync(categoryDir)
        ? fs
            .readdirSync(categoryDir, { withFileTypes: true })
            .filter((entry) => entry.isFile() && entry.name.endsWith('.svg')).length
        : 0;

      return {
        name: category.name,
        title: category.title,
        englishTitle: category.i18n.en.title,
        iconCount,
      };
    });
    const categoryNames = categories.map((category) => category.name);
    const categoryByName = new Map(categories.map((category) => [category.name, category]));

    const icons: BusinessIconEntity[] = categoryNames
      .flatMap((category) => {
        const categoryDir = path.resolve(businessIconsDir, category);
        if (!fs.existsSync(categoryDir)) return [];

        return fs
          .readdirSync(categoryDir, { withFileTypes: true })
          .filter((entry) => entry.isFile() && entry.name.endsWith('.svg'))
          .map((entry) => {
            const name = entry.name.replace(/\.svg$/, '');
            const svgPath = `business-icons/${category}/${entry.name}`;
            const indexedIcon = index.icons.find(
              (icon) => icon.category === category && icon.name === name,
            );
            const svg = fs.readFileSync(path.resolve(repoRoot, svgPath), 'utf8').trim();

            return {
              category,
              categoryTitle: categoryByName.get(category)?.title ?? category,
              englishCategoryTitle: categoryByName.get(category)?.englishTitle ?? category,
              name,
              path: svgPath,
              componentName: indexedIcon?.componentName ?? toDisplayName(name).replace(/\s+/g, ''),
              displayName: toDisplayName(name),
              svg,
              dataUri: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
            };
          });
      })
      .sort((left, right) => {
        const categoryOrder =
          categoryNames.indexOf(left.category) - categoryNames.indexOf(right.category);
        if (categoryOrder !== 0) return categoryOrder;
        return left.name.localeCompare(right.name);
      });

    return {
      categories,
      icons,
    };
  },
};
