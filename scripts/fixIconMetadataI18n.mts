import fs from 'node:fs/promises';
import path from 'node:path';
import z from 'zod';
import { createAiClient } from './aiClient.mts';

const files = process.argv.slice(2).filter((file) => file.endsWith('.json'));

if (files.length === 0) {
  console.log('No changed metadata JSON files to fix.');
  process.exit(0);
}

const hasCjk = (value: string) => /[\u3400-\u9fff]/.test(value);
const isSlugLike = (value: string) => /^[a-z0-9]+(?:[-_][a-z0-9]+)+$/.test(value.trim());
const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');
const isMeaningfulArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string') && value.length > 0;
const uniqueList = (items: string[]) =>
  items.filter((item, index, list) => list.indexOf(item) === index);
const uniquePairs = (leftItems: string[], rightItems: string[]) => {
  const seen = new Set<string>();
  const left: string[] = [];
  const right: string[] = [];
  const count = Math.min(leftItems.length, rightItems.length);

  for (let index = 0; index < count; index += 1) {
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
    (hasChineseUseCases && currentUseCases.some((useCase) => !hasCjk(useCase))) ||
    (hasEnglishUseCases && currentEnglishUseCases.some((useCase) => hasCjk(useCase)));

  return {
    shouldFixName: !currentName || !hasCjk(currentName),
    shouldFixEnglishName:
      !currentEnglishName ||
      hasCjk(currentEnglishName) ||
      currentEnglishName === currentName ||
      isSlugLike(currentEnglishName),
    shouldFixTags: !isMeaningfulArray(currentTags) || currentTags.every((tag) => !hasCjk(tag)),
    shouldFixEnglishTags:
      !isMeaningfulArray(currentEnglishTags) || currentEnglishTags.some((tag) => hasCjk(tag)),
    shouldFixUseCases: hasInvalidUseCases,
  };
}

function needsCategoryAiFix(metadata: Record<string, any>) {
  const currentTitle = String(metadata.title ?? '');
  const currentEnglishTitle = String(metadata.i18n?.en?.title ?? '');

  return {
    shouldFixTitle: !currentTitle || !hasCjk(currentTitle),
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

  if (
    !shouldFixName &&
    !shouldFixEnglishName &&
    !shouldFixTags &&
    !shouldFixEnglishTags &&
    !shouldFixUseCases
  ) {
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
- nameZh and tagsZh must be Simplified Chinese for UI display and search.
- nameEn and tagsEn must be natural English.
- Treat English metadata as the source of truth: file, nameEn, tagsEn, and useCasesEn.
- Use Chinese metadata only as reference for existing wording style; do not let bad Chinese translations override English source semantics.
- Generate Chinese tags by translating from English source metadata, using category context and use-cases to resolve ambiguity. Do not translate English tags word by word.
- If an English tag has multiple meanings, choose the Chinese term that fits the category and use-cases.
- Prefer natural Chinese UI/product search terms, such as "排列", "下载", "筛选", "急救", "波形". Avoid awkward dictionary words, machine translation, and rare transliterations.
- Keep common technical proper nouns as-is when Chinese users search for them that way, such as API, CSS, JSON, SVG, GitHub.
- Chinese tags and English tags do not need to have the same length or matching order.
- Translate English tags into natural Chinese concepts, then merge duplicates and remove weak secondary meanings.
- Prefer the icon's primary library meaning over secondary literal meanings. For example, if "bug" is in development context, use "错误", "缺陷", "调试", "排查"; do not keep animal terms just because "bug" can mean insect.
- If categories contain development, software, debugging, or code context, prioritize the software meaning of "bug"; do not include "昆虫" or "甲虫" unless the animal meaning is the primary icon usage.
- useCasesZh must be Simplified Chinese and useCasesEn must be English.
- If both languages have empty use-cases, generate concise use-cases for the icon's primary library meaning.
- If both languages have empty use-cases, generate useCasesEn first from the icon's English source meaning, then translate them into useCasesZh.
- If useCasesEn exists, treat it as source and translate/polish useCasesZh from it; keep the same length and order.
- If only useCasesZh exists, translate it into useCasesEn, then polish useCasesZh from the English source; keep the same length and order.
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

  if (shouldFixTags) {
    next.tags = uniqueList(fixed.tagsZh);
  }

  if (shouldFixEnglishTags) {
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
