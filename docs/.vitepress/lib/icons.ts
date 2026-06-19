import fs from 'fs';
import path from 'path';
import { IconNodeWithKeys } from '../theme/types';
import iconNodes from '../data/iconNodes';
import releaseMeta from '../data/releaseMetaData.json';
import {
  localizeIconCategories,
  localizeIconName,
  localizeIconTags,
} from '../theme/utils/iconI18n';

const DATE_OF_FORK = '2020-06-08T16:39:52+0100';

const directory = path.join(process.cwd(), '../icons');

export interface GetDataOptions {
  withChildKeys?: boolean;
}

export async function getData(name: string) {
  const jsonPath = path.join(directory, `${name}.json`);
  const jsonContent = fs.readFileSync(jsonPath, 'utf8');
  const { tags, categories, contributors, i18n } = JSON.parse(jsonContent);

  const iconNode = iconNodes[name];

  const releaseData = releaseMeta?.[name] ?? {
    createdRelease: {
      version: '0.0.0',
      date: DATE_OF_FORK,
    },
    changedRelease: {
      version: '0.0.0',
      date: DATE_OF_FORK,
    },
  };

  return {
    name,
    displayName: localizeIconName(name, i18n?.zh?.name),
    tags,
    displayTags: localizeIconTags(tags, i18n?.zh?.tags),
    categories,
    displayCategories: localizeIconCategories(categories, i18n?.zh?.categories),
    iconNode,
    contributors,
    ...releaseData,
  };
}

export async function getAllData(): Promise<{ name: string; iconNode: IconNodeWithKeys }[]> {
  const names = Object.keys(iconNodes);

  return Promise.all(names.map((name) => getData(name)));
}
