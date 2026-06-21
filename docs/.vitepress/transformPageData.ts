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

export async function transformPageData(pageData: PageData) {
  pageData.frontmatter.head ??= [];
  const { isEnglish, path } = getLocalePath(pageData.relativePath);

  if (path.startsWith('icons/') && pageData.params?.name) {
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
    pageData.title = isEnglish ? `${displayName} icon details` : `${displayName} 图标详情`;

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
      ? `Details and related icons for ${displayName} icon. ${taggedAs} ${categorizedIn}`.trim()
      : `${displayName} 图标详情、相关图标和使用示例。${taggedAs} ${categorizedIn}`.trim();

    const structuredData = await getStructuredData(iconName, pageData, {
      locale: isEnglish ? 'en' : 'zh',
      siteUrl,
    });

    const ogPath = isOGEnabled ? await createIconOGImage(iconName, displayTags || []) : undefined;

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

    pageData.frontmatter.head.push([
      'script',
      { type: 'application/ld+json' },
      JSON.stringify(structuredData),
    ]);
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
}
