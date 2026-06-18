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
import { localizeIconCategories, localizeIconName, localizeIconTags } from '../../theme/utils/iconI18n'

const { tags, categories, contributors, aliases, deprecated, deprecationReason, toBeRemovedInVersion, i18n } = metaData
const displayName = localizeIconName('${iconName}', i18n?.zh?.name)
const displayTags = localizeIconTags(tags, i18n?.zh?.tags)
const displayCategories = localizeIconCategories(categories, i18n?.zh?.categories)

const iconDetails = {
  name: '${iconName}',
  displayName,
  iconNode,
  contributors,
  tags,
  displayTags,
  categories,
  displayCategories,
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
