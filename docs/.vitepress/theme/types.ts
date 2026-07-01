export type IconNode = [elementName: string, attrs: Record<string, string>][];
export type IconNodeWithKeys = [elementName: string, attrs: Record<string, string>, key: string][];

export interface IconMetaData {
  name: string;
  tags: string[];
  categories: string[];
  i18n: {
    en: {
      name: string;
      tags: string[];
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
  displayCategories?: string[];
  englishName?: string;
  englishTags?: string[];
  englishCategories?: string[];
  iconNode: IconNode;
  createdRelease?: Release;
  changedRelease?: Release;
  popularity?: number;
}

export interface BusinessIconEntity {
  name: string;
  displayName: string;
  category: string;
  colorMode: string;
  categoryTitle: string;
  englishCategoryTitle: string;
  componentName: string;
  path: string;
  svg: string;
  dataUri: string;
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
  componentName: string;
  path: string;
  svg: string;
  dataUri: string;
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
