<script setup lang="ts">
import { withBase } from 'vitepress';

const { item } = defineProps<{
  item: {
    name: string;
    icon?: string;
    iconDark?: string;
  };
}>();
</script>

<template>
  <div v-if="item.icon || item.iconDark">
    <img
      v-if="item.icon"
      :src="withBase(item.icon)"
      :class="{ 'select-item-icon': true, light: item.iconDark }"
      :alt="`${item.name} logo`"
      loading="lazy"
    />
    <img
      v-if="item.iconDark"
      :src="withBase(item.iconDark)"
      :alt="`${item.name} logo`"
      class="select-item-icon dark"
    />
  </div>
</template>

<style scoped>
.select-item-icon {
  object-fit: contain;
  width: 24px;
  height: 24px;
}

html.dark .select-item-icon.light {
  display: none;
}

html:not(.dark) .select-item-icon.dark {
  display: none;
}
</style>
