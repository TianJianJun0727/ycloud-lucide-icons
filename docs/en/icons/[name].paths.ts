import relatedIcons from '../../.vitepress/data/relatedIcons.json';
import * as iconDetails from '../../.vitepress/data/iconDetails';
import { IconEntity } from '../../.vitepress/theme/types';

export default {
  paths: async () => {
    const iconDetailsByName = Object.fromEntries(
      (Object.values(iconDetails) as unknown as IconEntity[]).map((iconEntity) => [
        iconEntity.name,
        iconEntity,
      ]),
    );

    return (Object.values(iconDetails) as unknown as IconEntity[]).map((iconEntity) => {
      const params = {
        ...iconEntity,
        relatedIcons: relatedIcons[iconEntity.name].map((name: string) => {
          const relatedIcon = iconDetailsByName[name];

          return {
            name,
            displayName: relatedIcon?.displayName,
            englishName: relatedIcon?.englishName,
            englishTags: relatedIcon?.englishTags,
            englishCategories: relatedIcon?.englishCategories,
            i18n: relatedIcon?.i18n,
          };
        }),
      };

      return {
        params,
      };
    });
  },
};
