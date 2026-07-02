<script setup lang="ts">
import { computed, ref } from 'vue';
import type { BusinessIconCategory, BusinessIconEntity } from '@theme/types';
import InputSearch from '../base/InputSearch.vue';
import Select from '../base/Select.vue';
import StickyBar from './StickyBar.vue';
import BusinessIconGrid from './BusinessIconGrid.vue';
import BusinessIconDetailOverlay from './BusinessIconDetailOverlay.vue';
import NoResults from './NoResults.vue';
import { useData } from 'vitepress';
import useSearch from '@theme/composables/useSearch';
import useSearchInput from '@theme/composables/useSearchInput';
import useSearchShortcut from '@theme/utils/useSearchShortcut';
import useSearchPlaceholder from '@theme/utils/useSearchPlaceholder.ts';
import { Icon } from '@ycloud-web/icons-vue';
import { listSortDescending } from '~/.vitepress/data/iconNodes';

const props = defineProps<{
  icons: BusinessIconEntity[];
  categories: BusinessIconCategory[];
}>();

const { page } = useData();
const isEnglish = computed(() => page.value.relativePath?.startsWith?.('en/') ?? false);
const activeIcon = ref<BusinessIconEntity | null>(null);
const { searchInput, searchQuery, searchQueryDebounced } = useSearchInput();
const { shortcutText: kbdSearchShortcut } = useSearchShortcut(() => {
  searchInput.value?.focus();
});

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

const selectedSort = ref(sortingOptions.value[0]);

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

const searchKeys = computed(() =>
  isEnglish.value
    ? [
        { name: 'displayName', weight: 3 },
        { name: 'englishName', weight: 3 },
        { name: 'componentName', weight: 2 },
        { name: 'englishTags', weight: 2 },
        { name: 'englishUseCases', weight: 1 },
        { name: 'englishCategoryTitle', weight: 1 },
        { name: 'name', weight: 1 },
      ]
    : [
        { name: 'displayName', weight: 3 },
        { name: 'componentName', weight: 2 },
        { name: 'tags', weight: 2 },
        { name: 'useCases', weight: 1 },
        { name: 'categoryTitle', weight: 1 },
        { name: 'name', weight: 1 },
      ],
);

const searchResults = useSearch(searchQueryDebounced, sortedIcons, searchKeys);
const searchPlaceholder = useSearchPlaceholder(searchQuery, searchResults);

const categoryOrder = computed(() => props.categories.map((category) => category.name));
const sortedSearchResults = computed(() => {
  switch (selectedSort.value.value) {
    case 'popularity':
    case 'release-date':
    case 'name':
      return searchResults.value;
    default:
      return [...searchResults.value].sort((left, right) => {
        const order =
          categoryOrder.value.indexOf(left.category) - categoryOrder.value.indexOf(right.category);
        if (order !== 0) return order;
        return left.name.localeCompare(right.name);
      });
  }
});

const activeIconName = computed(() => activeIcon.value?.name ?? '');

const groupedIcons = computed(() =>
  props.categories
    .map((category) => ({
      category,
      icons: sortedSearchResults.value.filter((icon) => icon.category === category.name),
    }))
    .filter((group) => group.icons.length > 0),
);
</script>

<template>
  <div
    class="business-icons-overview"
    :class="{ 'business-icon-drawer-open': activeIconName }"
  >
    <StickyBar>
      <InputSearch
        v-model="searchQuery"
        :placeholder="
          isEnglish
            ? `Search ${icons.length} business icons...`
            : `搜索 ${icons.length} 个业务图标…`
        "
        ref="searchInput"
        :shortcut="kbdSearchShortcut"
        class="input-wrapper"
      />
      <Select
        id="business-sort-select"
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
    <section
      v-else
      v-for="group in groupedIcons"
      :key="group.category.name"
      class="business-category-section"
    >
      <h2
        class="business-category-title"
        :id="group.category.name"
      >
        <a
          class="header-anchor"
          :href="`#${group.category.name}`"
          :aria-label="
            isEnglish
              ? `Permalink to &quot;${group.category.englishTitle}&quot;`
              : `跳转到“${group.category.title}”颜色类型`
          "
          >&ZeroWidthSpace;</a
        >
        {{ isEnglish ? group.category.englishTitle : group.category.title }}
      </h2>
      <BusinessIconGrid
        :icons="group.icons"
        :activeIcon="activeIconName"
        @select="activeIcon = $event"
      />
    </section>
  </div>

  <BusinessIconDetailOverlay
    :icon="activeIcon"
    @close="activeIcon = null"
  />
</template>

<style scoped>
.business-icons-overview {
  width: 100%;
}

.input-wrapper {
  width: 100%;
}

.business-category-section {
  margin-bottom: 8px;
}

.business-category-title {
  margin-bottom: 8px;
  font-size: 19px;
  font-weight: 500;
  padding: 24px 0 8px;
}
</style>
