import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import semver from 'semver';

type GitEntry = {
  date: string;
  author: string;
};

type Release = {
  version: string;
  date: string;
};

type IllustrationIconGitMetadata = {
  createdAt?: string;
  changedAt?: string;
  createdBy?: string;
  changedBy?: string;
  contributors?: string[];
};

type IllustrationIconGeneratedMetadata = {
  createdRelease: Release;
  changedRelease: Release;
  git?: IllustrationIconGitMetadata;
};

type DiffFile = {
  status: string;
  file?: string;
  renamedFile?: string;
};

const DATE_OF_FORK = '2020-06-08T16:39:52+0100';
const defaultReleaseMetaData = {
  createdRelease: {
    version: '0.0.0',
    date: DATE_OF_FORK,
  },
  changedRelease: {
    version: '0.0.0',
    date: DATE_OF_FORK,
  },
};
const currentDir = process.cwd();
const repoRoot = path.resolve(currentDir, '..');
const illustrationIconsDir = path.resolve(repoRoot, 'illustration-icons');
const outputPath = path.resolve(currentDir, '.vitepress/data/illustrationIconGitMetadata.json');

function listIllustrationSvgPaths() {
  if (!fs.existsSync(illustrationIconsDir)) return [];

  return fs
    .readdirSync(illustrationIconsDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.svg'))
    .map((entry) => `illustration-icons/${entry.name}`)
    .sort((left, right) => left.localeCompare(right));
}

function readIllustrationGitLog() {
  try {
    return execFileSync(
      'git',
      ['log', '--format=commit%x09%aI%x09%an', '--name-status', '--', 'illustration-icons'],
      {
        cwd: repoRoot,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      },
    );
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
  if (!file.startsWith('illustration-icons/')) return;

  const entries = gitEntriesByFile.get(file) ?? [];
  entries.push(entry);
  gitEntriesByFile.set(file, entries);
}

function collectGitEntries() {
  const gitEntriesByFile = new Map<string, GitEntry[]>();
  let currentEntry: GitEntry | undefined;

  for (const line of readIllustrationGitLog().split('\n')) {
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

function toMetadata(entries: GitEntry[] | undefined): IllustrationIconGitMetadata | undefined {
  if (!entries?.length) return undefined;

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

function readTags() {
  try {
    return execFileSync('git', ['tag', '-l'], {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .trim()
      .split(/\n/)
      .filter((tag) => semver.valid(tag))
      .sort(semver.compare);
  } catch {
    return [];
  }
}

function readDiff(previousTag: string, tag: string): DiffFile[] {
  try {
    return execFileSync(
      'git',
      ['diff', '--name-status', '--oneline', previousTag, tag, '--', 'illustration-icons'],
      {
        cwd: repoRoot,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      },
    )
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        const [status, file, renamedFile] = line.split('\t');
        return { status, file, renamedFile };
      });
  } catch {
    return [];
  }
}

function readTagDate(tag: string) {
  try {
    const date = execFileSync('git', ['show', '-s', '--format=%cI', tag], {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();

    return date.startsWith('20') ? date : DATE_OF_FORK;
  } catch {
    return DATE_OF_FORK;
  }
}

function isIllustrationIconSvg(file: string | undefined) {
  return file?.startsWith('illustration-icons/') === true && file.endsWith('.svg');
}

function ensureReleaseEntry(
  releaseMetadataByFile: Map<string, Partial<IllustrationIconGeneratedMetadata>>,
  file: string,
) {
  const entry = releaseMetadataByFile.get(file) ?? {};
  releaseMetadataByFile.set(file, entry);
  return entry;
}

function collectReleaseMetadata() {
  const releaseMetadataByFile = new Map<string, Partial<IllustrationIconGeneratedMetadata>>();
  const tags = readTags();

  tags.forEach((tag, index) => {
    const previousTag = tags[index - 1];
    if (!previousTag) return;

    const releaseData = {
      version: tag.replace(/^v/, ''),
      date: readTagDate(tag),
    };

    readDiff(previousTag, tag).forEach(({ status, file, renamedFile }) => {
      if (!isIllustrationIconSvg(file)) return;

      const entry = ensureReleaseEntry(releaseMetadataByFile, file);

      if (status.startsWith('R')) {
        entry.changedRelease = releaseData;

        if (isIllustrationIconSvg(renamedFile)) {
          const renamedEntry = ensureReleaseEntry(releaseMetadataByFile, renamedFile);
          renamedEntry.createdRelease = entry.createdRelease ?? releaseData;
          renamedEntry.changedRelease = releaseData;
        }
      }

      if (status.startsWith('C') && isIllustrationIconSvg(renamedFile)) {
        const copiedEntry = ensureReleaseEntry(releaseMetadataByFile, renamedFile);
        copiedEntry.createdRelease = releaseData;
        copiedEntry.changedRelease = releaseData;
      }

      if (status === 'A') {
        entry.createdRelease = releaseData;
        entry.changedRelease = releaseData;
      }

      if (status === 'M') {
        entry.changedRelease = releaseData;
      }
    });
  });

  return releaseMetadataByFile;
}

const gitEntriesByFile = collectGitEntries();
const releaseMetadataByFile = collectReleaseMetadata();
const metadataEntries = listIllustrationSvgPaths().map((file) => {
  const releaseMetadata = releaseMetadataByFile.get(file) ?? {};
  const git = toMetadata(gitEntriesByFile.get(file));
  const metadata: IllustrationIconGeneratedMetadata = {
    ...defaultReleaseMetaData,
    ...releaseMetadata,
    ...(git ? { git } : {}),
  };

  return [file, metadata] as const;
});

await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
await fs.promises.writeFile(
  outputPath,
  `${JSON.stringify(Object.fromEntries(metadataEntries), null, 2)}\n`,
  'utf8',
);

console.log(`Successfully written git metadata for ${metadataEntries.length} illustration icons.`);
