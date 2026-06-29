import getArgumentOptions from 'minimist';
import os from 'node:os';
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';

import { getAllIconAliases } from '@ycloud-web/helpers';
import { allocateCodePoints } from './allocateCodepoints.ts';
import { buildFont } from './buildFont.ts';
import { hasMissingCodePoints } from './helpers.ts';

const fontName = 'ycloud';
const classNamePrefix = 'icon';
const businessFontName = 'ycloud-business';
const businessClassNamePrefix = 'business-icon';
const startUnicode = 57400;
const businessStartUnicode = 61440;
const defaultOutputDir = 'packages/icons-static/font';
const defaultBusinessOutputDir = 'packages/icons-static/business-font';

const {
  saveCodePoints = false,
  allowFixes = false,
  output = defaultOutputDir,
  businessOutput = defaultBusinessOutputDir,
  businessOnly = false,
} = getArgumentOptions(process.argv.slice(2)) ?? {};

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, '../../..');
const iconsDir = path.join(repoRoot, 'icons');
const businessIconsDir = path.join(repoRoot, 'business-icons');
const targetDir = path.resolve(repoRoot, String(output));
const businessTargetDir = path.resolve(repoRoot, String(businessOutput));

if (!businessOnly && saveCodePoints && !process.env.BLOB_READ_WRITE_TOKEN) {
  throw new Error(
    'Saving code points requires BLOB_READ_WRITE_TOKEN environment variable to be set.',
  );
}

if (!businessOnly) {
  const iconsWithAliases = await getAllIconAliases(iconsDir);

  const codePoints = await allocateCodePoints({
    saveCodePoints,
    allowFixes,
    iconsWithAliases,
  });

  if (hasMissingCodePoints(iconsWithAliases, codePoints)) {
    throw new Error('Some icons or aliases are missing code points. See log for details.');
  }

  await buildFont({
    inputDir: iconsDir,
    targetDir,
    fontName,
    classNamePrefix,
    codePoints,
    startUnicode,
  });

  const codepointsContent = JSON.stringify(codePoints, null, 2);
  await fs.writeFile(path.join(targetDir, 'codepoints.json'), codepointsContent, 'utf-8');
}

async function pathExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readExistingBusinessCodePoints(targetDir: string) {
  const codepointsPath = path.join(targetDir, 'codepoints.json');
  if (!(await pathExists(codepointsPath))) return {};

  return JSON.parse(await fs.readFile(codepointsPath, 'utf8')) as Record<string, number>;
}

async function readBusinessIconNames(dir: string): Promise<string[]> {
  if (!(await pathExists(dir))) return [];

  const entries = await fs.readdir(dir, { withFileTypes: true });
  const names = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return readBusinessIconNames(entryPath);
      if (entry.isFile() && entry.name.endsWith('.svg')) return [path.parse(entry.name).name];
      return [];
    }),
  );

  return names.flat();
}

async function copyBusinessIconsToFlatDirectory(sourceDir: string, targetDir: string) {
  const entries = await fs.readdir(sourceDir, { withFileTypes: true });
  const iconNames = new Set<string>();

  async function copyFromDirectory(dir: string) {
    const nestedEntries = await fs.readdir(dir, { withFileTypes: true });
    await Promise.all(
      nestedEntries.map(async (entry) => {
        const entryPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          await copyFromDirectory(entryPath);
          return;
        }
        if (!entry.isFile() || !entry.name.endsWith('.svg')) return;

        const iconName = path.parse(entry.name).name;
        if (iconNames.has(iconName)) {
          throw new Error(`Duplicate business icon name found while building font: ${iconName}`);
        }
        iconNames.add(iconName);
        await fs.copyFile(entryPath, path.join(targetDir, entry.name));
      }),
    );
  }

  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(sourceDir, entry.name);
      if (entry.isDirectory()) {
        await copyFromDirectory(entryPath);
      }
    }),
  );

  return [...iconNames].sort((left, right) => left.localeCompare(right));
}

async function allocateBusinessCodePoints(names: string[]) {
  const existingCodePoints = await readExistingBusinessCodePoints(businessTargetDir);
  let maxCodePoint = Math.max(businessStartUnicode - 1, ...Object.values(existingCodePoints));
  const codePoints: Record<string, number> = {};

  for (const name of names) {
    codePoints[name] = existingCodePoints[name] ?? ++maxCodePoint;
  }

  return codePoints;
}

async function buildBusinessFont() {
  const businessIconNames = await readBusinessIconNames(businessIconsDir);
  if (businessIconNames.length === 0) return;

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ycloud-business-font-'));

  try {
    const flatIconNames = await copyBusinessIconsToFlatDirectory(businessIconsDir, tempDir);
    const businessCodePoints = await allocateBusinessCodePoints(flatIconNames);

    await buildFont({
      inputDir: tempDir,
      targetDir: businessTargetDir,
      fontName: businessFontName,
      classNamePrefix: businessClassNamePrefix,
      codePoints: businessCodePoints,
      startUnicode: businessStartUnicode,
    });

    const businessCodepointsContent = JSON.stringify(businessCodePoints, null, 2);
    await fs.writeFile(
      path.join(businessTargetDir, 'codepoints.json'),
      businessCodepointsContent,
      'utf-8',
    );
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

await buildBusinessFont();
