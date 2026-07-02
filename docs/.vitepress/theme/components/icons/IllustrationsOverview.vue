<script setup lang="ts">
import { computed, ref } from 'vue';
import { useData } from 'vitepress';
import type { IllustrationEntity } from '@theme/types';
import { Icon } from '@ycloud-web/icons-vue';
import { listSortDescending } from '~/.vitepress/data/iconNodes';
import useSearch from '@theme/composables/useSearch';
import useSearchInput from '@theme/composables/useSearchInput';
import useSearchShortcut from '@theme/utils/useSearchShortcut';
import useSearchPlaceholder from '@theme/utils/useSearchPlaceholder.ts';
import InputSearch from '../base/InputSearch.vue';
import Select from '../base/Select.vue';
import StickyBar from './StickyBar.vue';
import NoResults from './NoResults.vue';
import IllustrationGrid from './IllustrationGrid.vue';
import IllustrationDetailOverlay from './IllustrationDetailOverlay.vue';

const props = defineProps<{
  illustrations: IllustrationEntity[];
}>();

const { page } = useData();
const isEnglish = computed(() => page.value.relativePath?.startsWith?.('en/') ?? false);
const activeIllustration = ref<IllustrationEntity | null>(null);
const activeIllustrationName = computed(() => activeIllustration.value?.name ?? '');
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

const sortedIllustrations = computed(() => {
  switch (selectedSort.value.value) {
    case 'popularity':
      return [...props.illustrations].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    case 'release-date':
      return [...props.illustrations].sort((a, b) => {
        const aDate = a.createdRelease?.date ? new Date(a.createdRelease.date).getTime() : 0;
        const bDate = b.createdRelease?.date ? new Date(b.createdRelease.date).getTime() : 0;
        return bDate - aDate;
      });
    case 'name':
      return [...props.illustrations].sort((a, b) => a.name.localeCompare(b.name));
    default:
      return props.illustrations;
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
        { name: 'name', weight: 1 },
      ]
    : [
        { name: 'displayName', weight: 3 },
        { name: 'componentName', weight: 2 },
        { name: 'tags', weight: 2 },
        { name: 'useCases', weight: 1 },
        { name: 'name', weight: 1 },
      ],
);
const searchResults = useSearch(searchQueryDebounced, sortedIllustrations, searchKeys);
const searchPlaceholder = useSearchPlaceholder(searchQuery, searchResults);
</script>

<template>
  <div
    class="illustrations-overview"
    :class="{ 'illustration-drawer-open': activeIllustrationName }"
  >
    <StickyBar>
      <InputSearch
        v-model="searchQuery"
        :placeholder="
          isEnglish
            ? `Search ${illustrations.length} illustrations...`
            : `搜索 ${illustrations.length} 个插画…`
        "
        ref="searchInput"
        :shortcut="kbdSearchShortcut"
        class="input-wrapper"
      />
      <Select
        id="illustration-sort-select"
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
    <IllustrationGrid
      v-else
      :illustrations="searchResults"
      :activeIllustration="activeIllustrationName"
      @select="activeIllustration = $event"
    />
  </div>

  <IllustrationDetailOverlay
    :illustration="activeIllustration"
    @close="activeIllustration = null"
  />
</template>

<style scoped>
.illustrations-overview {
  width: 100%;
  max-width: calc(var(--vp-layout-max-width) - 64px);
  margin: 0 auto;
}

.input-wrapper {
  width: 100%;
}
</style>
