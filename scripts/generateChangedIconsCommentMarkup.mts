/**
 * 为图标 PR 生成变更预览评论内容。
 *
 * 输入：PR 中变更的 SVG 文件列表。
 * 主要功能：
 * - 读取 SVG 源内容并生成可嵌入 GitHub 评论的预览 markup。
 * - 展示图标名称、SVG 预览和基础元数据信息。
 * - 用于 `pull_request_icon_preview` / comment 类 workflow，帮助评审人快速看新增或修改图标。
 *
 * 注意：该脚本只生成评论内容，不修改图标源文件或元数据。
 */
import fs from 'fs';
import path from 'path';
import { parseSync } from 'svgson';
import {
  shuffleArray,
  readSvgDirectory,
  getCurrentDirPath,
  minifySvg,
  toPascalCase,
} from '../tools/build-helpers/helpers.ts';

const currentDir = getCurrentDirPath(import.meta.url);
const ICONS_DIR = path.resolve(currentDir, '../icons');
const BASE_URL = 'https://tianjianjun0727.github.io/ycloud-icons/api/gh-icon';

const changedFilesPathString = process.env.CHANGED_FILES;

if (changedFilesPathString == null) {
  console.error('CHANGED_FILES env variable is not set');
  process.exit(1);
}

const changedFiles = changedFilesPathString
  .split(' ')
  .filter((file) => file.includes('.svg'))
  .filter((file, idx, arr) => arr.indexOf(file) === idx);

if (changedFiles.length === 0) {
  console.log('No changed icons found');
  process.exit(0);
}

const getImageTagsByFiles = (
  files: string[],
  getBaseUrl: (file: string) => string,
  width?: number,
  linkToYCloudStudio = false,
) =>
  files.map((file) => {
    const svgContent = fs.readFileSync(path.join(process.cwd(), file), 'utf-8');
    const strippedAttrsSVG = svgContent.replace(/<svg[^>]*>/, '<svg>');
    const minifiedSvg = minifySvg(strippedAttrsSVG);
    const name = path.basename(file, '.svg');

    const base64 = Buffer.from(minifiedSvg).toString('base64');
    const url = getBaseUrl(file);
    const widthAttr = width ? `width="${width}"` : '';

    return `${linkToYCloudStudio ? `<a title="Open ${name} in ycloud studio" target="_blank" href="https://tianjianjun0727.github.io/ycloud-icons/studio/edit?value=${encodeURI(minifiedSvg)}&name=${name}">` : ''}<img title="${name}" alt="${name}" ${widthAttr} src="${url}/${base64}.svg"/>${linkToYCloudStudio ? '</a>' : ''}`;
  });

const svgFiles = await readSvgDirectory(ICONS_DIR);
const svgFilePaths = svgFiles.map((file) => `icons/${file}`);

const iconsFilteredByName = (search: string) =>
  svgFilePaths.filter((file) => file.includes(search));

const cohesionRandomImageTags = getImageTagsByFiles(
  shuffleArray(svgFilePaths).slice(0, changedFiles.length),
  () => `${BASE_URL}/stroke-width/2`,
).join('');

const cohesionSquaresImageTags = getImageTagsByFiles(
  shuffleArray(iconsFilteredByName('square')).slice(0, changedFiles.length),
  () => `${BASE_URL}/stroke-width/2`,
).join('');

const changeFiles1pxStrokeImageTags = getImageTagsByFiles(
  changedFiles,
  () => `${BASE_URL}/stroke-width/1`,
).join('');

const changeFiles2pxStrokeImageTags = getImageTagsByFiles(
  changedFiles,
  () => `${BASE_URL}/stroke-width/2`,
).join('');

const changeFiles3pxStrokeImageTags = getImageTagsByFiles(
  changedFiles,
  () => `${BASE_URL}/stroke-width/3`,
).join('');

const changeFilesLowDPIImageTags16 = getImageTagsByFiles(changedFiles, (file) => {
  const iconName = path.basename(file, '.svg');
  return `${BASE_URL}/dpi/${iconName}/16`;
}).join(' ');

const changeFilesLowDPIImageTags24 = getImageTagsByFiles(changedFiles, (file) => {
  const iconName = path.basename(file, '.svg');
  return `${BASE_URL}/dpi/${iconName}/24`;
}).join(' ');

const changeFilesLowDPIImageTags32 = getImageTagsByFiles(changedFiles, (file) => {
  const iconName = path.basename(file, '.svg');
  return `${BASE_URL}/dpi/${iconName}/32`;
}).join(' ');

const changeFilesLowDPIImageTags48 = getImageTagsByFiles(changedFiles, (file) => {
  const iconName = path.basename(file, '.svg');
  return `${BASE_URL}/dpi/${iconName}/48`;
}).join(' ');

const changeFilesXRayImageTags = getImageTagsByFiles(
  changedFiles,
  (file) => {
    const iconName = path.basename(file, '.svg');

    return `${BASE_URL}/${iconName}`;
  },
  400,
  true,
).join(' ');

const changeFilesDiffImageTags = getImageTagsByFiles(
  changedFiles,
  (file) => {
    const iconName = path.basename(file, '.svg');

    return `${BASE_URL}/diff/${iconName}`;
  },
  400,
).join(' ');

const changeFilesSymmetryImageTagsRotate180 = getImageTagsByFiles(
  changedFiles,
  () => `${BASE_URL}/symmetry/rotate-180`,
  400,
).join(' ');

const changeFilesSymmetryImageTagsFlipHorizontal = getImageTagsByFiles(
  changedFiles,
  () => `${BASE_URL}/symmetry/flip-horizontal`,
  400,
).join(' ');

const changeFilesSymmetryImageTagsFlipVertical = getImageTagsByFiles(
  changedFiles,
  () => `${BASE_URL}/symmetry/flip-vertical`,
  400,
).join(' ');

const changeFilesSymmetryImageTagsFlipSlash = getImageTagsByFiles(
  changedFiles,
  () => `${BASE_URL}/symmetry/flip-slash`,
  400,
).join(' ');

const readyToUseCode = changedFiles
  .map((changedFile) => {
    const svgContent = fs.readFileSync(path.join(process.cwd(), changedFile), 'utf-8');
    const name = path.basename(changedFile, '.svg');
    return `const ${toPascalCase(name)}Icon = createYCloudIcon('${toPascalCase(name)}', [
  ${parseSync(svgContent)
    .children.map(({ name, attributes }) => JSON.stringify([name, attributes]))
    .join(',\n  ')}
])`;
  })
  .join('\n\n');

const commentMarkup = `\
### Added or changed icons
${
  changedFiles.length >= 8
    ? `<details>
<summary>Icon X-rays</summary>
${changeFilesXRayImageTags}
</details>
`
    : ''
}${changeFiles2pxStrokeImageTags}
<details>
<summary>Preview cohesion</summary>
${cohesionSquaresImageTags}<br/>
${changeFiles2pxStrokeImageTags}<br/>
${cohesionRandomImageTags}<br/>
</details>
<details>
<summary>Preview stroke widths</summary>
${changeFiles1pxStrokeImageTags}<br/>
${changeFiles2pxStrokeImageTags}<br/>
${changeFiles3pxStrokeImageTags}<br/>
</details>
<details>
<summary>DPI Preview</summary>
<h4>16px (shadcn/ui)</h4>
${changeFilesLowDPIImageTags16}
<h4>24px (default)</h4>
${changeFilesLowDPIImageTags24}
<h4>32px (shadcn/ui + retina)</h4>
${changeFilesLowDPIImageTags32}
<h4>48px (default + retina)</h4>
${changeFilesLowDPIImageTags48}
</details>${
  changedFiles.length < 8
    ? `
<details>
<summary>Icon X-rays</summary>
${changeFilesXRayImageTags}
</details>`
    : ''
}
<details>
<summary>Icon Diffs</summary>
${changeFilesDiffImageTags}
</details>
<details>
<summary>Icon Symmetry</summary>
<h4>Flip Horizontal</h4>
${changeFilesSymmetryImageTagsFlipHorizontal}
<h4>Flip Vertical</h4>
${changeFilesSymmetryImageTagsFlipVertical}
<h4>Flip Diagonal</h4>
${changeFilesSymmetryImageTagsFlipSlash}
<h4>Rotate 180°</h4>
${changeFilesSymmetryImageTagsRotate180}
</details>
<details>
<summary>Icons as code</summary>

Works for: \`ycloud-react\`, \`@ycloud-web/icons-react-native\`, \`@ycloud-web/icons-preact\`, \`@ycloud-web/icons-vue\`
\`\`\`ts
${readyToUseCode}
\`\`\`

</details>`;

console.log(commentMarkup);
