import relatedIcons from '../.vitepress/data/relatedIcons.json';
import iconNodes from '../.vitepress/data/iconNodes';
import * as iconDetails from '../.vitepress/data/iconDetails';
import { IconEntity } from '../.vitepress/theme/types';

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
            i18n: relatedIcon?.i18n,
            iconNode: iconNodes[name],
          };
        }),
      };

      return {
        params,
      };
    });
  },
};
