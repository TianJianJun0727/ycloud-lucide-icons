/**
 * Optimize all business SVG source files without applying generic icon defaults.
 */
import fs from 'fs';
import path from 'path';
import processBusinessSvg from './render/processBusinessSvg.mts';

const BUSINESS_ICONS_DIR = path.resolve(process.cwd(), 'business-icons');

console.log(`Optimizing business SVGs...`);

async function readSvgFiles(dir: string): Promise<string[]> {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return readSvgFiles(fullPath);
      }
      if (entry.isFile() && path.extname(entry.name) === '.svg') {
        return [path.relative(BUSINESS_ICONS_DIR, fullPath)];
      }
      return [];
    }),
  );
  return files.flat().sort();
}

const svgFiles = await readSvgFiles(BUSINESS_ICONS_DIR);

await Promise.all(
  svgFiles.map(async (svgFile: string) => {
    const content = fs.readFileSync(path.join(BUSINESS_ICONS_DIR, svgFile), 'utf-8');
    const svg = await processBusinessSvg(content, svgFile);
    await fs.promises.writeFile(path.join(BUSINESS_ICONS_DIR, svgFile), svg, 'utf-8');
  }),
);
