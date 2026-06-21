import path from 'path';
import {
  getCurrentDirPath,
  readAllMetadata,
  readSvgDirectory,
  writeFile,
} from '../tools/build-helpers/helpers.ts';

const currentDir = getCurrentDirPath(import.meta.url);
const ICONS_DIR = path.resolve(currentDir, '../icons');
const icons = await readAllMetadata(ICONS_DIR);

const svgFiles = await readSvgDirectory(ICONS_DIR);

const iconNames = svgFiles.map((icon) => icon.split('.')[0]);

iconNames.forEach((iconName) => {
  if (typeof icons[iconName] === 'undefined') {
    const iconContent = JSON.stringify(
      {
        $schema: '../icon.schema.json',
        'use-cases': [],
        name: iconName,
        tags: [],
        categories: [],
        i18n: {
          en: {
            name: iconName,
            tags: [],
          },
        },
      },
      null,
      2,
    );
    writeFile(iconContent, `${iconName}.json`, path.resolve(currentDir, '..'));
  }
});
