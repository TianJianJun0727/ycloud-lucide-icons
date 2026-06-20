import { h } from 'vue';
import DefaultTheme from 'vitepress/theme';
import './style.css';
import 'virtual:group-icons.css';
import { Theme } from 'vitepress';
import IconsSidebarNavAfter from './layouts/IconsSidebarNavAfter.vue';
import HomeHeroIconsCard from './components/home/HomeHeroIconsCard.vue';
import HomeHeroAfter from './components/home/HomeHeroAfter.vue';
import HomeHeroInfoBefore from './components/home/HomeHeroInfoBefore.vue';
import { ICON_STYLE_CONTEXT, iconStyleContext } from './composables/useIconStyle';
import { CATEGORY_VIEW_CONTEXT, categoryViewContext } from './composables/useCategoryView';
import FrameworkSelect from './components/guide/FrameworkSelect.vue';
import SnackPlayer from './components/editors/SnackPlayer.vue';

const theme: Partial<Theme> = {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'sidebar-nav-before': () => h(FrameworkSelect, { placement: 'before' }),
      'home-hero-info-before': () => h(HomeHeroInfoBefore),
      'sidebar-nav-after': () => [
        h(FrameworkSelect, { placement: 'after' }),
        h(IconsSidebarNavAfter),
      ],
      'home-hero-image': () => h(HomeHeroIconsCard),
      'home-hero-actions-after': () => h(HomeHeroAfter),
    });
  },
  enhanceApp({ app }) {
    app.provide(ICON_STYLE_CONTEXT, iconStyleContext);
    app.provide(CATEGORY_VIEW_CONTEXT, categoryViewContext);
    app.component('SnackPlayer', SnackPlayer);
  },
};

export default theme;
