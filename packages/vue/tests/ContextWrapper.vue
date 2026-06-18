<script setup lang="ts">
import { setYCloudIconsProps } from '../src/context';
import { House } from '../src/ycloud-vue';

const props = defineProps<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}>();

setYCloudIconsProps({
  size: 48,
  color: 'red',
  strokeWidth: 4,
  class: 'provider-class',
});
</script>

<template>
  <House v-bind="props" />
</template>
