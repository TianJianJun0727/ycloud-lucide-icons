import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseSync, type INode } from 'svgson';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const illustrationsDir = path.join(repoRoot, 'illustration-icons');
const illustrationPackageDirName = 'illustration-icons';
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

type IllustrationSource = {
  name: string;
  sourcePath: string;
  svg: string;
};

const packageDirs = {
  core: path.join(repoRoot, 'packages/icons/src'),
  data: path.join(repoRoot, 'packages/icons-data/src'),
  react: path.join(repoRoot, 'packages/icons-react/src'),
  preact: path.join(repoRoot, 'packages/icons-preact/src'),
  vue: path.join(repoRoot, 'packages/icons-vue/src'),
  solid: path.join(repoRoot, 'packages/icons-solid/src'),
  reactNative: path.join(repoRoot, 'packages/icons-react-native/src'),
  svelte: path.join(repoRoot, 'packages/icons-svelte/src'),
  astro: path.join(repoRoot, 'packages/icons-astro/src'),
  angular: path.join(repoRoot, 'packages/icons-angular/illustration/src'),
  static: path.join(repoRoot, 'packages/icons-static/illustration-icons'),
};

const reactAttributeNameMap: Record<string, string> = {
  'clip-rule': 'clipRule',
  'fill-rule': 'fillRule',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-width': 'strokeWidth',
  'stroke-miterlimit': 'strokeMiterlimit',
  'stroke-dasharray': 'strokeDasharray',
  'stroke-dashoffset': 'strokeDashoffset',
  'clip-path': 'clipPath',
  'fill-opacity': 'fillOpacity',
  'stroke-opacity': 'strokeOpacity',
  'stop-color': 'stopColor',
  'stop-opacity': 'stopOpacity',
  'color-interpolation-filters': 'colorInterpolationFilters',
  'mask-type': 'maskType',
  'xlink:href': 'xlinkHref',
};

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

function getIllustrationExportBase(name: string) {
  const baseName = toCamelCase(name);
  if (/^[a-zA-Z_$]/.test(baseName)) {
    return baseName;
  }
  return `illustration${toPascalCase(name)}`;
}

function getIllustrationComponentName(name: string) {
  return toPascalCase(getIllustrationExportBase(name));
}

const toStringLiteral = (value: string) => `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const toTemplateLiteral = (value: string) =>
  `\`${value.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\``;
const toDataUri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
const toReactAttributeName = (name: string) => {
  if (reactAttributeNameMap[name]) return reactAttributeNameMap[name];
  if (/^(aria|data)-/.test(name)) return name;
  return name.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
};

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

function buildDataModule(name: string, svg: string) {
  const exportBase = getIllustrationExportBase(name);
  const asset = parseSvgAsset(svg);
  return [
    `export const ${exportBase}Illustration = {`,
    `  name: ${toStringLiteral(name)},`,
    `  attrs: ${JSON.stringify(asset.attrs)},`,
    `  node: ${JSON.stringify(asset.node)},`,
    `} as const;`,
    '',
    `export default ${exportBase}Illustration;`,
    '',
  ].join('\n');
}

function buildDataIndex(sources: IllustrationSource[], includeAliases = true) {
  const sorted = [...sources].sort((left, right) => left.name.localeCompare(right.name));
  const imports = sorted.map(({ name }) => {
    const exportBase = getIllustrationExportBase(name);
    return `import { ${exportBase}Illustration } from './${illustrationPackageDirName}/${name}';`;
  });
  const exports = sorted.flatMap(({ name }) => {
    if (!includeAliases) {
      return [`export * from './${illustrationPackageDirName}/${name}';`];
    }

    const componentName = getIllustrationComponentName(name);
    return [
      `export * from './${illustrationPackageDirName}/${name}';`,
      `export { default as ${componentName}, default as ${componentName}Icon, default as YCloud${componentName} } from './${illustrationPackageDirName}/${name}';`,
    ];
  });
  const names = sorted.map(({ name }) => toStringLiteral(name)).join(', ');
  const entries = sorted.map(({ name }) => {
    const exportBase = getIllustrationExportBase(name);
    return `  ${toStringLiteral(name)}: ${exportBase}Illustration,`;
  });
  return [
    ...imports,
    '',
    ...exports,
    '',
    'export type IllustrationDefinitionNode =',
    '  | readonly [tag: string, attrs: Record<string, string>]',
    '  | readonly [tag: string, attrs: Record<string, string>, children: readonly IllustrationDefinitionNode[]];',
    '',
    'export interface IllustrationDefinition {',
    '  name: string;',
    '  attrs: Record<string, string>;',
    '  node: readonly IllustrationDefinitionNode[];',
    '}',
    '',
    `export const illustrationNames = [${names}] as const;`,
    'export type IllustrationName = (typeof illustrationNames)[number];',
    '',
    'export const illustrations = {',
    ...entries,
    '} as const satisfies Record<string, IllustrationDefinition>;',
    '',
    'export function getIllustration(name: IllustrationName) {',
    '  return illustrations[name];',
    '}',
    '',
  ].join('\n');
}

function buildReactAttribute(name: string, value: string) {
  return `${toReactAttributeName(name)}=${JSON.stringify(value)}`;
}

function buildReactSvgNode(node: INode, indent = 6): string[] {
  const spacing = ' '.repeat(indent);
  const attributes = Object.entries(node.attributes ?? {})
    .map(([name, value]) => buildReactAttribute(name, String(value)))
    .join(' ');
  const openTag = attributes ? `<${node.name} ${attributes}` : `<${node.name}`;
  const children = (node.children ?? []).filter((child) => typeof child !== 'string') as INode[];
  if (children.length === 0) return [`${spacing}${openTag} />`];
  return [
    `${spacing}${openTag}>`,
    ...children.flatMap((child) => buildReactSvgNode(child, indent + 2)),
    `${spacing}</${node.name}>`,
  ];
}

function buildReactSvgElement(svg: string) {
  const root = parseSync(svg);
  const rootAttributes = Object.entries(root.attributes ?? {})
    .filter(([name]) => name !== 'width' && name !== 'height')
    .map(([name, value]) => buildReactAttribute(name, String(value)));
  const children = (root.children ?? []).filter((child) => typeof child !== 'string') as INode[];
  return [
    '    <svg',
    '      ref={ref}',
    ...rootAttributes.map((attribute) => `      ${attribute}`),
    '      width={width}',
    '      height={height}',
    "      role={alt ? 'img' : undefined}",
    '      aria-label={alt || undefined}',
    '      aria-hidden={alt ? undefined : true}',
    '      {...props}',
    '    >',
    ...children.flatMap((child) => buildReactSvgNode(child, 6)),
    '    </svg>',
  ];
}

function buildReactModule(name: string, svg: string) {
  const componentName = getIllustrationComponentName(name);
  return [
    "import { forwardRef } from 'react';",
    "import type { IllustrationProps } from '../illustrationTypes';",
    '',
    `const ${componentName} = forwardRef<SVGSVGElement, IllustrationProps>(`,
    `  ({ width = '100%', height = 'auto', alt = '', ...props }, ref) => (`,
    ...buildReactSvgElement(svg),
    '  ),',
    ');',
    '',
    `${componentName}.displayName = '${componentName}';`,
    '',
    `export default ${componentName};`,
    '',
  ].join('\n');
}

function buildReactTypes() {
  return [
    "import type { SVGProps } from 'react';",
    '',
    "export interface IllustrationProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {",
    '  width?: number | string;',
    '  height?: number | string;',
    '  alt?: string;',
    '}',
    '',
  ].join('\n');
}

function buildImgModule(name: string, dataUri: string, framework: 'preact' | 'vue') {
  const componentName = getIllustrationComponentName(name);
  if (framework === 'preact') {
    return [
      "import { h } from 'preact';",
      "import type { IllustrationProps } from '../illustrationTypes';",
      '',
      `const dataUri = ${toStringLiteral(dataUri)};`,
      '',
      `const ${componentName} = ({ width = '100%', height = 'auto', alt = '', ...props }: IllustrationProps) =>`,
      "  h('img', { ...props, src: dataUri, alt, width, height });",
      '',
      `export default ${componentName};`,
      '',
    ].join('\n');
  }
  return [
    "import { h, type FunctionalComponent } from 'vue';",
    "import type { IllustrationProps } from '../illustrationTypes';",
    '',
    `const dataUri = ${toStringLiteral(dataUri)};`,
    '',
    `const ${componentName}: FunctionalComponent<IllustrationProps> = ({ width = '100%', height = 'auto', alt = '', ...props }) =>`,
    "  h('img', { ...props, src: dataUri, alt, width, height });",
    '',
    `export default ${componentName};`,
    '',
  ].join('\n');
}

function buildSolidModule(name: string, dataUri: string) {
  const componentName = getIllustrationComponentName(name);
  return [
    "import { mergeProps } from 'solid-js';",
    "import type { IllustrationProps } from '../illustrationTypes';",
    '',
    `const dataUri = ${toStringLiteral(dataUri)};`,
    '',
    `const ${componentName} = (props: IllustrationProps) => {`,
    "  const mergedProps = mergeProps({ src: dataUri, alt: '', width: '100%', height: 'auto' }, props);",
    '  return <img {...mergedProps} />;',
    '};',
    '',
    `export default ${componentName};`,
    '',
  ].join('\n');
}

function buildReactNativeModule(name: string, dataUri: string) {
  const componentName = getIllustrationComponentName(name);
  return [
    "import { Image } from 'react-native';",
    "import type { IllustrationProps } from '../illustrationTypes';",
    '',
    `const dataUri = ${toStringLiteral(dataUri)};`,
    '',
    `const ${componentName} = ({ width = '100%', height = 'auto', source, ...props }: IllustrationProps) => (`,
    '  <Image',
    '    {...props}',
    '    source={source ?? { uri: dataUri }}',
    '    style={[{ width, height }, props.style]}',
    '  />',
    ');',
    '',
    `export default ${componentName};`,
    '',
  ].join('\n');
}

function buildSvelteModule(dataUri: string) {
  return [
    '<script lang="ts">',
    `  const dataUri = ${toStringLiteral(dataUri)};`,
    "  const { width = '100%', height = 'auto', alt = '', ...props } = $props();",
    '</script>',
    '',
    '<img src={dataUri} {alt} {width} {height} {...props} />',
    '',
  ].join('\n');
}

function buildAstroModule(dataUri: string) {
  return [
    '---',
    `const dataUri = ${toStringLiteral(dataUri)};`,
    "const { width = '100%', height = 'auto', alt = '', ...props } = Astro.props;",
    '---',
    '',
    '<img src={dataUri} alt={alt} width={width} height={height} {...props} />',
    '',
  ].join('\n');
}

function buildComponentIndex(names: string[], extension = '', typeImportExtension = '') {
  const sorted = [...names].sort((left, right) => left.localeCompare(right));
  return [
    ...sorted.map((name) => {
      const componentName = getIllustrationComponentName(name);
      return `export { default as ${componentName}, default as ${componentName}Icon, default as YCloud${componentName} } from './${illustrationPackageDirName}/${name}${extension}';`;
    }),
    `export type { IllustrationProps } from './illustrationTypes${typeImportExtension}';`,
    '',
  ].join('\n');
}

function buildHtmlTypes() {
  return [
    'export interface IllustrationProps {',
    '  width?: number | string;',
    '  height?: number | string;',
    '  alt?: string;',
    '  [key: string]: unknown;',
    '}',
    '',
  ].join('\n');
}

function buildSolidTypes() {
  return [
    "import type { JSX } from 'solid-js';",
    '',
    'export interface IllustrationProps extends JSX.ImgHTMLAttributes<HTMLImageElement> {}',
    '',
  ].join('\n');
}

function buildReactNativeTypes() {
  return [
    "import type { ImageProps, DimensionValue } from 'react-native';",
    '',
    "export interface IllustrationProps extends Omit<ImageProps, 'source'> {",
    '  width?: DimensionValue;',
    '  height?: DimensionValue;',
    "  source?: ImageProps['source'];",
    '}',
    '',
  ].join('\n');
}

async function readSources(): Promise<IllustrationSource[]> {
  try {
    const entries = await fs.readdir(illustrationsDir, { withFileTypes: true });
    const sources = await Promise.all(
      entries
        .filter((entry) => entry.isFile() && entry.name.endsWith('.svg'))
        .map(async (entry) => {
          const sourcePath = entry.name;
          return {
            name: path.basename(entry.name, '.svg'),
            sourcePath,
            svg: await fs.readFile(path.join(illustrationsDir, sourcePath), 'utf-8'),
          };
        }),
    );
    return sources.sort((left, right) => left.name.localeCompare(right.name));
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') return [];
    throw error;
  }
}

async function reset(targets: Target[]) {
  const dirs = [
    ['core', path.join(packageDirs.core, illustrationPackageDirName)],
    ['data', path.join(packageDirs.data, illustrationPackageDirName)],
    ['react', path.join(packageDirs.react, illustrationPackageDirName)],
    ['preact', path.join(packageDirs.preact, illustrationPackageDirName)],
    ['vue', path.join(packageDirs.vue, illustrationPackageDirName)],
    ['solid', path.join(packageDirs.solid, illustrationPackageDirName)],
    ['react-native', path.join(packageDirs.reactNative, illustrationPackageDirName)],
    ['svelte', path.join(packageDirs.svelte, illustrationPackageDirName)],
    ['astro', path.join(packageDirs.astro, illustrationPackageDirName)],
    ['angular', path.join(packageDirs.angular, illustrationPackageDirName)],
    ['static', packageDirs.static],
  ] as const;

  await Promise.all(
    dirs
      .filter(([target]) => targets.includes(target))
      .map(([, dir]) => fs.rm(dir, { recursive: true, force: true }).then(() => fs.mkdir(dir, { recursive: true }))),
  );
}

export async function generateIllustrationsPackage(targets: Target[] = [...allTargets]) {
  const sources = await readSources();
  const names = sources.map((source) => source.name);
  await reset(targets);

  await Promise.all(
    sources.map(async (source) => {
      const dataUri = toDataUri(source.svg);
      const writes: Promise<unknown>[] = [];
      if (targets.includes('core')) {
        writes.push(
          fs.writeFile(path.join(packageDirs.core, illustrationPackageDirName, `${source.name}.ts`), buildDataModule(source.name, source.svg)),
        );
      }
      if (targets.includes('data')) {
        writes.push(
          fs.writeFile(path.join(packageDirs.data, illustrationPackageDirName, `${source.name}.ts`), buildDataModule(source.name, source.svg)),
        );
      }
      if (targets.includes('angular')) {
        writes.push(
          fs.writeFile(path.join(packageDirs.angular, illustrationPackageDirName, `${source.name}.ts`), buildDataModule(source.name, source.svg)),
        );
      }
      if (targets.includes('react')) {
        writes.push(
          fs.writeFile(path.join(packageDirs.react, illustrationPackageDirName, `${source.name}.tsx`), buildReactModule(source.name, source.svg)),
        );
      }
      if (targets.includes('preact')) {
        writes.push(
          fs.writeFile(path.join(packageDirs.preact, illustrationPackageDirName, `${source.name}.ts`), buildImgModule(source.name, dataUri, 'preact')),
        );
      }
      if (targets.includes('vue')) {
        writes.push(
          fs.writeFile(path.join(packageDirs.vue, illustrationPackageDirName, `${source.name}.ts`), buildImgModule(source.name, dataUri, 'vue')),
        );
      }
      if (targets.includes('solid')) {
        writes.push(
          fs.writeFile(path.join(packageDirs.solid, illustrationPackageDirName, `${source.name}.tsx`), buildSolidModule(source.name, dataUri)),
        );
      }
      if (targets.includes('react-native')) {
        writes.push(
          fs.writeFile(
            path.join(packageDirs.reactNative, illustrationPackageDirName, `${source.name}.tsx`),
            buildReactNativeModule(source.name, dataUri),
          ),
        );
      }
      if (targets.includes('svelte')) {
        writes.push(fs.writeFile(path.join(packageDirs.svelte, illustrationPackageDirName, `${source.name}.svelte`), buildSvelteModule(dataUri)));
      }
      if (targets.includes('astro')) {
        writes.push(fs.writeFile(path.join(packageDirs.astro, illustrationPackageDirName, `${source.name}.astro`), buildAstroModule(dataUri)));
      }
      if (targets.includes('static')) {
        writes.push(fs.copyFile(path.join(illustrationsDir, source.sourcePath), path.join(packageDirs.static, source.sourcePath)));
      }
      await Promise.all(writes);
    }),
  );

  if (targets.includes('core')) await fs.writeFile(path.join(packageDirs.core, 'illustration.ts'), buildDataIndex(sources));
  if (targets.includes('data')) await fs.writeFile(path.join(packageDirs.data, 'illustration.ts'), buildDataIndex(sources));
  if (targets.includes('angular')) await fs.writeFile(path.join(packageDirs.angular, 'illustration.ts'), buildDataIndex(sources));
  if (targets.includes('react')) {
    await fs.writeFile(path.join(packageDirs.react, 'illustration.ts'), buildComponentIndex(names));
    await fs.writeFile(path.join(packageDirs.react, 'illustrationTypes.ts'), buildReactTypes());
  }
  if (targets.includes('preact')) {
    await fs.writeFile(path.join(packageDirs.preact, 'illustration.ts'), buildComponentIndex(names));
    await fs.writeFile(path.join(packageDirs.preact, 'illustrationTypes.ts'), buildHtmlTypes());
  }
  if (targets.includes('vue')) {
    await fs.writeFile(path.join(packageDirs.vue, 'illustration.ts'), buildComponentIndex(names));
    await fs.writeFile(path.join(packageDirs.vue, 'illustrationTypes.ts'), buildHtmlTypes());
  }
  if (targets.includes('solid')) {
    await fs.writeFile(path.join(packageDirs.solid, 'illustration.ts'), buildComponentIndex(names));
    await fs.writeFile(path.join(packageDirs.solid, 'illustrationTypes.ts'), buildSolidTypes());
  }
  if (targets.includes('react-native')) {
    await fs.writeFile(path.join(packageDirs.reactNative, 'illustration.ts'), buildComponentIndex(names));
    await fs.writeFile(path.join(packageDirs.reactNative, 'illustrationTypes.ts'), buildReactNativeTypes());
  }
  if (targets.includes('svelte')) {
    await fs.writeFile(path.join(packageDirs.svelte, 'illustration-icons.ts'), buildComponentIndex(names, '.svelte', '.js'));
    await fs.writeFile(path.join(packageDirs.svelte, 'illustrationTypes.ts'), buildHtmlTypes());
  }
  if (targets.includes('astro')) {
    await fs.writeFile(path.join(packageDirs.astro, 'illustration-icons.ts'), buildComponentIndex(names, '.astro'));
    await fs.writeFile(path.join(packageDirs.astro, 'illustrationTypes.ts'), buildHtmlTypes());
  }
}

function parseTargets(args: string[]): Target[] {
  if (args.length === 0) return [...allTargets];
  return args.flatMap((arg) =>
    arg.split(',').map((target) => {
      if (!allTargets.includes(target as Target)) throw new Error(`Unknown illustration package target: ${target}`);
      return target as Target;
    }),
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await generateIllustrationsPackage(parseTargets(process.argv.slice(2)));
}
