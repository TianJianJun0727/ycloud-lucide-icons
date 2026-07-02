import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AssetMetadata } from './assetMetadata.mts';
import { buildBusinessIconIndex } from './writeBusinessIconIndex.mts';
import { buildIllustrationIndex } from './writeIllustrationIndex.mts';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

type NamesFile = {
  metadataVersion: 1;
  names: Array<{
    name: string;
    path: string;
  }>;
  duplicates: string[];
};

type MetadataFile = {
  metadataVersion: 1;
  assets: Array<{
    name: string;
    path: string;
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

function validateMetadata(file: string, metadata: AssetMetadata) {
  const errors: string[] = [];
  if (!metadata.name) errors.push(`${file}: missing name.`);
  if (!isNonEmptyStringArray(metadata.tags)) errors.push(`${file}: tags must be non-empty.`);
  if (!isNonEmptyStringArray(metadata['use-cases'])) {
    errors.push(`${file}: use-cases must be non-empty.`);
  }
  if (!metadata.i18n?.en?.name) errors.push(`${file}: missing i18n.en.name.`);
  if (!isNonEmptyStringArray(metadata.i18n?.en?.tags)) {
    errors.push(`${file}: i18n.en.tags must be non-empty.`);
  }
  if (!isNonEmptyStringArray(metadata.i18n?.en?.['use-cases'])) {
    errors.push(`${file}: i18n.en.use-cases must be non-empty.`);
  }
  return errors;
}

async function listIconSvgNames() {
  const entries = await fs.readdir(path.join(repoRoot, 'icons'), { withFileTypes: true });
  const nestedNames = await Promise.all(
    entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.svg'))
      .map(async (entry) => {
        const name = entry.name.replace(/\.svg$/, '');
        const metadata = await readJson<{
          aliases?: Array<string | { name: string }>;
        }>(path.join(repoRoot, 'icons', `${name}.json`));
        return [
          name,
          ...(metadata.aliases ?? []).map((alias) =>
            typeof alias === 'string' ? alias : alias.name,
          ),
        ];
      }),
  );
  return nestedNames.flat().sort();
}

async function validateNamesFile(file: string, expectedPaths: string[]) {
  const errors: string[] = [];
  const names = await readJson<NamesFile>(path.join(repoRoot, file));
  const actualPaths = names.names.map((entry) => entry.path).sort();
  const sortedExpectedPaths = [...expectedPaths].sort();
  if (JSON.stringify(actualPaths) !== JSON.stringify(sortedExpectedPaths)) {
    errors.push(`${file} is out of sync. Run "node ./scripts/writeAssetMetadata.mts".`);
  }
  if (names.metadataVersion !== 1) {
    errors.push(`${file}: metadataVersion must be 1.`);
  }
  return errors;
}

async function validateMetadataFile(file: string, expectedPaths: string[]) {
  const errors: string[] = [];
  const metadata = await readJson<MetadataFile>(path.join(repoRoot, file));
  const actualPaths = metadata.assets.map((entry) => entry.path).sort();
  const sortedExpectedPaths = [...expectedPaths].sort();
  if (JSON.stringify(actualPaths) !== JSON.stringify(sortedExpectedPaths)) {
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
    ...(await validateNamesFile(
      'business-icons/names/index.json',
      index.icons.map((icon) => icon.path),
    )),
  );
  errors.push(
    ...(await validateMetadataFile(
      'business-icons/metadata/index.json',
      index.icons.map((icon) => icon.path),
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
    ...(await validateNamesFile(
      'illustration-icons/names/index.json',
      index.illustrations.map((illustration) => illustration.path),
    )),
  );
  errors.push(
    ...(await validateMetadataFile(
      'illustration-icons/metadata/index.json',
      index.illustrations.map((illustration) => illustration.path),
    )),
  );
  return errors;
}

async function validateIconNames() {
  const iconNames = await listIconSvgNames();
  const canonicalIconPaths = iconNames.map((name) => `icons/${name}.svg`);
  const entries = await fs.readdir(path.join(repoRoot, 'icons'), { withFileTypes: true });
  return [
    ...(await validateNamesFile('icons/names/index.json', canonicalIconPaths)),
    ...(await validateMetadataFile(
      'icons/metadata/index.json',
      entries
        .filter((entry) => entry.isFile() && entry.name.endsWith('.svg'))
        .map((entry) => `icons/${entry.name}`),
    )),
  ];
}

const errors = [
  ...(await validateIconNames()),
  ...(await validateBusinessMetadata()),
  ...(await validateIllustrationMetadata()),
];

if (errors.length > 0) {
  throw new Error(
    `Asset metadata validation failed:\n${errors.map((error) => `- ${error}`).join('\n')}`,
  );
}

console.log('Asset metadata and names indexes are valid.');
