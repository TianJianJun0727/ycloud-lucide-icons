/**
 * 为图标元数据中引用但尚未定义的分类补齐 category JSON 文件。
 *
 * 输入：固定扫描 `icons/*.json` 中的 `categories` 和已有 `categories/*.json`。
 * 行为：
 * - 找出被图标引用、但没有对应 `categories/*.json` 的分类 slug。
 * - 为每个缺失项写入基础 JSON 骨架。
 * - 默认 `title` 使用分类 slug 作为占位，`i18n.en.title` 使用 slug 生成的自然英文名。
 * - 生成后仍需要人工或 `fixMetadata.mts` 补全中文分类标题。
 *
 * 适用场景：批量调整图标分类后，先保证每个被引用的分类都有可被 schema 识别的元数据文件。
 * 调用位置：根 `package.json` 的 `pnpm addcategoryjsons`。
 * 调用时机：人工批量维护分类后手动运行，不属于默认 CI 流程。
 */
import path from 'path';
import { getCurrentDirPath, readAllMetadata, writeFile } from '../tools/build-helpers/helpers.ts';
import { type IconMetadata } from '../tools/build-icons/types.ts';

const currentDir = getCurrentDirPath(import.meta.url);
const ICONS_DIR = path.resolve(currentDir, '../icons');
const CATEGORIES_DIR = path.resolve(currentDir, '../categories');
const icons = (await readAllMetadata(ICONS_DIR)) as Record<string, IconMetadata>;
const categories = await readAllMetadata(CATEGORIES_DIR);

const toEnglishTitle = (categoryName: string) =>
  categoryName
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const referencedCategories = new Set(
  Object.values(icons).flatMap((icon) => (Array.isArray(icon.categories) ? icon.categories : [])),
);

const missingCategoryWrites = [...referencedCategories].sort().map(async (categoryName) => {
  if (typeof categories[categoryName] !== 'undefined') {
    return;
  }

  const categoryContent = JSON.stringify(
    {
      $schema: '../category.schema.json',
      title: categoryName,
      i18n: {
        en: {
          title: toEnglishTitle(categoryName),
        },
      },
    },
    null,
    2,
  );

  await writeFile(categoryContent, `${categoryName}.json`, CATEGORIES_DIR);
  console.log(`Added missing category metadata: categories/${categoryName}.json`);
});

await Promise.all(missingCategoryWrites);
