import { PageData } from 'vitepress';
import getStructuredData from './getStructuredData';
import { createGeneralOGImage, createIconOGImage } from './createOGImage';

const shouldSkipOG = process.env.DOCS_SKIP_OG === '1';

export async function transformPageData(pageData: PageData) {
  pageData.frontmatter.head ??= [];
  if (
    pageData.relativePath.startsWith('icons/') &&
    !pageData.relativePath.startsWith('icons/lab/') &&
    pageData.params?.name
  ) {
    const iconName = pageData.params.name;
    pageData.title = `${iconName} icon details`;

    const taggedAs = pageData.params?.tags?.length
      ? `Tagged as: ${pageData.params.tags.join(', ')}.`
      : '';
    const categorizedIn = pageData.params?.category?.length
      ? `Categorized in: ${pageData.params.category.join(', ')}.`
      : '';

    pageData.description =
      `Details and related icons for ${iconName} icon. ${taggedAs} ${categorizedIn}`.trim();

    const structuredData = await getStructuredData(iconName, pageData);

    const ogPath = shouldSkipOG ? undefined : await createIconOGImage(iconName, pageData.params?.tags || []);

    if (ogPath) {
      const content = `https://tianjianjun0727.github.io/ycloud-icons${ogPath}`;
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

  if (pageData.relativePath.startsWith('guide/')) {
    const ogPath = shouldSkipOG ? undefined : await createGeneralOGImage(pageData);

    if (ogPath) {
      const content = `https://tianjianjun0727.github.io/ycloud-icons${ogPath}`;
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
