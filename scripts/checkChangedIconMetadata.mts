import fs from 'node:fs/promises';
import path from 'node:path';

const files = process.argv.slice(2).filter((file) => file.endsWith('.json'));

if (files.length === 0) {
  console.log('No changed icon metadata files to validate.');
  process.exit(0);
}

const categoriesDir = path.resolve('categories');
const categoryFiles = (await fs.readdir(categoriesDir)).filter((file) => file.endsWith('.json'));
const knownCategories = new Set(categoryFiles.map((file) => path.basename(file, '.json')));

let hasError = false;
const hasCjk = (value: string) => /[\u3400-\u9fff]/.test(value);
const isSlugLike = (value: string) => /^[a-z0-9]+(?:[-_][a-z0-9]+)+$/.test(value.trim());
const allowedNonChineseTags = new Set([
  '&',
  '&&',
  '*',
  '+',
  '-',
  '---',
  '->',
  '<-',
  '<-|',
  '>',
  'AI',
  'API',
  'CSS',
  'DNA',
  'Git',
  'GitHub',
  'GitLab',
  'GIF',
  'GPU',
  'HDMI',
  'HTML',
  'ID',
  'JSON',
  'Markdown',
  'NFC',
  'OS X',
  'PDF',
  'RSS',
  'SIM',
  'SVG',
  'USB',
  'Webhook',
  'Wi-Fi',
  'XML',
  'YAML',
  'iOS',
  'macOS',
  '3D',
  '2FA',
  '4K',
  '8K',
  '720p',
  '1080p',
  'A-Z',
  'DIY',
  'DJ',
  'DVD',
  'EP',
  'GSM',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'Instagram',
  'LP',
  'PHP',
  'RCA',
  'SaaS',
  'VPN',
  'grep',
  'x̄',
]);

function report(file: string, message: string) {
  console.error(`${file}: ${message}`);
  hasError = true;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
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
  if (typeof value !== 'string' || value.trim().length === 0 || !hasCjk(value)) {
    report(file, `\`${field}\` must be Simplified Chinese.`);
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

  const invalidTags = value.filter(
    (tag) => !hasCjk(tag) && /[A-Za-z]/.test(tag) && !allowedNonChineseTags.has(tag),
  );
  if (invalidTags.length > 0) {
    report(
      file,
      `\`${field}\` contains non-Chinese tags that are not allowed proper nouns: ${invalidTags.join(
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

  if (value.some((useCase) => useCase.trim().length > 0 && !hasCjk(useCase))) {
    report(file, `\`${field}\` must contain Simplified Chinese use cases.`);
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
  if (!file.startsWith('icons/') && !file.startsWith('categories/')) {
    continue;
  }

  let metadata: Record<string, unknown>;
  try {
    metadata = JSON.parse(await fs.readFile(file, 'utf-8')) as Record<string, unknown>;
  } catch (error) {
    report(file, `cannot parse JSON: ${error instanceof Error ? error.message : String(error)}`);
    continue;
  }

  if (file.startsWith('categories/')) {
    const englishMetadata = (metadata.i18n as Record<string, any> | undefined)?.en;

    assertChineseText(file, 'title', metadata.title);
    assertEnglishText(file, 'i18n.en.title', englishMetadata?.title);

    continue;
  }

  if (!file.startsWith('icons/')) {
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
