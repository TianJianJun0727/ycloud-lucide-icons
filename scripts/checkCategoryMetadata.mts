/**
 * 校验本次变更的分类元数据，通常由 PR 自动修复流程调用。
 *
 * 输入：命令行传入的 `categories/*.json` 文件列表。
 * 规则：
 * - 顶层 `title` 必须是简体中文，或是经审核确认适合中文搜索场景保留的英文品牌、
 *   标准、缩写、技术术语等例外词。
 * - `i18n.en.title` 必须是自然英文，不能包含中文，也不能是 kebab-case/snake_case slug。
 *
 * 调用位置：`.github/workflows/fix-icon-source.yml` 的 `Validate changed icon source` 步骤。
 * 调用时机：PR 中分类源文件经过 AI 元数据补全和格式化后，对本次变更 JSON 做最后一道增量校验。
 */
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { hasCjk, isSlugLike, isValidChineseSideText } from './metadataLanguageRules.mts';

function assertChineseText(errors: string[], field: string, value: unknown) {
  if (typeof value !== 'string' || value.trim().length === 0 || !isValidChineseSideText(value)) {
    errors.push(
      `\`${field}\` must be Simplified Chinese or a reviewed English term for Chinese search.`,
    );
  }
}

function assertEnglishText(errors: string[], field: string, value: unknown) {
  if (typeof value !== 'string' || value.trim().length === 0 || hasCjk(value)) {
    errors.push(`\`${field}\` must be English and must not contain Chinese characters.`);
    return;
  }

  if (isSlugLike(value)) {
    errors.push(`\`${field}\` must be natural English, not a kebab-case or snake_case slug.`);
  }
}

export function validateCategoryMetadata(metadata: Record<string, unknown>) {
  const errors: string[] = [];
  const englishMetadata = (metadata.i18n as Record<string, any> | undefined)?.en;

  assertChineseText(errors, 'title', metadata.title);
  assertEnglishText(errors, 'i18n.en.title', englishMetadata?.title);

  return errors;
}

export async function validateCategoryMetadataFile(file: string) {
  try {
    const metadata = JSON.parse(await fs.readFile(file, 'utf-8')) as Record<string, unknown>;
    return validateCategoryMetadata(metadata);
  } catch (error) {
    return [`cannot parse JSON: ${error instanceof Error ? error.message : String(error)}`];
  }
}

async function main() {
  const files = process.argv
    .slice(2)
    .filter((file) => file.startsWith('categories/') && file.endsWith('.json'));

  if (files.length === 0) {
    console.log('No changed category metadata files to validate.');
    return;
  }

  let hasError = false;

  for (const file of files) {
    const errors = await validateCategoryMetadataFile(file);

    for (const message of errors) {
      console.error(`${file}: ${message}`);
      hasError = true;
    }
  }

  if (hasError) {
    process.exit(1);
  }

  console.log('Changed category metadata files are valid.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
