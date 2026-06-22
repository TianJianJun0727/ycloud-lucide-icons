import getArgumentOptions from 'minimist';
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';

import { getAllIconAliases } from '@ycloud-web/helpers';
import { allocateCodePoints } from './allocateCodepoints.ts';
import { buildFont } from './buildFont.ts';
import { hasMissingCodePoints } from './helpers.ts';

const fontName = 'ycloud';
const classNamePrefix = 'icon';
const startUnicode = 57400;
const defaultOutputDir = 'packages/icons-static/font';

const {
  saveCodePoints = false,
  allowFixes = false,
  output = defaultOutputDir,
} = getArgumentOptions(process.argv.slice(2)) ?? {};

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, '../../..');
const iconsDir = path.join(repoRoot, 'icons');
const targetDir = path.resolve(repoRoot, String(output));

if (saveCodePoints && !process.env.BLOB_READ_WRITE_TOKEN) {
  throw new Error(
    'Saving code points requires BLOB_READ_WRITE_TOKEN environment variable to be set.',
  );
}

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
