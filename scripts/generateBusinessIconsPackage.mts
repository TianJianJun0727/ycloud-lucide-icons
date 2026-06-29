import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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
const angularPackageSrcDir = path.join(repoRoot, 'packages/icons-angular/src');
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

export function buildBusinessIconModule(name: string, svg: string) {
  const exportBase = getBusinessIconExportBase(name);
  const encodedSvg = encodeURIComponent(svg);

  return [
    `export const ${exportBase}Svg = ${toTemplateLiteral(svg)};`,
    `export const ${exportBase}DataUri = ${toStringLiteral(`data:image/svg+xml;utf8,${encodedSvg}`)};`,
    `export const ${exportBase}Icon = {`,
    `  name: ${toStringLiteral(name)},`,
    `  svg: ${exportBase}Svg,`,
    `  dataUri: ${exportBase}DataUri,`,
    `} as const;`,
    '',
    `export default ${exportBase}Icon;`,
    '',
  ].join('\n');
}

export function buildBusinessIconsIndex(names: string[]) {
  const sortedNames = [...names].sort((left, right) => left.localeCompare(right));
  const imports = sortedNames.map((name) => {
    const exportBase = getBusinessIconExportBase(name);
    return `import { ${exportBase}Icon } from './business-icons/${name}';`;
  });
  const exports = sortedNames.map((name) => `export * from './business-icons/${name}';`);
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
    'export interface BusinessIconDefinition {',
    '  name: string;',
    '  svg: string;',
    '  dataUri: string;',
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

export function buildBusinessReactIconModule(name: string) {
  const exportBase = getBusinessIconExportBase(name);
  const componentName = getBusinessIconComponentName(name);

  return [
    "import { forwardRef } from 'react';",
    "import type { BusinessIconImageProps } from '../businessTypes';",
    `import { ${exportBase}DataUri } from '@ycloud-web/icons/business';`,
    '',
    `const ${componentName} = forwardRef<HTMLImageElement, BusinessIconImageProps>(`,
    "  ({ size = 24, width, height, alt = '', ...props }, ref) => (",
    '    <img',
    '      ref={ref}',
    `      src={${exportBase}DataUri}`,
    '      alt={alt}',
    '      width={width ?? size}',
    '      height={height ?? size}',
    '      {...props}',
    '    />',
    '  ),',
    ');',
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
      return `export { default as ${componentName} } from './business-icons/${name}';`;
    }),
    "export type { BusinessIconImageProps } from './businessTypes';",
    '',
  ].join('\n');
}

function buildBusinessReactTypes() {
  return [
    "import type { ImgHTMLAttributes } from 'react';",
    '',
    'export interface BusinessIconImageProps extends ImgHTMLAttributes<HTMLImageElement> {',
    '  size?: number | string;',
    '}',
    '',
  ].join('\n');
}

export function buildBusinessPreactIconModule(name: string) {
  const exportBase = getBusinessIconExportBase(name);
  const componentName = getBusinessIconComponentName(name);

  return [
    "import { h } from 'preact';",
    "import type { BusinessIconImageProps } from '../businessTypes';",
    `import { ${exportBase}DataUri } from '@ycloud-web/icons/business';`,
    '',
    `const ${componentName} = ({ size = 24, width, height, alt = '', ...props }: BusinessIconImageProps) =>`,
    `  h('img', { ...props, src: ${exportBase}DataUri, alt, width: width ?? size, height: height ?? size });`,
    '',
    `export default ${componentName};`,
    '',
  ].join('\n');
}

export function buildBusinessVueIconModule(name: string) {
  const exportBase = getBusinessIconExportBase(name);
  const componentName = getBusinessIconComponentName(name);

  return [
    "import { h, type FunctionalComponent } from 'vue';",
    "import type { BusinessIconImageProps } from '../businessTypes';",
    `import { ${exportBase}DataUri } from '@ycloud-web/icons/business';`,
    '',
    `const ${componentName}: FunctionalComponent<BusinessIconImageProps> = ({ size = 24, width, height, alt = '', ...props }) =>`,
    `  h('img', { ...props, src: ${exportBase}DataUri, alt, width: width ?? size, height: height ?? size });`,
    '',
    `export default ${componentName};`,
    '',
  ].join('\n');
}

export function buildBusinessSolidIconModule(name: string) {
  const exportBase = getBusinessIconExportBase(name);
  const componentName = getBusinessIconComponentName(name);

  return [
    "import type { BusinessIconImageProps } from '../businessTypes';",
    `import { ${exportBase}DataUri } from '@ycloud-web/icons/business';`,
    '',
    `const ${componentName} = (props: BusinessIconImageProps) => {`,
    '  const size = () => props.size ?? 24;',
    '',
    '  return (',
    '    <img',
    `      src={${exportBase}DataUri}`,
    "      alt={props.alt ?? ''}",
    '      width={props.width ?? size()}',
    '      height={props.height ?? size()}',
    '      {...props}',
    '    />',
    '  );',
    '};',
    '',
    `export default ${componentName};`,
    '',
  ].join('\n');
}

export function buildBusinessReactNativeIconModule(name: string) {
  const exportBase = getBusinessIconExportBase(name);
  const componentName = getBusinessIconComponentName(name);

  return [
    "import { Image } from 'react-native';",
    "import type { BusinessIconImageProps } from '../businessTypes';",
    `import { ${exportBase}DataUri } from '@ycloud-web/icons/business';`,
    '',
    `const ${componentName} = ({ size = 24, width, height, source, ...props }: BusinessIconImageProps) => (`,
    '  <Image',
    '    {...props}',
    `    source={source ?? { uri: ${exportBase}DataUri }}`,
    '    style={[{ width: width ?? size, height: height ?? size }, props.style]}',
    '  />',
    ');',
    '',
    `export default ${componentName};`,
    '',
  ].join('\n');
}

export function buildBusinessSvelteIconModule(name: string) {
  const exportBase = getBusinessIconExportBase(name);

  return [
    '<script lang="ts">',
    `  import { ${exportBase}DataUri } from '@ycloud-web/icons/business';`,
    '',
    "  const { size = 24, width, height, alt = '', ...props } = $props();",
    '</script>',
    '',
    '<img',
    `  src={${exportBase}DataUri}`,
    '  {alt}',
    '  width={width ?? size}',
    '  height={height ?? size}',
    '  {...props}',
    '/>',
    '',
  ].join('\n');
}

export function buildBusinessAstroIconModule(name: string) {
  const exportBase = getBusinessIconExportBase(name);

  return [
    '---',
    `import { ${exportBase}DataUri } from '@ycloud-web/icons/business';`,
    '',
    "const { size = 24, width, height, alt = '', ...props } = Astro.props;",
    '---',
    '',
    '<img',
    `  src={${exportBase}DataUri}`,
    '  alt={alt}',
    '  width={width ?? size}',
    '  height={height ?? size}',
    '  {...props}',
    '/>',
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
      return `export { default as ${componentName} } from './business-icons/${name}${extension}';`;
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
    '  [key: string]: unknown;',
    '}',
    '',
  ].join('\n');
}

function buildBusinessSolidTypes() {
  return [
    "import type { JSX } from 'solid-js';",
    '',
    'export interface BusinessIconImageProps extends JSX.ImgHTMLAttributes<HTMLImageElement> {',
    '  size?: number | string;',
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
      const writes: Promise<unknown>[] = [];

      if (hasTarget(targets, 'core')) {
        writes.push(
          fs.writeFile(
            path.join(corePackageIconsDir, `${name}.ts`),
            buildBusinessIconModule(name, svg),
          ),
        );
      }

      if (hasTarget(targets, 'data')) {
        writes.push(
          fs.writeFile(
            path.join(iconsDataPackageIconsDir, `${name}.ts`),
            buildBusinessIconModule(name, svg),
          ),
        );
      }

      if (hasTarget(targets, 'react')) {
        writes.push(
          fs.writeFile(
            path.join(reactPackageIconsDir, `${name}.tsx`),
            buildBusinessReactIconModule(name),
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
            buildBusinessPreactIconModule(name),
          ),
        );
      }

      if (hasTarget(targets, 'vue')) {
        writes.push(
          fs.writeFile(
            path.join(vuePackageIconsDir, `${name}.ts`),
            buildBusinessVueIconModule(name),
          ),
        );
      }

      if (hasTarget(targets, 'solid')) {
        writes.push(
          fs.writeFile(
            path.join(solidPackageIconsDir, `${name}.tsx`),
            buildBusinessSolidIconModule(name),
          ),
        );
      }

      if (hasTarget(targets, 'react-native')) {
        writes.push(
          fs.writeFile(
            path.join(reactNativePackageIconsDir, `${name}.tsx`),
            buildBusinessReactNativeIconModule(name),
          ),
        );
      }

      if (hasTarget(targets, 'svelte')) {
        writes.push(
          fs.writeFile(
            path.join(sveltePackageIconsDir, `${name}.svelte`),
            buildBusinessSvelteIconModule(name),
          ),
        );
      }

      if (hasTarget(targets, 'astro')) {
        writes.push(
          fs.writeFile(
            path.join(astroPackageIconsDir, `${name}.astro`),
            buildBusinessAstroIconModule(name),
          ),
        );
      }

      if (hasTarget(targets, 'angular')) {
        writes.push(
          fs.writeFile(
            path.join(angularPackageIconsDir, `${name}.ts`),
            buildBusinessIconModule(name, svg),
          ),
        );
      }

      await Promise.all(writes);
    }),
  );

  if (hasTarget(targets, 'core')) {
    await fs.writeFile(path.join(corePackageSrcDir, 'business.ts'), buildBusinessIconsIndex(names));
  }

  if (hasTarget(targets, 'data')) {
    await fs.writeFile(
      path.join(iconsDataPackageSrcDir, 'business.ts'),
      buildBusinessIconsIndex(names),
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
      path.join(sveltePackageSrcDir, 'business.ts'),
      buildBusinessIconsComponentIndex(names, '.svelte', '.js'),
    );
    await fs.writeFile(
      path.join(sveltePackageSrcDir, 'businessTypes.ts'),
      buildBusinessHtmlImageTypes(),
    );
  }

  if (hasTarget(targets, 'astro')) {
    await fs.writeFile(
      path.join(astroPackageSrcDir, 'business.ts'),
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
      buildBusinessIconsIndex(names),
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
