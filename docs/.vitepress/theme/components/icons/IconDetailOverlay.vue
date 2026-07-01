<script setup lang="ts">
import type { IconEntity } from '@theme/types';
import { computed } from 'vue';
import { createYCloudIcon } from '@ycloud-web/icons-vue';
import IconButton from '../base/IconButton.vue';
import IconPreview from './IconPreview.vue';
import { x, expand } from '@data/iconNodes';
import { useData, useRouter } from 'vitepress';
import IconInfo from './IconInfo.vue';
import { resolveBrowserHref, resolveRoutePath } from '@theme/utils/navigation';

const props = defineProps<{
  icon: IconEntity | null;
}>();

const { go } = useRouter();
const { page } = useData();
const isEnglish = computed(() => page.value.relativePath?.startsWith?.('en/') ?? false);

const icon = computed(() => props.icon);

const emit = defineEmits(['close']);
const isOpen = computed(() => !!icon.value);

function onClose() {
  emit('close');
}

const CloseIcon = createYCloudIcon('Close', x);
const Expand = createYCloudIcon('Expand', expand);

function openDetailPage(iconName: string) {
  const targetHref = resolveBrowserHref(`${isEnglish.value ? '/en' : ''}/icons/${iconName}`);
  const currentUrl = new URL(window.location.href);
  const targetUrl = new URL(targetHref, currentUrl.origin);

  if (currentUrl.pathname === targetUrl.pathname) {
    window.location.reload();
    return;
  }

  go(resolveRoutePath(targetHref));
}
</script>

<template>
  <Transition
    name="drawer"
    appear
  >
    <div
      class="overlay-container"
      v-if="icon"
    >
      <div class="overlay-panel">
        <nav class="overlay-menu">
          <IconButton @click="openDetailPage(icon.name)">
            <component :is="Expand" />
          </IconButton>
          <IconButton @click="onClose">
            <component :is="CloseIcon" />
          </IconButton>
        </nav>
        <IconPreview
          id="previewer"
          :name="icon.name"
          :iconNode="icon.iconNode"
          customizable
        />
        <IconInfo
          :icon="icon"
          popoverPosition="top"
        />
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
  pointer-events: none;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: flex-end;
  width: auto;
}

@media (min-width: 960px) {
  .overlay-container {
    --left: var(--vp-sidebar-width);
  }
}

@media (min-width: 1440px) {
  .overlay-container {
    --left: calc((100% - (var(--vp-layout-max-width) - 64px)) / 2 + var(--vp-sidebar-width) - 32px);
    --right: calc(((100% - (var(--vp-layout-max-width) - var(--vp-sidebar-width))) - 272px) / 2);
  }
  .overlay-panel {
    border-top-right-radius: 8px;
  }
}

.overlay-panel {
  position: relative;
  width: 100%;
  margin: 0 auto;
  padding: 1rem;
  background-color: var(--vp-c-bg-elv);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  will-change: transform;
  pointer-events: all;
  height: 288px;
  padding: 24px;
  display: flex;
  box-shadow: var(--vp-shadow-5);
}

.icon-info {
  padding-left: 24px;
  flex-basis: 100%;
}

.icon-tags {
  font-size: 16px;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.overlay-menu {
  position: absolute;
  top: 24px;
  right: 24px;
  display: flex;
  gap: 8px;
  align-items: center;
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
</style>
