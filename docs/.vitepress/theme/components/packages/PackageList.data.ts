import packageDataList from '../../../data/packageData.json';
import fetchPackages from '../../../lib/fetchPackages';

const packageDescriptions: Record<string, { zh: string; en: string }> = {
  '@ycloud-web/icons': {
    zh: '面向 Web 和 JavaScript 应用的 YCloud Icons 库包。',
    en: 'YCloud Icons package for web and JavaScript applications.',
  },
  '@ycloud-web/icons-react': {
    zh: '面向 React 应用的 YCloud Icons 库包。',
    en: 'YCloud Icons package for React applications.',
  },
  '@ycloud-web/icons-vue': {
    zh: '面向 Vue 应用的 YCloud Icons 库包。',
    en: 'YCloud Icons package for Vue applications.',
  },
  '@ycloud-web/icons-svelte': {
    zh: '面向 Svelte 应用的 YCloud Icons 库包。',
    en: 'YCloud Icons package for Svelte applications.',
  },
  '@ycloud-web/icons-solid': {
    zh: '面向 Solid 应用的 YCloud Icons 库包。',
    en: 'YCloud Icons package for Solid applications.',
  },
  '@ycloud-web/icons-react-native': {
    zh: '面向 React Native 应用的 YCloud Icons 库包。',
    en: 'YCloud Icons package for React Native applications.',
  },
  '@ycloud-web/icons-angular': {
    zh: '面向 Angular 应用的 YCloud Icons 库包。',
    en: 'YCloud Icons package for Angular applications.',
  },
  '@ycloud-web/icons-preact': {
    zh: '面向 Preact 应用的 YCloud Icons 库包。',
    en: 'YCloud Icons package for Preact applications.',
  },
  '@ycloud-web/icons-astro': {
    zh: '面向 Astro 应用的 YCloud Icons 库包。',
    en: 'YCloud Icons package for Astro applications.',
  },
  '@ycloud-web/icons-static': {
    zh: 'YCloud Icons 的通用/业务 SVG、Sprite 和字体资源包。',
    en: 'Generic and business SVG, sprite, and icon font assets for YCloud Icons.',
  },
  '@ycloud-web/icons-data': {
    zh: '包含标准化图标节点和元数据的 YCloud Icons 数据包。',
    en: 'YCloud Icons data package with normalized icon nodes and metadata.',
  },
};

export default {
  async load() {
    const packageJsonList = await fetchPackages();

    return {
      packages: packageJsonList
        .filter((pJson) => pJson?.name != null && pJson.name in packageDataList)
        .map((pJson) => {
          const packageData = packageDataList[pJson.name];
          return {
            ...pJson,
            ...packageData,
            description: packageDescriptions[pJson.name]?.zh ?? pJson.description,
            descriptionEn: packageDescriptions[pJson.name]?.en ?? pJson.description,
            documentation:
              packageData.documentation ?? `/guide/${packageData.docsAlias ?? pJson.name}`,
            source: `https://github.com/TianJianJun0727/ycloud-icons/tree/main/${pJson.repository?.directory ?? `packages/${packageData.packageDirname ?? pJson.name}`}`,
            npmUrl: packageData.npmUrl ?? `https://www.npmjs.com/package/${pJson.name}`,
            icon: `/framework-logos/${packageData.icon}.svg`,
            iconDark: Boolean(packageData.iconDark)
              ? `/framework-logos/${packageData.iconDark}.svg`
              : null,
          };
        })
        .filter((pData) => !pData.hide)
        .sort((a, b) => a.order - b.order),
    };
  },
};
