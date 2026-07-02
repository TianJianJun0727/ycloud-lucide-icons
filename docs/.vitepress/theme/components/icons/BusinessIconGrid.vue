<script setup lang="ts">
import type { BusinessIconEntity } from '@theme/types';
import IconAssetGrid from './IconAssetGrid.vue';
import BusinessIconItem from './BusinessIconItem.vue';

defineProps<{
  icons: BusinessIconEntity[];
  activeIcon?: string;
}>();

const emit = defineEmits<{
  select: [icon: BusinessIconEntity];
}>();
</script>

<template>
  <IconAssetGrid
    class="business-icons"
    :icons="icons"
    :itemKey="(icon) => `${icon.category}/${icon.name}`"
  >
    <template #default="{ icon }">
      <BusinessIconItem
        :icon="icon"
        :active="activeIcon === icon.name"
        @select="emit('select', icon)"
      />
    </template>
  </IconAssetGrid>
</template>
