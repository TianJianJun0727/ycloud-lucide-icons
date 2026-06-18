<script setup lang="ts">
import type { IconEntity } from '../../types';
import IconGrid from './IconGrid.vue';

defineProps<{
  icons: IconEntity[];
}>();
</script>

<template>
  <section class="related-icons">
    <h2 class="title">相关图标</h2>
    <IconGrid :icons="icons" />
  </section>
</template>

<style scoped>
.related-icons {
  margin-bottom: 32px;
}
</style>
