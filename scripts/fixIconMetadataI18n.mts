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
const isMeaningfulArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string') && value.length > 0;

const iconI18nSchema = z.object({
  nameZh: z.string(),
  nameEn: z.string(),
  tagsZh: z.array(z.string()),
  tagsEn: z.array(z.string()),
});

const categoryI18nSchema = z.object({
  titleZh: z.string(),
  titleEn: z.string(),
});

function needsIconAiFix(metadata: Record<string, any>) {
  const currentName = String(metadata.name ?? '');
  const currentEnglishName = String(metadata.i18n?.en?.name ?? '');
  const currentTags = metadata.tags;
  const currentEnglishTags = metadata.i18n?.en?.tags;

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
      `${file} needs bilingual metadata fixes, but no AI provider is configured. Set OPENAI_API_KEY or run in GitHub Actions with models:read permissions.`,
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

  if (!shouldFixName && !shouldFixEnglishName && !shouldFixTags && !shouldFixEnglishTags) {
    return next;
  }

  const ai = assertAiClient(file);
  console.log(`Using ${ai.provider} for icon metadata i18n fixes with model ${ai.model}.`);

  const current = {
    file: iconName,
    name: metadata.name ?? '',
    tags: metadata.tags ?? [],
    englishName: metadata.i18n?.en?.name ?? '',
    englishTags: metadata.i18n?.en?.tags ?? [],
  };

  const fixed = await ai.completeJson(
    `Complete bilingual metadata for a YCloud icon.

Rules:
- nameZh and tagsZh must be Simplified Chinese for UI display and search.
- nameEn and tagsEn must be natural English.
- Do not include the word "icon".
- Keep tags short and useful for search.
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
    next.tags = fixed.tagsZh;
  }

  if (shouldFixEnglishTags) {
    next.i18n.en.tags = fixed.tagsEn;
  }

  return next;
}

async function completeCategoryMetadata(file: string, metadata: Record<string, any>) {
  const categoryName = path.basename(file, '.json');
  const {
    shouldFixTitle,
    shouldFixEnglishTitle,
  } = needsCategoryAiFix(metadata);

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
