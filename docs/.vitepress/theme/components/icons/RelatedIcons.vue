<script setup lang="ts">
import type { IconMetaData } from '@theme/types';
import IconGrid from './IconGrid.vue';
import { computed } from 'vue';
import { useData } from 'vitepress';
import iconNodes from '@data/iconNodes';
import iconMetaData from '@data/iconMetaData';

const props = defineProps<{
  icons: string[];
}>();

const { page } = useData();
const isEnglish = computed(() => page.value.relativePath?.startsWith?.('en/') ?? false);
const iconsWithNodes = computed(() =>
  props.icons
    .map((name) => {
      const metaData = iconMetaData[name] as IconMetaData | undefined;

      return {
        name,
        displayName: metaData?.name,
        englishName: metaData?.i18n?.en?.name,
        iconNode: iconNodes[name],
      };
    })
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
