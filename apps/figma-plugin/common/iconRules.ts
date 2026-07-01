export const toKebabCase = (value: string) =>
  value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .toLowerCase();
const hasCjkText = (value: string) => /[\u3400-\u9fff]/.test(value);
const ICON_NAME_ALLOWED_PATTERN = /^[a-zA-Z0-9-]+$/;
const ICON_NAME_ALLOWED_MESSAGE = '图标名称仅允许英文字母、数字和短横线（a-z、A-Z、0-9、-）';

function getRawIconNameIssues(rawName: string) {
  const normalizedRawName = rawName.trim();
  if (!ICON_NAME_ALLOWED_PATTERN.test(normalizedRawName)) {
    return [ICON_NAME_ALLOWED_MESSAGE];
  }
  return [];
}

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
  const issues = getRawIconNameIssues(rawName);
  const parsedName = parseIconName(rawName);
  if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(parsedName.fileName)) {
    issues.push('英文名需要能转换为小写短横线命名');
  }
  return issues;
}
export function getBusinessIconNameIssues(rawName: string) {
  const issues = getRawIconNameIssues(rawName);
  const parsedName = parseIconName(rawName);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(parsedName.fileName)) {
    issues.push('业务图标名需要能转换为小写短横线命名');
  }
  return issues;
}
export function getIconNameWarnings(rawName: string) {
  const warnings: string[] = [];
  const parsedName = parseIconName(rawName);
  if (!parsedName.nameEn) {
    warnings.push('建议图层名称使用英文语义名称，例如：arrow-left。');
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
export function getBusinessSvgIssues(svg: string) {
  const issues: string[] = [];
  const openTag = svg.match(/<svg\b[^>]*>/i)?.[0] ?? '';
  if (!openTag) {
    issues.push('业务 SVG 根节点需要是 <svg>');
    return issues;
  }
  if (!/\bviewBox="[^"]+"/i.test(openTag)) {
    issues.push('业务 SVG 需要包含 viewBox');
  }
  if (/<\s*(?:script|foreignObject)\b/i.test(svg)) {
    issues.push('业务 SVG 不能包含 script 或 foreignObject');
  }
  if (/\son[a-z]+\s*=/i.test(svg)) {
    issues.push('业务 SVG 不能包含事件属性');
  }
  if (/javascript\s*:/i.test(svg)) {
    issues.push('业务 SVG 不能包含 javascript: URL');
  }
  return issues;
}
export function getIllustrationSvgIssues(svg: string) {
  const issues: string[] = [];
  const openTag = svg.match(/<svg\b[^>]*>/i)?.[0] ?? '';
  if (!openTag) {
    issues.push('插画 SVG 根节点需要是 <svg>');
    return issues;
  }
  if (!/\bviewBox="[^"]+"/i.test(openTag)) {
    issues.push('插画 SVG 需要包含 viewBox');
  }
  if (/<\s*(?:script|foreignObject)\b/i.test(svg)) {
    issues.push('插画 SVG 不能包含 script 或 foreignObject');
  }
  if (/\son[a-z]+\s*=/i.test(svg)) {
    issues.push('插画 SVG 不能包含事件属性');
  }
  if (/javascript\s*:/i.test(svg)) {
    issues.push('插画 SVG 不能包含 javascript: URL');
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

type BusinessIconColorMode = 'mono' | 'duotone' | 'multicolor';

function normalizeBusinessSvgColor(value: string, colorMode: BusinessIconColorMode) {
  if (value === 'none' || value.startsWith('var(')) {
    return value;
  }
  if (colorMode === 'multicolor') {
    return value;
  }
  if (colorMode === 'mono') {
    return 'currentColor';
  }
  if (value === 'currentColor') {
    return 'var(--business-icon-primary-color)';
  }
  return isWhiteColor(value)
    ? 'var(--business-icon-secondary-color)'
    : 'var(--business-icon-primary-color)';
}

function isWhiteColor(value: string) {
  const normalizedValue = value.trim().toLowerCase().replace(/\s+/g, '');
  return (
    normalizedValue === 'white' ||
    normalizedValue === '#fff' ||
    normalizedValue === '#ffffff' ||
    normalizedValue === '#ffffffff' ||
    normalizedValue === 'rgb(255,255,255)' ||
    normalizedValue === 'rgba(255,255,255,1)'
  );
}

export function sanitizeBusinessSvg(svg: string, colorMode: BusinessIconColorMode = 'mono') {
  const openTag = svg.match(/<svg\b[^>]*>/i)?.[0];
  if (!openTag) return svg.trim();
  const cleanedOpenTag =
    colorMode === 'multicolor' || /\sfill="/i.test(openTag)
      ? openTag
      : openTag.replace(
          /<svg\b/i,
          colorMode === 'duotone'
            ? '<svg fill="var(--business-icon-primary-color)"'
            : '<svg fill="currentColor"',
        );
  const referencedIds = new Set([...svg.matchAll(/url\(#([^)]+)\)/g)].map((match) => match[1]));

  const normalized = svg
    .replace(openTag, cleanedOpenTag)
    .replace(
      /<\s*(?:script|foreignObject)\b[^>]*>[\s\S]*?<\s*\/\s*(?:script|foreignObject)\s*>/gi,
      '',
    )
    .replace(/<\s*(?:script|foreignObject)\b[^>]*\/\s*>/gi, '')
    .replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, '')
    .replace(/\s(?:style|class)="[^"]*"/gi, '')
    .replace(/\sdata-[^\s=]+="[^"]*"/gi, '')
    .replace(/\sid="([^"]*)"/gi, (match, id) => (referencedIds.has(id) ? match : ''))
    .replace(/\s(?:href|xlink:href)="javascript:[^"]*"/gi, '')
    .replace(/\s(fill|stroke)="([^"]+)"/gi, (_match, attr, value) => {
      const normalizedColor = normalizeBusinessSvgColor(value, colorMode);
      return ` ${attr}="${normalizedColor}"`;
    })
    .replace(/>\s*</g, '>\n  <')
    .replace(/\s*\/>/g, ' />')
    .trim();

  return `${normalized}\n`;
}

export function sanitizeIllustrationSvg(svg: string) {
  const openTag = svg.match(/<svg\b[^>]*>/i)?.[0];
  if (!openTag) return svg.trim();
  const referencedIds = new Set([...svg.matchAll(/url\(#([^)]+)\)/g)].map((match) => match[1]));

  const normalized = svg
    .replace(
      /<\s*(?:script|foreignObject)\b[^>]*>[\s\S]*?<\s*\/\s*(?:script|foreignObject)\s*>/gi,
      '',
    )
    .replace(/<\s*(?:script|foreignObject)\b[^>]*\/\s*>/gi, '')
    .replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, '')
    .replace(/\s(?:style|class)="[^"]*"/gi, '')
    .replace(/\sdata-[^\s=]+="[^"]*"/gi, '')
    .replace(/\sid="([^"]*)"/gi, (match, id) => (referencedIds.has(id) ? match : ''))
    .replace(/\s(?:href|xlink:href)="javascript:[^"]*"/gi, '')
    .replace(/>\s*</g, '>\n  <')
    .replace(/\s*\/>/g, ' />')
    .trim();

  return `${normalized}\n`;
}
