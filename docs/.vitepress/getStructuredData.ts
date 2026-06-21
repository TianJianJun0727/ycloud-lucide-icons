import { PageData } from 'vitepress';

type StructuredDataOptions = {
  locale: 'zh' | 'en';
  siteUrl: string;
};

export default async function getStructuredData(
  iconName: string,
  pageData: PageData,
  { locale, siteUrl }: StructuredDataOptions,
) {
  const localePrefix = locale === 'en' ? '/en' : '';
  const url = `${siteUrl}${localePrefix}/icons/${iconName}`;
  const iconsUrl = `${siteUrl}${localePrefix}/icons`;
  const iconSvgUrl = `https://raw.githubusercontent.com/TianJianJun0727/ycloud-icons/main/icons/${iconName}.svg`;
  const keywords =
    locale === 'en'
      ? pageData.params?.englishTags || pageData.params?.tags
      : pageData.params?.displayTags || pageData.params?.tags;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': url,
    name: pageData.title,
    description: pageData.description,
    url,
    inLanguage: locale === 'en' ? 'en-US' : 'zh-CN',
    isPartOf: {
      '@type': 'WebSite',
      name: 'YCloud Icons',
      url: siteUrl,
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: locale === 'en' ? 'Icons' : '图标',
          item: iconsUrl,
        },
        { '@type': 'ListItem', position: 2, name: iconName, item: url },
      ],
    },
    mainEntity: {
      '@type': 'ImageObject',
      '@id': `${url}#icon`,
      name: iconName,
      // TODO: Add support for description extraction from icon metadata
      // description: 'An ...SVG icon from the YCloud icon set.',
      contentUrl: iconSvgUrl,
      thumbnailUrl: iconSvgUrl,
      encodingFormat: 'image/svg+xml',
      keywords,
      width: 24,
      height: 24,
      creator: {
        '@type': 'Organization',
        name: 'YCloud Icons',
      },
      datePublished: pageData?.params?.createdRelease?.date,
      dateModified: pageData?.params?.changedRelease?.date,
    },
  };
}
