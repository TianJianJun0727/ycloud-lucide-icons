/**
 * 同步 README 中的赞助商占位内容到各 package README。
 *
 * 输入：根 `README.md` 中的 Sponsors 占位区块和 packages 目录下各子包的 README。
 * 行为：
 * - 查找各包 README 中同名占位区块。
 * - 用根 README 的内容覆盖，保持多包文档一致。
 *
 * 注意：当前项目已弱化赞助相关内容，该脚本主要保留历史兼容用途。
 */
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { existsSync, readFileSync, writeFileSync } from 'fs';

function updateSponsors() {
  const packagesPath = join(import.meta.dirname, '../packages');
  const mainReadme = readFileSync(join(import.meta.dirname, '../README.md'), 'utf8');
  const sponsorsRegex = /(\[\/\/]: <> \(Sponsors\).+)$/s;
  const sponsorsBlock = sponsorsRegex.exec(mainReadme);
  if (sponsorsBlock?.[1]) {
    const packageSponsorsBlock = sponsorsBlock[1].replaceAll(
      'src="docs/public',
      'src="https://tianjianjun0727.github.io/ycloud-icons',
    );
    readdirSync(packagesPath).forEach((packagePath) => {
      if (['ycloud-figma', 'shared'].includes(packagePath) || packagePath.startsWith('.')) {
        return;
      }
      const readmePath = join(packagesPath, packagePath, 'README.md');
      if (existsSync(readmePath)) {
        const readmeContent = readFileSync(readmePath, 'utf8');
        if (sponsorsRegex.test(readmeContent)) {
          writeFileSync(readmePath, readmeContent.replace(sponsorsRegex, packageSponsorsBlock));
          console.log(`Upgraded Sponsors block in ${readmePath}`);
        } else {
          console.error(`Could not find Sponsors block in ${readmePath}`);
        }
      } else {
        console.warn(`No readme found at ${readmePath}`);
      }
    });
  } else {
    console.error('Could not identify Sponsors block');
  }
}

updateSponsors();
