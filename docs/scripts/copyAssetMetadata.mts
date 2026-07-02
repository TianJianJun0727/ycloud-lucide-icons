import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const docsMetadataDir = path.join(repoRoot, 'docs/public/metadata');

const copies = [
  ['icons/metadata/index.json', 'icons.json'],
  ['business-icons/metadata/index.json', 'business-icons.json'],
  ['illustration-icons/metadata/index.json', 'illustration-icons.json'],
] as const;

await fs.rm(docsMetadataDir, { recursive: true, force: true });

await Promise.all(
  copies.map(async ([source, target]) => {
    const targetPath = path.join(docsMetadataDir, target);
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.copyFile(path.join(repoRoot, source), targetPath);
  }),
);

console.log('Copied asset metadata snapshots to docs/public/metadata.');
