import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import {
  createAssetMetadata,
  metadataPathForSvg,
  readAssetMetadata,
  writeAssetMetadata,
} from './assetMetadata.mts';
import { buildBusinessIconIndex } from './writeBusinessIconIndex.mts';
import { buildIllustrationIndex } from './writeIllustrationIndex.mts';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const iconsDir = path.join(repoRoot, 'icons');
const businessIconsDir = path.join(repoRoot, 'business-icons');
const illustrationIconsDir = path.join(repoRoot, 'illustration-icons');
const execFileAsync = promisify(execFile);

type NameEntry = {
  name: string;
  path: string;
  title?: string;
  englishName?: string;
  componentName?: string;
  category?: string;
  canonicalName?: string;
  deprecated?: true;
};

type MetadataEntry = NameEntry & {
  type: 'icon' | 'business-icon' | 'illustration';
  metadata?: unknown;
  colorMode?: string;
};

type LegacyBusinessMetadata = {
  name: string;
  title?: string;
  tags?: string[];
  'use-cases'?: string[];
  i18n?: {
    en?: {
      title?: string;
      tags?: string[];
      'use-cases'?: string[];
    };
  };
};

type LegacyIllustrationMetadata = LegacyBusinessMetadata;

async function pathExists(file: string) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function removeOrphanJsonFiles(dir: string, keepFiles: Set<string>) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await removeOrphanJsonFiles(fullPath, keepFiles);
        return;
      }
      if (
        entry.isFile() &&
        entry.name.endsWith('.json') &&
        entry.name !== 'index.json' &&
        !keepFiles.has(fullPath)
      ) {
        await fs.rm(fullPath);
      }
    }),
  );
}

async function readLegacyBusinessMetadata() {
  try {
    const file = JSON.parse(
      await fs.readFile(path.join(businessIconsDir, 'metadata.json'), 'utf8'),
    ) as {
      businessIcons?: LegacyBusinessMetadata[];
    };
    return new Map((file.businessIcons ?? []).map((item) => [item.name, item]));
  } catch {
    return new Map<string, LegacyBusinessMetadata>();
  }
}

async function readLegacyIllustrationMetadata() {
  try {
    const file = JSON.parse(
      await fs.readFile(path.join(illustrationIconsDir, 'metadata.json'), 'utf8'),
    ) as {
      illustrations?: LegacyIllustrationMetadata[];
    };
    return new Map((file.illustrations ?? []).map((item) => [item.name, item]));
  } catch {
    return new Map<string, LegacyIllustrationMetadata>();
  }
}

function fromLegacyMetadata(
  legacy: LegacyBusinessMetadata | LegacyIllustrationMetadata | undefined,
) {
  if (!legacy) {
    return undefined;
  }
  return {
    name: legacy.title,
    tags: legacy.tags,
    'use-cases': legacy['use-cases'],
    i18n: {
      en: {
        name: legacy.i18n?.en?.title,
        tags: legacy.i18n?.en?.tags,
        'use-cases': legacy.i18n?.en?.['use-cases'],
      },
    },
  };
}

async function syncBusinessIconMetadata() {
  const index = await buildBusinessIconIndex();
  const legacyMetadata = await readLegacyBusinessMetadata();
  const keepFiles = new Set<string>();

  await Promise.all(
    index.icons.map(async (icon) => {
      const svgPath = path.join(repoRoot, icon.path);
      const metadataPath = metadataPathForSvg(svgPath);
      keepFiles.add(metadataPath);

      const current = await readAssetMetadata(metadataPath);
      const legacy = fromLegacyMetadata(legacyMetadata.get(icon.name));
      const fallback = createAssetMetadata({
        kind: 'business-icon',
        name: icon.name,
        colorMode: icon.category,
        schemaPath: '../../asset-metadata.schema.json',
      });
      await writeAssetMetadata(metadataPath, {
        ...fallback,
        ...legacy,
        ...current,
        $schema: '../../asset-metadata.schema.json',
        i18n: {
          en: {
            ...fallback.i18n.en,
            ...legacy?.i18n.en,
            ...current?.i18n?.en,
          },
        },
      });
    }),
  );

  if (await pathExists(businessIconsDir)) {
    await removeOrphanJsonFiles(businessIconsDir, keepFiles);
  }
}

async function syncIllustrationMetadata() {
  const index = await buildIllustrationIndex();
  const legacyMetadata = await readLegacyIllustrationMetadata();
  const keepFiles = new Set<string>();

  await Promise.all(
    index.illustrations.map(async (illustration) => {
      const svgPath = path.join(repoRoot, illustration.path);
      const metadataPath = metadataPathForSvg(svgPath);
      keepFiles.add(metadataPath);

      const current = await readAssetMetadata(metadataPath);
      const legacy = fromLegacyMetadata(legacyMetadata.get(illustration.name));
      const fallback = createAssetMetadata({
        kind: 'illustration',
        name: illustration.name,
        schemaPath: '../asset-metadata.schema.json',
      });
      await writeAssetMetadata(metadataPath, {
        ...fallback,
        ...legacy,
        ...current,
        $schema: '../asset-metadata.schema.json',
        i18n: {
          en: {
            ...fallback.i18n.en,
            ...legacy?.i18n.en,
            ...current?.i18n?.en,
          },
        },
      });
    }),
  );

  if (await pathExists(illustrationIconsDir)) {
    await removeOrphanJsonFiles(illustrationIconsDir, keepFiles);
  }
}

await syncBusinessIconMetadata();
await syncIllustrationMetadata();
await Promise.all([
  fs.rm(path.join(businessIconsDir, 'metadata.json'), { force: true }),
  fs.rm(path.join(illustrationIconsDir, 'metadata.json'), { force: true }),
  fs.rm(path.join(businessIconsDir, 'names.json'), { force: true }),
  fs.rm(path.join(illustrationIconsDir, 'names.json'), { force: true }),
]);

async function readJson<T>(file: string): Promise<T | undefined> {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8')) as T;
  } catch {
    return undefined;
  }
}

async function writeNamesFile(file: string, names: NameEntry[]) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const duplicates = [
    ...names.reduce((map, item) => {
      map.set(item.name, (map.get(item.name) ?? 0) + 1);
      return map;
    }, new Map<string, number>()),
  ]
    .filter(([, count]) => count > 1)
    .map(([name]) => name)
    .sort();
  await fs.writeFile(
    file,
    `${JSON.stringify(
      {
        metadataVersion: 1,
        names: names.sort((left, right) => left.name.localeCompare(right.name)),
        duplicates,
      },
      null,
      2,
    )}\n`,
    'utf8',
  );
}

async function writeMetadataFile(
  file: string,
  type: MetadataEntry['type'],
  assets: MetadataEntry[],
) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(
    file,
    `${JSON.stringify(
      {
        metadataVersion: 1,
        type,
        assets: assets.sort((left, right) => left.name.localeCompare(right.name)),
      },
      null,
      2,
    )}\n`,
    'utf8',
  );
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

async function writeIconNames() {
  const entries = await fs.readdir(iconsDir, { withFileTypes: true });
  const nestedNames = await Promise.all(
    entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.svg'))
      .map(async (entry) => {
        const name = path.basename(entry.name, '.svg');
        const metadata = await readJson<{
          name?: string;
          aliases?: Array<
            | string
            | {
                name: string;
                deprecated?: true;
              }
          >;
          i18n?: {
            en?: {
              name?: string;
            };
          };
        }>(path.join(iconsDir, `${name}.json`));
        const canonicalEntry = {
          name,
          path: `icons/${entry.name}`,
          title: metadata?.name,
          englishName: metadata?.i18n?.en?.name,
        };
        const aliasEntries = (metadata?.aliases ?? []).map((alias) => {
          const aliasName = typeof alias === 'string' ? alias : alias.name;
          return {
            name: aliasName,
            path: `icons/${aliasName}.svg`,
            title: metadata?.name,
            englishName: metadata?.i18n?.en?.name,
            canonicalName: name,
            deprecated: typeof alias === 'string' ? undefined : alias.deprecated,
          };
        });
        return [canonicalEntry, ...aliasEntries];
      }),
  );
  const names = nestedNames.flat();
  await writeNamesFile(path.join(iconsDir, 'names/index.json'), names);

  const metadataAssets = await Promise.all(
    entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.svg'))
      .map(async (entry) => {
        const name = path.basename(entry.name, '.svg');
        const metadata = await readJson<Record<string, unknown>>(
          path.join(iconsDir, `${name}.json`),
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
  );
  await writeMetadataFile(path.join(iconsDir, 'metadata/index.json'), 'icon', metadataAssets);
}

async function writeBusinessNames() {
  const index = await buildBusinessIconIndex();
  const names = await Promise.all(
    index.icons.map(async (icon) => {
      const metadata = await readJson<{
        name?: string;
        i18n?: {
          en?: {
            name?: string;
          };
        };
      }>(path.join(repoRoot, icon.path.replace(/\.svg$/, '.json')));
      return {
        name: icon.name,
        path: icon.path,
        title: metadata?.name,
        englishName: metadata?.i18n?.en?.name,
        componentName: icon.componentName,
        category: icon.category,
      };
    }),
  );
  await writeNamesFile(path.join(businessIconsDir, 'names/index.json'), names);

  const metadataAssets = await Promise.all(
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
  );
  await writeMetadataFile(
    path.join(businessIconsDir, 'metadata/index.json'),
    'business-icon',
    metadataAssets,
  );
}

async function writeIllustrationNames() {
  const index = await buildIllustrationIndex();
  const names = await Promise.all(
    index.illustrations.map(async (illustration) => {
      const metadata = await readJson<{
        name?: string;
        i18n?: {
          en?: {
            name?: string;
          };
        };
      }>(path.join(repoRoot, illustration.path.replace(/\.svg$/, '.json')));
      return {
        name: illustration.name,
        path: illustration.path,
        title: metadata?.name,
        englishName: metadata?.i18n?.en?.name,
        componentName: illustration.componentName,
      };
    }),
  );
  await writeNamesFile(path.join(illustrationIconsDir, 'names/index.json'), names);

  const metadataAssets = await Promise.all(
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
  );
  await writeMetadataFile(
    path.join(illustrationIconsDir, 'metadata/index.json'),
    'illustration',
    metadataAssets,
  );
}

await writeIconNames();
await writeBusinessNames();
await writeIllustrationNames();

await execFileAsync(
  'pnpm',
  [
    'exec',
    'oxfmt',
    'icons/names/*.json',
    'icons/metadata/*.json',
    'business-icons/**/*.json',
    'illustration-icons/**/*.json',
  ],
  {
    cwd: repoRoot,
  },
);
