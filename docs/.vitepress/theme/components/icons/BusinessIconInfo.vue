<script setup lang="ts">
import { computed, ref } from 'vue';
import { useData } from 'vitepress';
import VPButton from 'vitepress/dist/client/theme-default/components/VPButton.vue';
import type { BusinessIconEntity } from '@theme/types';
import { useIconStyleContext } from '@theme/composables/useIconStyle';
import { resolveBrowserHref } from '@theme/utils/navigation';
import useConfetti from '@theme/composables/useConfetti';
import downloadData from '@theme/utils/downloadData';
import Badge from '../base/Badge.vue';
import ButtonMenu from '../base/ButtonMenu.vue';
import IconDetailName from './IconDetailName.vue';

const props = defineProps<{
  icon: BusinessIconEntity;
  popoverPosition?: 'top' | 'bottom';
}>();

const { page } = useData();
const isEnglish = computed(() => page.value.relativePath?.startsWith?.('en/') ?? false);
const { size, color } = useIconStyleContext();
const { animate, confetti } = useConfetti();
const copiedText = computed(() => (isEnglish.value ? 'Copied' : '已复制'));
const downloadText = computed(() => (isEnglish.value ? 'Downloaded' : '已下载'));
const confettiText = ref(copiedText.value);

const detailPath = computed(
  () => `${isEnglish.value ? '/en' : ''}/business-icons/${props.icon.name}`,
);
const isCurrentDetail = computed(() => {
  const relativePath = page.value.relativePath;
  return (
    relativePath?.startsWith?.(`business-icons/${props.icon.name}`) ||
    relativePath?.startsWith?.(`en/business-icons/${props.icon.name}`)
  );
});

const svgFileName = computed(() => props.icon.path.split('/').at(-1) ?? `${props.icon.name}.svg`);

function getCustomizedSvg() {
  const parser = new DOMParser();
  const document = parser.parseFromString(props.icon.svg, 'image/svg+xml');
  const svg = document.documentElement;
  const normalizedSize = String(size.value || 24);
  const normalizedColor = color.value || 'currentColor';

  svg.setAttribute('width', normalizedSize);
  svg.setAttribute('height', normalizedSize);

  if (normalizedColor !== 'currentColor') {
    svg.querySelectorAll('[fill="currentColor"]').forEach((node) => {
      node.setAttribute('fill', normalizedColor);
    });
    svg.querySelectorAll('[stroke="currentColor"]').forEach((node) => {
      node.setAttribute('stroke', normalizedColor);
    });
  }

  return new XMLSerializer().serializeToString(svg);
}

function copySvg() {
  confettiText.value = copiedText.value;
  navigator.clipboard.writeText(getCustomizedSvg());
  confetti();
}

function copyDataUri() {
  confettiText.value = copiedText.value;
  navigator.clipboard.writeText(
    `data:image/svg+xml;utf8,${encodeURIComponent(getCustomizedSvg())}`,
  );
  confetti();
}

function downloadSvg() {
  confettiText.value = downloadText.value;
  downloadData(
    svgFileName.value,
    `data:image/svg+xml;utf8,${encodeURIComponent(getCustomizedSvg())}`,
  );
  confetti();
}

function downloadPng() {
  confettiText.value = downloadText.value;
  const svgString = getCustomizedSvg();
  const normalizedSize = Number(size.value || 24);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const image = new Image();

  canvas.width = normalizedSize;
  canvas.height = normalizedSize;
  image.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`;
  image.onload = function () {
    ctx?.drawImage(image, 0, 0);
    downloadData(svgFileName.value.replace(/\.svg$/, '.png'), canvas.toDataURL('image/png'));
    confetti();
  };
}

function copyJSX() {
  const attrs = [''];

  if (size.value && size.value !== 24) {
    attrs.push(`size={${size.value}}`);
  }

  if (color.value && color.value !== 'currentColor') {
    attrs.push(`style={{ color: '${color.value}' }}`);
  }

  navigator.clipboard.writeText(`<${props.icon.componentName}${attrs.join(' ')} />`);
}

function copyVue() {
  const attrs = [''];

  if (size.value && size.value !== 24) {
    attrs.push(`:size="${size.value}"`);
  }

  if (color.value && color.value !== 'currentColor') {
    attrs.push(`:style="{ color: '${color.value}' }"`);
  }

  navigator.clipboard.writeText(`<${props.icon.componentName}${attrs.join(' ')} />`);
}

function copySvelte() {
  const attrs = [''];

  if (size.value && size.value !== 24) {
    attrs.push(`size={${size.value}}`);
  }

  if (color.value && color.value !== 'currentColor') {
    attrs.push(`style="color: ${color.value}"`);
  }

  navigator.clipboard.writeText(`<${props.icon.componentName}${attrs.join(' ')} />`);
}

function copyAngular() {
  const attrs = [''];

  if (size.value && size.value !== 24) {
    attrs.push(`[size]="${size.value}"`);
  }

  if (color.value && color.value !== 'currentColor') {
    attrs.push(`[style.color]="'${color.value}'"`);
  }

  navigator.clipboard.writeText(`<${props.icon.componentName}${attrs.join(' ')} />`);
}

function copyComponentName() {
  navigator.clipboard.writeText(props.icon.componentName);
}

function openDetail(event: MouseEvent) {
  event.preventDefault();

  const targetHref = resolveBrowserHref(detailPath.value);
  const currentUrl = new URL(window.location.href);
  const targetUrl = new URL(targetHref, currentUrl.origin);

  if (currentUrl.pathname === targetUrl.pathname) {
    window.location.reload();
    return;
  }

  window.location.assign(targetHref);
}
</script>

<template>
  <div class="business-icon-info">
    <div class="business-icon-name-wrapper">
      <IconDetailName class="business-icon-name">
        {{ icon.displayName }}
      </IconDetailName>
    </div>

    <div class="business-icon-description">
      {{ isEnglish ? 'Business-specific SVG icon' : '业务专有 SVG 图标' }}
    </div>

    <div class="group">
      <Badge :href="`${isEnglish ? '/en' : ''}/business-icons/#${icon.category}`">
        {{ isEnglish ? icon.englishCategoryTitle : icon.categoryTitle }}
      </Badge>
      <Badge :title="isEnglish ? 'Component export name' : '组件导出名'">
        {{ icon.componentName }}
      </Badge>
    </div>

    <div class="group buttons">
      <VPButton
        v-if="!isCurrentDetail"
        :href="detailPath"
        :text="isEnglish ? 'See details' : '查看详情'"
        @click="openDetail"
      />
      <ButtonMenu
        :buttonClass="`confetti-button ${animate ? 'animate' : ''}`"
        callOptionOnClick
        id="copy-business-svg-button"
        :data-confetti-text="confettiText"
        :popoverPosition="popoverPosition"
        :options="[
          { text: isEnglish ? 'Copy SVG' : '复制 SVG', onClick: copySvg },
          { text: isEnglish ? 'Copy Data URL' : '复制 Data URL', onClick: copyDataUri },
          { text: isEnglish ? 'Download SVG' : '下载 SVG', onClick: downloadSvg },
          { text: isEnglish ? 'Download PNG' : '下载 PNG', onClick: downloadPng },
        ]"
      />
      <ButtonMenu
        :buttonClass="`confetti-button ${animate ? 'animate' : ''}`"
        callOptionOnClick
        id="copy-business-code-button"
        :data-confetti-text="copiedText"
        :popoverPosition="popoverPosition"
        :options="[
          { text: isEnglish ? 'Copy JSX' : '复制 JSX', onClick: copyJSX },
          {
            text: isEnglish ? 'Copy component name' : '复制组件名',
            onClick: copyComponentName,
          },
          { text: isEnglish ? 'Copy Vue' : '复制 Vue', onClick: copyVue },
          { text: isEnglish ? 'Copy Svelte' : '复制 Svelte', onClick: copySvelte },
          { text: isEnglish ? 'Copy Angular' : '复制 Angular', onClick: copyAngular },
        ]"
        @click="confetti"
        @optionClick="confetti"
      />
    </div>

    <p class="business-icon-path">{{ icon.path }}</p>
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

.business-icon-name-wrapper {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-bottom: 4px;
}

.business-icon-name {
  margin-right: -36px;
}

.business-icon-description {
  margin: 8px 0 16px;
  color: var(--vp-c-text-2);
  font-size: 16px;
  line-height: 28px;
}

.buttons {
  margin-top: 24px;
}

.business-icon-path {
  margin: 0;
  color: var(--vp-c-text-2);
  font-family: var(--vp-font-family-mono);
  overflow-wrap: anywhere;
}
</style>
