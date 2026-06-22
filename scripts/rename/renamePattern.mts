/**
 * 按正则批量重命名图标。
 *
 * 输入：CLI 参数提供匹配正则和替换规则。
 * 行为：
 * - 扫描 `icons/*.svg` 获取图标名称。
 * - 用正则筛选要重命名的图标。
 * - 对每个匹配项计算新名称，并调用通用重命名逻辑。
 *
 * 适用场景：批量修正命名模式，例如前缀、后缀或拼写规则迁移。
 */
import path from 'path';
import { getCurrentDirPath, readSvgDirectory } from '../../tools/build-helpers/helpers.ts';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { renameIcon } from './renameIcon.function.mts';
import { type Arguments } from 'yargs';

async function main() {
  const currentDir = getCurrentDirPath(import.meta.url);
  const ICONS_DIR = path.resolve(currentDir, '../../icons');
  const svgFiles = await readSvgDirectory(ICONS_DIR);
  const iconNames = svgFiles.map((icon) => icon.split('.')[0]).reverse();
  const argv = (yargs(hideBin(process.argv))
  // @ts-ignore
    .usage('$0 <pattern> <replacement>', 'Renames all icons matching a pattern', (yargs) => {
      yargs
        .positional('pattern', {
          type: 'string',
          demandOption: true,
          describe: 'A regular expression, e.g. "^rhombus-(.+)$"',
        })
        .positional('replacement', {
          type: 'string',
          demandOption: true,
          describe: 'A replacement string, e.g. "diamond-\\1"',
        });
    })
    .strictCommands()
    .options({
      'dry-run': { type: 'boolean', default: false, alias: 'd' },
      'add-alias': { type: 'boolean', default: true, alias: 'a' },
    })
    .parse()) as unknown as Arguments<{
      pattern: string;
      replacement: string;
      dryRun: boolean;
      addAlias: boolean;
    }>;

  const pattern = new RegExp(argv?.pattern, 'g');
  const replacement = argv.replacement.replaceAll(/\\([0-9]+)/g, (s, i) => `$${i}`);

  if (!(pattern instanceof RegExp)) {
    console.error(`${pattern} is not a valid regular expression.`);
    process.exit(1);
  }

  for (const oldName of iconNames.filter((name) => pattern.test(name))) {
    const newName = oldName.replaceAll(pattern, replacement);
    console.log(`Renaming ${oldName} => ${newName}`);

    try {
      if (!argv.dryRun) {
        await renameIcon(ICONS_DIR, oldName, newName, false, argv.addAlias);
      }
    } catch (err) {
       if(err instanceof Error) {
      console.error(err.message);
    } else {
      console.error('An unexpected error occurred:', err);
    }
    }
  }
}

main();
