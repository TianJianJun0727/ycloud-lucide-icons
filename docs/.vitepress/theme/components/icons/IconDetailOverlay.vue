<script setup lang="ts">
import type { IconEntity } from '@theme/types';
import { computed } from 'vue';
import IconPreview from './IconPreview.vue';
import IconDetailOverlayShell from './IconDetailOverlayShell.vue';
import IconInfo from './IconInfo.vue';

const props = defineProps<{
  icon: IconEntity | null;
}>();

const icon = computed(() => props.icon);

const emit = defineEmits(['close']);
</script>

<template>
  <IconDetailOverlayShell
    :open="!!icon"
    @close="emit('close')"
  >
    <IconPreview
      v-if="icon"
      id="previewer"
      :name="icon.name"
      :iconNode="icon.iconNode"
      customizable
    />
    <IconInfo
      v-if="icon"
      :icon="icon"
      popoverPosition="top"
    />
  </IconDetailOverlayShell>
</template>
