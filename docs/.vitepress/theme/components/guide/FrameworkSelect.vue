<script setup lang="tsx">
import VPSidebarGroup from 'vitepress/dist/client/theme-default/components/VPSidebarGroup.vue';
import { createGuideSidebarTop, type DocsLocale } from '~/.vitepress/sidebar';
import { useData, useRoute, useRouter } from 'vitepress';
import Select from '../base/Select.vue';
import { computed } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { resolveRoutePath } from '@theme/utils/navigation';

type FrameworkItem = {
  name: string;
  icon: string;
  iconDark?: string;
  value: string;
};

const { page, site } = useData();
const route = useRoute();
const router = useRouter();
const props = withDefaults(defineProps<{ placement?: 'before' | 'after' }>(), {
  placement: 'before',
});

const frameworks: FrameworkItem[] = [
  { name: 'Vanilla', icon: '/framework-logos/js.svg', value: '/guide/ycloud/' },
  { name: 'React', icon: '/framework-logos/react.svg', value: '/guide/react/' },
  { name: 'Vue', icon: '/framework-logos/vue.svg', value: '/guide/vue/' },
  { name: 'Svelte', icon: '/framework-logos/svelte.svg', value: '/guide/svelte/' },
  { name: 'Solid', icon: '/framework-logos/solid.svg', value: '/guide/solid/' },
  { name: 'Angular', icon: '/framework-logos/angular.svg', value: '/guide/angular/' },
  { name: 'Preact', icon: '/framework-logos/preact.svg', value: '/guide/preact/' },
  {
    name: 'React Native',
    icon: '/framework-logos/react-native.svg',
    value: '/guide/react-native/',
  },
  {
    name: 'Astro',
    icon: '/framework-logos/astro.svg',
    iconDark: '/framework-logos/astro-dark.svg',
    value: '/guide/astro/',
  },
  { name: 'Static', icon: '/framework-logos/svg.svg', value: '/guide/static/' },
];

const fallbackFramework = useLocalStorage('ycloud-docs-fallback-framework', frameworks[1]);

const currentLocale = computed<DocsLocale>(() =>
  page.value.relativePath?.startsWith?.('en/') ? 'en' : 'zh',
);

const currentLocalePrefix = computed(() => (currentLocale.value === 'en' ? '/en' : ''));

const currentGuideSidebarTop = computed(() => createGuideSidebarTop(currentLocale.value));

function normalizeRelativePath(relativePath: string) {
  const normalized = `/${relativePath.replace(/\/index\.md$/, '/').replace(/\.md$/, '')}`;
  return normalized.replace(/^\/en(?=\/|$)/, '');
}

const normalizedPath = computed(() => {
  if (
    page.value.relativePath?.startsWith?.('guide/') ||
    page.value.relativePath?.startsWith?.('en/guide/')
  ) {
    return normalizeRelativePath(page.value.relativePath);
  }

  const path = route.path ?? '/';
  const base = site.value.base ?? '/';

  if (base !== '/' && path.startsWith(base)) {
    return `/${path.slice(base.length).replace(/^\/+/, '')}`;
  }

  return path;
});

function findSidebarLink(items: unknown[] | undefined, link: string): boolean {
  return Boolean(
    items?.some((item) => {
      const sidebarItem = item as { link?: string; items?: unknown[] };
      return sidebarItem.link === link || findSidebarLink(sidebarItem.items, link);
    }),
  );
}

const selected = computed<FrameworkItem>({
  get() {
    const current = frameworks.find(({ value }) => normalizedPath.value.startsWith(value));

    return current || (fallbackFramework.value?.value ? fallbackFramework.value : frameworks[0]);
  },
  set(item) {
    onSelectFramework(item);
  },
});

const isFrameworkGuidePage = computed(() =>
  frameworks.some(({ value }) => normalizedPath.value.startsWith(value)),
);

const isGuidePage = computed(() => normalizedPath.value === '/guide/' || normalizedPath.value.startsWith('/guide/'));

const selectedFrameworkSidebar = computed(
  () => site.value.themeConfig.sidebar?.[`${currentLocalePrefix.value}${selected.value.value}`],
);

const showBeforeGuideNavigation = computed(() => props.placement === 'before' && isFrameworkGuidePage.value);
const showAfterGuideNavigation = computed(
  () => props.placement === 'after' && isGuidePage.value && !isFrameworkGuidePage.value,
);

function onSelectFramework(item: FrameworkItem) {
  fallbackFramework.value = item;
  if (item.value !== normalizedPath.value) {
    const likeRoute = normalizedPath.value.replace(selected.value.value, item.value);
    const localizedLikeRoute = `${currentLocalePrefix.value}${likeRoute}`;
    const localizedFallbackRoute = `${currentLocalePrefix.value}${item.value}`;

    const hasRoute = findSidebarLink(site.value.themeConfig.sidebar?.[localizedFallbackRoute], localizedLikeRoute);

    if (hasRoute) {
      router.go(resolveRoutePath(localizedLikeRoute));
      return;
    }

    router.go(resolveRoutePath(localizedFallbackRoute));
  }
}
</script>

<template>
  <VPSidebarGroup
    :items="currentGuideSidebarTop"
    v-if="showBeforeGuideNavigation"
  />
  <div
    class="framework-select"
    v-if="showBeforeGuideNavigation || showAfterGuideNavigation"
  >
    <label for="framework-select">{{ currentLocale === 'zh' ? '框架' : 'Framework' }}</label>
    <Select
      id="framework-select"
      :key="selected.value"
      :items="frameworks"
      @update:model-value="onSelectFramework"
      v-model="selected"
    />
  </div>
  <VPSidebarGroup
    :key="selected.value"
    v-if="showAfterGuideNavigation"
    :items="selectedFrameworkSidebar"
  />
</template>

<style scoped>
.framework-select {
  font-size: 12px;
  transition:
    border-color 0.5s,
    background-color 0.5s ease;
  margin-bottom: 10px;
  position: sticky;
  top: -0.5px;
  z-index: 10;
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 10px;
  margin-top: -10px;
}

label {
  color: var(--vp-c-text-1);
  padding: 4px 0;
  line-height: 24px;
  font-size: 14px;
  transition: color 0.25s;
  font-weight: bold;
  margin-bottom: 4px;
  display: block;
  position: relative;
}

.framework-select:before {
  content: ' ';
  position: absolute;
  inset: 0 -16px -24px;
  background: color-mix(in srgb, var(--vp-c-bg-alt), transparent 50%);
  backdrop-filter: blur(4px);
  mask-image: linear-gradient(to bottom, black calc(100% - 16px), transparent 100%);
}
</style>
