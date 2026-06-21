import relatedIcons from '../.vitepress/data/relatedIcons.json';
import * as iconDetails from '../.vitepress/data/iconDetails';
import { IconEntity } from '../.vitepress/theme/types';

export default {
  paths: async () => {
    return (Object.values(iconDetails) as unknown as IconEntity[]).map((iconEntity) => {
      const params = {
        ...iconEntity,
        relatedIcons: relatedIcons[iconEntity.name] ?? [],
      };

      return {
        params,
      };
    });
  },
};
