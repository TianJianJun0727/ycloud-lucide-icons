import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { IllustrationEntity } from '../.vitepress/theme/types';

type IllustrationIndex = {
  illustrations: Array<{
    name: string;
    path: string;
    componentName: string;
  }>;
};

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, '../..');
const indexPath = path.resolve(repoRoot, 'illustration-icons/index.json');

function toDisplayName(name: string) {
  return name
    .split('-')
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ');
}

export default {
  async load() {
    const index = JSON.parse(fs.readFileSync(indexPath, 'utf8')) as IllustrationIndex;
    const illustrations: IllustrationEntity[] = index.illustrations.map((item) => {
      const svg = fs.readFileSync(path.resolve(repoRoot, item.path), 'utf8').trim();
      return {
        name: item.name,
        displayName: toDisplayName(item.name),
        componentName: item.componentName,
        path: item.path,
        svg,
        dataUri: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
      };
    });

    return {
      illustrations,
    };
  },
};
