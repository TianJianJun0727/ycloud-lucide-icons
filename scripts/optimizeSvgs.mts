import fs from 'fs';
import path from 'path';
import { readSvgDirectory, writeSvgFile } from '../tools/build-helpers/helpers.ts';
import processSvg from './render/processSvg.mts';

const ICONS_DIR = path.resolve(process.cwd(), 'icons');

console.log(`Optimizing SVGs...`);

const svgFiles = await readSvgDirectory(ICONS_DIR);

await Promise.all(
  svgFiles.map(async (svgFile: string) => {
    const content = fs.readFileSync(path.join(ICONS_DIR, svgFile), 'utf-8');
    const svg = await processSvg(content, svgFile);
    await writeSvgFile(svgFile, ICONS_DIR, svg);
  }),
);
