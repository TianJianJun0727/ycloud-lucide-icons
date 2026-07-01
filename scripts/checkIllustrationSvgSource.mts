import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseSync, type INode } from 'svgson';
import { buildIllustrationIndex } from './writeIllustrationIndex.mts';

const ILLUSTRATION_DIR = 'illustration-icons';
const ILLUSTRATION_INDEX_FILE = path.join(ILLUSTRATION_DIR, 'index.json');
const SVG_FILENAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*\.svg$/;

type IllustrationIndex = {
  illustrations: Array<{
    name: string;
    path: string;
    componentName: string;
  }>;
};

async function readIllustrationIndex() {
  return JSON.parse(await fs.readFile(ILLUSTRATION_INDEX_FILE, 'utf-8')) as IllustrationIndex;
}

function validateIllustrationSvgFileName(file: string) {
  const errors: string[] = [];
  const normalizedFile = file.split(path.sep).join('/');
  const illustrationPrefix = `${ILLUSTRATION_DIR}/`;
  const illustrationPrefixIndex = normalizedFile.lastIndexOf(illustrationPrefix);
  const relativePath =
    illustrationPrefixIndex === -1
      ? normalizedFile
      : normalizedFile.slice(illustrationPrefixIndex + illustrationPrefix.length);
  const segments = relativePath.split('/').filter(Boolean);
  const fileName = path.basename(file);

  if (segments.length !== 1) {
    errors.push('Illustration SVG must be stored as "illustration-icons/<name>.svg".');
  }
  if (!SVG_FILENAME_PATTERN.test(fileName)) {
    errors.push(
      'Illustration SVG filename must be lowercase kebab-case with only letters and numbers.',
    );
  }
  return errors;
}

function collectReferencedIds(svg: string) {
  return new Set([...svg.matchAll(/url\(#([^)]+)\)/g)].map((match) => match[1]));
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

function walk(errors: string[], node: INode, referencedIds: Set<string>) {
  const name = node.name.toLowerCase();
  const attributes = node.attributes ?? {};

  if (name === 'script' || name === 'foreignobject') {
    errors.push(`<${node.name}> is not allowed in illustration SVGs.`);
  }

  for (const [attr, value] of Object.entries(attributes)) {
    if (attr === 'id' && !referencedIds.has(String(value))) {
      errors.push(`<${node.name}> must not use unreferenced "id" attributes.`);
    }
    if (/^on/i.test(attr)) {
      errors.push(`<${node.name}> must not use event handler attribute "${attr}".`);
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

export function validateIllustrationSvgSource(svg: string) {
  const errors: string[] = [];
  const referencedIds = collectReferencedIds(svg);
  checkDuplicatedAttributes(errors, svg);

  try {
    const root = parseSync(svg);
    if (root.name !== 'svg') {
      errors.push('root element must be <svg>.');
    }
    walk(errors, root, referencedIds);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
  }

  return errors;
}

async function validateIllustrationSvgSourceFile(file: string) {
  const fileNameErrors = validateIllustrationSvgFileName(file);
  try {
    return [
      ...fileNameErrors,
      ...validateIllustrationSvgSource(await fs.readFile(file, 'utf-8')),
    ];
  } catch (error) {
    return [
      ...fileNameErrors,
      `cannot read illustration SVG: ${error instanceof Error ? error.message : String(error)}`,
    ];
  }
}

async function readDefaultIllustrationSvgFiles() {
  try {
    const entries = await fs.readdir(ILLUSTRATION_DIR, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.svg'))
      .map((entry) => path.join(ILLUSTRATION_DIR, entry.name))
      .sort();
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function validateIllustrationIndex(files: string[]) {
  const errors: string[] = [];
  const expectedIndex = await buildIllustrationIndex();
  const expectedPaths = files.map((file) => file.split(path.sep).join('/')).sort();
  try {
    const index = await readIllustrationIndex();
    if (JSON.stringify(index) !== JSON.stringify(expectedIndex)) {
      errors.push(
        `${ILLUSTRATION_INDEX_FILE} is out of sync. Run "node ./scripts/writeIllustrationIndex.mts".`,
      );
      return errors;
    }
    const actualPaths = index.illustrations.map((illustration) => illustration.path).sort();
    if (JSON.stringify(actualPaths) !== JSON.stringify(expectedPaths)) {
      errors.push(
        `${ILLUSTRATION_INDEX_FILE} is out of sync. Run "node ./scripts/writeIllustrationIndex.mts".`,
      );
    }
  } catch (error) {
    errors.push(
      `cannot read ${ILLUSTRATION_INDEX_FILE}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
  return errors;
}

async function main() {
  const svgFiles = process.argv.slice(2);
  const files = svgFiles.length ? svgFiles : await readDefaultIllustrationSvgFiles();
  let hasError = false;

  for (const message of await validateIllustrationIndex(files)) {
    console.error(message);
    hasError = true;
  }

  for (const file of files) {
    const errors = await validateIllustrationSvgSourceFile(file);
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
