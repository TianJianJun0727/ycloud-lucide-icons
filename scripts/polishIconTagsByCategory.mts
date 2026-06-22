import fs from 'node:fs/promises';
import path from 'node:path';
import { setTimeout } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import z from 'zod';
import { createAiClient } from './aiClient.mts';

type CategoryMetadata = {
  title: string;
  i18n?: {
    en?: {
      title?: string;
    };
  };
};

type IconMetadata = {
  name: string;
  tags: string[];
  categories: string[];
  'use-cases': string[];
  i18n: {
    en: {
      name: string;
      tags: string[];
      'use-cases': string[];
    };
  };
  [key: string]: unknown;
};

type CliOptions = {
  categories: string[];
  icons: string[];
  limit: number;
  batchSize: number;
  concurrency: number;
  startAfter: string;
  write: boolean;
  list: boolean;
  useCases: boolean;
};

type IconWorkItem = {
  file: string;
  icon: string;
  metadata: IconMetadata;
  categoryContext: Array<{
    key: string;
    title: string;
    englishTitle: string;
  }>;
};

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const iconsDir = path.join(repoRoot, 'icons');
const categoriesDir = path.join(repoRoot, 'categories');
const maxTagsPerIcon = 12;

const tagPolishItemSchema = z.object({
  icon: z.string().optional(),
  tagsZh: z.array(z.string()),
  tagsEn: z.array(z.string()),
  useCasesZh: z.array(z.string()).optional(),
  useCasesEn: z.array(z.string()).optional(),
  reason: z.string().optional(),
});

const tagPolishSchema = z.preprocess(
  (value) => {
    if (Array.isArray(value)) {
      return { icons: value };
    }

    if (value && typeof value === 'object') {
      const objectValue = value as Record<string, any>;

      if (Array.isArray(objectValue.tag_polish)) {
        return { icons: objectValue.tag_polish };
      }

      if (Array.isArray(objectValue.items)) {
        return { icons: objectValue.items };
      }

      if (Array.isArray(objectValue.icons)) {
        return value;
      }

      if (Array.isArray(objectValue.tagsZh) && Array.isArray(objectValue.tagsEn)) {
        return { icons: [objectValue] };
      }

      const keyedItems = Object.entries(objectValue)
        .filter(([, item]) => {
          if (!item || typeof item !== 'object') {
            return false;
          }
          const itemValue = item as Record<string, any>;
          return Array.isArray(itemValue.tagsZh) && Array.isArray(itemValue.tagsEn);
        })
        .map(([icon, item]) => ({
          ...(item as Record<string, any>),
          icon,
        }));

      if (keyedItems.length > 0) {
        return { icons: keyedItems };
      }

      if (objectValue.tag_polish && typeof objectValue.tag_polish === 'object') {
        const nested = objectValue.tag_polish as Record<string, any>;
        if (Array.isArray(nested.icons)) {
          return { icons: nested.icons };
        }
      }
    }

    return value;
  },
  z.object({
    icons: z.array(tagPolishItemSchema),
  }),
);

export function parseCliArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    categories: [],
    icons: [],
    limit: 20,
    batchSize: 5,
    concurrency: 1,
    startAfter: '',
    write: false,
    list: false,
    useCases: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === '--') {
      continue;
    }

    if (arg === '--write') {
      options.write = true;
      continue;
    }

    if (arg === '--list') {
      options.list = true;
      continue;
    }

    if (arg === '--use-cases') {
      options.useCases = true;
      continue;
    }

    if (arg === '--category') {
      const value = args[index + 1];
      if (!value) {
        throw new Error('--category requires a value.');
      }
      options.categories.push(
        ...value
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      );
      index += 1;
      continue;
    }

    if (arg === '--icon') {
      const value = args[index + 1];
      if (!value) {
        throw new Error('--icon requires a value.');
      }
      options.icons.push(
        ...value
          .split(',')
          .map((item) => item.trim().replace(/\.json$/, ''))
          .filter(Boolean),
      );
      index += 1;
      continue;
    }

    if (arg === '--limit') {
      const value = Number(args[index + 1]);
      if (!Number.isInteger(value) || value < 1) {
        throw new Error('--limit requires a positive integer.');
      }
      options.limit = value;
      index += 1;
      continue;
    }

    if (arg === '--batch-size') {
      const value = Number(args[index + 1]);
      if (!Number.isInteger(value) || value < 1 || value > 10) {
        throw new Error('--batch-size requires an integer from 1 to 10.');
      }
      options.batchSize = value;
      index += 1;
      continue;
    }

    if (arg === '--concurrency') {
      const value = Number(args[index + 1]);
      if (!Number.isInteger(value) || value < 1 || value > 8) {
        throw new Error('--concurrency requires an integer from 1 to 8.');
      }
      options.concurrency = value;
      index += 1;
      continue;
    }

    if (arg === '--start-after') {
      const value = args[index + 1];
      if (!value) {
        throw new Error('--start-after requires an icon name.');
      }
      options.startAfter = value.replace(/\.json$/, '');
      index += 1;
      continue;
    }

    throw new Error(`Unknown option: ${arg}`);
  }

  return options;
}

export function normalizeTagPairs(tagsZh: string[], tagsEn: string[], maxTags = maxTagsPerIcon) {
  const seenZh = new Set<string>();
  const seenEn = new Set<string>();
  const nextZh: string[] = [];
  const nextEn: string[] = [];

  for (const tag of tagsZh) {
    const zh = tag.trim();

    if (!zh || seenZh.has(zh)) {
      continue;
    }

    seenZh.add(zh);
    nextZh.push(zh);

    if (nextZh.length >= maxTags) {
      break;
    }
  }

  for (const tag of tagsEn) {
    const en = tag.trim();

    if (!en || seenEn.has(en)) {
      continue;
    }

    seenEn.add(en);
    nextEn.push(en);

    if (nextEn.length >= maxTags) {
      break;
    }
  }

  if (nextZh.length === 0) {
    throw new Error('AI returned no usable Chinese tags.');
  }

  if (nextEn.length === 0) {
    throw new Error('AI returned no usable English tags.');
  }

  return {
    tagsZh: nextZh,
    tagsEn: nextEn,
  };
}

export function normalizeUseCases(useCasesZh: string[], useCasesEn: string[]) {
  if (useCasesZh.length !== useCasesEn.length) {
    throw new Error(
      `AI returned mismatched use-case lengths: zh=${useCasesZh.length}, en=${useCasesEn.length}`,
    );
  }

  const nextZh: string[] = [];
  const nextEn: string[] = [];
  const seen = new Set<string>();

  for (let index = 0; index < useCasesZh.length; index += 1) {
    const zh = useCasesZh[index].trim();
    const en = useCasesEn[index].trim();
    const key = `${zh}\n${en}`;

    if (!zh || !en || seen.has(key)) {
      continue;
    }

    seen.add(key);
    nextZh.push(zh);
    nextEn.push(en);
  }

  if (nextZh.length === 0) {
    throw new Error('AI returned no usable use-cases.');
  }

  return {
    useCasesZh: nextZh,
    useCasesEn: nextEn,
  };
}

async function loadCategories() {
  const files = (await fs.readdir(categoriesDir)).filter((file) => file.endsWith('.json'));
  const entries = await Promise.all(
    files.map(async (file) => {
      const key = path.basename(file, '.json');
      const metadata = JSON.parse(
        await fs.readFile(path.join(categoriesDir, file), 'utf-8'),
      ) as CategoryMetadata;

      return [
        key,
        {
          key,
          title: metadata.title,
          englishTitle: metadata.i18n?.en?.title ?? '',
        },
      ] as const;
    }),
  );

  return new Map(entries);
}

async function loadIconWorkItems(
  categoryFilter: string[],
  iconFilter: string[],
  startAfter: string,
  limit: number,
) {
  const categoryMap = await loadCategories();
  const unknownCategories = categoryFilter.filter((category) => !categoryMap.has(category));
  if (unknownCategories.length > 0) {
    throw new Error(`Unknown categories: ${unknownCategories.join(', ')}`);
  }

  const files = (await fs.readdir(iconsDir)).filter((file) => file.endsWith('.json')).sort();
  const items: IconWorkItem[] = [];
  const iconFilterSet = new Set(iconFilter);
  let hasPassedStartAfter = !startAfter;

  for (const file of files) {
    const icon = path.basename(file, '.json');

    if (!hasPassedStartAfter) {
      if (icon === startAfter) {
        hasPassedStartAfter = true;
      }
      continue;
    }

    const filePath = path.join(iconsDir, file);
    const metadata = JSON.parse(await fs.readFile(filePath, 'utf-8')) as IconMetadata;
    const matchesIcon = iconFilterSet.size === 0 || iconFilterSet.has(icon);
    const matchesCategory =
      categoryFilter.length === 0 ||
      metadata.categories.some((category) => categoryFilter.includes(category));

    if (!matchesIcon || !matchesCategory) {
      continue;
    }

    items.push({
      file: filePath,
      icon,
      metadata,
      categoryContext: metadata.categories.map((category) => {
        const categoryMetadata = categoryMap.get(category);
        return {
          key: category,
          title: categoryMetadata?.title ?? '',
          englishTitle: categoryMetadata?.englishTitle ?? '',
        };
      }),
    });

    if (items.length >= limit) {
      break;
    }
  }

  return items;
}

function chunkItems<T>(items: T[], size: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

function buildPrompt(items: IconWorkItem[], includeUseCases: boolean) {
  return `Polish YCloud icon metadata tags for Simplified Chinese and English.

Library context:
- YCloud Icons is a general-purpose SVG icon library based on Lucide-style icon names.
- Each "icon" value is the canonical English symbol name and is often more important than individual legacy tags.
- Categories are coarse semantic buckets. Use them to resolve ambiguous English words and decide the primary meaning.
- Existing tags may contain literal translations, old aliases, typos, or weak secondary meanings. Treat them as hints, not as facts that must be preserved.
- Use-cases describe product/UI scenarios. When present, they are the strongest context for both tags and translation choices.

Goal:
- Rewrite tagsZh so they are natural Simplified Chinese UI/product search terms.
- Rewrite tagsEn only when needed to fix typos, remove noise, or make the English search terms natural.
${includeUseCases ? '- Generate or translate useCasesEn/useCasesZh for each icon.' : '- Do not change use-cases.'}

Rules:
- Treat English metadata as the source of truth: icon, nameEn, tagsEn, and useCasesEn.
- Use Chinese metadata only as reference for existing wording style; do not let bad Chinese translations override English source semantics.
- Translate from English source metadata into Chinese, using category context and use-cases to resolve ambiguity.
- Do not translate English tags word by word.
- If an English tag has multiple meanings, choose the Chinese term that fits the category and use-cases.
- Prefer terms designers and frontend developers would actually search for in a Chinese icon library.
- Avoid awkward dictionary words, machine translation, rare transliterations, and phonetic transliteration unless it is a standard term.
- Fix obvious English typos when producing tagsEn, for example "siesmic" should become "seismic".
- Keep common technical proper nouns as-is when Chinese users search for them that way, such as API, CSS, JSON, SVG, GitHub.
- Never include the word "icon".
- Chinese tags and English tags do not need to have the same length or matching order.
- tagsZh should be optimized for Chinese search and display, not for preserving every English tag.
- Translate English tags into natural Chinese concepts, then merge duplicates and remove weak secondary meanings.
- Prefer the icon's primary library meaning over secondary literal meanings. For example, if "bug" is in development context, use "错误", "缺陷", "调试", "排查"; do not keep animal terms just because "bug" can mean insect.
- If categories contain development, software, debugging, or code context, prioritize the software meaning of "bug"; do not include "昆虫" or "甲虫" unless the animal meaning is the primary icon usage.
- Do not include the icon file name as a tag unless the word is independently useful as a search term.
- Keep each tag short. Use 4 to 12 high-quality tags. Never return more than 12 tags for one icon.
- For use-cases, treat English metadata as source. If useCasesEn is empty, generate concise English use-cases from icon, nameEn, tagsEn, and category context first, then translate to Simplified Chinese.
- If useCasesEn exists, translate and polish useCasesZh from useCasesEn. Keep useCasesZh and useCasesEn the same length and order.
- If only useCasesZh exists, translate it into useCasesEn first, then polish useCasesZh from that English source. Keep the same length and order.
- Use-cases must be concrete product/UI situations, short, and without trailing punctuation.
- Do not generate use-cases from weak secondary meanings unless categories or English source metadata clearly make that meaning primary.
- Return every input icon exactly once.

Icons:
${JSON.stringify(
  items.map((item) => ({
    libraryContext:
      'This item is one icon in the YCloud Icons library. Translate metadata for icon search and display, not as a standalone dictionary entry.',
    icon: item.icon,
    nameZh: item.metadata.name,
    nameEn: item.metadata.i18n.en.name,
    categoryContext: item.categoryContext,
    tagsZh: item.metadata.tags,
    tagsEn: item.metadata.i18n.en.tags,
    useCasesZh: item.metadata['use-cases'],
    useCasesEn: item.metadata.i18n.en['use-cases'],
  })),
  null,
  2,
)}`;
}

async function polishBatch(items: IconWorkItem[], includeUseCases: boolean) {
  const ai = createAiClient();

  if (!ai) {
    throw new Error(
      'No AI provider is configured. Set OPENROUTER_API_KEY or GITHUB_TOKEN before running tag polishing.',
    );
  }

  console.log(`Using ${ai.provider} for tag polishing with model ${ai.model}.`);

  const response = await ai.completeJson(
    buildPrompt(items, includeUseCases),
    'tag_polish',
    tagPolishSchema,
  );
  const responseItems = response.icons.map((item) => ({
    ...item,
    icon: item.icon ?? (items.length === 1 ? items[0].icon : ''),
    reason: item.reason ?? 'AI polished tags from icon context.',
  }));
  const byIcon = new Map(responseItems.map((item) => [item.icon, item]));

  return items.map((item) => {
    const polished = byIcon.get(item.icon);
    if (!polished) {
      throw new Error(`AI response missed icon: ${item.icon}`);
    }

    const normalized = normalizeTagPairs(polished.tagsZh, polished.tagsEn);
    const normalizedUseCases =
      includeUseCases || polished.useCasesZh || polished.useCasesEn
        ? normalizeUseCases(polished.useCasesZh ?? [], polished.useCasesEn ?? [])
        : {
            useCasesZh: item.metadata['use-cases'],
            useCasesEn: item.metadata.i18n.en['use-cases'],
          };

    return {
      ...item,
      reason: polished.reason,
      ...normalized,
      ...normalizedUseCases,
    };
  });
}

async function polishBatchWithRetry(items: IconWorkItem[], includeUseCases: boolean, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await polishBatch(items, includeUseCases);
    } catch (error) {
      if (attempt >= retries) {
        throw error;
      }

      const delayMs = 1500 * (attempt + 1);
      console.warn(
        `Retrying batch (${items.map((item) => item.icon).join(', ')}) after error: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      await setTimeout(delayMs);
    }
  }

  throw new Error('Unreachable retry state.');
}

async function runWithConcurrency<T>(
  items: T[],
  concurrency: number,
  task: (item: T, index: number) => Promise<void>,
) {
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      await task(items[currentIndex], currentIndex);
    }
  }

  const workerCount = Math.min(concurrency, items.length);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));
}

async function main() {
  const options = parseCliArgs(process.argv.slice(2));
  const items = await loadIconWorkItems(
    options.categories,
    options.icons,
    options.startAfter,
    options.limit,
  );

  if (items.length === 0) {
    console.log('No matching icons found.');
    return;
  }

  console.log(`Selected ${items.length} icon(s): ${items.map((item) => item.icon).join(', ')}`);

  if (options.list) {
    return;
  }

  let changedCount = 0;
  const chunks = chunkItems(items, options.batchSize);

  await runWithConcurrency(chunks, options.concurrency, async (chunk, chunkIndex) => {
    console.log(
      `Processing batch ${chunkIndex + 1}/${chunks.length}: ${chunk
        .map((item) => item.icon)
        .join(', ')}`,
    );
    const polishedItems = await polishBatchWithRetry(chunk, options.useCases);

    for (const item of polishedItems) {
      const changed =
        JSON.stringify(item.metadata.tags) !== JSON.stringify(item.tagsZh) ||
        JSON.stringify(item.metadata.i18n.en.tags) !== JSON.stringify(item.tagsEn) ||
        (options.useCases &&
          (JSON.stringify(item.metadata['use-cases']) !== JSON.stringify(item.useCasesZh) ||
            JSON.stringify(item.metadata.i18n.en['use-cases']) !==
              JSON.stringify(item.useCasesEn)));

      console.log(
        [
          `${changed ? 'CHANGE' : 'KEEP'} ${item.icon}`,
          `  zh: ${item.metadata.tags.join(' / ')} -> ${item.tagsZh.join(' / ')}`,
          `  en: ${item.metadata.i18n.en.tags.join(' / ')} -> ${item.tagsEn.join(' / ')}`,
          ...(options.useCases
            ? [
                `  use zh: ${item.metadata['use-cases'].join(' / ')} -> ${item.useCasesZh.join(' / ')}`,
                `  use en: ${item.metadata.i18n.en['use-cases'].join(' / ')} -> ${item.useCasesEn.join(' / ')}`,
              ]
            : []),
          `  reason: ${item.reason}`,
        ].join('\n'),
      );

      if (!changed) {
        continue;
      }

      changedCount += 1;

      if (options.write) {
        item.metadata.tags = item.tagsZh;
        item.metadata.i18n.en.tags = item.tagsEn;
        if (options.useCases) {
          item.metadata['use-cases'] = item.useCasesZh;
          item.metadata.i18n.en['use-cases'] = item.useCasesEn;
        }
        await fs.writeFile(item.file, `${JSON.stringify(item.metadata, null, 2)}\n`, 'utf-8');
      }
    }
  });

  console.log(
    options.write
      ? `Wrote polished tags for ${changedCount} icon(s).`
      : `Dry run found ${changedCount} icon(s) with tag changes. Re-run with --write to persist.`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
