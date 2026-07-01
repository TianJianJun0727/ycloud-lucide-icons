<script setup lang="ts">
import { ref, computed, defineAsyncComponent, onMounted, watch } from 'vue';
import type { IconEntity } from '@theme/types';
import { useElementSize, useEventListener, useVirtualList } from '@vueuse/core';
import { useData, useRoute, withBase } from 'vitepress';
import IconGrid from './IconGrid.vue';
import Select from '../base/Select.vue';
import InputSearch from '../base/InputSearch.vue';
import useSearch from '@theme/composables/useSearch';
import useSearchInput from '@theme/composables/useSearchInput';
import useSearchShortcut from '@theme/utils/useSearchShortcut';
import StickyBar from './StickyBar.vue';
import useFetchTags from '@theme/composables/useFetchTags';
import useFetchCategories from '@theme/composables/useFetchCategories';
import chunkArray from '@theme/utils/chunkArray';
import useSearchPlaceholder from '@theme/utils/useSearchPlaceholder.ts';
import { Icon } from '@ycloud-web/icons-vue';
import { listSortDescending } from '~/.vitepress/data/iconNodes';

const ICON_SIZE = 56;
const ICON_GRID_GAP = 8;
const { page } = useData();
const isEnglish = computed(() => page.value.relativePath?.startsWith?.('en/') ?? false);

const sortingOptions = computed(() => [
  {
    name: isEnglish.value ? 'Popularity' : '热度',
    value: 'popularity',
  },
  {
    name: isEnglish.value ? 'Release date' : '发布日期',
    value: 'release-date',
  },
  {
    name: isEnglish.value ? 'Name' : '名称',
    value: 'name',
  },
]);

const initialGridItems = computed(() => {
  if (containerWidth.value === 0) return 120;

  const itemsPerRow = columnSize.value || 10;
  const visibleRows = Math.ceil(window.innerHeight / (ICON_SIZE + ICON_GRID_GAP));

  return Math.min(itemsPerRow * (visibleRows + 2), 200);
});

const props = defineProps<{
  icons: IconEntity[];
}>();

const activeIcon = ref<IconEntity | null>(null);
const activeIconName = computed(() => activeIcon.value?.name ?? '');
const selectedSort = ref(sortingOptions.value[0]);

const { execute: fetchTags, data: tags } = useFetchTags();
const { execute: fetchCategories, data: categories } = useFetchCategories();

const overviewEl = ref<HTMLElement | null>(null);
const { width: containerWidth } = useElementSize(overviewEl);

const columnSize = computed(() => {
  return Math.floor(containerWidth.value / (ICON_SIZE + ICON_GRID_GAP));
});

const sortedIcons = computed(() => {
  switch (selectedSort.value.value) {
    case 'popularity':
      return [...props.icons].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    case 'release-date':
      return [...props.icons].sort((a, b) => {
        const aDate = a.createdRelease?.date ? new Date(a.createdRelease.date).getTime() : 0;
        const bDate = b.createdRelease?.date ? new Date(b.createdRelease.date).getTime() : 0;
        return bDate - aDate;
      });
    case 'name':
      return [...props.icons].sort((a, b) => a.name.localeCompare(b.name));
    default:
      return props.icons;
  }
});

const mappedIcons = computed(() => {
  return sortedIcons.value.map((icon) => {
    const iconTags = tags.value?.[icon.name] ?? icon.tags ?? [];
    const iconCategories = categories.value?.[icon.name] ?? [];

    return {
      ...icon,
      tags: iconTags,
      categories: iconCategories,
    };
  });
});

const { searchInput, searchQuery, searchQueryDebounced } = useSearchInput();

const { shortcutText: kbdSearchShortcut } = useSearchShortcut(() => {
  searchInput.value?.focus();
});

const searchKeys = computed(() =>
  isEnglish.value
    ? [
        { name: 'displayName', weight: 3 },
        { name: 'aliases', weight: 8 },
        { name: 'displayTags', weight: 2 },
        { name: 'displayCategories', weight: 1 },
      ]
    : [
        { name: 'displayName', weight: 3 },
        { name: 'displayTags', weight: 2 },
        { name: 'displayCategories', weight: 1 },
      ],
);

const searchResults = useSearch(searchQueryDebounced, mappedIcons, searchKeys);

const searchPlaceholder = useSearchPlaceholder(searchQuery, searchResults);

const chunkedIcons = computed(() => {
  return chunkArray(searchResults.value, columnSize.value);
});

const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(chunkedIcons, {
  itemHeight: ICON_SIZE + ICON_GRID_GAP,
  overscan: 10,
});

onMounted(() => {
  containerProps.ref.value = document.documentElement;
  useEventListener(window, 'scroll', containerProps.onScroll);

  // Check if we should focus the search input from URL parameter
  const route = useRoute();
  if (route.data?.relativePath && window.location.search.includes('focus')) {
    searchInput.value?.focus();
  }
});

function setActiveIcon(icon: IconEntity) {
  activeIcon.value = icon;
}

function onFocusSearchInput() {
  if (tags.value == null) {
    fetchTags();
  }
  if (categories.value == null) {
    fetchCategories();
  }
}

const NoResults = defineAsyncComponent(() => import('./NoResults.vue'));

const IconDetailOverlay = defineAsyncComponent(() => import('./IconDetailOverlay.vue'));

watch(searchQueryDebounced, () => {
  scrollTo(0);
});

function handleCloseDrawer() {
  activeIcon.value = null;

  const url = new URL(window.location);
  url.pathname = withBase(isEnglish.value ? '/en/icons/' : '/icons/');

  if (searchQueryDebounced.value) {
    url.searchParams.set('search', searchQueryDebounced.value);
  }

  window.history.pushState({}, '', url);
}
</script>

<template>
  <div
    ref="overviewEl"
    class="overview-container"
    :class="{ 'icon-drawer-open': activeIconName }"
  >
    <StickyBar>
      <InputSearch
        :placeholder="
          isEnglish ? `Search ${icons.length} icons...` : `搜索 ${icons.length} 个图标…`
        "
        v-model="searchQuery"
        ref="searchInput"
        :shortcut="kbdSearchShortcut"
        class="input-wrapper"
        @focus="onFocusSearchInput"
      />

      <Select
        id="sort-select"
        :items="sortingOptions"
        v-model="selectedSort"
      >
        <template #start-icon>
          <Icon
            :iconNode="listSortDescending"
            class="chevron-icon"
            aria-hidden="true"
          />
        </template>
      </Select>
    </StickyBar>
    <NoResults
      v-if="searchPlaceholder.isNoResults"
      :searchQuery="searchPlaceholder.query"
      :isBrandSearch="searchPlaceholder.isBrand"
      @clear="searchQuery = ''"
    />
    <IconGrid
      v-else-if="list.length === 0"
      overlayMode
      :icons="searchResults.slice(0, initialGridItems)"
      :activeIcon="activeIconName"
      @setActiveIcon="setActiveIcon"
    />
    <div
      v-bind="wrapperProps"
      class="icon"
      v-else
    >
      <IconGrid
        v-for="{ index, data: icons } in list"
        :key="index"
        overlayMode
        :icons="icons"
        :activeIcon="activeIconName"
        @setActiveIcon="setActiveIcon"
      />
    </div>
  </div>

  <IconDetailOverlay
    :icon="activeIcon"
    @close="handleCloseDrawer"
  />
</template>

<style>
.icons {
  margin-bottom: 8px;
}

.icon {
  aspect-ratio: 1/1;
}

.input-wrapper {
  width: 100%;
  /* view-transition-name: icons-search-box; */
}
</style>
