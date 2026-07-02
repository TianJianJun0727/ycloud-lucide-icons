import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import illustrationIconGitMetadata from '../.vitepress/data/illustrationIconGitMetadata.json';
import type { IllustrationEntity, Release } from '../.vitepress/theme/types';

type IllustrationIndex = {
  illustrations: Array<{
    name: string;
    path: string;
    componentName: string;
  }>;
};

type AssetMetadata = {
  name?: string;
  tags?: string[];
  'use-cases'?: string[];
  i18n?: {
    en?: {
      name?: string;
      tags?: string[];
      'use-cases'?: string[];
    };
  };
};

type IllustrationIconGeneratedMetadata = {
  createdRelease?: Release;
  changedRelease?: Release;
  git?: NonNullable<IllustrationEntity['git']>;
};

type IllustrationIconGeneratedMetadataIndex = Record<string, IllustrationIconGeneratedMetadata>;

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, '../..');
const indexPath = path.resolve(repoRoot, 'illustration-icons/index.json');
const generatedMetadata = illustrationIconGitMetadata as IllustrationIconGeneratedMetadataIndex;

function toDisplayName(name: string) {
  return name
    .split('-')
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ');
}

function readMetadata(file: string): AssetMetadata | undefined {
  if (!fs.existsSync(file)) return undefined;
  return JSON.parse(fs.readFileSync(file, 'utf8')) as AssetMetadata;
}

export default {
  async load() {
    const index = JSON.parse(fs.readFileSync(indexPath, 'utf8')) as IllustrationIndex;
    const illustrations: IllustrationEntity[] = index.illustrations.map((item) => {
      const svg = fs.readFileSync(path.resolve(repoRoot, item.path), 'utf8').trim();
      const metadata = readMetadata(path.resolve(repoRoot, item.path.replace(/\.svg$/, '.json')));
      const assetGeneratedMetadata = generatedMetadata[item.path];
      return {
        name: item.name,
        displayName: metadata?.name ?? toDisplayName(item.name),
        tags: metadata?.tags ?? [],
        useCases: metadata?.['use-cases'] ?? [],
        englishName: metadata?.i18n?.en?.name,
        englishTags: metadata?.i18n?.en?.tags ?? [],
        englishUseCases: metadata?.i18n?.en?.['use-cases'] ?? [],
        componentName: item.componentName,
        path: item.path,
        svg,
        dataUri: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
        createdRelease: assetGeneratedMetadata?.createdRelease,
        changedRelease: assetGeneratedMetadata?.changedRelease,
        git: assetGeneratedMetadata?.git,
      };
    });

    return {
      illustrations,
    };
  },
};
