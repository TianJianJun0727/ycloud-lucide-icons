/**
 * 自动补全或修复图标与分类元数据的双语字段，通常在图标 PR 中按增量文件运行。
 *
 * 输入：命令行传入的 `icons/*.json` 或 `categories/*.json` 文件列表。
 * 依赖：通过 `AI_API_KEY`、`AI_BASE_URL`、`AI_MODEL` 创建 OpenAI 兼容 AI 客户端。
 * 执行方式：默认批量调用 AI，图标每批 5 个、分类每批 10 个；不足一批也会处理。
 * 如果某批 AI 响应失败，会先重试一次；仍失败时自动降级为逐文件修复，避免一个坏响应阻塞整批。
 * 图标修复范围：
 * - `name` 缺失、不是中文且不是已审核可保留的英文专有词/术语时，生成简体中文图标名。
 * - `i18n.en.name` 缺失、含中文、等于中文名或像 slug 时，生成自然英文名。
 * - `tags` / `i18n.en.tags` 任一侧缺失、语言不对或中文侧包含未审核英文词时，
 *   基于文件名、两侧现有元数据、分类上下文和使用场景整体生成中英文标签，不逐词直译。
 * - `use-cases` / `i18n.en.use-cases` 缺失、不成对、语言不对、中文侧包含未审核英文或为空时，
 *   基于文件名、两侧现有元数据、分类上下文和标签整体生成成对的中英文使用场景，不逐词直译。
 * - 自动移除废弃的 `i18n.en.categories` 字段。
 * 分类修复范围：
 * - `title` 缺失、不是中文且不是已审核可保留的英文专有词/术语时，生成中文分类标题。
 * - `i18n.en.title` 缺失、含中文、等于中文标题或像 slug 时，生成英文分类标题。
 *
 * 约束：英文元数据是语义来源，中文结果用于 UI 展示和中文搜索；标签会去重，use-cases 会保持中英文成对。
 * 修复和写入完成后会对传入文件重新执行元数据校验，避免 AI 生成的错误结果进入提交。
 * 调用位置：`.github/workflows/fix-icon-source.yml` 的 `Complete changed metadata i18n` 步骤。
 * 调用时机：PR 修改 `icons/*.json` 或 `categories/*.json` 后，在格式化和最终校验前尝试补齐缺失/异常的双语字段。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import z from 'zod';
import { createAiClient } from './aiClient.mts';
import { validateCategoryMetadata } from './checkCategoryMetadata.mts';
import { validateIconMetadata } from './checkIconMetadata.mts';
import allowedNonChineseTerms from './data/allowedNonChineseTerms.json' with { type: 'json' };
import {
  hasCjk,
  hasUnreviewedNonChineseTerm,
  hasInvalidChineseSideUseCases,
  isMeaningfulArray,
  isSlugLike,
  isStringArray,
  isValidChineseSideText,
  uniqueList,
} from './metadataLanguageRules.mts';

const files = process.argv.slice(2).filter((file) => file.endsWith('.json'));

if (files.length === 0) {
  console.log('No changed metadata JSON files to fix.');
  process.exit(0);
}

const uniquePairs = (leftItems: string[], rightItems: string[]) => {
  if (leftItems.length !== rightItems.length) {
    throw new Error(
      `AI returned mismatched use-cases: ${leftItems.length} Chinese values and ${rightItems.length} English values.`,
    );
  }

  const seen = new Set<string>();
  const left: string[] = [];
  const right: string[] = [];

  for (let index = 0; index < leftItems.length; index += 1) {
    const leftItem = leftItems[index];
    const rightItem = rightItems[index];
    const key = `${leftItem}\n${rightItem}`;

    if (!leftItem || !rightItem || seen.has(key)) {
      continue;
    }

    seen.add(key);
    left.push(leftItem);
    right.push(rightItem);
  }

  return { left, right };
};
const normalizeAllowedNonChineseTerm = (term: string) => term.trim();
const compareAllowedNonChineseTerms = (left: string, right: string) =>
  left.localeCompare(right, 'en', { numeric: true });
const syncedAllowedNonChineseTerms = new Set<string>(
  allowedNonChineseTerms.map(normalizeAllowedNonChineseTerm).filter((term) => term.length > 0),
);
const allowedNonChineseTermSet = new Set<string>(syncedAllowedNonChineseTerms);
const hasDisallowedNonChineseTag = (value: unknown) =>
  isStringArray(value) && value.some((tag) => hasUnreviewedNonChineseTerm(tag));
const categoriesDir = path.resolve('categories');
const allowedNonChineseTermsFile = path.resolve('scripts/data/allowedNonChineseTerms.json');
const ICON_BATCH_SIZE = 5;
const CATEGORY_BATCH_SIZE = 10;
const ICON_LIBRARY_CONTEXT = `Library context:
- YCloud Icons is a general-purpose SVG icon library based on Lucide-style icon names.
- The file name is the canonical English symbol name and is often more important than individual legacy tags.
- Categories are coarse semantic buckets. Use them to resolve ambiguous English words and decide the primary meaning.
- Existing names, tags, and use-cases may contain literal translations, old aliases, typos, or weak secondary meanings. Treat them as hints, not as facts that must be preserved.
- Use-cases describe product/UI scenarios and must follow the icon's primary meaning in this icon library.`;
const ICON_METADATA_RULES = `Rules:
- Return all fields required by the JSON schema even when only some fields are listed in fixTargets.
- Use fixTargets to focus the repair, but keep every returned field coherent with the full icon context.
- nameZh, tagsZh, and useCasesZh are Chinese-side metadata for UI display and Chinese search.
- nameEn, tagsEn, and useCasesEn are English-side metadata for UI display and English search.
- Chinese-side metadata should be Simplified Chinese by default.
- English-side metadata must be natural English and must not contain Chinese characters.
- English words already present in the reviewed allowlist may be kept as-is.
- For English words outside the allowlist, decide from icon context whether they are true proper nouns, brands, standards, abbreviations, or technical terms that Chinese users naturally search for in English. Keep them only when that is true; otherwise translate them according to icon context.
- allowedNonChineseTerms must contain only non-Chinese terms from nameZh, tagsZh, or useCasesZh that should be kept in Chinese-side metadata because they are proper nouns, standards, abbreviations, brands, or technical terms Chinese users naturally search for in English.
- Do not include ordinary English words in allowedNonChineseTerms. Translate ordinary words into natural Chinese instead.
- Treat valid English metadata as the strongest source of truth, but do not trust English-side fields that are missing, contain Chinese, are slug-like, or are only literal/machine translations.
- When English-side fields are missing or contain Chinese, infer natural English from the file name, valid Chinese metadata, category context, tags, and use-cases.
- Use existing Chinese metadata only as context for meaning and wording style; do not let bad Chinese translations override stronger file/category semantics.
- Generate tagsZh and tagsEn from the whole icon context: file name, current names, both tag lists, categories, and use-cases.
- Do not translate tags one word at a time in either direction. Resolve ambiguous terms from category and use-case context, then produce natural search terms in each language.
- If a tag has multiple meanings, choose the term that fits the category and use-cases.
- Prefer natural Chinese UI/product search terms, such as "排列", "下载", "筛选", "急救", "波形". Avoid awkward dictionary words, machine translation, and rare transliterations.
- Keep common technical proper nouns as-is when Chinese users search for them that way, such as AI, API, CSS, HTML, JSON, Markdown, SVG, Webhook, XML, GitHub. Do not keep ordinary English words only because they appeared in the source; translate those into natural Chinese.
- Chinese tags and English tags do not need to have the same length or matching order.
- Merge duplicates and remove weak secondary meanings in both languages.
- Prefer the icon's primary library meaning over secondary literal meanings. For example, if "bug" is in development context, use "错误", "缺陷", "调试", "排查"; do not keep animal terms just because "bug" can mean insect.
- If categories contain development, software, debugging, or code context, prioritize the software meaning of "bug"; do not include animal meanings unless that is the primary icon usage.
- Generate useCasesZh and useCasesEn as paired scenarios from the whole icon context: file name, current names, tags in both languages, categories, and existing use-cases.
- Do not translate use-cases sentence by sentence mechanically. Preserve the scenario intent, then write natural short scenarios in each language.
- Keep useCasesZh and useCasesEn the same length and order.
- If valid useCasesEn exists, use it as the primary scenario source and translate/polish useCasesZh from it; keep the same length and order.
- If useCasesEn is missing or contains Chinese but useCasesZh is valid, infer useCasesEn from useCasesZh plus file/category/tag context, then polish both sides; keep the same length and order.
- If both languages have empty use-cases, generate concise paired use-cases for the icon's primary library meaning.
- Do not generate use-cases from weak secondary meanings unless categories or current use-cases clearly make that meaning primary.
- Do not include the word "icon" in tags or use-cases.
- Keep tags short and useful for search.
- Keep use-cases short, concrete, and without trailing punctuation.
- Preserve the meaning of the file name and current metadata.`;
const CATEGORY_METADATA_RULES = `Rules:
- Return all fields required by the JSON schema even when only some fields are listed in fixTargets.
- Category titles label broad groups in the icon picker, search filters, documentation, and metadata navigation. They should be concise, stable, and easy to scan.
- Categories describe the shared semantic area of many icons, not one specific icon. Prefer broad category wording over narrow object names.
- Use the file name and existing English title as the strongest source of category meaning.
- Use existing icon-library category conventions when possible: accessibility, accounts/access, arrows, buildings, charts, communication, connectivity, cursors, design, development, devices, emoji, files, finance, food/beverage, gaming, home, layout, mail, math, medical, multimedia, nature, navigation/places, notifications, people, photography, science, seasons, security, shapes, shopping, social, sports, sustainability, text formatting, time/calendar, tools, transportation, travel, weather.
- titleZh must be Simplified Chinese unless the existing English term is a proper noun or technical term that Chinese users naturally search for as-is.
- titleEn must be natural English.
- titleEn must not contain Chinese characters.
- Do not return a slug or file name as titleEn.
- allowedNonChineseTerms must contain only non-Chinese terms from titleZh that should be kept in Chinese-side metadata because they are proper nouns, standards, abbreviations, brands, or technical terms Chinese users naturally search for in English.
- Do not include ordinary English category words in allowedNonChineseTerms. Translate ordinary words into natural Chinese instead.
- Preserve the meaning of each file name and current metadata.`;

type CategoryContext = {
  title?: string;
  englishTitle?: string;
};

const iconI18nSchema = z.object({
  nameZh: z.string(),
  nameEn: z.string(),
  tagsZh: z.array(z.string()),
  tagsEn: z.array(z.string()),
  useCasesZh: z.array(z.string()),
  useCasesEn: z.array(z.string()),
  allowedNonChineseTerms: z.array(z.string()),
});

const categoryI18nSchema = z.object({
  titleZh: z.string(),
  titleEn: z.string(),
  allowedNonChineseTerms: z.array(z.string()),
});
const iconBatchI18nSchema = z.object({
  items: z.array(
    z.object({
      file: z.string(),
      fixed: iconI18nSchema,
    }),
  ),
});
const categoryBatchI18nSchema = z.object({
  items: z.array(
    z.object({
      file: z.string(),
      fixed: categoryI18nSchema,
    }),
  ),
});

async function loadCategoryContext() {
  const categoryMap = new Map<string, CategoryContext>();

  try {
    const categoryFiles = (await fs.readdir(categoriesDir)).filter((file) =>
      file.endsWith('.json'),
    );

    await Promise.all(
      categoryFiles.map(async (file) => {
        const key = path.basename(file, '.json');
        const metadata = JSON.parse(await fs.readFile(path.join(categoriesDir, file), 'utf-8'));

        categoryMap.set(key, {
          title: metadata.title,
          englishTitle: metadata.i18n?.en?.title,
        });
      }),
    );
  } catch {
    // Keep metadata fixing usable for isolated test fixtures.
  }

  return categoryMap;
}

const categoryContext = await loadCategoryContext();
const knownCategoryNames = new Set(categoryContext.keys());

function getIconCategoryContext(metadata: Record<string, any>) {
  if (!Array.isArray(metadata.categories)) {
    return [];
  }

  return metadata.categories.map((category: string) => ({
    key: category,
    title: categoryContext.get(category)?.title ?? '',
    englishTitle: categoryContext.get(category)?.englishTitle ?? '',
  }));
}

function needsIconAiFix(metadata: Record<string, any>) {
  const currentName = String(metadata.name ?? '');
  const currentEnglishName = String(metadata.i18n?.en?.name ?? '');
  const currentTags = metadata.tags;
  const currentEnglishTags = metadata.i18n?.en?.tags;
  const currentUseCases = metadata['use-cases'];
  const currentEnglishUseCases = metadata.i18n?.en?.['use-cases'];
  const isChineseUseCasesArray = isStringArray(currentUseCases);
  const isEnglishUseCasesArray = isStringArray(currentEnglishUseCases);
  const hasChineseUseCases = isMeaningfulArray(currentUseCases);
  const hasEnglishUseCases = isMeaningfulArray(currentEnglishUseCases);
  const hasAnyUseCases = hasChineseUseCases || hasEnglishUseCases;
  const hasInvalidUseCases =
    !isChineseUseCasesArray ||
    !isEnglishUseCasesArray ||
    !hasAnyUseCases ||
    hasChineseUseCases !== hasEnglishUseCases ||
    (hasChineseUseCases && hasInvalidChineseSideUseCases(currentUseCases)) ||
    (hasEnglishUseCases && currentEnglishUseCases.some((useCase) => hasCjk(useCase)));

  return {
    shouldFixName: !currentName || !isValidChineseSideText(currentName),
    shouldFixEnglishName:
      !currentEnglishName ||
      hasCjk(currentEnglishName) ||
      currentEnglishName === currentName ||
      isSlugLike(currentEnglishName),
    shouldFixTags:
      !isMeaningfulArray(currentTags) ||
      currentTags.every((tag) => !isValidChineseSideText(tag)) ||
      hasDisallowedNonChineseTag(currentTags),
    shouldFixEnglishTags:
      !isMeaningfulArray(currentEnglishTags) || currentEnglishTags.some((tag) => hasCjk(tag)),
    shouldFixUseCases: hasInvalidUseCases,
  };
}

function needsCategoryAiFix(metadata: Record<string, any>) {
  const currentTitle = String(metadata.title ?? '');
  const currentEnglishTitle = String(metadata.i18n?.en?.title ?? '');

  return {
    shouldFixTitle: !currentTitle || !isValidChineseSideText(currentTitle),
    shouldFixEnglishTitle:
      !currentEnglishTitle ||
      hasCjk(currentEnglishTitle) ||
      currentEnglishTitle === currentTitle ||
      isSlugLike(currentEnglishTitle),
  };
}

function assertAiClient(file: string) {
  const ai = createAiClient();

  if (!ai) {
    throw new Error(
      `${file} needs bilingual metadata fixes, but no AI provider is configured. Set AI_API_KEY, AI_BASE_URL, and AI_MODEL.`,
    );
  }

  return ai;
}

async function syncAllowedNonChineseTerms(terms: string[]) {
  const normalizedTerms = terms
    .map(normalizeAllowedNonChineseTerm)
    .filter((term) => term.length > 0 && !hasCjk(term));
  const nextTerms = [...new Set(normalizedTerms)].filter(
    (term) => !syncedAllowedNonChineseTerms.has(term),
  );

  if (nextTerms.length === 0) {
    return;
  }

  for (const term of nextTerms) {
    syncedAllowedNonChineseTerms.add(term);
    allowedNonChineseTermSet.add(term);
  }

  const mergedTerms = [...syncedAllowedNonChineseTerms].sort(compareAllowedNonChineseTerms);
  const content = `${JSON.stringify(mergedTerms, null, 2)}\n`;

  await fs.writeFile(allowedNonChineseTermsFile, content, 'utf-8');

  console.log('Updated allowed non-Chinese terms:', nextTerms.join(', '));
}

type IconFixFlags = ReturnType<typeof needsIconAiFix> & {
  shouldFixTagGroup: boolean;
};

type CategoryFixFlags = ReturnType<typeof needsCategoryAiFix>;

type MetadataTask<TFlags> = {
  file: string;
  key: string;
  metadata: Record<string, any>;
  flags: TFlags;
};

function createIconNextMetadata(metadata: Record<string, any>) {
  const next = { ...metadata };
  next.i18n = {
    ...(next.i18n ?? {}),
    en: {
      ...(next.i18n?.en ?? {}),
    },
  };

  if (Object.prototype.hasOwnProperty.call(next.i18n.en, 'categories')) {
    delete next.i18n.en.categories;
  }

  return next;
}

function createCategoryNextMetadata(metadata: Record<string, any>): Record<string, any> {
  return {
    ...metadata,
    i18n: {
      ...(metadata.i18n ?? {}),
      en: {
        ...(metadata.i18n?.en ?? {}),
      },
    },
  };
}

function getIconFixTargets(flags: IconFixFlags) {
  return [
    flags.shouldFixName ? 'nameZh' : '',
    flags.shouldFixEnglishName ? 'nameEn' : '',
    flags.shouldFixTagGroup ? 'tagsZh/tagsEn' : '',
    flags.shouldFixUseCases ? 'useCasesZh/useCasesEn' : '',
  ].filter(Boolean);
}

function getCategoryFixTargets(flags: CategoryFixFlags) {
  return [
    flags.shouldFixTitle ? 'titleZh' : '',
    flags.shouldFixEnglishTitle ? 'titleEn' : '',
  ].filter(Boolean);
}

function createIconCurrentMetadata(
  file: string,
  metadata: Record<string, any>,
  flags?: IconFixFlags,
) {
  const iconName = path.basename(file, '.json');

  return {
    libraryContext:
      'This item is one icon in the YCloud Icons library, a general-purpose SVG icon set based on Lucide-style icon names. Translate metadata for icon search and display, not as standalone dictionary entries.',
    file: iconName,
    name: metadata.name ?? '',
    categoryContext: getIconCategoryContext(metadata),
    tags: metadata.tags ?? [],
    useCases: metadata['use-cases'] ?? [],
    englishName: metadata.i18n?.en?.name ?? '',
    englishTags: metadata.i18n?.en?.tags ?? [],
    englishUseCases: metadata.i18n?.en?.['use-cases'] ?? [],
    fixTargets: flags ? getIconFixTargets(flags) : [],
  };
}

function createCategoryCurrentMetadata(
  file: string,
  metadata: Record<string, any>,
  flags?: CategoryFixFlags,
) {
  const categoryName = path.basename(file, '.json');

  return {
    file: categoryName,
    title: metadata.title ?? '',
    englishTitle: metadata.i18n?.en?.title ?? '',
    fixTargets: flags ? getCategoryFixTargets(flags) : [],
  };
}

function applyIconFix(
  metadata: Record<string, any>,
  fixed: z.infer<typeof iconI18nSchema>,
  flags: IconFixFlags,
) {
  const next = createIconNextMetadata(metadata);

  if (flags.shouldFixName) {
    next.name = fixed.nameZh;
  }

  if (flags.shouldFixEnglishName) {
    next.i18n.en.name = fixed.nameEn;
  }

  if (flags.shouldFixTagGroup) {
    next.tags = uniqueList(fixed.tagsZh);
    next.i18n.en.tags = uniqueList(fixed.tagsEn);
  }

  if (flags.shouldFixUseCases) {
    const useCasePairs = uniquePairs(fixed.useCasesZh, fixed.useCasesEn);
    next['use-cases'] = useCasePairs.left;
    next.i18n.en['use-cases'] = useCasePairs.right;
  }

  return next;
}

function applyCategoryFix(
  metadata: Record<string, any>,
  fixed: z.infer<typeof categoryI18nSchema>,
  flags: CategoryFixFlags,
) {
  const next = createCategoryNextMetadata(metadata);

  if (flags.shouldFixTitle) {
    next.title = fixed.titleZh;
  }

  if (flags.shouldFixEnglishTitle) {
    next.i18n.en.title = fixed.titleEn;
  }

  return next;
}

function getIconFixFlags(metadata: Record<string, any>): IconFixFlags {
  const flags = needsIconAiFix(metadata);

  return {
    ...flags,
    shouldFixTagGroup: flags.shouldFixTags || flags.shouldFixEnglishTags,
  };
}

function hasIconFixes(flags: IconFixFlags) {
  return (
    flags.shouldFixName ||
    flags.shouldFixEnglishName ||
    flags.shouldFixTagGroup ||
    flags.shouldFixUseCases
  );
}

function hasCategoryFixes(flags: CategoryFixFlags) {
  return flags.shouldFixTitle || flags.shouldFixEnglishTitle;
}

function hasDeprecatedEnglishCategories(metadata: Record<string, any>) {
  return Object.prototype.hasOwnProperty.call(metadata.i18n?.en ?? {}, 'categories');
}

function chunkTasks<T>(items: T[], size: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

async function writeMetadataIfChanged(file: string, metadata: Record<string, any>) {
  assertValidMetadata(file, metadata);

  const currentContent = await fs.readFile(file, 'utf-8');
  const nextContent = `${JSON.stringify(metadata, null, 2)}\n`;

  if (nextContent !== currentContent) {
    await fs.writeFile(file, nextContent, 'utf-8');
    console.log('Fixed metadata:', file);
  } else {
    console.log('Metadata already valid:', file);
  }
}

function assertValidMetadata(file: string, metadata: Record<string, any>) {
  const errors = file.startsWith('icons/')
    ? validateIconMetadata(metadata, knownCategoryNames)
    : validateCategoryMetadata(metadata);

  if (errors.length > 0) {
    throw new Error(
      `${file} failed metadata validation after fix:\n${errors
        .map((message) => `- ${message}`)
        .join('\n')}`,
    );
  }
}

async function validateFixedMetadataFiles(targetFiles: string[]) {
  const uniqueMetadataFiles = [
    ...new Set(
      targetFiles.filter(
        (file) =>
          (file.startsWith('icons/') || file.startsWith('categories/')) && file.endsWith('.json'),
      ),
    ),
  ];
  let hasError = false;

  for (const file of uniqueMetadataFiles) {
    try {
      const metadata = JSON.parse(await fs.readFile(file, 'utf-8')) as Record<string, any>;
      assertValidMetadata(file, metadata);
    } catch (error) {
      hasError = true;
      console.error(`${file}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (hasError) {
    throw new Error('Metadata validation failed after fixes.');
  }

  console.log('Fixed metadata files are valid.');
}

async function completeIconMetadata(file: string, metadata: Record<string, any>) {
  const flags = getIconFixFlags(metadata);
  const next = createIconNextMetadata(metadata);

  if (!hasIconFixes(flags)) {
    return next;
  }

  const ai = assertAiClient(file);
  console.log(`Using ${ai.provider} for icon metadata i18n fixes with model ${ai.model}.`);

  const current = createIconCurrentMetadata(file, metadata, flags);

  const fixed = await ai.completeJson(
    `Complete bilingual metadata for a YCloud icon.

${ICON_LIBRARY_CONTEXT}

${ICON_METADATA_RULES}

Current metadata:
${JSON.stringify(current, null, 2)}`,
    'icon_i18n',
    iconI18nSchema,
  );

  await syncAllowedNonChineseTerms(fixed.allowedNonChineseTerms);

  return applyIconFix(metadata, fixed, flags);
}

async function completeCategoryMetadata(file: string, metadata: Record<string, any>) {
  const flags = needsCategoryAiFix(metadata);

  const next = createCategoryNextMetadata(metadata);

  if (!hasCategoryFixes(flags)) {
    return next;
  }

  const ai = assertAiClient(file);
  console.log(`Using ${ai.provider} for category metadata i18n fixes with model ${ai.model}.`);

  const current = createCategoryCurrentMetadata(file, metadata, flags);

  const fixed = await ai.completeJson(
    `Complete bilingual metadata for a YCloud icon category.

${CATEGORY_METADATA_RULES}

Current metadata:
${JSON.stringify(current, null, 2)}`,
    'category_i18n',
    categoryI18nSchema,
  );

  await syncAllowedNonChineseTerms(fixed.allowedNonChineseTerms);

  return applyCategoryFix(metadata, fixed, flags);
}

async function completeIconMetadataBatch(tasks: MetadataTask<IconFixFlags>[]) {
  const ai = assertAiClient(tasks[0].file);
  console.log(
    `Using ${ai.provider} for ${tasks.length} icon metadata fixes with model ${ai.model}.`,
  );

  const currentItems = tasks.map((task) =>
    createIconCurrentMetadata(task.file, task.metadata, task.flags),
  );
  const fixedBatch = await ai.completeJson(
    `Complete bilingual metadata for these YCloud icons.

Return exactly one item for each input item. The item file must match the input file value.

${ICON_LIBRARY_CONTEXT}

${ICON_METADATA_RULES}

Current metadata items:
${JSON.stringify(currentItems, null, 2)}`,
    'icon_i18n_batch',
    iconBatchI18nSchema,
  );

  const fixedByFile = new Map(fixedBatch.items.map((item) => [item.file, item.fixed]));
  await syncAllowedNonChineseTerms(
    fixedBatch.items.flatMap((item) => item.fixed.allowedNonChineseTerms),
  );

  return tasks.map((task) => {
    const fixed = fixedByFile.get(task.key);

    if (!fixed) {
      throw new Error(`AI response did not include fixed metadata for ${task.key}.`);
    }

    return {
      file: task.file,
      metadata: applyIconFix(task.metadata, fixed, task.flags),
    };
  });
}

async function completeCategoryMetadataBatch(tasks: MetadataTask<CategoryFixFlags>[]) {
  const ai = assertAiClient(tasks[0].file);
  console.log(
    `Using ${ai.provider} for ${tasks.length} category metadata fixes with model ${ai.model}.`,
  );

  const currentItems = tasks.map((task) =>
    createCategoryCurrentMetadata(task.file, task.metadata, task.flags),
  );
  const fixedBatch = await ai.completeJson(
    `Complete bilingual metadata for these YCloud icon categories.

Return exactly one item for each input item. The item file must match the input file value.

${CATEGORY_METADATA_RULES}

Current metadata items:
${JSON.stringify(currentItems, null, 2)}`,
    'category_i18n_batch',
    categoryBatchI18nSchema,
  );

  const fixedByFile = new Map(fixedBatch.items.map((item) => [item.file, item.fixed]));
  await syncAllowedNonChineseTerms(
    fixedBatch.items.flatMap((item) => item.fixed.allowedNonChineseTerms),
  );

  return tasks.map((task) => {
    const fixed = fixedByFile.get(task.key);

    if (!fixed) {
      throw new Error(`AI response did not include fixed metadata for ${task.key}.`);
    }

    return {
      file: task.file,
      metadata: applyCategoryFix(task.metadata, fixed, task.flags),
    };
  });
}

async function processIconBatch(tasks: MetadataTask<IconFixFlags>[]) {
  try {
    const fixedItems = await completeBatchWithRetry(
      `icon metadata fix for ${tasks.length} file(s)`,
      () => completeIconMetadataBatch(tasks),
    );

    for (const item of fixedItems) {
      await writeMetadataIfChanged(item.file, item.metadata);
    }
  } catch (error) {
    console.warn(
      `Batch icon metadata fix failed for ${tasks.length} file(s); falling back to single-file fixes.`,
    );
    console.warn(error);

    for (const task of tasks) {
      const fixed = await completeIconMetadata(task.file, task.metadata);
      await writeMetadataIfChanged(task.file, fixed);
    }
  }
}

async function processCategoryBatch(tasks: MetadataTask<CategoryFixFlags>[]) {
  try {
    const fixedItems = await completeBatchWithRetry(
      `category metadata fix for ${tasks.length} file(s)`,
      () => completeCategoryMetadataBatch(tasks),
    );

    for (const item of fixedItems) {
      await writeMetadataIfChanged(item.file, item.metadata);
    }
  } catch (error) {
    console.warn(
      `Batch category metadata fix failed for ${tasks.length} file(s); falling back to single-file fixes.`,
    );
    console.warn(error);

    for (const task of tasks) {
      const fixed = await completeCategoryMetadata(task.file, task.metadata);
      await writeMetadataIfChanged(task.file, fixed);
    }
  }
}

async function completeBatchWithRetry<T>(label: string, complete: () => Promise<T>) {
  try {
    return await complete();
  } catch (firstError) {
    console.warn(`Batch ${label} failed; retrying once.`);
    console.warn(firstError);
  }

  try {
    return await complete();
  } catch (secondError) {
    console.warn(`Batch ${label} failed after retry.`);
    console.warn(secondError);
    throw secondError;
  }
}

try {
  const iconTasks: MetadataTask<IconFixFlags>[] = [];
  const categoryTasks: MetadataTask<CategoryFixFlags>[] = [];

  for (const file of files) {
    if (!file.startsWith('icons/') && !file.startsWith('categories/')) {
      continue;
    }

    const metadata = JSON.parse(await fs.readFile(file, 'utf-8')) as Record<string, any>;

    if (file.startsWith('icons/')) {
      const flags = getIconFixFlags(metadata);

      if (hasIconFixes(flags)) {
        iconTasks.push({
          file,
          key: path.basename(file, '.json'),
          metadata,
          flags,
        });
      } else if (hasDeprecatedEnglishCategories(metadata)) {
        await writeMetadataIfChanged(file, createIconNextMetadata(metadata));
      } else {
        assertValidMetadata(file, metadata);
        console.log('Metadata already valid:', file);
      }
    } else {
      const flags = needsCategoryAiFix(metadata);

      if (hasCategoryFixes(flags)) {
        categoryTasks.push({
          file,
          key: path.basename(file, '.json'),
          metadata,
          flags,
        });
      } else {
        assertValidMetadata(file, metadata);
        console.log('Metadata already valid:', file);
      }
    }
  }

  for (const taskBatch of chunkTasks(iconTasks, ICON_BATCH_SIZE)) {
    await processIconBatch(taskBatch);
  }

  for (const taskBatch of chunkTasks(categoryTasks, CATEGORY_BATCH_SIZE)) {
    await processCategoryBatch(taskBatch);
  }

  await validateFixedMetadataFiles(files);
} catch (error) {
  console.error('Metadata fixes failed.');
  console.error(error);
  process.exit(1);
}
