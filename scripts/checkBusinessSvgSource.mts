/**
 * Validate business-specific SVG source files.
 *
 * These SVGs may keep fixed colors, fills, gradients, and product-specific
 * shapes, so they intentionally do not reuse the generic icon source rules.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseSync, type INode } from 'svgson';

const BUSINESS_ICONS_DIR = 'business-icons';
const BUSINESS_ICON_INDEX_FILE = path.join(BUSINESS_ICONS_DIR, 'index.json');
const BUSINESS_CATEGORY_NAMES = new Set([
  'inbox',
  'menu',
  'chatbot',
  'outlined',
  'filled',
  'basic',
  'filter',
]);
const SVG_FILENAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*\.svg$/;

export function validateBusinessSvgFileName(file: string) {
  const fileName = path.basename(file);
  const normalizedFile = file.split(path.sep).join('/');
  const businessPrefix = `${BUSINESS_ICONS_DIR}/`;
  const businessPrefixIndex = normalizedFile.lastIndexOf(businessPrefix);
  const relativePath =
    businessPrefixIndex === -1
      ? normalizedFile
      : normalizedFile.slice(businessPrefixIndex + businessPrefix.length);
  const segments = relativePath.split('/').filter(Boolean);
  const errors: string[] = [];

  if (segments.length !== 2) {
    errors.push(`Business SVG must be stored as "business-icons/<category>/<icon-name>.svg".`);
  } else if (!BUSINESS_CATEGORY_NAMES.has(segments[0])) {
    errors.push(
      `Business SVG category must be one of: ${Array.from(BUSINESS_CATEGORY_NAMES).join(', ')}.`,
    );
  }

  if (!SVG_FILENAME_PATTERN.test(fileName)) {
    errors.push(
      `Business SVG filename must be lowercase kebab-case with only letters and numbers, for example "whatsapp-business.svg".`,
    );
  }

  return errors;
}

function checkDuplicatedAttributes(errors: string[], svg: string) {
  for (const tag of svg.matchAll(/<([a-zA-Z][\w:-]*)([^<>]*?)\/?>/g)) {
    const tagName = tag[1];
    const attributes = tag[2];
    const seen = new Set<string>();

    for (const attribute of attributes.matchAll(/\s([^\s"'=<>/]+)\s*=/g)) {
      const name = attribute[1];
      if (seen.has(name)) {
        errors.push(`<${tagName}> has duplicated "${name}" attribute.`);
      }
      seen.add(name);
    }
  }
}

function collectReferencedIds(svg: string) {
  return new Set([...svg.matchAll(/url\(#([^)]+)\)/g)].map((match) => match[1]));
}

function walk(errors: string[], node: INode, referencedIds: Set<string>) {
  const name = node.name.toLowerCase();
  const attributes = node.attributes ?? {};

  if (name === 'script' || name === 'foreignobject') {
    errors.push(`<${node.name}> is not allowed in business SVGs.`);
  }

  for (const [attr, value] of Object.entries(attributes)) {
    if (attr === 'style' || attr === 'class') {
      errors.push(`<${node.name}> must not use "${attr}" attributes.`);
    }

    if (/^data-/i.test(attr)) {
      errors.push(`<${node.name}> must not use "${attr}" attributes.`);
    }

    if (attr === 'id' && !referencedIds.has(String(value))) {
      errors.push(`<${node.name}> must not use unreferenced "id" attributes.`);
    }

    if (/^on/i.test(attr)) {
      errors.push(`<${node.name}> must not use event handler attribute "${attr}".`);
    }

    if (/^(fill|stroke)$/i.test(attr) && value !== 'none' && value !== 'currentColor') {
      errors.push(`<${node.name}> must use "${attr}" as "currentColor" or "none".`);
    }

    if (typeof value === 'string' && /javascript\s*:/i.test(value)) {
      errors.push(`<${node.name}> must not use javascript: URLs in "${attr}".`);
    }
  }

  for (const child of node.children ?? []) {
    if (typeof child !== 'string') {
      walk(errors, child, referencedIds);
    }
  }
}

function checkRoot(errors: string[], root: INode) {
  if (root.name !== 'svg') {
    errors.push('root element must be <svg>.');
  }
}

export function validateBusinessSvgSource(svg: string) {
  const errors: string[] = [];
  const referencedIds = collectReferencedIds(svg);
  checkDuplicatedAttributes(errors, svg);

  try {
    const root = parseSync(svg);
    checkRoot(errors, root);
    walk(errors, root, referencedIds);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
  }

  return errors;
}

export async function validateBusinessSvgSourceFile(file: string) {
  const fileNameErrors = validateBusinessSvgFileName(file);

  try {
    return [...fileNameErrors, ...validateBusinessSvgSource(await fs.readFile(file, 'utf-8'))];
  } catch (error) {
    return [
      ...fileNameErrors,
      `cannot read business SVG: ${error instanceof Error ? error.message : String(error)}`,
    ];
  }
}

function findNormalizedDuplicateFiles(files: string[]) {
  const filesByNormalizedName = new Map<string, string[]>();
  const duplicates: string[][] = [];

  for (const file of files) {
    const normalizedName = path.basename(file).toLowerCase();
    const matchingFiles = filesByNormalizedName.get(normalizedName) ?? [];
    matchingFiles.push(file);
    filesByNormalizedName.set(normalizedName, matchingFiles);
  }

  for (const matchingFiles of filesByNormalizedName.values()) {
    if (matchingFiles.length > 1) {
      duplicates.push(matchingFiles);
    }
  }

  return duplicates;
}

async function validateBusinessIconIndex(files: string[]) {
  const errors: string[] = [];
  const expectedPaths = files
    .map((file) => file.split(path.sep).join('/'))
    .map((file) => {
      const businessPrefix = `${BUSINESS_ICONS_DIR}/`;
      const businessPrefixIndex = file.lastIndexOf(businessPrefix);
      return businessPrefixIndex === -1 ? file : file.slice(businessPrefixIndex);
    })
    .sort();

  try {
    const index = JSON.parse(await fs.readFile(BUSINESS_ICON_INDEX_FILE, 'utf-8')) as {
      icons?: Array<{
        name?: string;
        category?: string;
        path?: string;
        componentName?: string;
      }>;
    };
    const actualPaths = (Array.isArray(index.icons) ? index.icons : [])
      .map((icon) => icon.path)
      .filter((iconPath): iconPath is string => typeof iconPath === 'string')
      .sort();

    if (JSON.stringify(actualPaths) !== JSON.stringify(expectedPaths)) {
      errors.push(
        `${BUSINESS_ICON_INDEX_FILE} is out of sync. Run "node ./scripts/writeBusinessIconIndex.mts".`,
      );
    }
  } catch (error) {
    errors.push(
      `cannot read ${BUSINESS_ICON_INDEX_FILE}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  return errors;
}

async function readDefaultBusinessSvgFiles() {
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
            return [fullPath];
          }
          return [];
        }),
      );
      return files.flat().sort();
    };
    return readSvgFiles(BUSINESS_ICONS_DIR);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function main() {
  const svgFiles = process.argv.slice(2);
  const files = svgFiles.length ? svgFiles : await readDefaultBusinessSvgFiles();
  let hasError = false;

  for (const duplicate of findNormalizedDuplicateFiles(files)) {
    console.error(
      `Business SVG filenames must be unique after case normalization: ${duplicate.join(', ')}.`,
    );
    hasError = true;
  }

  for (const message of await validateBusinessIconIndex(files)) {
    console.error(message);
    hasError = true;
  }

  for (const file of files) {
    const errors = await validateBusinessSvgSourceFile(file);

    for (const message of errors) {
      console.error(`${file}: ${message}`);
      hasError = true;
    }
  }

  if (hasError) {
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
