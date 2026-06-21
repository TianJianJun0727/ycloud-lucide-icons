import fs from 'fs';
import processSvg from './render/processSvg.mts';

const svgFiles = process.argv.slice(2);

await Promise.all(
  svgFiles.map(async (svgFile) => {
    console.log('Optimizing staged SVG file:', svgFile);
    const content = fs.readFileSync(svgFile, 'utf-8');
    const svg = await processSvg(content, svgFile);
    fs.writeFileSync(svgFile, svg, 'utf-8');
  }),
);
