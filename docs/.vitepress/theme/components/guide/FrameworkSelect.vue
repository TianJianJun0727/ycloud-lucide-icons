<script setup lang="tsx">
import VPSidebarGroup from 'vitepress/dist/client/theme-default/components/VPSidebarGroup.vue';
import sidebar, { guideSidebarTop } from '../../../sidebar';
import { useData, useRoute, useRouter, withBase } from 'vitepress';
import Select from '../base/Select.vue';
import { computed } from 'vue';
import { useLocalStorage } from '@vueuse/core';

type FrameworkItem = {
  name: string;
  icon: string;
  iconDark?: string;
  value: string;
};

const { page, site } = useData();
const route = useRoute();
const router = useRouter();

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

function normalizeRelativePath(relativePath: string) {
  return `/${relativePath.replace(/\/index\.md$/, '/').replace(/\.md$/, '')}`;
}

const normalizedPath = computed(() => {
  if (page.value.relativePath?.startsWith?.('guide/')) {
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

function onSelectFramework(item: FrameworkItem) {
  fallbackFramework.value = item;
  if (item.value !== normalizedPath.value) {
    const likeRoute = normalizedPath.value.replace(selected.value.value, item.value);

    const hasRoute = findSidebarLink(sidebar[item.value] as unknown[] | undefined, likeRoute);

    if (hasRoute) {
      router.go(likeRoute);
      return;
    }

    router.go(item.value);
  }
}
</script>

<template>
  <VPSidebarGroup
    :items="guideSidebarTop"
    v-if="page?.relativePath?.startsWith?.('guide')"
  />
  <div
    class="framework-select"
    v-if="page?.relativePath?.startsWith?.('guide')"
  >
    <label for="framework-select">框架</label>
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
    v-if="
      page?.relativePath?.startsWith?.('guide') &&
      !page?.relativePath?.startsWith?.(selected.value.substring(1))
    "
    :items="sidebar[selected.value]"
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
