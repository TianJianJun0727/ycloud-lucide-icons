<script setup lang="ts">
import { computed, ref } from 'vue';
import { useData } from 'vitepress';
import ButtonMenu from '../base/ButtonMenu.vue';
import { useIconStyleContext } from '@theme/composables/useIconStyle';
import useConfetti from '@theme/composables/useConfetti';
import getSVGIcon from '@theme/utils/getSVGIcon';
import downloadData from '@theme/utils/downloadData';

const { page } = useData();
const isEnglish = computed(() => page.value.relativePath?.startsWith?.('en/') ?? false);
const downloadText = computed(() => (isEnglish.value ? 'Downloaded' : '已下载'));
const copiedText = computed(() => (isEnglish.value ? 'Copied' : '已复制'));
const confettiText = ref(copiedText.value);
const props = defineProps<{
  name: string;
  popoverPosition?: 'top' | 'bottom';
}>();

const { size } = useIconStyleContext();

const { animate, confetti } = useConfetti();

function copySVG() {
  confettiText.value = copiedText.value;
  const svgString = getSVGIcon();

  confetti();
  void navigator.clipboard.writeText(svgString).catch(() => {});
}

function copyDataUrl() {
  confettiText.value = copiedText.value;
  const svgString = getSVGIcon();

  // Create SVG data url
  const dataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;
  confetti();
  void navigator.clipboard.writeText(dataUrl).catch(() => {});
}

function downloadSVG() {
  confettiText.value = downloadText.value;
  const svgString = getSVGIcon();

  downloadData(`${props.name}.svg`, `data:image/svg+xml;base64,${btoa(svgString)}`);
  confetti();
}

function downloadPNG() {
  confettiText.value = downloadText.value;
  const svgString = getSVGIcon();

  const canvas = document.createElement('canvas');
  canvas.width = size.value;
  canvas.height = size.value;
  const ctx = canvas.getContext('2d');

  const image = new Image();
  image.src = `data:image/svg+xml;base64,${btoa(svgString)}`;
  image.onload = function () {
    ctx.drawImage(image, 0, 0);
    downloadData(`${props.name}.png`, canvas.toDataURL('image/png'));
    confetti();
  };
}
</script>

<template>
  <ButtonMenu
    :buttonClass="`confetti-button ${animate ? 'animate' : ''}`"
    callOptionOnClick
    id="copy-svg-button"
    :data-confetti-text="confettiText"
    :popoverPosition="popoverPosition"
    :options="[
      { text: isEnglish ? 'Copy SVG' : '复制 SVG', onClick: copySVG },
      { text: isEnglish ? 'Copy Data URL' : '复制 Data URL', onClick: copyDataUrl },
      { text: isEnglish ? 'Download SVG' : '下载 SVG', onClick: downloadSVG },
      { text: isEnglish ? 'Download PNG' : '下载 PNG', onClick: downloadPNG },
    ]"
  />
</template>

<style src="./confetti.css" />
