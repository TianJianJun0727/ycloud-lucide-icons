/**
 * 全量校验图标源文件、图标元数据和分类定义的关系。
 *
 * 输入：固定读取仓库 `icons` 和 `categories` 目录。
 * 检查内容：
 * - 每个 `icons/*.svg` 必须有同名 `icons/*.json`。
 * - 每个 `icons/*.json` 必须有同名 `icons/*.svg`。
 * - 每个图标 JSON 中的 `categories` 必须引用已经存在的 `categories/*.json`。
 * 提醒内容：
 * - `icons/*.svg`、`icons/*.json`、`categories/*.json` 的 slug 是否出现大小写变体重复。
 * - 图标文件名和 aliases 是否互相重复。
 * 提醒只针对新增文件场景：CLI 通过 `ADDED_FILES` 环境变量传入 PR 新增文件列表。
 *
 * 注意：这里不检查中英文内容细节；字段语言、重复值和 use-cases 成对规则由
 * `checkIconMetadata.mts` / `checkCategoryMetadata.mts` 负责。
 * 调用位置：根 `package.json` 的 `pnpm checkIcons`，并被 lint-staged 在提交图标源文件时调用。
 * 调用时机：本地检查、CI 校验和提交前校验都会运行，用于防止 SVG/JSON/分类引用关系断裂。
 */
import path from 'path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import {
  readSvgDirectory,
  getCurrentDirPath,
  readAllMetadata,
} from '../tools/build-helpers/helpers.ts';
import { type IconMetadata } from '../tools/build-icons/types.ts';

const currentDir = getCurrentDirPath(import.meta.url);
const ICONS_DIR = path.resolve(currentDir, '../icons');
const CATEGORIES_DIR = path.resolve(currentDir, '../categories');

type CheckIconsAndCategoriesOptions = {
  addedFiles?: string[];
};

type IconNameEntry = {
  name: string;
  ownerIconName: string;
};

function getFileSlug(file: string, extension: string) {
  return path.basename(file, extension);
}

function findNormalizedDuplicates(values: string[]) {
  const valuesByNormalizedValue = new Map<string, string[]>();
  const duplicates: string[][] = [];

  for (const value of values) {
    const normalizedValue = value.toLowerCase();
    const matchingValues = valuesByNormalizedValue.get(normalizedValue) ?? [];
    matchingValues.push(value);
    valuesByNormalizedValue.set(normalizedValue, matchingValues);
  }

  for (const matchingValues of valuesByNormalizedValue.values()) {
    if (matchingValues.length > 1) {
      duplicates.push([...new Set(matchingValues)]);
    }
  }

  return duplicates;
}

function findDuplicateIconNameEntries(entries: IconNameEntry[]) {
  const entriesByNormalizedName = new Map<string, IconNameEntry[]>();
  const duplicates: IconNameEntry[][] = [];

  for (const entry of entries) {
    const normalizedName = entry.name.toLowerCase();
    const matchingEntries = entriesByNormalizedName.get(normalizedName) ?? [];
    matchingEntries.push(entry);
    entriesByNormalizedName.set(normalizedName, matchingEntries);
  }

  for (const matchingEntries of entriesByNormalizedName.values()) {
    if (matchingEntries.length > 1) {
      duplicates.push(matchingEntries);
    }
  }

  return duplicates;
}

function parseAddedFilesFromEnv() {
  return (process.env.ADDED_FILES ?? '').split(/\s+/).filter(Boolean);
}

function getAddedSlugs(addedFiles: string[], directory: string, extension: string) {
  return new Set(
    addedFiles
      .filter((file) => file.startsWith(`${directory}/`) && file.endsWith(extension))
      .map((file) => getFileSlug(file, extension).toLowerCase()),
  );
}

function includesAddedSlug(values: string[], addedSlugs: ReadonlySet<string>) {
  return values.some((value) => addedSlugs.has(value.toLowerCase()));
}

function getAliasName(alias: unknown) {
  if (typeof alias === 'string') {
    return alias;
  }

  if (typeof alias === 'object' && alias !== null && 'name' in alias) {
    const name = (alias as { name?: unknown }).name;
    return typeof name === 'string' ? name : '';
  }

  return '';
}

export async function checkIconsAndCategories(
  iconsDir = ICONS_DIR,
  categoriesDir = CATEGORIES_DIR,
  options: CheckIconsAndCategoriesOptions = {},
) {
  const icons = (await readAllMetadata(iconsDir)) as Record<string, IconMetadata>;
  const categories = (await readAllMetadata(categoriesDir)) as Record<
    string,
    {
      name: string;
    }
  >;
  const svgFiles = await readSvgDirectory(iconsDir);
  const iconJsonFiles = (await fs.readdir(iconsDir)).filter((file) => file.endsWith('.json'));
  const categoryJsonFiles = (await fs.readdir(categoriesDir)).filter((file) =>
    file.endsWith('.json'),
  );
  const iconNames = svgFiles.map((file) => getFileSlug(file, '.svg'));
  const iconJsonNames = iconJsonFiles.map((file) => getFileSlug(file, '.json'));
  const categoryNames = categoryJsonFiles.map((file) => getFileSlug(file, '.json'));
  const addedFiles = options.addedFiles ?? [];
  const addedIconSvgSlugs = getAddedSlugs(addedFiles, 'icons', '.svg');
  const addedIconJsonSlugs = getAddedSlugs(addedFiles, 'icons', '.json');
  const addedCategoryJsonSlugs = getAddedSlugs(addedFiles, 'categories', '.json');
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const duplicate of findNormalizedDuplicates(iconNames)) {
    if (includesAddedSlug(duplicate, addedIconSvgSlugs)) {
      warnings.push(`Duplicate icon SVG slugs after case normalization: ${duplicate.join(', ')}.`);
    }
  }

  for (const duplicate of findNormalizedDuplicates(iconJsonNames)) {
    if (includesAddedSlug(duplicate, addedIconJsonSlugs)) {
      warnings.push(`Duplicate icon JSON slugs after case normalization: ${duplicate.join(', ')}.`);
    }
  }

  for (const duplicate of findNormalizedDuplicates(categoryNames)) {
    if (includesAddedSlug(duplicate, addedCategoryJsonSlugs)) {
      warnings.push(
        `Duplicate category JSON slugs after case normalization: ${duplicate.join(', ')}.`,
      );
    }
  }

  iconNames.forEach((iconName) => {
    if (typeof icons[iconName] === 'undefined') {
      errors.push(`'${iconName}.svg' does not have a matching JSON file.`);
    }
  });

  Object.keys(icons).forEach((iconName) => {
    const icon = icons[iconName];
    if (iconNames.indexOf(iconName) === -1) {
      errors.push(`'${iconName}.svg' does not exist.`);
    }
    icon.categories?.forEach((categoryName) => {
      if (typeof categories[categoryName] === 'undefined') {
        errors.push(`Icon '${iconName}' refers to the non-existing category '${categoryName}'.`);
      }
    });
  });

  const iconAndAliasNames = Object.entries(icons).flatMap(([iconName, icon]) => [
    {
      name: iconName,
      ownerIconName: iconName,
    },
    ...((icon.aliases ?? []) as unknown[])
      .map(getAliasName)
      .filter(Boolean)
      .map((name) => ({
        name,
        ownerIconName: iconName,
      })),
  ]);

  for (const duplicate of findDuplicateIconNameEntries(iconAndAliasNames)) {
    if (duplicate.some((entry) => addedIconJsonSlugs.has(entry.ownerIconName.toLowerCase()))) {
      warnings.push(
        `Duplicate icon name or alias after case normalization: ${[
          ...new Set(duplicate.map((entry) => entry.name)),
        ].join(', ')}.`,
      );
    }
  }

  return { errors, warnings };
}

async function main() {
  console.log('Reading all icons');
  const { errors, warnings } = await checkIconsAndCategories(ICONS_DIR, CATEGORIES_DIR, {
    addedFiles: parseAddedFilesFromEnv(),
  });

  for (const warning of warnings) {
    console.warn(`Warning: ${warning}`);
  }

  for (const error of errors) {
    console.error(error);
  }

  if (errors.length > 0) {
    console.error('At least one error in icon JSONs prevents from committing changes.');
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
