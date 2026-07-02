import { PageData } from 'vitepress';
import getStructuredData from './getStructuredData';
import { createGeneralOGImage, createIconOGImage } from './createOGImage';

const isOGEnabled = process.env.DOCS_OG !== '0' && process.env.DOCS_SKIP_OG !== '1';
const siteUrl = process.env.DOCS_SITE_URL ?? 'https://tianjianjun0727.github.io/ycloud-icons';

function getLocalePath(relativePath: string) {
  const isEnglish = relativePath.startsWith('en/');
  const path = isEnglish ? relativePath.slice(3) : relativePath;

  return { isEnglish, path };
}

function getAbsoluteUrl(path: string) {
  return `${siteUrl}${path}`;
}

function getAssetKind(path: string) {
  if (path.startsWith('icons/')) return 'icon';
  if (path.startsWith('business-icons/')) return 'business-icon';
  if (path.startsWith('illustration-icons/')) return 'illustration';
  return undefined;
}

export async function transformPageData(pageData: PageData) {
  pageData.frontmatter.head ??= [];
  const { isEnglish, path } = getLocalePath(pageData.relativePath);

  const assetKind = getAssetKind(path);
  if (assetKind && pageData.params?.name) {
    const iconName = pageData.params.name;
    const displayName = isEnglish
      ? pageData.params.englishName || iconName
      : pageData.params.displayName || iconName;
    const displayTags = isEnglish
      ? pageData.params.englishTags || pageData.params.tags
      : pageData.params.displayTags || pageData.params.tags;
    const displayCategories = isEnglish
      ? pageData.params.englishCategories || pageData.params.categories
      : pageData.params.displayCategories || pageData.params.categories;
    const assetLabel =
      assetKind === 'business-icon'
        ? isEnglish
          ? 'business icon'
          : '业务图标'
        : assetKind === 'illustration'
          ? isEnglish
            ? 'illustration'
            : '插画'
          : isEnglish
            ? 'icon'
            : '图标';
    pageData.title = isEnglish
      ? `${displayName} ${assetLabel} details`
      : `${displayName} ${assetLabel}详情`;

    const taggedAs = displayTags?.length
      ? isEnglish
        ? `Tagged as: ${displayTags.join(', ')}.`
        : `标签：${displayTags.join('、')}。`
      : '';
    const categorizedIn = displayCategories?.length
      ? isEnglish
        ? `Categorized in: ${displayCategories.join(', ')}.`
        : `分类：${displayCategories.join('、')}。`
      : '';

    pageData.description = isEnglish
      ? `Details and usage examples for ${displayName} ${assetLabel}. ${taggedAs} ${categorizedIn}`.trim()
      : `${displayName} ${assetLabel}详情和使用示例。${taggedAs} ${categorizedIn}`.trim();

    const structuredData =
      assetKind === 'icon'
        ? await getStructuredData(iconName, pageData, {
            locale: isEnglish ? 'en' : 'zh',
            siteUrl,
          })
        : undefined;

    const ogPath =
      assetKind === 'icon' && isOGEnabled
        ? await createIconOGImage(iconName, displayTags || [])
        : undefined;

    if (ogPath) {
      const content = getAbsoluteUrl(ogPath);
      pageData.frontmatter.head.push(
        [
          'meta',
          {
            property: 'og:image',
            content,
          },
        ],
        [
          'meta',
          {
            property: 'twitter:image',
            content,
          },
        ],
      );
    }

    if (structuredData) {
      pageData.frontmatter.head.push([
        'script',
        { type: 'application/ld+json' },
        JSON.stringify(structuredData),
      ]);
    }
  }

  if (path.startsWith('guide/')) {
    const ogPath = isOGEnabled ? await createGeneralOGImage(pageData) : undefined;

    if (ogPath) {
      const content = getAbsoluteUrl(ogPath);
      pageData.frontmatter.head.push(
        [
          'meta',
          {
            property: 'og:image',
            content,
          },
        ],
        [
          'meta',
          {
            property: 'twitter:image',
            content,
          },
        ],
      );
    }
  }

  pageData.frontmatter.head.push(
    [
      'meta',
      {
        property: 'og:locale',
        content: isEnglish ? 'en_US' : 'zh_CN',
      },
    ],
    [
      'meta',
      {
        property: 'og:description',
        content: pageData.description,
      },
    ],
    [
      'meta',
      {
        property: 'twitter:description',
        content: pageData.description,
      },
    ],
  );
}
