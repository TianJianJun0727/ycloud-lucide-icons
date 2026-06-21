import { HeadConfig } from 'vitepress';

const getHeadConfig = ({
  title,
  description,
  socialTitle,
  base,
}: {
  title: string;
  description: string;
  socialTitle?: string;
  base: string;
}): HeadConfig[] => {
  const assetBase = base.endsWith('/') ? base : `${base}/`;
  const siteUrl = process.env.DOCS_SITE_URL ?? 'https://tianjianjun0727.github.io/ycloud-icons';

  return [
    [
      'link',
      {
        rel: 'icon',
        sizes: 'any',
        href: `${assetBase}favicon.ico`,
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: `${assetBase}favicon.svg`,
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: `${assetBase}favicon-32x32.png`,
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: `${assetBase}favicon-16x16.png`,
      },
    ],
    [
      'meta',
      {
        property: 'og:locale',
        content: 'en_US',
      },
    ],
    [
      'meta',
      {
        property: 'og:type',
        content: 'website',
      },
    ],
    [
      'meta',
      {
        property: 'og:site_name',
        content: title,
      },
    ],
    [
      'meta',
      {
        property: 'og:title',
        content: socialTitle,
      },
    ],
    [
      'meta',
      {
        property: 'og:description',
        content: description,
      },
    ],
    [
      'meta',
      {
        property: 'og:url',
        content: siteUrl,
      },
    ],
    [
      'meta',
      {
        property: 'og:image',
        content: `${siteUrl}/og.png`,
      },
    ],
    [
      'meta',
      {
        property: 'og:image:width',
        content: '1200',
      },
    ],
    [
      'meta',
      {
        property: 'og:image:height',
        content: '630',
      },
    ],
    [
      'meta',
      {
        property: 'og:image:type',
        content: 'image/png',
      },
    ],
    [
      'meta',
      {
        property: 'twitter:card',
        content: 'summary_large_image',
      },
    ],
    [
      'meta',
      {
        property: 'twitter:title',
        content: socialTitle,
      },
    ],
    [
      'meta',
      {
        property: 'twitter:description',
        content: description,
      },
    ],
    [
      'meta',
      {
        property: 'twitter:image',
        content: `${siteUrl}/og.png`,
      },
    ],
  ];
};

export default getHeadConfig;
