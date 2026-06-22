/**
 * 生成 Next.js modularize imports 兼容别名。
 *
 * 输入：扫描 `icons/*.svg` 得到所有图标名。
 * 输出：写入构建所需的 Next.js 别名映射文件。
 * 规则：
 * - 按 Next.js modularize imports 的 kebab-case 规则转换组件名。
 * - 对与标准图标名不同的转换结果生成别名。
 * - 让用户在 Next.js 项目中使用自动模块化导入时仍能命中正确图标。
 *
 * 调用位置：根 `package.json` 的 `pnpm generate:nextJSAliases`，以及 `lint-staged.config.mjs`。
 * 调用时机：提交 SVG 源文件时自动刷新；也可在批量改名或新增图标后手动运行。
 */
import path from 'path';
import { promises as fs } from 'fs';
import { getCurrentDirPath, readSvgDirectory } from '../tools/build-helpers/helpers.ts';

type IconAlias = string | { name: string };

// This is a special case convertion NextJS uses for their modularize imports. We try to follow the same convention, to generate the same imports.
function pascalToKebabNextJSFlavour(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z])-?([0-9]+|[A-Z])/g, '$1-$2')
    .replace(/([0-9]+)-?([a-zA-Z])/g, '$1-$2')
    .replace(/([0-9])-([0-9])/g, '$1$2')
    .split('-')
    .map((word) => word.toLowerCase())
    .join('-');
}

const currentDir = getCurrentDirPath(import.meta.url);
const ICONS_DIR = path.resolve(currentDir, '../icons');

const svgFiles = await readSvgDirectory(ICONS_DIR);

const iconNames = svgFiles.map((icon) => icon.split('.')[0]).reverse();

console.log('Creating aliases for NextJS imports: ');

await Promise.all(
  iconNames.map(async (iconName) => {
    const pascalCaseName = iconName.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

    const iconNameKebabCaseNextjsFlavour = pascalToKebabNextJSFlavour(pascalCaseName);

    if (iconName !== iconNameKebabCaseNextjsFlavour) {
      console.log(iconName, '➡️', iconNameKebabCaseNextjsFlavour);

      const metaJson = await fs.readFile(path.resolve(ICONS_DIR, `${iconName}.json`), 'utf-8');
      const iconMetaData = JSON.parse(metaJson);

      const aliases = (iconMetaData.aliases ?? []) as IconAlias[];
      const hasAlias = aliases.some((alias) =>
        typeof alias === 'string'
          ? alias === iconNameKebabCaseNextjsFlavour
          : alias.name === iconNameKebabCaseNextjsFlavour,
      );

      if (!hasAlias) {
        aliases.push({ name: iconNameKebabCaseNextjsFlavour });
      }

      let output = JSON.stringify({ ...iconMetaData, aliases }, null, 2);
      output = `${output}\n`;
      await fs.writeFile(path.resolve(ICONS_DIR, `${iconName}.json`), output, 'utf-8');
    }
  }),
);
