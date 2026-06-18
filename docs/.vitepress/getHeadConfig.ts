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

  return [
    [
      'link',
      {
        rel: 'icon',
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
        content: 'https://tianjianjun0727.github.io/ycloud-icons',
      },
    ],
    [
      'meta',
      {
        property: 'og:image',
        content: 'https://tianjianjun0727.github.io/ycloud-icons/og.png',
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
        content: 'https://tianjianjun0727.github.io/ycloud-icons/og.png',
      },
    ],
  ];
};

export default getHeadConfig;
