import fs from 'fs';
import path from 'path';
import { readSvgDirectory, toCamelCase } from '@ycloud-web/helpers';

const currentDir = process.cwd();
const ICONS_DIR = path.resolve(currentDir, '../icons');
const icons = await readSvgDirectory(ICONS_DIR, '.json');

const iconDetailsDirectory = path.resolve(currentDir, '.vitepress/data', 'iconDetails');

if (fs.existsSync(iconDetailsDirectory)) {
  fs.rmSync(iconDetailsDirectory, { recursive: true, force: true });
}

if (!fs.existsSync(iconDetailsDirectory)) {
  fs.mkdirSync(iconDetailsDirectory);
}

const indexFile = path.resolve(iconDetailsDirectory, `index.ts`);

const writeIconFiles = icons.map(async (iconFileName) => {
  const iconName = path.basename(iconFileName, '.json');
  const location = path.resolve(iconDetailsDirectory, `${iconName}.ts`);

  const contents = `\
import iconNode from '../iconNodes/${iconName}.node.json'
import metaData from '../../../../icons/${iconName}.json'
import releaseData from '../releaseMetadata/${iconName}.json'
import popularity from '../iconPopularity/${iconName}.json'
import categoriesData from '../categoriesData.json'

type IconMetaJson = {
  name: string
  tags: string[]
  categories: string[]
  aliases?: {
    name: string
    deprecated?: true
    deprecationReason?: string
    toBeRemovedInVersion?: string
  }[]
  deprecated?: true
  deprecationReason?: string
  toBeRemovedInVersion?: string
  i18n: {
    en: {
      name: string
      tags: string[]
    }
  }
}

type CategoryMetaJson = {
  name: string
  title: string
  englishTitle: string
}

const typedMetaData = metaData as IconMetaJson
const typedCategoriesData = categoriesData as CategoryMetaJson[]
const { name: displayName, tags, categories, aliases, deprecated, deprecationReason, toBeRemovedInVersion, i18n } = typedMetaData
const displayTags = tags
const categoryDetails = categories.map((categoryName) => {
  return typedCategoriesData.find((category) => category.name === categoryName)
})
const displayCategories = categories.map((categoryName, index) => {
  return categoryDetails[index]?.title ?? categoryName
})
const englishName = i18n.en.name
const englishTags = i18n.en.tags
const englishCategories = categories.map((categoryName, index) => {
  return categoryDetails[index]?.englishTitle ?? categoryName
})

const iconDetails = {
  name: '${iconName}',
  displayName,
  englishName,
  iconNode,
  i18n,
  tags,
  displayTags,
  englishTags,
  categories,
  displayCategories,
  englishCategories,
  aliases,
  deprecated,
  popularity,
  deprecationReason,
  toBeRemovedInVersion,
  ...releaseData,
}

export default iconDetails
  `;

  await fs.promises.writeFile(location, contents, 'utf-8');
  await fs.promises.appendFile(
    indexFile,
    `export { default as ${toCamelCase(iconName)} } from './${iconName}';\n`,
    'utf-8',
  );
});

Promise.all(writeIconFiles)
  .then(() => {
    console.log('Successfully write', writeIconFiles.length, 'iconDetails files.');
  })
  .catch((error) => {
    throw new Error(`Something went wrong generating iconNode files,\n ${error}`);
  });
