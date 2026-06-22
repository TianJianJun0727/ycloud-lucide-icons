/**
 * 为指定图标名称生成初始 SVG 占位文件。
 *
 * 输入：命令行传入一个或多个图标名称。
 * 输出：在 `icons` 目录下创建对应 `.svg` 文件。
 * 规则：
 * - 只在文件不存在时写入，避免覆盖已有源图标。
 * - 生成的是占位骨架，真实图形、元数据和分类仍需要后续补充。
 */
import path from 'path';
import { getCurrentDirPath, writeFileIfNotExists } from '../../tools/build-helpers/helpers.ts';

const currentDir = getCurrentDirPath(import.meta.url);
const ICONS_DIR = path.resolve(currentDir, '../../icons');

const iconNames = process.argv.slice(2);

const iconSvgTemplate = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
</svg>
`;

const iconJsonTemplate = `{
  "$schema": "../icon.schema.json",
  "use-cases": [
  ],
  "name": "",
  "tags": [
  ],
  "categories": [
  ],
  "i18n": {
    "en": {
      "name": "",
      "tags": [
      ],
      "use-cases": [
      ]
    }
  }
}
`;

iconNames.forEach((iconName) => {
  writeFileIfNotExists(iconSvgTemplate, `${iconName}.svg`, ICONS_DIR);
  writeFileIfNotExists(iconJsonTemplate, `${iconName}.json`, ICONS_DIR);
});
