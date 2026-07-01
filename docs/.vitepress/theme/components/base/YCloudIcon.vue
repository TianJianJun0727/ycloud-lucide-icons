<script setup lang="ts">
import { createYCloudIcon } from '@ycloud-web/icons-vue';

export type IconNode = [elementName: string, attrs: Record<string, string>][];

const props = defineProps<{
  name: string;
  tags?: string[];
  categories?: string[];
  // contributors: Contributor[];
  iconNode: IconNode;
}>();

const icon = createYCloudIcon(props.name, props.iconNode);
</script>

<template>
  <component :is="icon" />
</template>
