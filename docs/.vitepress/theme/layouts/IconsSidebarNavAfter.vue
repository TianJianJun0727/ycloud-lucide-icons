<script setup>
import { useData } from 'vitepress';
import { computed } from 'vue';

import CategoryList from '../components/icons/CategoryList.vue';
import BusinessCategoryList from '../components/icons/BusinessCategoryList.vue';
import SidebarIconCustomizer from '../components/icons/SidebarIconCustomizer.vue';

const { page } = useData();

const isIconsPage = computed(() => {
  const relativePath = page.value?.relativePath ?? '';

  return relativePath.startsWith('icons/') || relativePath.startsWith('en/icons/');
});

const isBusinessIconsPage = computed(() => {
  const relativePath = page.value?.relativePath ?? '';

  return (
    relativePath.startsWith('business-icons/') || relativePath.startsWith('en/business-icons/')
  );
});

</script>

<template>
  <div>
    <SidebarIconCustomizer
      v-if="isIconsPage"
      mode="icon"
    />
    <SidebarIconCustomizer
      v-if="isBusinessIconsPage"
      mode="business"
    />
    <CategoryList v-if="isIconsPage" />
    <BusinessCategoryList v-if="isBusinessIconsPage" />
  </div>
</template>
