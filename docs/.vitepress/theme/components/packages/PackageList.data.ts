import packageDataList from '../../../data/packageData.json';
import fetchPackages from '../../../lib/fetchPackages';

const packageDescriptions: Record<string, string> = {
  '@ycloud-web/icons': '面向 Web 和 JavaScript 应用的 YCloud Icons库包。',
  '@ycloud-web/icons-react': '面向 React 应用的 YCloud Icons库包。',
  '@ycloud-web/icons-vue': '面向 Vue 应用的 YCloud Icons库包。',
  '@ycloud-web/icons-svelte': '面向 Svelte 应用的 YCloud Icons库包。',
  '@ycloud-web/icons-solid': '面向 Solid 应用的 YCloud Icons库包。',
  '@ycloud-web/icons-react-native': '面向 React Native 应用的 YCloud Icons库包。',
  '@ycloud-web/icons-angular': '面向 Angular 应用的 YCloud Icons库包。',
  '@ycloud-web/icons-preact': '面向 Preact 应用的 YCloud Icons库包。',
  '@ycloud-web/icons-astro': '面向 Astro 应用的 YCloud Icons库包。',
  '@ycloud-web/icons-static': 'YCloud Icons 的静态 SVG 和字体资源包。',
  '@ycloud-web/icons-data': '包含标准化图标节点和元数据的 YCloud Icons数据包。',
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
            description: packageDescriptions[pJson.name] ?? pJson.description,
            documentation:
              packageData.documentation ?? `/guide/${packageData.docsAlias ?? pJson.name}`,
            source: `https://github.com/TianJianJun0727/ycloud-icons/tree/main/packages/${packageData.packageDirname ?? pJson.name}`,
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
