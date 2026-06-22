/**
 * 更新文档图标设计指南使用的 SVG 示例。
 *
 * 输入：扫描 `docs/images/*.svg`。
 * 行为：
 * - 批量替换 SVG 中与文档展示相关的属性。
 * - 保持 icon design guide 中示例图的描边、颜色和尺寸风格一致。
 *
 * 注意：这个脚本只面向文档示例资源，不处理 `icons/*.svg` 源图标。
 */
import path from 'path';
import { readdirSync, readFileSync, writeFileSync } from 'fs';

for (const file of readdirSync(path.join(import.meta.dirname, '../docs/images'))) {
  if (!file.endsWith('.svg')) continue;
  const fileName = path.join(import.meta.dirname, '../docs/images', file);
  const oldFileContent = readFileSync(fileName, 'utf8');
  const newFileContent = oldFileContent
    .split('</g>')
    .map((val) =>
      val.replace(
        /(<g id="embed-ycloud-([^"]*).*>)(.|\n)*/gm,
        (_, groupOpeningTag, iconName) =>
          [
            groupOpeningTag,
            ...readFileSync(path.join(import.meta.dirname, `../icons/${iconName}.svg`), 'utf8')
              .replace(/(<svg)([^>]|\n)*>|<\/svg>/g, '')
              .split('\n'),
          ]
            .map((val) => val.trimEnd())
            .filter(Boolean)
            .join('\n') + '\n',
      ),
    )
    .join('</g>');
  if (oldFileContent !== newFileContent) {
    console.log(`Updating ${fileName}`);
    writeFileSync(fileName, newFileContent);
  }
}
