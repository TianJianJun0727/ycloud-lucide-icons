import fs from 'node:fs/promises';
import path from 'node:path';
import { zodTextFormat } from 'openai/helpers/zod';
import z from 'zod';
import { createAiClient } from './aiClient.mts';

const files = process.argv.slice(2).filter((file) => file.endsWith('.json'));

if (files.length === 0) {
  console.log('No changed metadata JSON files to fix.');
  process.exit(0);
}

const ai = createAiClient();

if (!ai) {
  console.log('No AI provider is configured. Skipping AI metadata i18n fixes.');
  process.exit(0);
}

const hasCjk = (value: string) => /[\u3400-\u9fff]/.test(value);
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

async function completeIconMetadata(file: string, metadata: Record<string, any>) {
  const iconName = path.basename(file, '.json');
  const current = {
    file: iconName,
    name: metadata.name ?? '',
    tags: metadata.tags ?? [],
    englishName: metadata.i18n?.en?.name ?? '',
    englishTags: metadata.i18n?.en?.tags ?? [],
  };

  const response = await ai.client.responses.create({
    model: ai.model,
    input: `Complete bilingual metadata for a YCloud icon.

Rules:
- nameZh and tagsZh must be Simplified Chinese for UI display and search.
- nameEn and tagsEn must be natural English.
- Do not include the word "icon".
- Keep tags short and useful for search.
- Preserve the meaning of the file name and current metadata.

Current metadata:
${JSON.stringify(current, null, 2)}`,
    text: {
      format: zodTextFormat(iconI18nSchema, 'icon_i18n'),
    },
  });

  const fixed = JSON.parse(response.output_text) as z.infer<typeof iconI18nSchema>;
  const next = { ...metadata };
  const currentName = String(next.name ?? '');
  const currentEnglishName = String(next.i18n?.en?.name ?? '');
  const currentTags = next.tags;
  const currentEnglishTags = next.i18n?.en?.tags;

  if (!currentName || !hasCjk(currentName)) {
    next.name = fixed.nameZh;
  }

  next.i18n = {
    ...(next.i18n ?? {}),
    en: {
      ...(next.i18n?.en ?? {}),
    },
  };

  if (!currentEnglishName || hasCjk(currentEnglishName) || currentEnglishName === currentName) {
    next.i18n.en.name = fixed.nameEn;
  }

  if (!isMeaningfulArray(currentTags) || currentTags.every((tag) => !hasCjk(tag))) {
    next.tags = fixed.tagsZh;
  }

  if (!isMeaningfulArray(currentEnglishTags) || currentEnglishTags.some((tag) => hasCjk(tag))) {
    next.i18n.en.tags = fixed.tagsEn;
  }

  return next;
}

async function completeCategoryMetadata(file: string, metadata: Record<string, any>) {
  const categoryName = path.basename(file, '.json');
  const current = {
    file: categoryName,
    title: metadata.title ?? '',
    englishTitle: metadata.i18n?.en?.title ?? '',
  };

  const response = await ai.client.responses.create({
    model: ai.model,
    input: `Complete bilingual metadata for a YCloud icon category.

Rules:
- titleZh must be Simplified Chinese.
- titleEn must be natural English.
- Preserve the meaning of the file name and current metadata.

Current metadata:
${JSON.stringify(current, null, 2)}`,
    text: {
      format: zodTextFormat(categoryI18nSchema, 'category_i18n'),
    },
  });

  const fixed = JSON.parse(response.output_text) as z.infer<typeof categoryI18nSchema>;
  const next = { ...metadata };
  const currentTitle = String(next.title ?? '');
  const currentEnglishTitle = String(next.i18n?.en?.title ?? '');

  if (!currentTitle || !hasCjk(currentTitle)) {
    next.title = fixed.titleZh;
  }

  next.i18n = {
    ...(next.i18n ?? {}),
    en: {
      ...(next.i18n?.en ?? {}),
    },
  };

  if (!currentEnglishTitle || hasCjk(currentEnglishTitle) || currentEnglishTitle === currentTitle) {
    next.i18n.en.title = fixed.titleEn;
  }

  return next;
}

try {
  console.log(`Using ${ai.provider} for metadata i18n fixes with model ${ai.model}.`);

  for (const file of files) {
    if (!file.startsWith('icons/') && !file.startsWith('categories/')) {
      continue;
    }

    const metadata = JSON.parse(await fs.readFile(file, 'utf-8')) as Record<string, any>;
    const fixed = file.startsWith('icons/')
      ? await completeIconMetadata(file, metadata)
      : await completeCategoryMetadata(file, metadata);

    await fs.writeFile(file, `${JSON.stringify(fixed, null, 2)}\n`, 'utf-8');
    console.log('Fixed metadata i18n:', file);
  }
} catch (error) {
  console.warn('AI metadata i18n fixes failed. Skipping optional AI step.');
  console.warn(error);
}
