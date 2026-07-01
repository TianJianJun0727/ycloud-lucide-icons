/**
 * Write GitHub Release notes without installing workspace dependencies.
 *
 * The release PR should have already generated either
 * `changelogs/releases/vX.Y.Z.json` or the matching CHANGELOG sections. This
 * script only formats those committed notes for the GitHub Release job.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDir, '..');
const version = (process.env.RELEASE_VERSION || process.argv[2] || '').replace(/^v/, '');
const outputPath = path.resolve(
  projectRoot,
  process.env.YCLOUD_CHANGELOG_RELEASE_NOTES_PATH || process.argv[3] || '.release-notes.md',
);

if (!/^[0-9]+\.[0-9]+\.[0-9]+([.-][0-9A-Za-z.-]+)?$/.test(version)) {
  throw new Error(`Invalid release notes version: ${version || '<empty>'}.`);
}

const tag = `v${version}`;

function run(command, args) {
  return execFileSync(command, args, {
    cwd: projectRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();
}

function formatShanghaiDateTime(isoDateTime) {
  const parts = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
    .formatToParts(new Date(isoDateTime))
    .reduce((result, part) => {
      result[part.type] = part.value;
      return result;
    }, {});

  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second} (UTC+08:00)`;
}

function readPersistedNotes() {
  const notesPath = path.resolve(projectRoot, `changelogs/releases/${tag}.json`);
  if (!existsSync(notesPath)) {
    return undefined;
  }

  const notes = JSON.parse(readFileSync(notesPath, 'utf8'));
  if (
    notes.tag !== tag ||
    !Array.isArray(notes.zh) ||
    !Array.isArray(notes.en) ||
    !notes.zh.length ||
    !notes.en.length
  ) {
    throw new Error(`Invalid persisted release notes: ${notesPath}.`);
  }

  return { zh: notes.zh, en: notes.en };
}

function readMarkdownNotes(filePath, subsectionHeading) {
  const markdown = readFileSync(path.resolve(projectRoot, filePath), 'utf8');
  const headingPattern = new RegExp(`^## ${tag.replaceAll('.', '\\\\.')} - .*$`, 'm');
  const headingMatch = headingPattern.exec(markdown);
  if (!headingMatch || headingMatch.index === undefined) {
    return [];
  }

  const sectionStart = headingMatch.index + headingMatch[0].length;
  const nextHeadingMatch = /^## v/m.exec(markdown.slice(sectionStart));
  const section = nextHeadingMatch
    ? markdown.slice(sectionStart, sectionStart + nextHeadingMatch.index)
    : markdown.slice(sectionStart);
  const notesSection = subsectionHeading
    ? extractSubsection(section, subsectionHeading)
    : section;

  return notesSection
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim())
    .filter(Boolean);
}

function extractSubsection(section, subsectionHeading) {
  const headingPattern = new RegExp(`^### ${subsectionHeading}$`, 'm');
  const headingMatch = headingPattern.exec(section);
  if (!headingMatch || headingMatch.index === undefined) {
    return '';
  }

  const subsectionStart = headingMatch.index + headingMatch[0].length;
  const nextSubsectionMatch = /^### /m.exec(section.slice(subsectionStart));
  return nextSubsectionMatch
    ? section.slice(subsectionStart, subsectionStart + nextSubsectionMatch.index)
    : section.slice(subsectionStart);
}

function readCommittedNotes() {
  const persistedNotes = readPersistedNotes();
  if (persistedNotes) {
    return persistedNotes;
  }

  const zh = readMarkdownNotes('CHANGELOG.md', '中文');
  const en = readMarkdownNotes('docs/.vitepress/data/CHANGELOG.en.md');
  if (!zh.length || !en.length) {
    throw new Error(
      `Release notes for ${tag} were not found in changelogs/releases or CHANGELOG files.`,
    );
  }

  return { zh, en };
}

const notes = readCommittedNotes();
const releaseDate = formatShanghaiDateTime(run('git', ['log', '-1', '--format=%cI', tag]));
const markdown = [
  `发布日期：${releaseDate}`,
  '',
  '## 中文',
  '',
  ...notes.zh.map((note) => `- ${note}`),
  '',
  '## English',
  '',
  ...notes.en.map((note) => `- ${note}`),
  '',
].join('\n');

writeFileSync(outputPath, markdown.trimEnd() + '\n', 'utf8');
