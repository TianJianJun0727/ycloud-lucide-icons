/**
 * 为缺少元数据的 SVG 源文件补齐对应的 icon JSON 文件。
 *
 * 输入：固定扫描 `icons/*.svg` 和已有 `icons/*.json`。
 * 行为：
 * - 找出有 SVG 但没有 JSON 的图标。
 * - 为每个缺失项写入基础 JSON 骨架。
 * - 默认 `name` 使用图标文件名作为占位，`i18n.en.name` 使用文件名生成的自然英文名。
 * - 生成后仍需要人工或 `fixMetadata.mts` 补全中文名、标签、分类和使用场景。
 *
 * 适用场景：批量导入 SVG 后，先保证每个图标都有可被 schema 和构建流程识别的元数据文件。
 * 调用位置：根 `package.json` 的 `pnpm addjsons`。
 * 调用时机：人工批量导入 SVG 后手动运行，不属于默认 CI 流程。
 */
import path from 'path';
import {
  getCurrentDirPath,
  readAllMetadata,
  readSvgDirectory,
  writeFile,
} from '../tools/build-helpers/helpers.ts';

const currentDir = getCurrentDirPath(import.meta.url);
const ICONS_DIR = path.resolve(currentDir, '../icons');
const icons = await readAllMetadata(ICONS_DIR);

const svgFiles = await readSvgDirectory(ICONS_DIR);

const iconNames = svgFiles.map((icon) => icon.split('.')[0]);

const toEnglishName = (iconName: string) =>
  iconName
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const missingIconWrites = iconNames.map(async (iconName) => {
  if (typeof icons[iconName] === 'undefined') {
    const iconContent = JSON.stringify(
      {
        $schema: '../icon.schema.json',
        'use-cases': [],
        name: iconName,
        tags: [],
        categories: [],
        i18n: {
          en: {
            name: toEnglishName(iconName),
            tags: [],
            'use-cases': [],
          },
        },
      },
      null,
      2,
    );
    await writeFile(iconContent, `${iconName}.json`, ICONS_DIR);
    console.log(`Added missing icon metadata: icons/${iconName}.json`);
  }
});

await Promise.all(missingIconWrites);
