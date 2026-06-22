/**
 * 校验本次变更的图标元数据，通常由 PR 自动修复流程调用。
 *
 * 输入：命令行传入的 `icons/*.json` 文件列表。
 * 规则：
 * - 顶层 `name` 必须是简体中文，或是经审核确认适合中文搜索场景保留的英文品牌、
 *   标准、缩写、技术术语等例外词；`i18n.en.name` 必须是自然英文，不能是 slug。
 * - 顶层 `tags` 必须是非空中文搜索词数组；通用非中文术语 allowlist 中的例外词已审核，可直接保留。
 *   不在列表中的英文词需要进入 AI 审核：如果 AI 判断是中文搜索中应保留的专有名词/术语，可继续保留；
 *   否则应按图标语义翻译为自然中文。
 * - `i18n.en.tags` 必须是非空英文搜索词数组。
 * - `tags`、`i18n.en.tags`、`categories` 都不能包含重复值。
 * - `use-cases` 和 `i18n.en.use-cases` 必须都是数组；双空允许，但只要一侧有值，另一侧也必须有值。
 * - 非空的 `use-cases` 必须是中文，或是经审核的英文例外词；非空的 `i18n.en.use-cases`
 *   必须是英文，并且两侧长度和顺序一致。
 * - `categories` 只能引用 `categories/*.json` 中存在的分类 slug。
 * - 禁止继续使用 `i18n.en.categories`，分类翻译统一放在 `categories/*.json`。
 *
 * 调用位置：`.github/workflows/fix-icon-source.yml` 的 `Validate changed icon source` 步骤。
 * 调用时机：PR 中图标源文件经过 SVG 清洗、AI 元数据补全和格式化后，对本次变更 JSON 做最后一道增量校验。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  hasCjk,
  hasUnreviewedNonChineseTerm,
  isSlugLike,
  isStringArray,
  isValidChineseSideText,
} from './metadataLanguageRules.mts';

const files = process.argv
  .slice(2)
  .filter((file) => file.startsWith('icons/') && file.endsWith('.json'));

if (files.length === 0) {
  console.log('No changed icon metadata files to validate.');
  process.exit(0);
}

const categoriesDir = path.resolve('categories');
const categoryFiles = (await fs.readdir(categoriesDir)).filter((file) => file.endsWith('.json'));
const knownCategories = new Set(categoryFiles.map((file) => path.basename(file, '.json')));

let hasError = false;

function report(file: string, message: string) {
  console.error(`${file}: ${message}`);
  hasError = true;
}

function assertUniqueArray(file: string, field: string, value: unknown) {
  if (!isStringArray(value)) {
    return;
  }

  const duplicates = value.filter((item, index, list) => list.indexOf(item) !== index);
  if (duplicates.length > 0) {
    report(
      file,
      `\`${field}\` must not contain duplicate values: ${[...new Set(duplicates)].join(', ')}.`,
    );
  }
}

function assertChineseText(file: string, field: string, value: unknown) {
  if (typeof value !== 'string' || value.trim().length === 0 || !isValidChineseSideText(value)) {
    report(
      file,
      `\`${field}\` must be Simplified Chinese or a reviewed English term for Chinese search.`,
    );
  }
}

function assertEnglishText(file: string, field: string, value: unknown) {
  if (typeof value !== 'string' || value.trim().length === 0 || hasCjk(value)) {
    report(file, `\`${field}\` must be English and must not contain Chinese characters.`);
    return;
  }

  if (isSlugLike(value)) {
    report(file, `\`${field}\` must be natural English, not a kebab-case or snake_case slug.`);
  }
}

function assertChineseTags(file: string, field: string, value: unknown) {
  if (!isStringArray(value) || value.length === 0) {
    report(file, `\`${field}\` must be a non-empty array of Simplified Chinese tags.`);
    return;
  }

  const invalidTags = value.filter((tag) => hasUnreviewedNonChineseTerm(tag));
  if (invalidTags.length > 0) {
    report(
      file,
      `\`${field}\` contains English tags that need AI review before they can be kept in Chinese-side metadata: ${invalidTags.join(
        ', ',
      )}.`,
    );
  }
}

function assertEnglishTags(file: string, field: string, value: unknown) {
  if (!isStringArray(value) || value.length === 0) {
    report(file, `\`${field}\` must be a non-empty array of English tags.`);
    return;
  }

  if (value.some((tag) => hasCjk(tag))) {
    report(file, `\`${field}\` must not contain Chinese characters.`);
  }
}

function assertChineseUseCases(file: string, field: string, value: unknown) {
  if (!isStringArray(value)) {
    report(file, `\`${field}\` must be an array of Simplified Chinese use cases.`);
    return;
  }

  if (value.some((useCase) => useCase.trim().length > 0 && !isValidChineseSideText(useCase))) {
    report(
      file,
      `\`${field}\` must contain Simplified Chinese use cases or reviewed English terms.`,
    );
  }
}

function assertEnglishUseCases(file: string, field: string, value: unknown) {
  if (!isStringArray(value)) {
    report(file, `\`${field}\` must be an array of English use cases.`);
    return;
  }

  if (value.some((useCase) => hasCjk(useCase))) {
    report(file, `\`${field}\` must not contain Chinese characters.`);
  }
}

function assertBilingualUseCases(file: string, chineseValue: unknown, englishValue: unknown) {
  if (!isStringArray(chineseValue) || !isStringArray(englishValue)) {
    return;
  }

  if (chineseValue.length === 0 && englishValue.length === 0) {
    return;
  }

  if (chineseValue.length === 0) {
    report(
      file,
      '`use-cases` is empty but `i18n.en.use-cases` has values; add the matching Simplified Chinese translations.',
    );
    return;
  }

  if (englishValue.length === 0) {
    report(
      file,
      '`i18n.en.use-cases` is empty but `use-cases` has values; add the matching English translations.',
    );
    return;
  }

  if (chineseValue.length !== englishValue.length) {
    report(file, '`use-cases` and `i18n.en.use-cases` must have the same length and order.');
  }
}

for (const file of files) {
  let metadata: Record<string, unknown>;
  try {
    metadata = JSON.parse(await fs.readFile(file, 'utf-8')) as Record<string, unknown>;
  } catch (error) {
    report(file, `cannot parse JSON: ${error instanceof Error ? error.message : String(error)}`);
    continue;
  }

  const categories = metadata.categories;
  const englishMetadata = (metadata.i18n as Record<string, any> | undefined)?.en;

  if (!isStringArray(categories)) {
    report(file, '`categories` must be an array of category slugs.');
    continue;
  }

  if (englishMetadata && Object.prototype.hasOwnProperty.call(englishMetadata, 'categories')) {
    report(
      file,
      '`i18n.en.categories` is no longer supported; category translations live in categories/*.json.',
    );
  }

  assertChineseText(file, 'name', metadata.name);
  assertChineseTags(file, 'tags', metadata.tags);
  assertUniqueArray(file, 'tags', metadata.tags);
  assertChineseUseCases(file, 'use-cases', metadata['use-cases']);
  assertEnglishText(file, 'i18n.en.name', englishMetadata?.name);
  assertEnglishTags(file, 'i18n.en.tags', englishMetadata?.tags);
  assertUniqueArray(file, 'i18n.en.tags', englishMetadata?.tags);
  assertEnglishUseCases(file, 'i18n.en.use-cases', englishMetadata?.['use-cases']);
  assertUniqueArray(file, 'categories', categories);

  assertBilingualUseCases(file, metadata['use-cases'], englishMetadata?.['use-cases']);

  for (const category of categories) {
    if (!knownCategories.has(category)) {
      report(file, `category '${category}' does not exist in categories/*.json.`);
    }
  }
}

if (hasError) {
  process.exit(1);
}

console.log('Changed icon metadata files are valid.');
