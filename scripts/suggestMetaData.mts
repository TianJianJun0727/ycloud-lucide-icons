/**
 * 为图标 PR 生成元数据建议。
 *
 * 输入：GitHub PR 上下文、PR 描述、当前分类定义、已有图标元数据和变更的 SVG 文件名。
 * 主要功能：
 * - 为新增图标建议中文名、英文名、标签、分类和 use-cases。
 * - 使用已有分类说明和高质量样例作为 few-shot 上下文，减少随意发明分类。
 * - 输出建议内容供 PR 评论或后续修复脚本参考，不直接替代校验流程。
 */
import 'dotenv/config';
import { Octokit } from '@octokit/rest';

import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import z from 'zod';
import { createAiClient } from './aiClient.mts';

// Resolve repo paths relative to this script so they work no matter which
// directory the script is invoked from (the workflow runs it from the repo root).
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(scriptDir, '..');
const iconsDir = path.join(repoRoot, 'icons');
const categoriesDir = path.join(repoRoot, 'categories');

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const pullRequestNumber = Number(process.env.PULL_REQUEST_NUMBER);
const username = process.env.REVIEWER ?? 'github-actions[bot]';
const commitSha = process.env.COMMIT_SHA ?? 'HEAD';
const useFileSystem =
  process.env.USE_FILE_SYSTEM === 'true' || process.env.USE_FILE_SYSYEM === 'true';

const [owner, repo] = (process.env.GITHUB_REPOSITORY ?? 'TianJianJun0727/ycloud-icons').split('/');

const ai = createAiClient();

if (!ai) {
  console.log('No AI provider is configured. Skipping metadata suggestions.');
  process.exit(0);
}

const ALL_METADATA_FIELDS = ['tags', 'categories', 'use-cases', 'i18n.en.use-cases'] as const;
const PORTAL_METADATA_FIELDS = ['tags', 'use-cases', 'i18n.en.use-cases'] as const;
type MetadataField = (typeof ALL_METADATA_FIELDS)[number];
type ReviewComment = {
  path: string;
  line: number;
  side: 'RIGHT';
  body: string;
  start_line?: number;
  start_side?: 'RIGHT';
};

// Load the allowed categories (name + human-readable title) straight from the
// `categories/` directory so we can both validate suggestions and give the
// model a description of every category.
async function loadCategories() {
  const files = (await fs.readdir(categoriesDir)).filter((file) => file.endsWith('.json'));

  const categories = await Promise.all(
    files.map(async (file) => {
      const metadata = JSON.parse(await fs.readFile(path.join(categoriesDir, file), 'utf-8'));
      return {
        name: path.basename(file, '.json'),
        title: metadata.title,
        englishTitle: metadata.i18n?.en?.title ?? '',
      };
    }),
  );

  return categories.sort((a, b) => a.name.localeCompare(b.name));
}

// Sample a handful of well-populated icons to feed the model as few-shot
// examples so its suggestions match the repository's house style. Candidates
// are spread evenly across the (alphabetically sorted) icon set and read
// sequentially to keep the number of open file handles bounded.
async function loadReferenceExamples(count = 8) {
  const fileNames = (await fs.readdir(iconsDir)).filter((file) => file.endsWith('.json')).sort();
  const candidateCount = Math.min(fileNames.length, count * 8);
  const step = Math.max(1, Math.floor(fileNames.length / candidateCount));

  const examples: Record<string, unknown>[] = [];
  for (let i = 0; i < fileNames.length && examples.length < count; i += step) {
    try {
      const metadata = JSON.parse(await fs.readFile(path.join(iconsDir, fileNames[i]), 'utf-8'));
      const isWellPopulated =
        Array.isArray(metadata.tags) &&
        metadata.tags.length > 0 &&
        Array.isArray(metadata.categories) &&
        metadata.categories.length > 0 &&
        Array.isArray(metadata['use-cases']) &&
        metadata['use-cases'].length > 0 &&
        Array.isArray(metadata.i18n?.en?.['use-cases']) &&
        metadata.i18n.en['use-cases'].length > 0;

      if (isWellPopulated) {
        examples.push({
          name: path.basename(fileNames[i], '.json'),
          tags: metadata.tags,
          categories: metadata.categories,
          'use-cases': metadata['use-cases'],
          i18n: {
            en: {
              tags: metadata.i18n?.en?.tags ?? [],
              'use-cases': metadata.i18n?.en?.['use-cases'] ?? [],
            },
          },
        });
      }
    } catch {
      // Ignore files that fail to parse.
    }
  }

  return examples;
}

const categories = await loadCategories();
const categoryNames = categories.map((category) => category.name);
const categoryByName = new Map(categories.map((category) => [category.name, category]));
const referenceExamples = await loadReferenceExamples();

const { data: files } = await octokit.pulls.listFiles({
  owner,
  repo,
  pull_number: pullRequestNumber,
});

const { data: reviews } = await octokit.pulls.listReviews({
  owner,
  repo,
  pull_number: pullRequestNumber,
  query: `in:body author:github-actions[bot]`,
});

// Get the PR description so the model can ground its suggestions in the
// author's stated intent for the icon. Truncated to keep the prompt small.
const { data: pullRequest } = await octokit.pulls.get({
  owner,
  repo,
  pull_number: pullRequestNumber,
});

const prDescription = (pullRequest.body || '').slice(0, 4000);
const isPortalPullRequest =
  pullRequest.head.ref.startsWith('ycloud-icons-portal/') ||
  (pullRequest.body || '').includes('ycloud-icons-source:figma-plugin') ||
  (pullRequest.body || '').includes('ycloud-icons-source:portal') ||
  (pullRequest.body || '').includes('YCloud 图标同步助手');
const metadataFields = isPortalPullRequest ? PORTAL_METADATA_FIELDS : ALL_METADATA_FIELDS;
const shouldSuggestCategories = !isPortalPullRequest;

const metadataSchema = z.object({
  tags: z.array(z.string()),
  ...(shouldSuggestCategories
    ? {
        categories: z.array(z.enum(categoryNames as [string, ...string[]])),
      }
    : {}),
  'use-cases': z.array(z.string()),
  i18n: z.object({
    en: z.object({
      'use-cases': z.array(z.string()),
    }),
  }),
});

const hasUserReviews = reviews.some((review) => review.user?.login === username);

// TODO: Find a better way to check if the PR has been updated since the last review
if (hasUserReviews) {
  console.log(
    `Pull request #${pullRequestNumber} already has reviews from ${username}. Skipping...`,
  );
  process.exit(0);
}

const changedFiles = files.filter(
  ({ filename }) => filename.startsWith('icons/') && filename.includes('.json'),
);

if (changedFiles.length === 0) {
  console.log('No changed icons found');
  process.exit(0);
}

console.log(`Using ${ai.provider} for metadata suggestions with model ${ai.model}.`);

const categoriesContext = categories
  .map(({ name, title, englishTitle }) => {
    const suffix = englishTitle ? ` / ${englishTitle}` : '';
    return `- ${name}: ${title}${suffix}`;
  })
  .join('\n');

// Render an array property exactly as it should appear in the metadata JSON,
// preserving the repo's 2-space indentation and the original trailing comma.
function buildArrayBlock(
  field: MetadataField,
  values: string[],
  trailingComma: string,
  indent = '  ',
) {
  const itemIndent = `${indent}  `;
  const fieldName = field.split('.').at(-1) ?? field;

  if (values.length === 0) {
    return `${indent}"${fieldName}": []${trailingComma}`;
  }

  const items = values.map((value) => `${itemIndent}${JSON.stringify(value)}`).join(',\n');
  return `${indent}"${fieldName}": [\n${items}\n${indent}]${trailingComma}`;
}

// Locate the line range of an array property in the raw file so we can anchor a
// GitHub suggestion to it. Handles both inline (`"use-cases": []`) and
// multi-line arrays, and reports whether the closing line has a trailing comma.
function findFieldBlock(lines: string[], field: string, startAt = 0) {
  const startIdx = lines.findIndex(
    (line, index) => index >= startAt && line.trimStart().startsWith(`"${field}":`),
  );
  if (startIdx === -1) return null;

  let endIdx = startIdx;
  if (!lines[startIdx].includes(']')) {
    for (let i = startIdx + 1; i < lines.length; i++) {
      endIdx = i;
      if (lines[i].trimStart().startsWith(']')) break;
    }
  }

  const trailingComma = lines[endIdx].trim().endsWith(',') ? ',' : '';
  return { startLine: startIdx + 1, endLine: endIdx + 1, trailingComma };
}

function findMetadataFieldBlock(lines: string[], field: MetadataField) {
  if (field !== 'i18n.en.use-cases') {
    return { block: findFieldBlock(lines, field), indent: '  ' };
  }

  const englishMetadataIdx = lines.findIndex((line) => line.trimStart().startsWith('"en":'));
  if (englishMetadataIdx === -1) {
    return { block: null, indent: '      ' };
  }

  return { block: findFieldBlock(lines, 'use-cases', englishMetadataIdx + 1), indent: '      ' };
}

function getCurrentValues(metadata: any, field: MetadataField): string[] {
  if (field === 'i18n.en.use-cases') {
    return metadata.i18n?.en?.['use-cases'] ?? [];
  }

  return metadata[field] ?? [];
}

function getSuggestedValues(suggested: any, field: MetadataField): string[] {
  if (field === 'i18n.en.use-cases') {
    return suggested.i18n?.en?.['use-cases'] ?? [];
  }

  return suggested[field] ?? [];
}

function getUseCasesState(metadata: any) {
  const chineseUseCases = Array.isArray(metadata['use-cases']) ? metadata['use-cases'] : [];
  const englishUseCases = Array.isArray(metadata.i18n?.en?.['use-cases'])
    ? metadata.i18n.en['use-cases']
    : [];

  return {
    hasChineseUseCases: chineseUseCases.length > 0,
    hasEnglishUseCases: englishUseCases.length > 0,
  };
}

function getCategoryContext(metadata: any) {
  if (!Array.isArray(metadata.categories)) {
    return [];
  }

  return metadata.categories.map((categoryName: string) => {
    const category = categoryByName.get(categoryName);
    return {
      name: categoryName,
      title: category?.title ?? '',
      englishTitle: category?.englishTitle ?? '',
    };
  });
}

function shouldSuggestField(metadata: any, field: MetadataField) {
  if (field !== 'use-cases' && field !== 'i18n.en.use-cases') {
    return true;
  }

  const { hasChineseUseCases, hasEnglishUseCases } = getUseCasesState(metadata);

  if (!hasChineseUseCases) {
    return field === 'use-cases';
  }

  if (!hasEnglishUseCases) {
    return field === 'i18n.en.use-cases';
  }

  return true;
}

const suggestionsByFile = changedFiles.map(async ({ filename, raw_url }) => {
  const iconName = path.basename(filename, '.json');

  // Read the icon's current metadata (the PR head version) first, so we can
  // both give it to the model as context and dedupe suggestions against it.
  let fileContent: string;
  if (useFileSystem) {
    fileContent = await fs.readFile(path.join(repoRoot, filename), 'utf-8');
  } else {
    const fileGithubRequest = await octokit.request(`GET ${raw_url}`, {
      headers: {
        Accept: 'application/vnd.github.v3.raw',
      },
    });
    fileContent = fileGithubRequest.data;
  }

  const metadata = JSON.parse(fileContent);

  const currentMetadata = {
    libraryContext:
      'This item is one icon in the YCloud Icons library, a general-purpose SVG icon set based on Lucide-style icon names. Suggest metadata for icon search and display, not as standalone dictionary entries.',
    tags: metadata.tags ?? [],
    categories: metadata.categories ?? [],
    categoryContext: getCategoryContext(metadata),
    'use-cases': metadata['use-cases'] ?? [],
    i18n: {
      en: {
        tags: metadata.i18n?.en?.tags ?? [],
        'use-cases': metadata.i18n?.en?.['use-cases'] ?? [],
      },
    },
  };

  const input = `You are maintaining the metadata for the YCloud icon library. Suggest additional metadata for the \`${iconName}\` icon.

Library context:
- YCloud Icons is a general-purpose SVG icon library based on Lucide-style icon names.
- The icon name \`${iconName}\` is the canonical English symbol name and is often more important than individual legacy tags.
- Categories are coarse semantic buckets. Use them to resolve ambiguous English words and decide the primary meaning.
- Existing tags and use-cases may contain literal translations, old aliases, typos, or weak secondary meanings. Treat them as hints, not as facts that must be preserved.
- Use-cases describe product/UI scenarios and must follow the icon's primary meaning in this icon library.

Guidelines:
- tags: Simplified Chinese search terms for the default Chinese metadata. Treat English metadata as the source of truth: icon name, i18n.en.name, i18n.en.tags, and i18n.en.use-cases. Use Chinese metadata only as wording reference.
- tags: Generate Chinese tags by translating from English source metadata, using selected category context and use-cases to resolve ambiguity. Do not translate English tags word by word.
- tags: If an English tag has multiple meanings, choose the Chinese term that fits the category and use-cases. Prefer natural Chinese UI/product search terms, such as "排列", "下载", "筛选", "急救", "波形". Avoid awkward dictionary words, machine translation, and rare transliterations.
- tags: Chinese tags do not need to match English tags one-to-one. Translate English tags into natural Chinese concepts, then merge duplicates and remove weak secondary meanings.
- tags: Prefer the icon's primary library meaning over weak secondary literal meanings. Use the filename, English name, current tags, categories, and use-cases together as context.
- tags: Keep common technical proper nouns as-is when Chinese users search for them that way, such as API, CSS, JSON, SVG, GitHub. Never include the word "icon" or the icon's own name ("${iconName}").
- categories: ${isPortalPullRequest ? 'do not suggest categories. This PR comes from the Figma submission flow, where categories are explicitly selected by the designer.' : 'only use values from the allowed categories listed below. Lowercase. Keep them relevant to the icon.'}
- use-cases: Simplified Chinese phrases describing concrete product/UI situations for this icon's primary library meaning (e.g. "表示摄像头已禁用"). No trailing punctuation.
- i18n.en.use-cases: English lowercase phrases describing the same concrete product/UI situations for this icon's primary library meaning (e.g. "indicating a disabled webcam"). No trailing punctuation.
- use-cases: If both languages have empty use-cases, suggest English use-cases first from the icon's English source meaning, then translate them into Chinese.
- use-cases: If i18n.en.use-cases exists, treat it as source and translate/polish top-level use-cases from it. If only top-level use-cases exists, translate it into English first, then polish Chinese from that English source.
- use-cases: Do not suggest use-cases from weak secondary meanings unless categories or current use-cases clearly make that meaning primary.
Only suggest NEW values that build on the current metadata, and prefer quality over quantity.

Allowed categories:
${categoriesContext}

Current metadata for "${iconName}":
${JSON.stringify(currentMetadata, null, 2)}

Pull request description:
${prDescription || '(no description provided)'}

Reference examples from existing icons:
${JSON.stringify(referenceExamples, null, 2)}`;

  const suggested = await ai.completeJson(input, 'metadata', metadataSchema);

  console.log(`Suggestions for ${iconName}:`, suggested);
  console.log(`Current metadata for ${iconName}:`, currentMetadata);

  const lines = fileContent.split('\n');
  const chatGptQuery = `Suggest Simplified Chinese tags, categories, Simplified Chinese use-cases, and English i18n.en.use-cases for a "${iconName}" icon in the YCloud icon library.`;

  // Build one inline GitHub suggestion per field, deduped against the values
  // already present in the file.
  const comments = metadataFields.flatMap((field) => {
    if (!shouldSuggestField(metadata, field)) {
      console.log(`Skipping ${field} suggestion for ${iconName} based on current use-cases state.`);
      return [];
    }

    const current = getCurrentValues(metadata, field);
    const newValues = getSuggestedValues(suggested, field).filter(
      (value) => !current.includes(value) && value !== iconName,
    );

    if (newValues.length === 0) {
      console.log(`No new ${field} to suggest for ${iconName}. Skipping...`);
      return [];
    }

    const { block, indent } = findMetadataFieldBlock(lines, field);
    if (!block) {
      console.log(`Could not locate "${field}" in ${filename}. Skipping...`);
      return [];
    }

    const suggestion = buildArrayBlock(
      field,
      [...current, ...newValues],
      block.trailingComma,
      indent,
    );

    const body = `Suggested \`${field}\` for the \`${iconName}\` icon.
\`\`\`suggestion
${suggestion}
\`\`\`
Want more ideas? [Ask ChatGPT](https://chatgpt.com/?q=${encodeURIComponent(chatGptQuery)})`;

    const comment: ReviewComment = {
      path: filename,
      line: block.endLine,
      side: 'RIGHT',
      body,
    };

    // Multi-line arrays need a start anchor; inline arrays are single-line.
    if (block.endLine !== block.startLine) {
      comment.start_line = block.startLine;
      comment.start_side = 'RIGHT';
    }

    return [comment];
  });

  return comments;
});

const comments = (await Promise.all(suggestionsByFile)).flat();

if (comments.length === 0) {
  console.log('No new metadata to suggest for any icons.');
  process.exit(0);
}

const reviewBody = `### Metadata suggestions
I've asked AI for suggestions for \`tags\`, \`categories\`, Simplified Chinese \`use-cases\`, and English \`i18n.en.use-cases\`.
\`tags\` and top-level \`use-cases\` are Simplified Chinese because they belong to the default Chinese metadata.
Please review them and apply any that you find useful.
`;

try {
  console.log({
    owner,
    repo,
    pull_number: pullRequestNumber,
    body: reviewBody,
    event: 'COMMENT',
    comments,
    commit_id: commitSha,
  });
  await octokit.pulls.createReview({
    owner,
    repo,
    pull_number: pullRequestNumber,
    body: reviewBody,
    event: 'COMMENT',
    comments,
    commit_id: commitSha,
  });
} catch (error) {
  console.error('Error creating review:', error);
  process.exit(0);
}
