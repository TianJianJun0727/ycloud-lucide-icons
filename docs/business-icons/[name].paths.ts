import businessIconsData from './business-icons.data';
import type { BusinessIconEntity } from '../.vitepress/theme/types';

export default {
  paths: async () => {
    const { icons } = (await businessIconsData.load()) as { icons: BusinessIconEntity[] };

    return icons.map((icon) => ({
      params: icon,
    }));
  },
};
