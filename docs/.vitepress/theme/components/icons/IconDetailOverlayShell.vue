<script setup lang="ts">
import { createYCloudIcon } from '@ycloud-web/icons-vue';
import { x } from '@data/iconNodes';
import IconButton from '../base/IconButton.vue';

withDefaults(defineProps<{
  open: boolean;
  layout?: 'sidebar' | 'page';
}>(), {
  layout: 'sidebar',
});

const emit = defineEmits<{
  close: [];
}>();

const CloseIcon = createYCloudIcon('Close', x);
</script>

<template>
  <Transition
    name="drawer"
    appear
  >
    <div
      v-if="open"
      class="overlay-container"
      :class="`overlay-container-${layout}`"
    >
      <div class="overlay-panel">
        <nav class="overlay-menu">
          <IconButton @click="emit('close')">
            <component :is="CloseIcon" />
          </IconButton>
        </nav>
        <slot />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.overlay-container {
  position: fixed;
  top: 0;
  left: var(--left, 0);
  right: var(--right, 0);
  bottom: 0;
  z-index: 40;
  pointer-events: none;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: flex-end;
  width: auto;
}

@media (min-width: 960px) {
  .overlay-container-sidebar {
    --left: calc(var(--vp-sidebar-width) + 32px);
    --right: 32px;
  }
}

@media (min-width: 1440px) {
  .overlay-container-sidebar {
    --left: calc((100% - (var(--vp-layout-max-width) - 64px)) / 2 + var(--vp-sidebar-width));
    --right: calc((100% - var(--vp-layout-max-width)) / 2 + 32px);
  }

  .overlay-container-page {
    --left: calc((100% - (var(--vp-layout-max-width) - 64px)) / 2);
    --right: calc((100% - (var(--vp-layout-max-width) - 64px)) / 2);
  }

  .overlay-panel {
    border-top-right-radius: 8px;
  }
}

.overlay-panel {
  position: relative;
  width: 100%;
  margin: 0 auto;
  height: 288px;
  padding: 24px;
  display: flex;
  gap: 24px;
  background-color: var(--vp-c-bg-elv);
  box-shadow: var(--vp-shadow-5);
  will-change: transform;
  pointer-events: all;
  overflow: hidden;
}

.overlay-menu {
  position: absolute;
  top: 24px;
  right: 24px;
  display: flex;
  gap: 8px;
  align-items: center;
}

:deep(.icon-info),
:deep(.business-icon-info),
:deep(.illustration-info) {
  height: 100%;
  flex: 1 1 auto;
  min-width: 0;
  padding-right: 56px;
}

.drawer-enter-active {
  transition:
    opacity 0.5s,
    transform 0.25s ease;
}

.drawer-leave-active {
  transition:
    opacity 0.25s ease,
    transform 1.6s ease-out;
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@media (max-width: 639px) {
  .overlay-panel {
    display: block;
    height: auto;
  }

  :deep(.icon-info),
  :deep(.business-icon-info),
  :deep(.illustration-info) {
    padding-right: 0;
  }
}
</style>
