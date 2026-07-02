<script setup lang="ts" generic="T extends { name: string }">
defineProps<{
  icons: T[];
  itemKey?: (icon: T) => string;
}>();
</script>

<template>
  <div class="asset-icons">
    <div
      v-for="icon in icons"
      :key="itemKey ? itemKey(icon) : icon.name"
      class="asset-icon"
    >
      <slot :icon="icon" />
    </div>
  </div>
</template>

<style scoped>
.asset-icons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(56px, 1fr));
  gap: 8px;
  width: 100%;
}

.asset-icon {
  aspect-ratio: 1 / 1;
  position: relative;
}
</style>
