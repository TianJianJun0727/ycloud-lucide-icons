import * as iconDetails from '../.vitepress/data/iconDetails';

export default {
  async load() {
    return {
      icons: Object.entries(iconDetails).map(
        ([
          ,
          {
            name,
            displayName,
            englishName,
            tags,
            displayTags,
            englishTags,
            useCases,
            displayUseCases,
            englishUseCases,
            categories,
            displayCategories,
            englishCategories,
            iconNode,
            popularity,
            createdRelease,
          },
        ]) => ({
          name,
          displayName,
          englishName,
          tags,
          displayTags,
          englishTags,
          useCases,
          displayUseCases,
          englishUseCases,
          categories,
          displayCategories,
          englishCategories,
          iconNode,
          popularity: popularity?.count ?? 0,
          createdRelease,
        }),
      ),
    };
  },
};
