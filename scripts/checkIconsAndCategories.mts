import path from 'path';
import {
  readSvgDirectory,
  getCurrentDirPath,
  readAllMetadata,
} from '../tools/build-helpers/helpers.ts';
import { type IconMetadata } from '../tools/build-icons/types.ts';

const currentDir = getCurrentDirPath(import.meta.url);
const ICONS_DIR = path.resolve(currentDir, '../icons');
const icons = (await readAllMetadata(ICONS_DIR)) as Record<string, IconMetadata>;
const CATEGORIES_DIR = path.resolve(currentDir, '../categories');
const categories = (await readAllMetadata(CATEGORIES_DIR)) as Record<
  string,
  {
    name: string;
  }
>;

console.log('Reading all icons');

const svgFiles = await readSvgDirectory(ICONS_DIR);
const iconNames = svgFiles.map((icon) => icon.split('.')[0]);

let error = false;

iconNames.forEach((iconName) => {
  if (typeof icons[iconName] === 'undefined') {
    console.error(`'${iconName}.svg' does not have a matching JSON file.`);
    error = true;
  }
});

Object.keys(icons).forEach((iconName) => {
  const icon = icons[iconName];
  if (iconNames.indexOf(iconName) === -1) {
    console.error(`'${iconName}.svg' does not exist.`);
    error = true;
  }
  icon.categories?.forEach((categoryName) => {
    if (typeof categories[categoryName] === 'undefined') {
      console.error(`Icon '${iconName}' refers to the non-existing category '${categoryName}'.`);
      error = true;
    }
  });
});

if (error) {
  console.error('At least one error in icon JSONs prevents from committing changes.');
  process.exit(1);
}
