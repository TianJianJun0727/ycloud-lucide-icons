/**
 * 为缺少元数据的 SVG 源文件补齐对应的 icon JSON 文件。
 *
 * 输入：固定扫描 `icons/*.svg` 和已有 `icons/*.json`。
 * 行为：
 * - 找出有 SVG 但没有 JSON 的图标。
 * - 为每个缺失项写入基础 JSON 骨架。
 * - 默认 `name` 使用图标文件名，`categories` 暂放到 `text`，方便后续人工或 AI 修正。
 *
 * 适用场景：批量导入 SVG 后，先保证每个图标都有可被 schema 和构建流程识别的元数据文件。
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

iconNames.forEach((iconName) => {
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
            name: iconName,
            tags: [],
            'use-cases': [],
          },
        },
      },
      null,
      2,
    );
    writeFile(iconContent, `${iconName}.json`, path.resolve(currentDir, '..'));
  }
});
