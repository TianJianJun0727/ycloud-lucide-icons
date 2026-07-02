import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AssetMetadata } from './assetMetadata.mts';
import { buildBusinessIconIndex } from './writeBusinessIconIndex.mts';
import { buildIllustrationIndex } from './writeIllustrationIndex.mts';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

type MetadataFile = {
  metadataVersion: 1;
  type: 'icon' | 'business-icon' | 'illustration';
  assets: Array<{
    type: 'icon' | 'business-icon' | 'illustration';
    name: string;
    path: string;
    title?: string;
    englishName?: string;
    componentName?: string;
    category?: string;
    colorMode?: string;
    metadata?: unknown;
  }>;
};

async function readJson<T>(file: string): Promise<T> {
  return JSON.parse(await fs.readFile(file, 'utf8')) as T;
}

function isNonEmptyStringArray(value: unknown) {
  return (
    Array.isArray(value) && value.length > 0 && value.every((item) => typeof item === 'string')
  );
}

function findDuplicateItems(value: string[]) {
  return [...value.reduce((map, item) => map.set(item, (map.get(item) ?? 0) + 1), new Map<string, number>())]
    .filter(([, count]) => count > 1)
    .map(([item]) => item);
}

function validateStringArray(file: string, field: string, value: unknown) {
  if (!isNonEmptyStringArray(value)) {
    return [`${file}: ${field} must be non-empty.`];
  }
  const duplicates = findDuplicateItems(value);
  return duplicates.length > 0 ? [`${file}: ${field} has duplicates: ${duplicates.join(', ')}.`] : [];
}

function validateMetadata(file: string, metadata: AssetMetadata) {
  const errors: string[] = [];
  const allowedRootKeys = new Set(['$schema', 'name', 'tags', 'i18n', 'use-cases']);
  const allowedI18nKeys = new Set(['en']);
  const allowedEnglishKeys = new Set(['name', 'tags', 'use-cases']);
  for (const key of Object.keys(metadata)) {
    if (!allowedRootKeys.has(key)) {
      errors.push(`${file}: unexpected field "${key}".`);
    }
  }
  for (const key of Object.keys(metadata.i18n ?? {})) {
    if (!allowedI18nKeys.has(key)) {
      errors.push(`${file}: unexpected i18n field "${key}".`);
    }
  }
  for (const key of Object.keys(metadata.i18n?.en ?? {})) {
    if (!allowedEnglishKeys.has(key)) {
      errors.push(`${file}: unexpected i18n.en field "${key}".`);
    }
  }
  if (!metadata.name) errors.push(`${file}: missing name.`);
  errors.push(...validateStringArray(file, 'tags', metadata.tags));
  errors.push(...validateStringArray(file, 'use-cases', metadata['use-cases']));
  if (!metadata.i18n?.en?.name) errors.push(`${file}: missing i18n.en.name.`);
  errors.push(...validateStringArray(file, 'i18n.en.tags', metadata.i18n?.en?.tags));
  errors.push(...validateStringArray(file, 'i18n.en.use-cases', metadata.i18n?.en?.['use-cases']));
  return errors;
}

function getMetadataTitle(metadata: Record<string, unknown> | undefined) {
  return typeof metadata?.name === 'string' ? metadata.name : undefined;
}

function getMetadataEnglishName(metadata: Record<string, unknown> | undefined) {
  const i18n = metadata?.i18n;
  if (!i18n || typeof i18n !== 'object' || !('en' in i18n)) {
    return undefined;
  }
  const english = i18n.en;
  if (!english || typeof english !== 'object' || !('name' in english)) {
    return undefined;
  }
  return typeof english.name === 'string' ? english.name : undefined;
}

function stableJson(value: unknown) {
  return JSON.stringify(value);
}

async function validateMetadataFile(file: string, expected: MetadataFile) {
  const errors: string[] = [];
  const metadata = await readJson<MetadataFile>(path.join(repoRoot, file));
  const normalize = (value: MetadataFile) => ({
    ...value,
    assets: [...value.assets].sort((left, right) => left.name.localeCompare(right.name)),
  });
  if (stableJson(normalize(metadata)) !== stableJson(normalize(expected))) {
    errors.push(`${file} is out of sync. Run "node ./scripts/writeAssetMetadata.mts".`);
  }
  if (metadata.metadataVersion !== 1) {
    errors.push(`${file}: metadataVersion must be 1.`);
  }
  return errors;
}

async function validateBusinessMetadata() {
  const errors: string[] = [];
  const index = await buildBusinessIconIndex();
  const expectedMetadataFiles = new Set(
    index.icons.map((icon) => icon.path.replace(/\.svg$/, '.json')),
  );

  for (const metadataPath of expectedMetadataFiles) {
    try {
      errors.push(
        ...validateMetadata(
          metadataPath,
          await readJson<AssetMetadata>(path.join(repoRoot, metadataPath)),
        ),
      );
    } catch (error) {
      errors.push(
        `${metadataPath}: cannot read metadata (${error instanceof Error ? error.message : String(error)}).`,
      );
    }
  }

  errors.push(
    ...(await validateMetadataFile(
      'business-icons/metadata/index.json',
      {
        metadataVersion: 1,
        type: 'business-icon',
        assets: await Promise.all(
          index.icons.map(async (icon) => {
            const metadata = await readJson<Record<string, unknown>>(
              path.join(repoRoot, icon.path.replace(/\.svg$/, '.json')),
            );
            return {
              type: 'business-icon' as const,
              name: icon.name,
              path: icon.path,
              title: getMetadataTitle(metadata),
              englishName: getMetadataEnglishName(metadata),
              componentName: icon.componentName,
              category: icon.category,
              colorMode: icon.category,
              metadata,
            };
          }),
        ),
      },
    )),
  );
  return errors;
}

async function validateIllustrationMetadata() {
  const errors: string[] = [];
  const index = await buildIllustrationIndex();
  const expectedMetadataFiles = new Set(
    index.illustrations.map((illustration) => illustration.path.replace(/\.svg$/, '.json')),
  );

  for (const metadataPath of expectedMetadataFiles) {
    try {
      errors.push(
        ...validateMetadata(
          metadataPath,
          await readJson<AssetMetadata>(path.join(repoRoot, metadataPath)),
        ),
      );
    } catch (error) {
      errors.push(
        `${metadataPath}: cannot read metadata (${error instanceof Error ? error.message : String(error)}).`,
      );
    }
  }

  errors.push(
    ...(await validateMetadataFile(
      'illustration-icons/metadata/index.json',
      {
        metadataVersion: 1,
        type: 'illustration',
        assets: await Promise.all(
          index.illustrations.map(async (illustration) => {
            const metadata = await readJson<Record<string, unknown>>(
              path.join(repoRoot, illustration.path.replace(/\.svg$/, '.json')),
            );
            return {
              type: 'illustration' as const,
              name: illustration.name,
              path: illustration.path,
              title: getMetadataTitle(metadata),
              englishName: getMetadataEnglishName(metadata),
              componentName: illustration.componentName,
              metadata,
            };
          }),
        ),
      },
    )),
  );
  return errors;
}

async function validateIconMetadata() {
  const entries = await fs.readdir(path.join(repoRoot, 'icons'), { withFileTypes: true });
  return validateMetadataFile('icons/metadata/index.json', {
    metadataVersion: 1,
    type: 'icon',
    assets: await Promise.all(
      entries
        .filter((entry) => entry.isFile() && entry.name.endsWith('.svg'))
        .map(async (entry) => {
          const name = entry.name.replace(/\.svg$/, '');
          const metadata = await readJson<Record<string, unknown>>(
            path.join(repoRoot, 'icons', `${name}.json`),
          );
          return {
            type: 'icon' as const,
            name,
            path: `icons/${entry.name}`,
            title: getMetadataTitle(metadata),
            englishName: getMetadataEnglishName(metadata),
            metadata,
          };
        }),
    ),
  });
}

const errors = [
  ...(await validateIconMetadata()),
  ...(await validateBusinessMetadata()),
  ...(await validateIllustrationMetadata()),
];

if (errors.length > 0) {
  throw new Error(
    `Asset metadata validation failed:\n${errors.map((error) => `- ${error}`).join('\n')}`,
  );
}

console.log('Asset metadata indexes are valid.');
