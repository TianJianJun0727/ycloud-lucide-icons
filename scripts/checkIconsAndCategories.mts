/**
 * 全量校验图标源文件、图标元数据和分类定义的关系。
 *
 * 输入：固定读取仓库 `icons` 和 `categories` 目录。
 * 检查内容：
 * - 每个 `icons/*.svg` 必须有同名 `icons/*.json`。
 * - 每个 `icons/*.json` 必须有同名 `icons/*.svg`。
 * - 每个图标 JSON 中的 `categories` 必须引用已经存在的 `categories/*.json`。
 *
 * 注意：这里不检查中英文内容细节；字段语言、重复值和 use-cases 成对规则由
 * `checkIconMetadata.mts` / `checkCategoryMetadata.mts` 负责。
 * 调用位置：根 `package.json` 的 `pnpm checkIcons`，并被 lint-staged 在提交图标源文件时调用。
 * 调用时机：本地检查、CI 校验和提交前校验都会运行，用于防止 SVG/JSON/分类引用关系断裂。
 */
import path from 'path';
import {
  readSvgDirectory,
  getCurrentDirPath,
  readAllMetadata,
} from '../tools/build-helpers/helpers.ts';
import { type IconMetadata } from '../tools/build-icons/types.ts';

const currentDir = getCurrentDirPath(import.meta.url);
const ICONS_DIR = path.resolve(currentDir, '../icons');
const icons = (await readAllMetadata(ICONS_DIR)) as Record<string, IconMetadata>;
const CATEGORIES_DIR = path.resolve(currentDir, '../categories');
const categories = (await readAllMetadata(CATEGORIES_DIR)) as Record<
  string,
  {
    name: string;
  }
>;

console.log('Reading all icons');

const svgFiles = await readSvgDirectory(ICONS_DIR);
const iconNames = svgFiles.map((icon) => icon.split('.')[0]);

let error = false;

iconNames.forEach((iconName) => {
  if (typeof icons[iconName] === 'undefined') {
    console.error(`'${iconName}.svg' does not have a matching JSON file.`);
    error = true;
  }
});

Object.keys(icons).forEach((iconName) => {
  const icon = icons[iconName];
  if (iconNames.indexOf(iconName) === -1) {
    console.error(`'${iconName}.svg' does not exist.`);
    error = true;
  }
  icon.categories?.forEach((categoryName) => {
    if (typeof categories[categoryName] === 'undefined') {
      console.error(`Icon '${iconName}' refers to the non-existing category '${categoryName}'.`);
      error = true;
    }
  });
});

if (error) {
  console.error('At least one error in icon JSONs prevents from committing changes.');
  process.exit(1);
}
