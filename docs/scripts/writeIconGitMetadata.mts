import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { readSvgDirectory } from '@ycloud-web/helpers';

type GitEntry = {
  date: string;
  author: string;
};

type IconGitMetadata = {
  createdAt?: string;
  changedAt?: string;
  createdBy?: string;
  changedBy?: string;
  contributors?: string[];
};

const currentDir = process.cwd();
const repoRoot = path.resolve(currentDir, '..');
const iconsDir = path.resolve(repoRoot, 'icons');
const outputDir = path.resolve(currentDir, '.vitepress/data/iconGitMetadata');
const iconFiles = await readSvgDirectory(iconsDir, '.svg');

function readIconGitLog() {
  try {
    return execFileSync('git', ['log', '--format=commit%x09%aI%x09%an', '--name-status', '--', 'icons'], {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch {
    return '';
  }
}

function appendFileEntry(
  gitEntriesByFile: Map<string, GitEntry[]>,
  file: string | undefined,
  entry: GitEntry,
) {
  if (!file?.endsWith('.svg')) return;
  if (!file.startsWith('icons/')) return;

  const entries = gitEntriesByFile.get(file) ?? [];
  entries.push(entry);
  gitEntriesByFile.set(file, entries);
}

function collectGitEntries() {
  const gitEntriesByFile = new Map<string, GitEntry[]>();
  let currentEntry: GitEntry | undefined;

  for (const line of readIconGitLog().split('\n')) {
    if (!line.trim()) continue;

    if (line.startsWith('commit\t')) {
      const [, date, author] = line.split('\t');
      currentEntry = { date, author };
      continue;
    }

    if (!currentEntry) continue;

    const [status, file, renamedFile] = line.split('\t');
    appendFileEntry(gitEntriesByFile, file, currentEntry);

    if (status?.startsWith('R')) {
      appendFileEntry(gitEntriesByFile, renamedFile, currentEntry);
    }
  }

  return gitEntriesByFile;
}

function toMetadata(entries: GitEntry[] | undefined): IconGitMetadata {
  if (!entries?.length) return {};

  const latest = entries[0];
  const earliest = entries.at(-1);
  const contributors = Array.from(new Set(entries.map((entry) => entry.author).filter(Boolean)));

  return {
    createdAt: earliest?.date,
    changedAt: latest.date,
    createdBy: earliest?.author,
    changedBy: latest.author,
    contributors,
  };
}

if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true, force: true });
}

await fs.promises.mkdir(outputDir, { recursive: true });

const gitEntriesByFile = collectGitEntries();
const writeIconGitMetadata = iconFiles.map(async (iconFile) => {
  const iconName = path.basename(iconFile, '.svg');
  const file = `icons/${iconFile}`;
  const metadata = toMetadata(gitEntriesByFile.get(file));

  await fs.promises.writeFile(
    path.resolve(outputDir, `${iconName}.json`),
    `${JSON.stringify(metadata, null, 2)}\n`,
    'utf8',
  );
});

await Promise.all(writeIconGitMetadata);

console.log(`Successfully written git metadata for ${writeIconGitMetadata.length} icons.`);
