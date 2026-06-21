import { execSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type ReleaseEntry = {
  version: string;
  tag: string;
  date: string;
  compareUrl?: string;
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

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDir, '..');
const changelogPath = path.resolve(projectRoot, 'CHANGELOG.md');
const englishChangelogPath = path.resolve(projectRoot, 'docs/.vitepress/data/CHANGELOG.en.md');
const changelogSidebarPath = path.resolve(projectRoot, 'docs/.vitepress/data/changelogSidebar.ts');
const aiChangelogEnabled = process.env.YCLOUD_AI_CHANGELOG === '1';
const githubToken = process.env.GITHUB_TOKEN;
const githubModelsEndpoint =
  process.env.YCLOUD_AI_CHANGELOG_ENDPOINT || 'https://models.github.ai/inference/chat/completions';
const githubModelsModel = process.env.YCLOUD_AI_CHANGELOG_MODEL || 'openai/gpt-4o';

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

function getCommits(currentTag: string, previousTag?: string) {
  if (!previousTag) {
    return ['首个正式版本发布。'];
  }

  const output = run(`git log --no-merges --format=%s ${previousTag}..${currentTag}`);
  const commits = output
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^chore\(release\):/i.test(line));

  return commits.length ? Array.from(new Set(commits)) : ['本版本没有记录到额外提交说明。'];
}

function getChangedFiles(currentTag: string, previousTag?: string) {
  if (!previousTag) {
    return [];
  }

  const output = run(`git diff --name-status ${previousTag}..${currentTag}`);

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
      compareUrl: previousTag
        ? `https://github.com/TianJianJun0727/ycloud-icons/compare/${previousTag}...${tag}`
        : undefined,
      commits,
      changedFiles: getChangedFiles(tag, previousTag),
      notes: {
        zh: commits,
        en: getEnglishFallbackNotes(commits, previousTagExists),
      },
    };
  });
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

function parseJsonObject(content: string) {
  const normalized = content
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```$/i, '')
    .trim();
  const start = normalized.indexOf('{');
  const end = normalized.lastIndexOf('}');

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('GitHub Models response did not contain a JSON object.');
  }

  return JSON.parse(normalized.slice(start, end + 1));
}

function buildAiPrompt(entries: ReleaseEntry[]) {
  const payload = entries.map((entry) => ({
    version: entry.tag,
    date: entry.date,
    commits: entry.commits,
    changedFiles: entry.changedFiles,
  }));

  return `你是 YCloud Icons 图标库的发布说明编辑。请根据每个版本的提交标题和文件变更，生成面向使用者的双语 changelog 摘要。

要求：
- 输出严格 JSON，不要 Markdown，不要代码块。
- JSON 结构必须是 {"releases":[{"tag":"v0.0.0","zh":["..."],"en":["..."]}]}。
- 每个版本 zh 和 en 各 1 到 5 条。
- 中文自然、简洁，避免逐字翻译 commit。
- 英文自然、简洁，不能混入中文。
- 不要编造文件变更之外的能力。
- 不要输出原始 commit hash。
- 忽略纯 release version sync、自动生成文件、无实际用户影响的维护提交。
- 如果版本只包含维护或 CI 调整，也要概括成用户可理解的稳定性、文档或构建流程变化。

版本变更输入：
${JSON.stringify(payload, null, 2)}`;
}

async function applyAiGeneratedNotes(entries: ReleaseEntry[]) {
  if (!aiChangelogEnabled || !githubToken) {
    return entries;
  }

  try {
    const response = await fetch(githubModelsEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${githubToken}`,
      },
      body: JSON.stringify({
        model: githubModelsModel,
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content:
              'You generate concise, accurate bilingual release notes from repository changes.',
          },
          {
            role: 'user',
            content: buildAiPrompt(entries),
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub Models request failed with ${response.status}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (typeof content !== 'string') {
      throw new Error('GitHub Models response did not contain message content.');
    }

    const parsed = parseJsonObject(content) as { releases?: unknown };
    const releases = Array.isArray(parsed.releases) ? (parsed.releases as AiReleaseNotes[]) : [];
    const notesByTag = new Map<string, ChangelogNotes>();

    for (const release of releases) {
      if (typeof release.tag !== 'string') {
        continue;
      }

      notesByTag.set(release.tag, {
        zh: sanitizeNotes(release.zh),
        en: sanitizeNotes(release.en),
      });
    }

    return entries.map((entry) => {
      const notes = notesByTag.get(entry.tag);

      if (!notes || !notes.zh.length || !notes.en.length) {
        return entry;
      }

      return {
        ...entry,
        notes,
      };
    });
  } catch (error) {
    console.warn(
      `AI changelog generation failed; falling back to deterministic notes. ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    return entries;
  }
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
    const releaseUrl = `https://github.com/TianJianJun0727/ycloud-icons/releases/tag/${entry.tag}`;
    const notes = isEnglish ? entry.notes.en : entry.notes.zh;

    lines.push(`## [${entry.tag}](${releaseUrl}) - ${entry.date}`);
    lines.push('');

    if (entry.compareUrl) {
      lines.push(`[${isEnglish ? 'View comparison' : '查看对比变更'}](${entry.compareUrl})`);
      lines.push('');
    }

    for (const note of notes) {
      lines.push(`- ${note}`);
    }

    lines.push('');
  }

  return `${lines.join('\n').trim()}\n`;
}

async function main() {
  const tags = listTags();

  if (!tags.length) {
    const fallback = '# 更新日志\n\n> 当前仓库还没有可用的版本标签。\n';
    const englishFallback =
      '# Changelog\n\n> No version tags are available in this repository yet.\n';
    await writeFile(changelogPath, fallback, 'utf8');
    await writeFile(englishChangelogPath, englishFallback, 'utf8');
    await writeFile(changelogSidebarPath, 'export default [];\n', 'utf8');
    return;
  }

  const entries = await applyAiGeneratedNotes(buildEntries(tags));
  const markdown = toMarkdown(entries, 'zh');
  const englishMarkdown = toMarkdown(entries, 'en');
  const sidebarItems = entries.map((entry) => ({
    text: `${entry.tag} · ${entry.date}`,
    link: `/changelog#${getChangelogAnchor(entry.version, entry.date)}`,
  }));

  await writeFile(changelogPath, markdown, 'utf8');
  await writeFile(englishChangelogPath, englishMarkdown, 'utf8');
  await writeFile(
    changelogSidebarPath,
    `const changelogSidebarItems = ${JSON.stringify(sidebarItems, null, 2)};\n\nexport default changelogSidebarItems;\n`,
    'utf8',
  );
}

await main();
