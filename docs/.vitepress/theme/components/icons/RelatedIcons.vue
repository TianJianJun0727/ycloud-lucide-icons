<script setup lang="ts">
import type { IconEntity } from '@theme/types';
import IconGrid from './IconGrid.vue';
import { computed } from 'vue';
import { useData } from 'vitepress';
import iconNodes from '@data/iconNodes';

const props = defineProps<{
  icons: IconEntity[];
}>();

const { page } = useData();
const isEnglish = computed(() => page.value.relativePath?.startsWith?.('en/') ?? false);
const iconsWithNodes = computed(() =>
  props.icons
    .map((icon) => ({
      ...icon,
      iconNode: icon.iconNode ?? iconNodes[icon.name],
    }))
    .filter((icon) => icon.iconNode),
);
</script>

<template>
  <section class="related-icons">
    <h2 class="title">{{ isEnglish ? 'Related icons' : '相关图标' }}</h2>
    <IconGrid :icons="iconsWithNodes" />
  </section>
</template>

<style scoped>
.related-icons {
  margin-bottom: 32px;
}
</style>
