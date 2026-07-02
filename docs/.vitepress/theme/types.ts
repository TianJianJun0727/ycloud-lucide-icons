export type IconNode = [elementName: string, attrs: Record<string, string>][];
export type IconNodeWithKeys = [elementName: string, attrs: Record<string, string>, key: string][];

export interface IconMetaData {
  name: string;
  tags: string[];
  useCases?: string[];
  categories: string[];
  i18n: {
    en: {
      name: string;
      tags: string[];
      useCases?: string[];
    };
  };
  aliases?: string[];
  deprecated?: boolean;
  deprecationReason?: string;
  toBeRemovedInVersion?: string;
}

export interface IconEntity extends IconMetaData {
  name: string;
  displayName?: string;
  displayTags?: string[];
  displayUseCases?: string[];
  displayCategories?: string[];
  englishName?: string;
  englishTags?: string[];
  englishUseCases?: string[];
  englishCategories?: string[];
  iconNode: IconNode;
  createdRelease?: Release;
  changedRelease?: Release;
  git?: IconGitMetadata;
  popularity?: number;
}

export interface IconGitMetadata {
  createdAt?: string;
  changedAt?: string;
  createdBy?: string;
  changedBy?: string;
  contributors?: string[];
}

export interface BusinessIconEntity {
  name: string;
  displayName: string;
  tags?: string[];
  useCases?: string[];
  englishName?: string;
  englishTags?: string[];
  englishUseCases?: string[];
  category: string;
  colorMode: string;
  categoryTitle: string;
  englishCategoryTitle: string;
  componentName: string;
  path: string;
  svg: string;
  dataUri: string;
  createdRelease?: Release;
  changedRelease?: Release;
  git?: IconGitMetadata;
}

export interface BusinessIconCategory {
  name: string;
  title: string;
  englishTitle: string;
  iconCount: number;
}

export interface IllustrationEntity {
  name: string;
  displayName: string;
  tags?: string[];
  useCases?: string[];
  englishName?: string;
  englishTags?: string[];
  englishUseCases?: string[];
  componentName: string;
  path: string;
  svg: string;
  dataUri: string;
  createdRelease?: Release;
  changedRelease?: Release;
  git?: IconGitMetadata;
  popularity?: number;
}

export interface Category {
  name: string;
  title: string;
  englishTitle: string;
  icon?: string;
  iconCount: number;
  icons?: IconEntity[];
}

interface Shield {
  alt: string;
  src: string;
  href: string;
}

export interface PackageItem {
  name: string;
  repository?: {
    directory?: string;
  };
  // set when the package's directory
  // name under the `packages/` directory
  // is diffrent from the package name
  packageDirname?: string;
  description: string;
  icon: string;
  iconDark: string;
  shields: Shield[];
  source: string;
  npmUrl: string;
  documentation: string;
  // set when the docs page name is
  // diffrent from the package name
  docsAlias?: string;
  order?: number;
  private?: boolean;
  flutter?: object;
}

export interface Release {
  version: string;
  date: string;
}

interface ShowcaseItemImage {
  light: string;
  dark: string;
}

export interface ShowcaseItem {
  name: string;
  url: string;
  image: ShowcaseItemImage;
}
