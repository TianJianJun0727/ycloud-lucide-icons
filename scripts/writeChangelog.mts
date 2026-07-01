/**
 * 生成仓库和文档使用的双语变更日志。
 *
 * 输入：
 * - Git tag 和提交记录。
 * - 可选 `YCLOUD_AI_CHANGELOG=1`、`AI_API_KEY`、`AI_BASE_URL`、`AI_MODEL`。
 * - 可选 `YCLOUD_AI_CHANGELOG_VERSION` 指定只生成某个版本的 AI release notes。
 * 输出：
 * - 根 `CHANGELOG.md` 双语日志。
 * - `docs/.vitepress/data/CHANGELOG.en.md` 英文日志。
 * - `docs/.vitepress/data/changelogSidebar.ts` 文档侧边栏数据。
 * - `changelogs/releases/v*.json` 持久化双语版本说明。
 *
 * 规则：AI 模式只为当前目标版本生成摘要，不重新生成全部历史版本。
 * 调用位置：根 `package.json` 的 `pnpm generate:changelog` / `pnpm generate:changelog:md`，`docs/package.json` 的 `prebuild:changelog`，以及 `.github/workflows/release.yml`。
 * 调用时机：文档构建前生成页面用 changelog；release 流程中生成并持久化当前版本双语 release notes。
 */
import { execSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import z from 'zod';
import { createAiClient } from './aiClient.mts';
import { formatShanghaiDateTime } from './dateTime.mts';

type ReleaseEntry = {
  version: string;
  tag: string;
  date: string;
  commits: string[];
  changedFiles: string[];
  notes: {
    zh: string[];
    en: string[];
  };
};

type ChangelogNotes = ReleaseEntry['notes'];

type AiReleaseNotes = {
  tag?: unknown;
  zh?: unknown;
  en?: unknown;
};

type GeneratedAiNotes = {
  notes: ChangelogNotes;
  generated: boolean;
};

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDir, '..');
const changelogPath = path.resolve(projectRoot, 'CHANGELOG.md');
const englishChangelogPath = path.resolve(projectRoot, 'docs/.vitepress/data/CHANGELOG.en.md');
const changelogSidebarPath = path.resolve(projectRoot, 'docs/.vitepress/data/changelogSidebar.ts');
const persistedReleaseNotesDir = path.resolve(projectRoot, 'changelogs/releases');
const releaseNotesOutputPath = process.env.YCLOUD_CHANGELOG_RELEASE_NOTES_PATH
  ? path.resolve(projectRoot, process.env.YCLOUD_CHANGELOG_RELEASE_NOTES_PATH)
  : undefined;
const aiChangelogEnabled = process.env.YCLOUD_AI_CHANGELOG === '1';
const aiChangelogVersion = process.env.YCLOUD_AI_CHANGELOG_VERSION;

const aiReleaseNotesSchema = z.object({
  tag: z.string(),
  zh: z.array(z.string()),
  en: z.array(z.string()),
});

function run(command: string) {
  return execSync(command, {
    cwd: projectRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();
}

function listTags() {
  const output = run(`git tag --list 'v*' --sort=-version:refname`);
  return output ? output.split('\n').filter(Boolean) : [];
}

function getTagDate(tag: string) {
  return run(`git log -1 --format=%cs ${tag}`);
}

function getTagDateTime(tag: string) {
  return run(`git log -1 --format=%cI ${tag}`);
}

function getRefDate(ref: string) {
  return run(`git log -1 --format=%cs ${ref}`);
}

function getCommits(currentRef: string, previousTag?: string) {
  if (!previousTag) {
    return ['首个正式版本发布。'];
  }

  const output = run(`git log --no-merges --format=%s ${previousTag}..${currentRef}`);
  const commits = output
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^chore\(release\):/i.test(line));

  return commits.length ? Array.from(new Set(commits)) : ['本版本没有记录到额外提交说明。'];
}

function getChangedFiles(currentRef: string, previousTag?: string) {
  if (!previousTag) {
    return [];
  }

  const output = run(`git diff --name-status ${previousTag}..${currentRef}`);

  return output
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 120);
}

function getEnglishFallbackNotes(commits: string[], hasPreviousTag: boolean) {
  if (!hasPreviousTag && commits.length === 1 && commits[0] === '首个正式版本发布。') {
    return ['First stable release.'];
  }

  if (commits.length === 1 && commits[0] === '本版本没有记录到额外提交说明。') {
    return ['No additional commit notes were recorded for this release.'];
  }

  return commits;
}

function buildEntries(tags: string[]): ReleaseEntry[] {
  return tags.map((tag, index) => {
    const previousTag = tags[index + 1];
    const version = tag.replace(/^v/, '');
    const commits = getCommits(tag, previousTag);
    const previousTagExists = index < tags.length - 1;

    return {
      version,
      tag,
      date: getTagDate(tag),
      commits,
      changedFiles: getChangedFiles(tag, previousTag),
      notes: {
        zh: commits,
        en: getEnglishFallbackNotes(commits, previousTagExists),
      },
    };
  });
}

function buildPendingReleaseEntry(tags: string[]): ReleaseEntry | undefined {
  const targetVersion = aiChangelogVersion?.replace(/^v/, '');
  if (!targetVersion) {
    return undefined;
  }

  const targetTag = `v${targetVersion}`;
  if (tags.includes(targetTag)) {
    return undefined;
  }

  const previousTag = tags[0];
  const commits = getCommits('HEAD', previousTag);
  const previousTagExists = Boolean(previousTag);

  return {
    version: targetVersion,
    tag: targetTag,
    date: getRefDate('HEAD'),
    commits,
    changedFiles: getChangedFiles('HEAD', previousTag),
    notes: {
      zh: commits,
      en: getEnglishFallbackNotes(commits, previousTagExists),
    },
  };
}

function getChangelogAnchor(version: string, date: string) {
  return `v${version.replace(/\./g, '-')}-${date}`;
}

function sanitizeNotes(notes: unknown) {
  if (!Array.isArray(notes)) {
    return [];
  }

  return notes
    .filter((note): note is string => typeof note === 'string')
    .map((note) => note.trim())
    .filter(Boolean)
    .slice(0, 6);
}

async function readPersistedNotes(entry: ReleaseEntry): Promise<ChangelogNotes | undefined> {
  try {
    const content = await readFile(
      path.resolve(persistedReleaseNotesDir, `${entry.tag}.json`),
      'utf8',
    );
    const parsed = JSON.parse(content) as AiReleaseNotes;
    const notes = {
      zh: sanitizeNotes(parsed.zh),
      en: sanitizeNotes(parsed.en),
    };

    if (!notes.zh.length || !notes.en.length) {
      return undefined;
    }

    return notes;
  } catch {
    return undefined;
  }
}

async function writePersistedNotes(entry: ReleaseEntry) {
  await mkdir(persistedReleaseNotesDir, { recursive: true });
  await writeFile(
    path.resolve(persistedReleaseNotesDir, `${entry.tag}.json`),
    `${JSON.stringify(
      {
        tag: entry.tag,
        date: entry.date,
        zh: entry.notes.zh,
        en: entry.notes.en,
      },
      null,
      2,
    )}\n`,
    'utf8',
  );
}

function buildAiPrompt(entry: ReleaseEntry) {
  const payload = {
    version: entry.tag,
    date: entry.date,
    commits: entry.commits.slice(0, 30),
    changedFiles: entry.changedFiles.slice(0, 60),
  };

  return `你是 YCloud Icons 图标库的发布说明编辑。请根据单个版本的提交标题和文件变更，生成面向使用者的双语 changelog 摘要。

要求：
- 输出严格 JSON，不要 Markdown，不要代码块。
- JSON 结构必须是 {"tag":"v0.0.0","zh":["..."],"en":["..."]}。
- zh 和 en 各 1 到 5 条。
- 中文自然、简洁，避免逐字翻译 commit。
- 英文自然、简洁，不能混入中文。
- 不要编造文件变更之外的能力。
- 不要输出原始 commit hash。
- 忽略纯 release version sync、自动生成文件、无实际用户影响的维护提交。
- 如果版本只包含维护或 CI 调整，也要概括成用户可理解的稳定性、文档或构建流程变化。

版本变更输入：
${JSON.stringify(payload, null, 2)}`;
}

async function generateAiNotes(entry: ReleaseEntry): Promise<GeneratedAiNotes> {
  try {
    const ai = createAiClient({
      provider: process.env.AI_PROVIDER ?? 'Release notes AI',
      systemPrompt:
        'You generate concise, accurate bilingual release notes from repository changes.',
    });

    if (!ai) {
      throw new Error('AI changelog generation requires AI_API_KEY, AI_BASE_URL, and AI_MODEL.');
    }

    const parsed = await ai.completeJson(
      buildAiPrompt(entry),
      'release_notes',
      aiReleaseNotesSchema,
    );

    if (parsed.tag !== entry.tag) {
      throw new Error(`AI response tag mismatch for ${entry.tag}.`);
    }

    const notes = {
      zh: sanitizeNotes(parsed.zh),
      en: sanitizeNotes(parsed.en),
    };

    if (!notes.zh.length || !notes.en.length) {
      throw new Error(`AI response did not include bilingual notes for ${entry.tag}.`);
    }

    return { notes, generated: true };
  } catch (error) {
    console.warn(
      `AI changelog generation failed for ${entry.tag}; falling back to deterministic notes. ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    return { notes: entry.notes, generated: false };
  }
}

async function applyAiGeneratedNotes(entries: ReleaseEntry[]) {
  const entriesWithPersistedNotes = await Promise.all(
    entries.map(async (entry) => {
      const notes = await readPersistedNotes(entry);
      return notes ? { ...entry, notes } : entry;
    }),
  );

  if (!aiChangelogEnabled) {
    return entriesWithPersistedNotes;
  }

  const targetTag = aiChangelogVersion
    ? aiChangelogVersion.replace(/^v/, '')
    : entriesWithPersistedNotes[0]?.version;
  const targetEntry = entriesWithPersistedNotes.find((entry) => entry.version === targetTag);

  if (!targetEntry) {
    console.warn(
      `AI changelog target version was not found: ${aiChangelogVersion || 'latest tag'}.`,
    );
    return entriesWithPersistedNotes;
  }

  const { notes } = await generateAiNotes(targetEntry);
  const updatedTargetEntry = { ...targetEntry, notes };

  await writePersistedNotes(updatedTargetEntry);

  return entriesWithPersistedNotes.map((entry) =>
    entry.tag === targetEntry.tag ? updatedTargetEntry : entry,
  );
}

function toMarkdown(entries: ReleaseEntry[], locale: 'zh' | 'en') {
  const isEnglish = locale === 'en';
  const lines = isEnglish
    ? [
        '# Changelog',
        '',
        '> This file is generated before the documentation build from Git tags and release changes.',
        '',
      ]
    : ['# 更新日志', '', '> 此文件会在文档构建前根据 Git tag 和版本变更自动生成。', ''];

  for (const entry of entries) {
    const notes = isEnglish ? entry.notes.en : entry.notes.zh;

    lines.push(`## ${entry.tag} - ${entry.date}`);
    lines.push('');

    for (const note of notes) {
      lines.push(`- ${note}`);
    }

    lines.push('');
  }

  return `${lines.join('\n').trim()}\n`;
}

function toBilingualMarkdown(entries: ReleaseEntry[]) {
  const lines = [
    '# 更新日志 / Changelog',
    '',
    '> 此文件会在文档构建前根据 Git tag 和版本变更自动生成。',
    '> This file is generated before the documentation build from Git tags and release changes.',
    '',
  ];

  for (const entry of entries) {
    lines.push(`## ${entry.tag} - ${entry.date}`);
    lines.push('');
    lines.push('### 中文');
    lines.push('');

    for (const note of entry.notes.zh) {
      lines.push(`- ${note}`);
    }

    lines.push('');
    lines.push('### English');
    lines.push('');

    for (const note of entry.notes.en) {
      lines.push(`- ${note}`);
    }

    lines.push('');
  }

  return `${lines.join('\n').trim()}\n`;
}

function toReleaseNotesMarkdown(entry: ReleaseEntry) {
  const lines = [
    `发布日期：${formatShanghaiDateTime(getTagDateTime(entry.tag))}`,
    '',
    '## 中文',
    '',
    ...entry.notes.zh.map((note) => `- ${note}`),
    '',
    '## English',
    '',
    ...entry.notes.en.map((note) => `- ${note}`),
    '',
  ];

  return `${lines.join('\n').trim()}\n`;
}

async function main() {
  const tags = listTags();

  if (!tags.length) {
    if (releaseNotesOutputPath) {
      throw new Error('Release notes cannot be generated because no version tags are available.');
    }

    const fallback =
      '# 更新日志 / Changelog\n\n> 当前仓库还没有可用的版本标签。\n> No version tags are available in this repository yet.\n';
    const englishFallback =
      '# Changelog\n\n> No version tags are available in this repository yet.\n';
    await writeFile(changelogPath, fallback, 'utf8');
    await writeFile(englishChangelogPath, englishFallback, 'utf8');
    await writeFile(changelogSidebarPath, 'export default [];\n', 'utf8');
    return;
  }

  const pendingReleaseEntry = buildPendingReleaseEntry(tags);
  const rawEntries = pendingReleaseEntry
    ? [pendingReleaseEntry, ...buildEntries(tags)]
    : buildEntries(tags);
  const entries = await applyAiGeneratedNotes(rawEntries);
  const markdown = toBilingualMarkdown(entries);
  const englishMarkdown = toMarkdown(entries, 'en');
  const targetVersion = aiChangelogVersion
    ? aiChangelogVersion.replace(/^v/, '')
    : entries[0]?.version;
  const targetEntry = entries.find((entry) => entry.version === targetVersion);
  const sidebarItems = entries.map((entry) => ({
    text: `${entry.tag} · ${entry.date}`,
    link: `/changelog#${getChangelogAnchor(entry.version, entry.date)}`,
  }));

  if (releaseNotesOutputPath && !targetEntry) {
    throw new Error(`Release notes target version was not found: ${targetVersion}.`);
  }

  await writeFile(changelogPath, markdown, 'utf8');
  await writeFile(englishChangelogPath, englishMarkdown, 'utf8');
  if (releaseNotesOutputPath && targetEntry) {
    await writeFile(releaseNotesOutputPath, toReleaseNotesMarkdown(targetEntry), 'utf8');
  }
  await writeFile(
    changelogSidebarPath,
    `const changelogSidebarItems = ${JSON.stringify(sidebarItems, null, 2)};\n\nexport default changelogSidebarItems;\n`,
    'utf8',
  );
}

await main();
