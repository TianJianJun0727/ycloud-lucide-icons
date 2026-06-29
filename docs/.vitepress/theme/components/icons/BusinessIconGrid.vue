<script setup lang="ts">
import type { BusinessIconEntity } from '@theme/types';
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
  <div class="business-icons">
    <div
      v-for="icon in icons"
      :key="`${icon.category}/${icon.name}`"
      class="business-icon"
    >
      <BusinessIconItem
        :icon="icon"
        :active="activeIcon === icon.name"
        @select="emit('select', icon)"
      />
    </div>
  </div>
</template>

<style scoped>
.business-icons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(56px, 1fr));
  gap: 8px;
  width: 100%;
}

.business-icon {
  aspect-ratio: 1 / 1;
  position: relative;
}
</style>
