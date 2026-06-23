export const toKebabCase = (value: string) =>
  value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .toLowerCase();
const hasCjkText = (value: string) => /[\u3400-\u9fff]/.test(value);
export function parseIconName(rawName: string) {
  const normalizedRawName = rawName.trim();
  const [left = '', right = ''] = normalizedRawName
    .split(/\s*[|｜/]\s*/, 2)
    .map((item) => item.trim());
  let nameZh = '';
  let nameEn = '';
  if (right) {
    if (hasCjkText(left) && !hasCjkText(right)) {
      nameZh = left;
      nameEn = right;
    } else if (!hasCjkText(left) && hasCjkText(right)) {
      nameZh = right;
      nameEn = left;
    }
  } else if (hasCjkText(left)) {
    nameZh = left;
  } else {
    nameEn = left;
  }
  const fileName = toKebabCase(nameEn || normalizedRawName);
  return {
    fileName,
    nameEn,
    nameZh,
  };
}
export function getIconNameIssues(rawName: string) {
  const issues: string[] = [];
  const parsedName = parseIconName(rawName);
  if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(parsedName.fileName)) {
    issues.push('英文名需要能转换为小写短横线命名');
  }
  return issues;
}
export function getIconNameWarnings(rawName: string) {
  const warnings: string[] = [];
  const parsedName = parseIconName(rawName);
  if (!parsedName.nameZh || !parsedName.nameEn) {
    warnings.push(
      '建议图层名称同时包含中文名和英文名，例如：返回|arrow-left；缺失内容后续可由 AI 补全。',
    );
  }
  return warnings;
}
export function getSvgIssues(svg: string) {
  const issues: string[] = [];
  const openTag = svg.match(/<svg\b[^>]*>/i)?.[0] ?? '';
  const width = openTag.match(/\bwidth="([^"]+)"/i)?.[1];
  const height = openTag.match(/\bheight="([^"]+)"/i)?.[1];
  const viewBox = openTag.match(/\bviewBox="([^"]+)"/i)?.[1];
  if (width !== '24' || height !== '24' || viewBox !== '0 0 24 24') {
    issues.push('SVG 画板需要是 24 x 24，viewBox 需要是 0 0 24 24');
  }
  if (/\bstyle="/i.test(svg)) {
    issues.push('SVG 不能包含 style 属性');
  }
  if (/\b(?:fill|stroke)="(?!none\b|currentColor\b)[^"]+"/i.test(svg)) {
    issues.push('SVG 不能写死颜色，请使用 currentColor 或 none');
  }
  return issues;
}
export function sanitizeSvg(svg: string) {
  const openTag = svg.match(/<svg\b[^>]*>/i)?.[0];
  if (!openTag) return svg.trim();
  const cleanedOpenTag = openTag
    .replace(
      /\s(?:width|height|viewBox|fill|stroke|stroke-width|stroke-linecap|stroke-linejoin)="[^"]*"/gi,
      '',
    )
    .replace(
      /<svg\b/i,
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"',
    );
  const normalized = svg
    .replace(openTag, cleanedOpenTag)
    .replace(/\sstyle="[^"]*"/gi, '')
    .replace(/\s(fill|stroke)="(?!none\b|currentColor\b)[^"]+"/gi, ' $1="currentColor"')
    .replace(/>\s*</g, '>\n  <')
    .replace(/\s*\/>/g, ' />')
    .trim();
  return `${normalized}\n`;
}
