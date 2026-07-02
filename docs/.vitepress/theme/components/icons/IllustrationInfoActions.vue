<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
import VPButton from 'vitepress/dist/client/theme-default/components/VPButton.vue';
import { resolveBrowserHref } from '@theme/utils/navigation';
import useConfetti from '@theme/composables/useConfetti';
import ButtonMenu from '../base/ButtonMenu.vue';
import CopySVGButton from './CopySVGButton.vue';

const props = defineProps<{
  name: string;
  componentName: string;
  detailPath: string;
  detailText: string;
  isCurrentDetail?: boolean;
  popoverPosition?: 'top' | 'bottom';
}>();

const { page } = useData();
const isEnglish = computed(() => page.value.relativePath?.startsWith?.('en/') ?? false);
const { animate, confetti } = useConfetti();

function openDetail(event: MouseEvent) {
  event.preventDefault();

  const targetHref = resolveBrowserHref(props.detailPath);
  const currentUrl = new URL(window.location.href);
  const targetUrl = new URL(targetHref, currentUrl.origin);

  if (currentUrl.pathname === targetUrl.pathname) {
    window.location.reload();
    return;
  }

  window.location.assign(targetHref);
}

function copyJSX() {
  const code = `<${props.componentName} width="100%" height="auto" />`;
  confetti();
  void navigator.clipboard.writeText(code).catch(() => {});
}

function copyComponentName() {
  confetti();
  void navigator.clipboard.writeText(props.componentName).catch(() => {});
}

function copyVue() {
  const code = `<${props.componentName} width="100%" height="auto" />`;
  confetti();
  void navigator.clipboard.writeText(code).catch(() => {});
}
</script>

<template>
  <div class="group buttons">
    <VPButton
      v-if="!isCurrentDetail"
      :href="detailPath"
      :text="detailText"
      @click="openDetail"
    />
    <CopySVGButton
      :name="name"
      :popoverPosition="popoverPosition"
    />
    <ButtonMenu
      :buttonClass="`confetti-button ${animate ? 'animate' : ''}`"
      id="copy-illustration-code-button"
      callOptionOnClick
      :data-confetti-text="isEnglish ? 'Copied' : '已复制'"
      :popoverPosition="popoverPosition"
      :options="[
        { text: isEnglish ? 'Copy JSX' : '复制 JSX', onClick: copyJSX },
        { text: isEnglish ? 'Copy component name' : '复制组件名', onClick: copyComponentName },
        { text: isEnglish ? 'Copy Vue' : '复制 Vue', onClick: copyVue },
        { text: isEnglish ? 'Copy Svelte' : '复制 Svelte', onClick: copyJSX },
      ]"
    />
  </div>
</template>

<style src="./confetti.css" />

<style scoped>
.group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.buttons {
  flex: 0 0 auto;
  margin-top: 24px;
}
</style>
