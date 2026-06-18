<script setup lang="ts">
import { ref } from 'vue';
import ButtonMenu from '../base/ButtonMenu.vue';
import { useIconStyleContext } from '../../composables/useIconStyle';
import useConfetti from '../../composables/useConfetti';
import getSVGIcon from '../../utils/getSVGIcon';
import downloadData from '../../utils/downloadData';

const downloadText = '已下载';
const copiedText = '已复制';
const confettiText = ref(copiedText);
const props = defineProps<{
  name: string;
  popoverPosition?: 'top' | 'bottom';
}>();

const { size } = useIconStyleContext();

const { animate, confetti } = useConfetti();

function copySVG() {
  confettiText.value = copiedText;
  const svgString = getSVGIcon();

  navigator.clipboard.writeText(svgString);

  confetti();
}

function copyDataUrl() {
  confettiText.value = copiedText;
  const svgString = getSVGIcon();

  // Create SVG data url
  const dataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;
  navigator.clipboard.writeText(dataUrl);

  confetti();
}

function downloadSVG() {
  confettiText.value = downloadText;
  const svgString = getSVGIcon();

  downloadData(`${props.name}.svg`, `data:image/svg+xml;base64,${btoa(svgString)}`);
  confetti();
}

function downloadPNG() {
  confettiText.value = downloadText;
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
      { text: '复制 SVG', onClick: copySVG },
      { text: '复制 Data URL', onClick: copyDataUrl },
      { text: '下载 SVG', onClick: downloadSVG },
      { text: '下载 PNG', onClick: downloadPNG },
    ]"
  />
</template>

<style src="./confetti.css" />
