import svgtofont from 'svgtofont';
import fs from 'node:fs/promises';
import path from 'node:path';
import { type CodePoints } from './allocateCodepoints.ts';

interface BuildFontOptions {
  inputDir: string;
  targetDir: string;
  fontName: string;
  classNamePrefix: string;
  codePoints: CodePoints;
  startUnicode: number;
}

export async function buildFont({
  inputDir,
  targetDir,
  fontName,
  classNamePrefix,
  codePoints,
  startUnicode,
}: BuildFontOptions) {
  console.time('Font generation');
  try {
    await svgtofont({
      src: inputDir,
      dist: targetDir,
      fontName,
      classNamePrefix,
      css: {
        fontSize: 'inherit',
        hasTimestamp: false,
      },
      emptyDist: true,
      useCSSVars: false,
      outSVGReact: false,
      outSVGPath: false,
      addLigatures: true,
      svgicons2svgfont: {
        fontHeight: 1000, // At least 1000 is recommended
        normalize: false,
      },
      svg2ttf: {
        ts: 0,
      },
      generateInfoData: true,
      website: {
        title: 'YCloud',
        logo: undefined,
        meta: {
          description: 'YCloud icons as TTF/EOT/WOFF/WOFF2/SVG.',
          keywords: 'YCloud,TTF,EOT,WOFF,WOFF2,SVG',
        },
        corners: {
          url: 'https://github.com/TianJianJun0727/ycloud-icons',
          width: 62, // default: 60
          height: 62, // default: 60
          bgColor: '#dc3545', // default: '#151513'
        },
        links: [
          {
            title: 'GitHub',
            url: 'https://github.com/TianJianJun0727/ycloud-icons',
          },
          {
            title: 'Feedback',
            url: 'https://github.com/TianJianJun0727/ycloud-icons/issues',
          },
          {
            title: 'Font Class',
            url: 'index.html',
          },
          {
            title: 'Unicode',
            url: 'unicode.html',
          },
        ],
      },
      getIconUnicode: (name: string) => {
        if (!codePoints[name]) {
          throw new Error(`No codepoint found for icon: ${name}`);
        }

        const unicode = codePoints[name];
        return [String.fromCharCode(unicode), startUnicode];
      },
    });
    await normalizeGeneratedFontFiles(targetDir, fontName);
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    console.timeEnd('Font generation');
  }
}

async function normalizeGeneratedFontFiles(targetDir: string, fontName: string) {
  const generatedTextFiles = [
    `${fontName}.css`,
    `${fontName}.less`,
    `${fontName}.module.less`,
    `${fontName}.scss`,
    `${fontName}.styl`,
    'index.html',
    'unicode.html',
    'symbol.html',
  ];

  await Promise.all(
    generatedTextFiles.map(async (fileName) => {
      const filePath = path.join(targetDir, fileName);
      let content: string;

      try {
        content = await fs.readFile(filePath, 'utf8');
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') return;
        throw error;
      }

      const normalizedContent = content
        .replace(new RegExp(`(${fontName}\\.(?:eot|woff2?|ttf))\\?t=\\d+`, 'g'), '$1')
        .replace(new RegExp(`(${fontName}\\.eot)\\?#iefix`, 'g'), '$1#iefix')
        .replace(new RegExp(`(${fontName}\\.(?:woff2?|ttf))\\?\\d+`, 'g'), '$1')
        .replace(new RegExp(`(${fontName}\\.svg#${fontName})\\?\\d+`, 'g'), '$1');

      if (normalizedContent !== content) {
        await fs.writeFile(filePath, normalizedContent);
      }
    }),
  );
}
