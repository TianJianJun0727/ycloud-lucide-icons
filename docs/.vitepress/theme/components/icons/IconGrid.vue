<script setup lang="ts">
import type { IconEntity } from '@theme/types';
import IconAssetGrid from './IconAssetGrid.vue';
import IconItem from './IconItem.vue';

const emit = defineEmits(['setActiveIcon']);

defineProps<{
  icons: IconEntity[];
  activeIcon?: string;
  overlayMode?: boolean;
  hideIcons?: boolean;
}>();

function setActiveIcon(icon: IconEntity) {
  emit('setActiveIcon', icon);
}
</script>

<template>
  <IconAssetGrid
    class="icons"
    :icons="icons"
  >
    <template #default="{ icon }">
      <IconItem
        :iconNode="icon.iconNode"
        :name="icon.name"
        :displayName="icon.displayName"
        @setActiveIcon="setActiveIcon(icon)"
        :active="activeIcon === icon.name"
        customizable
        :overlayMode="overlayMode"
        :hideIcon="hideIcons"
      />
    </template>
  </IconAssetGrid>
</template>

<style>
.icon {
  aspect-ratio: 1/1;
}
</style>
