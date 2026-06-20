import fs from 'fs/promises';
import path from 'path';

const currentDir = process.cwd();
const fontFile = path.resolve(currentDir, '../packages/icons-static/font/ycloud.woff2');
const dataDirectory = path.resolve(currentDir, '.vitepress/data');
const outputFile = path.resolve(dataDirectory, 'fontDataUrl.ts');

try {
  const font = await fs.readFile(fontFile);
  const dataUrl = `data:font/woff2;base64,${font.toString('base64')}`;

  await fs.mkdir(dataDirectory, { recursive: true });
  await fs.writeFile(
    outputFile,
    `export const ycloudFontDataUrl = ${JSON.stringify(dataUrl)};\n`,
    'utf-8',
  );

  console.log('Successfully written icon font data URL');
} catch (error) {
  throw new Error(`Something went wrong generating the icon font data URL,\n ${error}`);
}
