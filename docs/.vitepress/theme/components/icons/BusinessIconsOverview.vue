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

const props = defineProps<{
  icons: BusinessIconEntity[];
  categories: BusinessIconCategory[];
}>();

const { page } = useData();
const isEnglish = computed(() => page.value.relativePath?.startsWith?.('en/') ?? false);
const searchQuery = ref('');
const activeIcon = ref<BusinessIconEntity | null>(null);

const categoryOptions = computed(() => [
  {
    name: isEnglish.value ? 'All categories' : '全部分类',
    value: 'all',
  },
  ...props.categories.map((category) => ({
    name: isEnglish.value ? category.englishTitle : category.title,
    value: category.name,
  })),
]);

const selectedCategory = ref(categoryOptions.value[0]);

const filteredIcons = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return props.icons.filter((icon) => {
    const matchesCategory =
      selectedCategory.value.value === 'all' || icon.category === selectedCategory.value.value;
    const matchesQuery =
      !query ||
      icon.name.includes(query) ||
      icon.displayName.toLowerCase().includes(query) ||
      icon.category.includes(query) ||
      icon.componentName.toLowerCase().includes(query);

    return matchesCategory && matchesQuery;
  });
});

const activeIconName = computed(() => activeIcon.value?.name ?? '');

const groupedIcons = computed(() =>
  props.categories
    .map((category) => ({
      category,
      icons: filteredIcons.value.filter((icon) => icon.category === category.name),
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
        class="input-wrapper"
      />
      <Select
        id="business-category-select"
        :items="categoryOptions"
        v-model="selectedCategory"
      />
    </StickyBar>

    <NoResults
      v-if="filteredIcons.length === 0"
      :searchQuery="searchQuery"
      :isBrandSearch="false"
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
              : `跳转到“${group.category.title}”分类`
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
