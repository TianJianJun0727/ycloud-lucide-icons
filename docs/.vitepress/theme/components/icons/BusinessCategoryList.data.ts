import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(process.cwd(), '..');
const businessIconsDir = path.resolve(repoRoot, 'business-icons');
const indexPath = path.resolve(businessIconsDir, 'index.json');

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
};

export default {
  async load() {
    const index = JSON.parse(fs.readFileSync(indexPath, 'utf8')) as BusinessIconIndex;
    const categories = index.categories.map((category) => {
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

    return {
      categories,
    };
  },
};
