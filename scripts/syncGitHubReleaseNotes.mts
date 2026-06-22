/**
 * 同步本地持久化变更日志到 GitHub Release。
 *
 * 输入：读取 `changelogs/releases/v*.json` 中持久化的双语 release notes。
 * 行为：
 * - 根据 tag 找到或创建对应 GitHub Release。
 * - 将中文和英文变更说明写入 Release body。
 * - 可把最新版本标记为 latest。
 *
 * 适用场景：修复历史 Release 内容，或把本地 changelog 数据重新同步到 GitHub。
 */
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { formatShanghaiDateTime } from './dateTime.mts';

type PersistedReleaseNotes = {
  tag: string;
  date: string;
  zh: string[];
  en: string[];
};

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDir, '..');
const releaseNotesDir = path.resolve(projectRoot, 'changelogs/releases');
const repo = process.env.YCLOUD_RELEASE_REPO || 'TianJianJun0727/ycloud-icons';
const dryRun = process.argv.includes('--dry-run');

function compareTags(left: string, right: string) {
  const leftParts = left.replace(/^v/, '').split('.').map(Number);
  const rightParts = right.replace(/^v/, '').split('.').map(Number);

  for (let index = 0; index < Math.max(leftParts.length, rightParts.length); index += 1) {
    const diff = (leftParts[index] || 0) - (rightParts[index] || 0);

    if (diff !== 0) {
      return diff;
    }
  }

  return 0;
}

function runGh(args: string[]) {
  return execFileSync('gh', args, {
    cwd: projectRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function runGit(args: string[]) {
  return execFileSync('git', args, {
    cwd: projectRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function getTagDateTime(tag: string) {
  return formatShanghaiDateTime(runGit(['log', '-1', '--format=%cI', tag]));
}

function releaseExists(tag: string) {
  try {
    runGh(['release', 'view', tag, '--repo', repo]);
    return true;
  } catch (error) {
    const stderr =
      typeof error === 'object' && error && 'stderr' in error
        ? String((error as { stderr?: unknown }).stderr || '')
        : '';

    if (stderr.includes('release not found')) {
      return false;
    }

    throw error;
  }
}

function validateReleaseNotes(notes: PersistedReleaseNotes) {
  if (!notes.tag || !notes.date || !notes.zh?.length || !notes.en?.length) {
    throw new Error(`Invalid release notes file for ${notes.tag || 'unknown tag'}.`);
  }
}

function renderReleaseBody(notes: PersistedReleaseNotes) {
  const lines = [
    `发布日期：${getTagDateTime(notes.tag)}`,
    '',
    '## 中文',
    '',
    ...notes.zh.map((item) => `- ${item}`),
    '',
    '## English',
    '',
    ...notes.en.map((item) => `- ${item}`),
    '',
  ];

  return `${lines.join('\n').trim()}\n`;
}

async function readReleaseNotesFiles() {
  const files = (await readdir(releaseNotesDir))
    .filter((file) => /^v\d+\.\d+\.\d+\.json$/.test(file))
    .sort((left, right) => compareTags(left.replace(/\.json$/, ''), right.replace(/\.json$/, '')));

  return Promise.all(
    files.map(async (file) => {
      const content = await readFile(path.resolve(releaseNotesDir, file), 'utf8');
      const notes = JSON.parse(content) as PersistedReleaseNotes;
      validateReleaseNotes(notes);
      return notes;
    }),
  );
}

async function syncReleaseNotes() {
  const releaseNotes = await readReleaseNotesFiles();
  const tempDir = await mkdtemp(path.join(tmpdir(), 'ycloud-release-notes-'));

  try {
    for (const notes of releaseNotes) {
      const body = renderReleaseBody(notes);

      if (dryRun) {
        console.log(`--- ${notes.tag} ---`);
        console.log(body);
        continue;
      }

      const bodyPath = path.resolve(tempDir, `${notes.tag}.md`);
      await writeFile(bodyPath, body, 'utf8');

      if (releaseExists(notes.tag)) {
        runGh(['release', 'edit', notes.tag, '--repo', repo, '--notes-file', bodyPath]);
        console.log(`Updated ${notes.tag}`);
      } else {
        runGh([
          'release',
          'create',
          notes.tag,
          '--repo',
          repo,
          '--title',
          notes.tag,
          '--notes-file',
          bodyPath,
        ]);
        console.log(`Created ${notes.tag}`);
      }
    }

    const latestRelease = releaseNotes.at(-1);

    if (!dryRun && latestRelease) {
      runGh(['release', 'edit', latestRelease.tag, '--repo', repo, '--latest']);
      console.log(`Marked ${latestRelease.tag} as latest`);
    }
  } finally {
    await rm(tempDir, { force: true, recursive: true });
  }
}

await syncReleaseNotes();
