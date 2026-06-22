/**
 * 自动补全或修复图标与分类元数据的双语字段，通常在图标 PR 中按增量文件运行。
 *
 * 输入：命令行传入的 `icons/*.json` 或 `categories/*.json` 文件列表。
 * 依赖：通过 `AI_API_KEY`、`AI_BASE_URL`、`AI_MODEL` 创建 OpenAI 兼容 AI 客户端。
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
 * 调用位置：`.github/workflows/fix-icon-source.yml` 的 `Complete changed metadata i18n` 步骤。
 * 调用时机：PR 修改 `icons/*.json` 或 `categories/*.json` 后，在格式化和最终校验前尝试补齐缺失/异常的双语字段。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import z from 'zod';
import { createAiClient } from './aiClient.mts';
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
const hasDisallowedNonChineseTag = (value: unknown) =>
  isStringArray(value) && value.some((tag) => hasUnreviewedNonChineseTerm(tag));
const categoriesDir = path.resolve('categories');

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
});

const categoryI18nSchema = z.object({
  titleZh: z.string(),
  titleEn: z.string(),
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

async function completeIconMetadata(file: string, metadata: Record<string, any>) {
  const iconName = path.basename(file, '.json');
  const {
    shouldFixName,
    shouldFixEnglishName,
    shouldFixTags,
    shouldFixEnglishTags,
    shouldFixUseCases,
  } = needsIconAiFix(metadata);
  const shouldFixTagGroup = shouldFixTags || shouldFixEnglishTags;

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

  if (!shouldFixName && !shouldFixEnglishName && !shouldFixTagGroup && !shouldFixUseCases) {
    return next;
  }

  const ai = assertAiClient(file);
  console.log(`Using ${ai.provider} for icon metadata i18n fixes with model ${ai.model}.`);

  const current = {
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
  };

  const fixed = await ai.completeJson(
    `Complete bilingual metadata for a YCloud icon.

Library context:
- YCloud Icons is a general-purpose SVG icon library based on Lucide-style icon names.
- The file name is the canonical English symbol name and is often more important than individual legacy tags.
- Categories are coarse semantic buckets. Use them to resolve ambiguous English words and decide the primary meaning.
- Existing tags and use-cases may contain literal translations, old aliases, typos, or weak secondary meanings. Treat them as hints, not as facts that must be preserved.
- Use-cases describe product/UI scenarios and must follow the icon's primary meaning in this icon library.

Rules:
- nameZh, tagsZh, and useCasesZh are Chinese-side metadata for UI display and Chinese search.
- Chinese-side metadata should be Simplified Chinese by default.
- English words already present in the reviewed allowlist may be kept as-is.
- For English words outside the allowlist, decide from icon context whether they are true proper nouns, brands, standards, abbreviations, or technical terms that Chinese users naturally search for in English. Keep them only when that is true; otherwise translate them according to icon context.
- nameEn and tagsEn must be natural English.
- English-side metadata must not contain Chinese characters.
- Treat valid English metadata as the strongest source of truth, but do not trust English-side fields that are missing, contain Chinese, are slug-like, or are only literal/machine translations.
- When English-side fields are missing or contain Chinese, infer natural English from the file name, valid Chinese metadata, category context, tags, and use-cases.
- Use existing Chinese metadata only as context for meaning and wording style; do not let bad Chinese translations override stronger file/category semantics.
- Generate tagsZh and tagsEn as a semantic pair from the whole icon context: file name, current names, both tag lists, categories, and use-cases.
- Do not translate tags one word at a time in either direction. Resolve ambiguous terms from category and use-case context, then produce natural search terms in each language.
- If a tag has multiple meanings, choose the term that fits the category and use-cases.
- Prefer natural Chinese UI/product search terms, such as "排列", "下载", "筛选", "急救", "波形". Avoid awkward dictionary words, machine translation, and rare transliterations.
- Keep common technical proper nouns as-is when Chinese users search for them that way, such as API, CSS, JSON, SVG, GitHub. Do not keep ordinary English words only because they appeared in the source; translate those into natural Chinese.
- Chinese tags and English tags do not need to have the same length or matching order.
- Merge duplicates and remove weak secondary meanings in both languages.
- Prefer the icon's primary library meaning over secondary literal meanings. For example, if "bug" is in development context, use "错误", "缺陷", "调试", "排查"; do not keep animal terms just because "bug" can mean insect.
- If categories contain development, software, debugging, or code context, prioritize the software meaning of "bug"; do not include "昆虫" or "甲虫" unless the animal meaning is the primary icon usage.
- useCasesZh must be Simplified Chinese scenarios, except English proper nouns/technical terms when they are the natural Chinese-search wording after review. useCasesEn must be English.
- Generate useCasesZh and useCasesEn as paired scenarios from the whole icon context: file name, current names, tags in both languages, categories, and existing use-cases.
- Do not translate use-cases sentence by sentence mechanically. Preserve the scenario intent, then write natural short scenarios in each language.
- If valid useCasesEn exists, use it as the primary scenario source and translate/polish useCasesZh from it; keep the same length and order.
- If useCasesEn is missing or contains Chinese but useCasesZh is valid, infer useCasesEn from useCasesZh plus file/category/tag context, then polish both sides; keep the same length and order.
- If both languages have empty use-cases, generate concise paired use-cases for the icon's primary library meaning.
- Do not generate use-cases from weak secondary meanings unless categories or current use-cases clearly make that meaning primary.
- Do not include the word "icon".
- Keep tags short and useful for search.
- Keep use-cases short, concrete, and without trailing punctuation.
- Preserve the meaning of the file name and current metadata.

Current metadata:
${JSON.stringify(current, null, 2)}`,
    'icon_i18n',
    iconI18nSchema,
  );

  if (shouldFixName) {
    next.name = fixed.nameZh;
  }

  if (shouldFixEnglishName) {
    next.i18n.en.name = fixed.nameEn;
  }

  if (shouldFixTagGroup) {
    next.tags = uniqueList(fixed.tagsZh);
    next.i18n.en.tags = uniqueList(fixed.tagsEn);
  }

  if (shouldFixUseCases) {
    const useCasePairs = uniquePairs(fixed.useCasesZh, fixed.useCasesEn);
    next['use-cases'] = useCasePairs.left;
    next.i18n.en['use-cases'] = useCasePairs.right;
  }

  return next;
}

async function completeCategoryMetadata(file: string, metadata: Record<string, any>) {
  const categoryName = path.basename(file, '.json');
  const { shouldFixTitle, shouldFixEnglishTitle } = needsCategoryAiFix(metadata);

  const next = { ...metadata };
  next.i18n = {
    ...(next.i18n ?? {}),
    en: {
      ...(next.i18n?.en ?? {}),
    },
  };

  if (!shouldFixTitle && !shouldFixEnglishTitle) {
    return next;
  }

  const ai = assertAiClient(file);
  console.log(`Using ${ai.provider} for category metadata i18n fixes with model ${ai.model}.`);

  const current = {
    file: categoryName,
    title: metadata.title ?? '',
    englishTitle: metadata.i18n?.en?.title ?? '',
  };

  const fixed = await ai.completeJson(
    `Complete bilingual metadata for a YCloud icon category.

Rules:
- titleZh must be Simplified Chinese.
- titleEn must be natural English.
- Preserve the meaning of the file name and current metadata.

Current metadata:
${JSON.stringify(current, null, 2)}`,
    'category_i18n',
    categoryI18nSchema,
  );

  if (shouldFixTitle) {
    next.title = fixed.titleZh;
  }

  if (shouldFixEnglishTitle) {
    next.i18n.en.title = fixed.titleEn;
  }

  return next;
}

try {
  for (const file of files) {
    if (!file.startsWith('icons/') && !file.startsWith('categories/')) {
      continue;
    }

    const metadata = JSON.parse(await fs.readFile(file, 'utf-8')) as Record<string, any>;
    const fixed = file.startsWith('icons/')
      ? await completeIconMetadata(file, metadata)
      : await completeCategoryMetadata(file, metadata);
    const nextContent = `${JSON.stringify(fixed, null, 2)}\n`;

    if (nextContent !== JSON.stringify(metadata, null, 2) + '\n') {
      await fs.writeFile(file, nextContent, 'utf-8');
      console.log('Fixed metadata i18n:', file);
    } else {
      console.log('Metadata i18n already valid:', file);
    }
  }
} catch (error) {
  console.error('AI metadata i18n fixes failed.');
  console.error(error);
  process.exit(1);
}
