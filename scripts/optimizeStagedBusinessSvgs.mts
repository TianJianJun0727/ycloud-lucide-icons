/**
 * Optimize changed business SVG files without applying generic icon defaults.
 */
import fs from 'fs';
import processBusinessSvg from './render/processBusinessSvg.mts';

const svgFiles = process.argv.slice(2);

await Promise.all(
  svgFiles.map(async (svgFile) => {
    console.log('Optimizing staged business SVG file:', svgFile);
    const content = fs.readFileSync(svgFile, 'utf-8');
    const svg = await processBusinessSvg(content, svgFile);
    fs.writeFileSync(svgFile, svg, 'utf-8');
  }),
);
