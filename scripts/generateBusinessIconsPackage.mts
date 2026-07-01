import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseSync, type INode } from 'svgson';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const businessIconsDir = path.join(repoRoot, 'business-icons');
const corePackageSrcDir = path.join(repoRoot, 'packages/icons/src');
const corePackageIconsDir = path.join(corePackageSrcDir, 'business-icons');
const iconsDataPackageSrcDir = path.join(repoRoot, 'packages/icons-data/src');
const iconsDataPackageIconsDir = path.join(iconsDataPackageSrcDir, 'business-icons');
const reactPackageSrcDir = path.join(repoRoot, 'packages/icons-react/src');
const reactPackageIconsDir = path.join(reactPackageSrcDir, 'business-icons');
const staticPackageIconsDir = path.join(repoRoot, 'packages/icons-static/business-icons');
const preactPackageSrcDir = path.join(repoRoot, 'packages/icons-preact/src');
const preactPackageIconsDir = path.join(preactPackageSrcDir, 'business-icons');
const vuePackageSrcDir = path.join(repoRoot, 'packages/icons-vue/src');
const vuePackageIconsDir = path.join(vuePackageSrcDir, 'business-icons');
const solidPackageSrcDir = path.join(repoRoot, 'packages/icons-solid/src');
const solidPackageIconsDir = path.join(solidPackageSrcDir, 'business-icons');
const reactNativePackageSrcDir = path.join(repoRoot, 'packages/icons-react-native/src');
const reactNativePackageIconsDir = path.join(reactNativePackageSrcDir, 'business-icons');
const sveltePackageSrcDir = path.join(repoRoot, 'packages/icons-svelte/src');
const sveltePackageIconsDir = path.join(sveltePackageSrcDir, 'business-icons');
const astroPackageSrcDir = path.join(repoRoot, 'packages/icons-astro/src');
const astroPackageIconsDir = path.join(astroPackageSrcDir, 'business-icons');
const angularPackageSrcDir = path.join(repoRoot, 'packages/icons-angular/business/src');
const angularPackageIconsDir = path.join(angularPackageSrcDir, 'business-icons');
const allTargets = [
  'core',
  'data',
  'react',
  'static',
  'preact',
  'vue',
  'solid',
  'react-native',
  'svelte',
  'astro',
  'angular',
] as const;
type Target = (typeof allTargets)[number];

type BusinessIconSource = {
  name: string;
  sourcePath: string;
  staticPath: string;
  colorMode: BusinessIconColorMode;
};
type BusinessIconColorMode = 'mono' | 'duotone' | 'multicolor';
type BusinessIconExportSource = string | { name: string; colorMode: BusinessIconColorMode };

const toPascalCase = (value: string) =>
  value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join('');

const toCamelCase = (value: string) => {
  const pascal = toPascalCase(value);
  return `${pascal.charAt(0).toLowerCase()}${pascal.slice(1)}`;
};

export function getBusinessIconExportBase(name: string) {
  const baseName = toCamelCase(name);
  if (/^[a-zA-Z_$]/.test(baseName)) {
    return baseName;
  }
  return `business${toPascalCase(name)}`;
}

export function getBusinessIconComponentName(name: string) {
  return toPascalCase(getBusinessIconExportBase(name));
}

const toStringLiteral = (value: string) => `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const toTemplateLiteral = (value: string) =>
  `\`${value.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\``;
const reactAttributeNameMap: Record<string, string> = {
  class: 'className',
  'clip-rule': 'clipRule',
  'clip-path': 'clipPath',
  'fill-rule': 'fillRule',
  'fill-opacity': 'fillOpacity',
  'color-interpolation-filters': 'colorInterpolationFilters',
  'mask-type': 'maskType',
  'stop-color': 'stopColor',
  'stop-opacity': 'stopOpacity',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-width': 'strokeWidth',
  'stroke-miterlimit': 'strokeMiterlimit',
  'stroke-dasharray': 'strokeDasharray',
  'stroke-dashoffset': 'strokeDashoffset',
  'stroke-opacity': 'strokeOpacity',
  'xlink:href': 'xlinkHref',
};
const primaryColorToken = 'var(--business-icon-primary-color)';
const secondaryColorToken = 'var(--business-icon-secondary-color)';

function buildBusinessIconDataUri(svg: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function buildSvgAssetNode(node: INode): [string, Record<string, string>] | [string, Record<string, string>, ReturnType<typeof buildSvgAssetNode>[]] {
  const attrs = Object.fromEntries(Object.entries(node.attributes).map(([key, value]) => [key, String(value)]));
  const children = node.children.filter((child) => child.type === 'element').map(buildSvgAssetNode);

  if (children.length > 0) {
    return [node.name, attrs, children];
  }

  return [node.name, attrs];
}

function parseSvgAsset(svg: string) {
  const root = parseSync(svg);
  return {
    attrs: Object.fromEntries(Object.entries(root.attributes).map(([key, value]) => [key, String(value)])),
    node: root.children.filter((child) => child.type === 'element').map(buildSvgAssetNode),
  };
}

function normalizeBusinessIconSource(source: BusinessIconExportSource): {
  name: string;
  colorMode: BusinessIconColorMode;
} {
  return typeof source === 'string' ? { name: source, colorMode: 'mono' } : source;
}

function toReactAttributeName(name: string) {
  if (reactAttributeNameMap[name]) {
    return reactAttributeNameMap[name];
  }
  if (/^(aria|data)-/.test(name)) {
    return name;
  }
  return name.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

function buildReactAttribute(name: string, value: string) {
  const reactName = toReactAttributeName(name);
  if (value === primaryColorToken) {
    return `${reactName}={color}`;
  }
  if (value === secondaryColorToken) {
    return `${reactName}={secondaryColor}`;
  }
  return `${reactName}=${JSON.stringify(value)}`;
}

function buildReactSvgNode(node: INode, indent = 6): string[] {
  const spacing = ' '.repeat(indent);
  const attributes = Object.entries(node.attributes ?? {})
    .map(([name, value]) => buildReactAttribute(name, String(value)))
    .join(' ');
  const openTag = attributes ? `<${node.name} ${attributes}` : `<${node.name}`;
  const children = (node.children ?? []).filter((child) => typeof child !== 'string') as INode[];

  if (children.length === 0) {
    return [`${spacing}${openTag} />`];
  }

  return [
    `${spacing}${openTag}>`,
    ...children.flatMap((child) => buildReactSvgNode(child, indent + 2)),
    `${spacing}</${node.name}>`,
  ];
}

function getBusinessSvgPropsPattern(
  colorMode: BusinessIconColorMode,
  includeSecondaryColor = colorMode === 'duotone',
) {
  if (colorMode === 'duotone' && includeSecondaryColor) {
    return "{ size = 24, width, height, alt = '', color = 'currentColor', secondaryColor = '#fff', style, ...props }";
  }
  if (colorMode === 'duotone') {
    return "{ size = 24, width, height, alt = '', color = 'currentColor', style, ...props }";
  }
  if (colorMode === 'mono') {
    return "{ size = 24, width, height, alt = '', color = 'currentColor', style, ...props }";
  }
  return "{ size = 24, width, height, alt = '', style, ...props }";
}

function getBusinessSvgPropsType(componentName: string, colorMode: BusinessIconColorMode) {
  if (colorMode === 'duotone') {
    return `${componentName}Props`;
  }
  if (colorMode === 'multicolor') {
    return `${componentName}Props`;
  }
  return 'BusinessIconImageProps';
}

function buildBusinessIconExtraProps(
  componentName: string,
  colorMode: BusinessIconColorMode,
): string[] {
  if (colorMode === 'duotone') {
    return [
      `type ${componentName}Props = BusinessIconImageProps & {`,
      '  secondaryColor?: string;',
      '};',
      '',
    ];
  }
  if (colorMode === 'multicolor') {
    return [
      `type ${componentName}Props = Omit<BusinessIconImageProps, 'color' | 'secondaryColor'>;`,
      '',
    ];
  }
  return [];
}

function getBusinessRootColorAttribute(colorMode: BusinessIconColorMode) {
  return colorMode === 'multicolor' ? [] : ['  color={color}'];
}

function toObjectPropertyName(name: string) {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name) ? name : JSON.stringify(name);
}

function buildObjectAttributeValue(value: string) {
  if (value === primaryColorToken) {
    return 'color';
  }
  if (value === secondaryColorToken) {
    return 'secondaryColor';
  }
  return toStringLiteral(value);
}

function buildObjectProperty(name: string, value: string, indent = 8) {
  return `${' '.repeat(indent)}${toObjectPropertyName(name)}: ${buildObjectAttributeValue(value)},`;
}

function buildHNode(node: INode, indent = 6): string[] {
  const spacing = ' '.repeat(indent);
  const properties = Object.entries(node.attributes ?? {}).map(([name, value]) =>
    buildObjectProperty(name, String(value), indent + 4),
  );
  const children = (node.children ?? []).filter((child) => typeof child !== 'string') as INode[];

  if (children.length === 0) {
    return [
      `${spacing}h(`,
      `${spacing}  ${toStringLiteral(node.name)},`,
      `${spacing}  {`,
      ...properties,
      `${spacing}  },`,
      `${spacing}),`,
    ];
  }

  return [
    `${spacing}h(`,
    `${spacing}  ${toStringLiteral(node.name)},`,
    `${spacing}  {`,
    ...properties,
    `${spacing}  },`,
    `${spacing}  [`,
    ...children.flatMap((child) => buildHNode(child, indent + 4)),
    `${spacing}  ],`,
    `${spacing}),`,
  ];
}

function buildHSvgElement(svg: string, colorMode: BusinessIconColorMode) {
  const root = parseSync(svg);
  const rootProperties = Object.entries(root.attributes ?? {})
    .filter(([name]) => name !== 'width' && name !== 'height')
    .map(([name, value]) => buildObjectProperty(name, String(value), 4));
  const children = (root.children ?? []).filter((child) => typeof child !== 'string') as INode[];
  const colorProperties =
    colorMode === 'multicolor' ? [] : ['    color,'];

  return [
    '  h(',
    `    ${toStringLiteral(root.name)},`,
    '    {',
    ...rootProperties,
    '    width: width ?? size,',
    '    height: height ?? size,',
    "    role: alt ? 'img' : undefined,",
    "    'aria-label': alt || undefined,",
    "    'aria-hidden': alt ? undefined : true,",
    ...colorProperties,
    '    style,',
    '    ...props,',
    '    },',
    '    [',
    ...children.flatMap((child) => buildHNode(child, 6)),
    '    ],',
    '  );',
  ];
}

function buildMarkupAttribute(name: string, value: string) {
  if (value === primaryColorToken) {
    return `${name}={color}`;
  }
  if (value === secondaryColorToken) {
    return `${name}={secondaryColor}`;
  }
  return `${name}=${JSON.stringify(value)}`;
}

function buildMarkupSvgNode(
  node: INode,
  indent = 6,
  attributeNameFormatter: (name: string) => string = (name) => name,
): string[] {
  const spacing = ' '.repeat(indent);
  const attributes = Object.entries(node.attributes ?? {})
    .map(([name, value]) => buildMarkupAttribute(attributeNameFormatter(name), String(value)))
    .join(' ');
  const openTag = attributes ? `<${node.name} ${attributes}` : `<${node.name}`;
  const children = (node.children ?? []).filter((child) => typeof child !== 'string') as INode[];

  if (children.length === 0) {
    return [`${spacing}${openTag} />`];
  }

  return [
    `${spacing}${openTag}>`,
    ...children.flatMap((child) => buildMarkupSvgNode(child, indent + 2, attributeNameFormatter)),
    `${spacing}</${node.name}>`,
  ];
}

function buildMarkupSvgElement(
  svg: string,
  colorMode: BusinessIconColorMode,
  attributeNameFormatter: (name: string) => string = (name) => name,
) {
  const root = parseSync(svg);
  const rootAttributes = Object.entries(root.attributes ?? {})
    .filter(([name]) => name !== 'width' && name !== 'height')
    .map(([name, value]) => `  ${buildMarkupAttribute(attributeNameFormatter(name), String(value))}`);
  const children = (root.children ?? []).filter((child) => typeof child !== 'string') as INode[];

  return [
    '<svg',
    ...rootAttributes,
    '  width={width ?? size}',
    '  height={height ?? size}',
    "  role={alt ? 'img' : undefined}",
    '  aria-label={alt || undefined}',
    '  aria-hidden={alt ? undefined : true}',
    ...getBusinessRootColorAttribute(colorMode),
    '  style={style}',
    '  {...props}',
    '>',
    ...children.flatMap((child) => buildMarkupSvgNode(child, 2, attributeNameFormatter)),
    '</svg>',
  ];
}

function buildReactSvgElement(
  svg: string,
  componentName: string,
  colorMode: BusinessIconColorMode,
) {
  const root = parseSync(svg);
  const rootAttributes = Object.entries(root.attributes ?? {})
    .filter(([name]) => name !== 'width' && name !== 'height')
    .map(([name, value]) => buildReactAttribute(name, String(value)));
  const children = (root.children ?? []).filter((child) => typeof child !== 'string') as INode[];
  const propsType = colorMode === 'mono' ? 'BusinessIconImageProps' : `${componentName}Props`;
  const propsPattern =
    colorMode === 'duotone'
      ? "{ size = 24, width, height, alt = '', color = 'currentColor', secondaryColor = '#fff', style, ...props }"
      : colorMode === 'mono'
        ? "{ size = 24, width, height, alt = '', color = 'currentColor', style, ...props }"
        : "{ size = 24, width, height, alt = '', style, ...props }";
  const styleExpression =
    colorMode === 'multicolor' ? 'style={style}' : 'style={{ color, ...style }}';

  return [
    `const ${componentName} = forwardRef<SVGSVGElement, ${propsType}>(`,
    `  (${propsPattern}, ref) => (`,
    '    <svg',
    '      ref={ref}',
    ...rootAttributes.map((attribute) => `      ${attribute}`),
    '      width={width ?? size}',
    '      height={height ?? size}',
    "      role={alt ? 'img' : undefined}",
    '      aria-label={alt || undefined}',
    '      aria-hidden={alt ? undefined : true}',
    `      ${styleExpression}`,
    '      {...props}',
    '    >',
    ...children.flatMap((child) => buildReactSvgNode(child, 6)),
    '    </svg>',
    '  ),',
    ');',
  ];
}

export function buildBusinessIconModule(
  name: string,
  svg: string,
  colorMode: BusinessIconColorMode = 'mono',
) {
  const exportBase = getBusinessIconExportBase(name);
  const asset = parseSvgAsset(svg);

  return [
    `export const ${exportBase}Icon = {`,
    `  name: ${toStringLiteral(name)},`,
    `  colorMode: ${toStringLiteral(colorMode)},`,
    `  attrs: ${JSON.stringify(asset.attrs)},`,
    `  node: ${JSON.stringify(asset.node)},`,
    `} as const;`,
    '',
    `export default ${exportBase}Icon;`,
    '',
  ].join('\n');
}

export function buildBusinessIconsIndex(sources: BusinessIconExportSource[], includeAliases = true) {
  const sortedSources = sources
    .map(normalizeBusinessIconSource)
    .sort((left, right) => left.name.localeCompare(right.name));
  const sortedNames = sortedSources.map((source) => source.name);
  const imports = sortedSources.map(({ name }) => {
    const exportBase = getBusinessIconExportBase(name);
    return `import { ${exportBase}Icon } from './business-icons/${name}';`;
  });
  const exports = sortedSources.flatMap(({ name }) => {
    if (!includeAliases) {
      return [`export * from './business-icons/${name}';`];
    }

    const componentName = getBusinessIconComponentName(name);
    return [
      `export * from './business-icons/${name}';`,
      `export { default as ${componentName}, default as ${componentName}Icon, default as YCloud${componentName} } from './business-icons/${name}';`,
    ];
  });
  const namesLiteral = sortedNames.map((name) => toStringLiteral(name)).join(', ');
  const iconEntries = sortedNames.map((name) => {
    const exportBase = getBusinessIconExportBase(name);
    return `  ${toStringLiteral(name)}: ${exportBase}Icon,`;
  });

  return [
    ...imports,
    '',
    ...exports,
    '',
    'export type BusinessIconDefinitionNode =',
    '  | readonly [tag: string, attrs: Record<string, string>]',
    '  | readonly [tag: string, attrs: Record<string, string>, children: readonly BusinessIconDefinitionNode[]];',
    '',
    'export interface BusinessIconDefinition {',
    '  name: string;',
    "  colorMode: 'mono' | 'duotone' | 'multicolor';",
    '  attrs: Record<string, string>;',
    '  node: readonly BusinessIconDefinitionNode[];',
    '}',
    '',
    `export const businessIconNames = [${namesLiteral}] as const;`,
    'export type BusinessIconName = (typeof businessIconNames)[number];',
    '',
    'export const businessIcons = {',
    ...iconEntries,
    '} as const satisfies Record<string, BusinessIconDefinition>;',
    '',
    'export function getBusinessIcon(name: BusinessIconName) {',
    '  return businessIcons[name];',
    '}',
    '',
  ].join('\n');
}

export function buildBusinessReactIconModule(
  name: string,
  colorMode: BusinessIconColorMode = 'mono',
  svg = '<svg fill="currentColor" viewBox="0 0 24 24" />',
) {
  const componentName = getBusinessIconComponentName(name);
  const componentSource = buildReactSvgElement(svg, componentName, colorMode);

  if (colorMode === 'mono') {
    return [
      "import { forwardRef } from 'react';",
      "import type { BusinessIconImageProps } from '../businessTypes';",
      '',
      ...componentSource,
      '',
      `${componentName}.displayName = '${componentName}';`,
      '',
      `export default ${componentName};`,
      '',
    ].join('\n');
  }

  if (colorMode === 'duotone') {
    return [
      "import { forwardRef } from 'react';",
      "import type { BusinessIconImageProps } from '../businessTypes';",
      '',
      `type ${componentName}Props = BusinessIconImageProps & {`,
      '  secondaryColor?: string;',
      '};',
      '',
      ...componentSource,
      '',
      `${componentName}.displayName = '${componentName}';`,
      '',
      `export default ${componentName};`,
      '',
    ].join('\n');
  }

  return [
    "import { forwardRef } from 'react';",
    "import type { BusinessIconImageProps } from '../businessTypes';",
    '',
    `type ${componentName}Props = Omit<BusinessIconImageProps, 'color'>;`,
    '',
    ...componentSource,
    '',
    `${componentName}.displayName = '${componentName}';`,
    '',
    `export default ${componentName};`,
    '',
  ].join('\n');
}

export function buildBusinessReactIconsIndex(names: string[]) {
  const sortedNames = [...names].sort((left, right) => left.localeCompare(right));
  return [
    ...sortedNames.map((name) => {
      const componentName = getBusinessIconComponentName(name);
      return `export { default as ${componentName}, default as ${componentName}Icon, default as YCloud${componentName} } from './business-icons/${name}';`;
    }),
    "export type { BusinessIconImageProps } from './businessTypes';",
    '',
  ].join('\n');
}

function buildBusinessReactTypes() {
  return [
    "import type { SVGProps } from 'react';",
    '',
    "export interface BusinessIconImageProps extends Omit<SVGProps<SVGSVGElement>, 'color' | 'width' | 'height'> {",
    '  size?: number | string;',
    '  width?: number | string;',
    '  height?: number | string;',
    '  alt?: string;',
    '  color?: string;',
    '}',
    '',
  ].join('\n');
}

export function buildBusinessPreactIconModule(
  name: string,
  svg: string,
  colorMode: BusinessIconColorMode,
) {
  const componentName = getBusinessIconComponentName(name);
  const propsType = getBusinessSvgPropsType(componentName, colorMode);
  const propsPattern = getBusinessSvgPropsPattern(
    colorMode,
    svg.includes(secondaryColorToken),
  );

  return [
    "import { h } from 'preact';",
    "import type { BusinessIconImageProps } from '../businessTypes';",
    '',
    ...buildBusinessIconExtraProps(componentName, colorMode),
    `const ${componentName} = (${propsPattern}: ${propsType}) =>`,
    ...buildHSvgElement(svg, colorMode),
    '',
    `export default ${componentName};`,
    '',
  ].join('\n');
}

export function buildBusinessVueIconModule(
  name: string,
  svg: string,
  colorMode: BusinessIconColorMode,
) {
  const componentName = getBusinessIconComponentName(name);
  const propsType = getBusinessSvgPropsType(componentName, colorMode);
  const propsPattern = getBusinessSvgPropsPattern(
    colorMode,
    svg.includes(secondaryColorToken),
  );

  return [
    "import { h, type FunctionalComponent } from 'vue';",
    "import type { BusinessIconImageProps } from '../businessTypes';",
    '',
    ...buildBusinessIconExtraProps(componentName, colorMode),
    `const ${componentName}: FunctionalComponent<${propsType}> = (${propsPattern}) =>`,
    ...buildHSvgElement(svg, colorMode),
    '',
    `export default ${componentName};`,
    '',
  ].join('\n');
}

export function buildBusinessSolidIconModule(
  name: string,
  svg: string,
  colorMode: BusinessIconColorMode,
) {
  const componentName = getBusinessIconComponentName(name);
  const propsType = getBusinessSvgPropsType(componentName, colorMode);
  const propsPattern = getBusinessSvgPropsPattern(
    colorMode,
    svg.includes(secondaryColorToken),
  );

  return [
    "import type { BusinessIconImageProps } from '../businessTypes';",
    '',
    ...buildBusinessIconExtraProps(componentName, colorMode),
    `const ${componentName} = (${propsPattern}: ${propsType}) => (`,
    ...buildMarkupSvgElement(svg, colorMode),
    ');',
    '',
    `export default ${componentName};`,
    '',
  ].join('\n');
}

export function buildBusinessReactNativeIconModule(name: string, dataUri: string) {
  const componentName = getBusinessIconComponentName(name);

  return [
    "import { Image } from 'react-native';",
    "import type { BusinessIconImageProps } from '../businessTypes';",
    '',
    `const dataUri = ${toStringLiteral(dataUri)};`,
    '',
    `const ${componentName} = ({ size = 24, width, height, source, ...props }: BusinessIconImageProps) => (`,
    '  <Image',
    '    {...props}',
    '    source={source ?? { uri: dataUri }}',
    '    style={[{ width: width ?? size, height: height ?? size }, props.style]}',
    '  />',
    ');',
    '',
    `export default ${componentName};`,
    '',
  ].join('\n');
}

export function buildBusinessSvelteIconModule(
  name: string,
  svg: string,
  colorMode: BusinessIconColorMode,
) {
  const componentName = getBusinessIconComponentName(name);
  const propsType = getBusinessSvgPropsType(componentName, colorMode);
  const propsPattern = getBusinessSvgPropsPattern(
    colorMode,
    svg.includes(secondaryColorToken),
  );

  return [
    '<script lang="ts">',
    "  import type { BusinessIconImageProps } from '../businessTypes.js';",
    ...buildBusinessIconExtraProps(componentName, colorMode).map((line) =>
      line ? `  ${line}` : line,
    ),
    `  const ${propsPattern}: ${propsType} = $props();`,
    '</script>',
    '',
    ...buildMarkupSvgElement(svg, colorMode),
    '',
  ].join('\n');
}

export function buildBusinessAstroIconModule(
  name: string,
  svg: string,
  colorMode: BusinessIconColorMode,
) {
  const componentName = getBusinessIconComponentName(name);
  const propsType = getBusinessSvgPropsType(componentName, colorMode);
  const propsPattern = getBusinessSvgPropsPattern(
    colorMode,
    svg.includes(secondaryColorToken),
  );

  return [
    '---',
    "import type { BusinessIconImageProps } from '../businessTypes';",
    ...buildBusinessIconExtraProps(componentName, colorMode),
    `const ${propsPattern}: ${propsType} = Astro.props;`,
    '---',
    '',
    ...buildMarkupSvgElement(svg, colorMode),
    '',
  ].join('\n');
}

export function buildBusinessIconsComponentIndex(
  names: string[],
  extension = '',
  typeImportExtension = '',
) {
  const sortedNames = [...names].sort((left, right) => left.localeCompare(right));
  return [
    ...sortedNames.map((name) => {
      const componentName = getBusinessIconComponentName(name);
      return `export { default as ${componentName}, default as ${componentName}Icon, default as YCloud${componentName} } from './business-icons/${name}${extension}';`;
    }),
    `export type { BusinessIconImageProps } from './businessTypes${typeImportExtension}';`,
    '',
  ].join('\n');
}

function buildBusinessHtmlImageTypes() {
  return [
    'export interface BusinessIconImageProps {',
    '  size?: number | string;',
    '  width?: number | string;',
    '  height?: number | string;',
    '  alt?: string;',
    '  color?: string;',
    '  secondaryColor?: string;',
    '  style?: unknown;',
    '  [key: string]: unknown;',
    '}',
    '',
  ].join('\n');
}

function buildBusinessSvelteTypes() {
  return [
    "import type { SVGAttributes } from 'svelte/elements';",
    '',
    "export interface BusinessIconImageProps extends Omit<SVGAttributes<SVGSVGElement>, 'color' | 'width' | 'height'> {",
    '  size?: number | string;',
    '  width?: number | string;',
    '  height?: number | string;',
    '  alt?: string;',
    '  color?: string;',
    '  secondaryColor?: string;',
    '}',
    '',
  ].join('\n');
}

function buildBusinessSolidTypes() {
  return [
    "import type { JSX } from 'solid-js';",
    '',
    "export interface BusinessIconImageProps extends Omit<JSX.SvgSVGAttributes<SVGSVGElement>, 'color' | 'width' | 'height'> {",
    '  size?: number | string;',
    '  width?: number | string;',
    '  height?: number | string;',
    '  alt?: string;',
    '  color?: string;',
    '  secondaryColor?: string;',
    '}',
    '',
  ].join('\n');
}

function buildBusinessReactNativeTypes() {
  return [
    "import type { ImageProps } from 'react-native';",
    '',
    "export interface BusinessIconImageProps extends Omit<ImageProps, 'source'> {",
    '  size?: number;',
    '  width?: number;',
    '  height?: number;',
    "  source?: ImageProps['source'];",
    '}',
    '',
  ].join('\n');
}

function hasTarget(targets: Target[], target: Target) {
  return targets.includes(target);
}

async function resetOutputDirectory(targets: Target[]) {
  if (hasTarget(targets, 'core')) {
    await fs.rm(corePackageIconsDir, { recursive: true, force: true });
    await fs.mkdir(corePackageIconsDir, { recursive: true });
  }

  if (hasTarget(targets, 'data')) {
    await fs.rm(iconsDataPackageIconsDir, { recursive: true, force: true });
    await fs.mkdir(iconsDataPackageIconsDir, { recursive: true });
  }

  if (hasTarget(targets, 'react')) {
    await fs.rm(reactPackageIconsDir, { recursive: true, force: true });
    await fs.mkdir(reactPackageIconsDir, { recursive: true });
  }

  if (hasTarget(targets, 'static')) {
    await fs.rm(staticPackageIconsDir, { recursive: true, force: true });
    await fs.mkdir(staticPackageIconsDir, { recursive: true });
  }

  if (hasTarget(targets, 'preact')) {
    await fs.rm(preactPackageIconsDir, { recursive: true, force: true });
    await fs.mkdir(preactPackageIconsDir, { recursive: true });
  }

  if (hasTarget(targets, 'vue')) {
    await fs.rm(vuePackageIconsDir, { recursive: true, force: true });
    await fs.mkdir(vuePackageIconsDir, { recursive: true });
  }

  if (hasTarget(targets, 'solid')) {
    await fs.rm(solidPackageIconsDir, { recursive: true, force: true });
    await fs.mkdir(solidPackageIconsDir, { recursive: true });
  }

  if (hasTarget(targets, 'react-native')) {
    await fs.rm(reactNativePackageIconsDir, { recursive: true, force: true });
    await fs.mkdir(reactNativePackageIconsDir, { recursive: true });
  }

  if (hasTarget(targets, 'svelte')) {
    await fs.rm(sveltePackageIconsDir, { recursive: true, force: true });
    await fs.mkdir(sveltePackageIconsDir, { recursive: true });
  }

  if (hasTarget(targets, 'astro')) {
    await fs.rm(astroPackageIconsDir, { recursive: true, force: true });
    await fs.mkdir(astroPackageIconsDir, { recursive: true });
  }

  if (hasTarget(targets, 'angular')) {
    await fs.rm(angularPackageIconsDir, { recursive: true, force: true });
    await fs.mkdir(angularPackageIconsDir, { recursive: true });
  }
}

async function readBusinessIconSources() {
  try {
    const readSvgFiles = async (dir: string): Promise<string[]> => {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      const files = await Promise.all(
        entries.map(async (entry) => {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            return readSvgFiles(fullPath);
          }
          if (entry.isFile() && entry.name.endsWith('.svg')) {
            return [path.relative(businessIconsDir, fullPath)];
          }
          return [];
        }),
      );
      return files.flat();
    };
    return (await readSvgFiles(businessIconsDir))
      .map((sourcePath): BusinessIconSource => {
        const parsed = path.parse(sourcePath);
        return {
          name: parsed.name,
          sourcePath,
          staticPath: sourcePath,
          colorMode:
            sourcePath.split(path.sep)[0] === 'duotone'
              ? 'duotone'
              : sourcePath.split(path.sep)[0] === 'multicolor'
                ? 'multicolor'
                : 'mono',
        };
      })
      .sort((left, right) => left.name.localeCompare(right.name));
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

export async function generateBusinessIconsPackage(targets: Target[] = [...allTargets]) {
  const sources = await readBusinessIconSources();
  const names = sources.map((source) => source.name);
  const duplicateNames = names.filter((name, index) => names.indexOf(name) !== index);
  if (duplicateNames.length > 0) {
    throw new Error(
      `Business icon names must be unique across categories because package exports are flat: ${[
        ...new Set(duplicateNames),
      ].join(', ')}`,
    );
  }
  await resetOutputDirectory(targets);

  await Promise.all(
    sources.map(async (source) => {
      const { name } = source;
      const svg = await fs.readFile(path.join(businessIconsDir, source.sourcePath), 'utf-8');
      const dataUri = buildBusinessIconDataUri(svg);
      const writes: Promise<unknown>[] = [];

      if (hasTarget(targets, 'core')) {
        writes.push(
          fs.writeFile(
            path.join(corePackageIconsDir, `${name}.ts`),
            buildBusinessIconModule(name, svg, source.colorMode),
          ),
        );
      }

      if (hasTarget(targets, 'data')) {
        writes.push(
          fs.writeFile(
            path.join(iconsDataPackageIconsDir, `${name}.ts`),
            buildBusinessIconModule(name, svg, source.colorMode),
          ),
        );
      }

      if (hasTarget(targets, 'react')) {
        writes.push(
          fs.writeFile(
            path.join(reactPackageIconsDir, `${name}.tsx`),
            buildBusinessReactIconModule(name, source.colorMode, svg),
          ),
        );
      }

      if (hasTarget(targets, 'static')) {
        const staticOutputPath = path.join(staticPackageIconsDir, source.staticPath);
        writes.push(
          fs
            .mkdir(path.dirname(staticOutputPath), { recursive: true })
            .then(() =>
              fs.copyFile(path.join(businessIconsDir, source.sourcePath), staticOutputPath),
            ),
        );
      }

      if (hasTarget(targets, 'preact')) {
        writes.push(
          fs.writeFile(
            path.join(preactPackageIconsDir, `${name}.ts`),
            buildBusinessPreactIconModule(name, svg, source.colorMode),
          ),
        );
      }

      if (hasTarget(targets, 'vue')) {
        writes.push(
          fs.writeFile(
            path.join(vuePackageIconsDir, `${name}.ts`),
            buildBusinessVueIconModule(name, svg, source.colorMode),
          ),
        );
      }

      if (hasTarget(targets, 'solid')) {
        writes.push(
          fs.writeFile(
            path.join(solidPackageIconsDir, `${name}.tsx`),
            buildBusinessSolidIconModule(name, svg, source.colorMode),
          ),
        );
      }

      if (hasTarget(targets, 'react-native')) {
        writes.push(
          fs.writeFile(
            path.join(reactNativePackageIconsDir, `${name}.tsx`),
            buildBusinessReactNativeIconModule(name, dataUri),
          ),
        );
      }

      if (hasTarget(targets, 'svelte')) {
        writes.push(
          fs.writeFile(
            path.join(sveltePackageIconsDir, `${name}.svelte`),
            buildBusinessSvelteIconModule(name, svg, source.colorMode),
          ),
        );
      }

      if (hasTarget(targets, 'astro')) {
        writes.push(
          fs.writeFile(
            path.join(astroPackageIconsDir, `${name}.astro`),
            buildBusinessAstroIconModule(name, svg, source.colorMode),
          ),
        );
      }

      if (hasTarget(targets, 'angular')) {
        writes.push(
          fs.writeFile(
            path.join(angularPackageIconsDir, `${name}.ts`),
            buildBusinessIconModule(name, svg, source.colorMode),
          ),
        );
      }

      await Promise.all(writes);
    }),
  );

  if (hasTarget(targets, 'core')) {
    await fs.writeFile(
      path.join(corePackageSrcDir, 'business.ts'),
      buildBusinessIconsIndex(sources),
    );
  }

  if (hasTarget(targets, 'data')) {
    await fs.writeFile(
      path.join(iconsDataPackageSrcDir, 'business.ts'),
      buildBusinessIconsIndex(sources),
    );
  }

  if (hasTarget(targets, 'react')) {
    await fs.writeFile(
      path.join(reactPackageSrcDir, 'business.ts'),
      buildBusinessReactIconsIndex(names),
    );
    await fs.writeFile(
      path.join(reactPackageSrcDir, 'businessTypes.ts'),
      buildBusinessReactTypes(),
    );
  }

  if (hasTarget(targets, 'preact')) {
    await fs.writeFile(
      path.join(preactPackageSrcDir, 'business.ts'),
      buildBusinessIconsComponentIndex(names),
    );
    await fs.writeFile(
      path.join(preactPackageSrcDir, 'businessTypes.ts'),
      buildBusinessHtmlImageTypes(),
    );
  }

  if (hasTarget(targets, 'vue')) {
    await fs.writeFile(
      path.join(vuePackageSrcDir, 'business.ts'),
      buildBusinessIconsComponentIndex(names),
    );
    await fs.writeFile(
      path.join(vuePackageSrcDir, 'businessTypes.ts'),
      buildBusinessHtmlImageTypes(),
    );
  }

  if (hasTarget(targets, 'solid')) {
    await fs.writeFile(
      path.join(solidPackageSrcDir, 'business.ts'),
      buildBusinessIconsComponentIndex(names),
    );
    await fs.writeFile(
      path.join(solidPackageSrcDir, 'businessTypes.ts'),
      buildBusinessSolidTypes(),
    );
  }

  if (hasTarget(targets, 'react-native')) {
    await fs.writeFile(
      path.join(reactNativePackageSrcDir, 'business.ts'),
      buildBusinessIconsComponentIndex(names),
    );
    await fs.writeFile(
      path.join(reactNativePackageSrcDir, 'businessTypes.ts'),
      buildBusinessReactNativeTypes(),
    );
  }

  if (hasTarget(targets, 'svelte')) {
    await fs.writeFile(
      path.join(sveltePackageSrcDir, 'business-icons.ts'),
      buildBusinessIconsComponentIndex(names, '.svelte', '.js'),
    );
    await fs.writeFile(
      path.join(sveltePackageSrcDir, 'businessTypes.ts'),
      buildBusinessSvelteTypes(),
    );
  }

  if (hasTarget(targets, 'astro')) {
    await fs.writeFile(
      path.join(astroPackageSrcDir, 'business-icons.ts'),
      buildBusinessIconsComponentIndex(names, '.astro'),
    );
    await fs.writeFile(
      path.join(astroPackageSrcDir, 'businessTypes.ts'),
      buildBusinessHtmlImageTypes(),
    );
  }

  if (hasTarget(targets, 'angular')) {
    await fs.writeFile(
      path.join(angularPackageSrcDir, 'business.ts'),
      buildBusinessIconsIndex(sources),
    );
  }
}

function parseTargets(args: string[]): Target[] {
  if (args.length === 0) {
    return [...allTargets];
  }

  return args.flatMap((arg) =>
    arg.split(',').map((target) => {
      if (!allTargets.includes(target as Target)) {
        throw new Error(`Unknown business icon package target: ${target}`);
      }
      return target as Target;
    }),
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await generateBusinessIconsPackage(parseTargets(process.argv.slice(2)));
}
