<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
import { toPascalCase } from '@ycloud-web/shared';
import ButtonMenu from '../base/ButtonMenu.vue';
import { useIconStyleContext } from '@theme/composables/useIconStyle';
import useConfetti from '@theme/composables/useConfetti';

const props = defineProps<{
  name: string;
  popoverPosition?: 'top' | 'bottom';
}>();
const { page } = useData();
const isEnglish = computed(() => page.value.relativePath?.startsWith?.('en/') ?? false);
const { size, color, strokeWidth, absoluteStrokeWidth } = useIconStyleContext();
const { animate, confetti } = useConfetti();
const componentName = computed(() => {
  return (toPascalCase(props.name) as string).replace(/\s/g, '');
});

function copyJSX() {
  let attrs = [''];

  if (size.value && size.value !== 24) {
    attrs.push(`size={${size.value}}`);
  }

  if (color.value && color.value !== 'currentColor') {
    attrs.push(`color="${color.value}"`);
  }

  if (strokeWidth.value && strokeWidth.value !== 2) {
    attrs.push(`strokeWidth={${strokeWidth.value}}`);
  }

  if (absoluteStrokeWidth.value) {
    attrs.push(`absoluteStrokeWidth`);
  }

  const code = `<${componentName.value}${attrs.join(' ')} />`;

  confetti();
  void navigator.clipboard.writeText(code).catch(() => {});
}

function copyComponentName() {
  const code = componentName.value;

  confetti();
  void navigator.clipboard.writeText(code).catch(() => {});
}

function copyVue() {
  let attrs = [''];

  if (size.value && size.value !== 24) {
    attrs.push(`:size="${size.value}"`);
  }

  if (color.value && color.value !== 'currentColor') {
    attrs.push(`color="${color.value}"`);
  }

  if (strokeWidth.value && strokeWidth.value !== 2) {
    attrs.push(`:stroke-width="${strokeWidth.value}"`);
  }

  if (absoluteStrokeWidth.value) {
    attrs.push(`absoluteStrokeWidth`);
  }

  const code = `<${componentName.value}${attrs.join(' ')} />`;

  confetti();
  void navigator.clipboard.writeText(code).catch(() => {});
}

function copyAngular() {
  let attrs = [''];

  attrs.push(`name="${props.name}"`);

  if (size.value && size.value !== 24) {
    attrs.push(`[size]="${size.value}"`);
  }

  if (color.value && color.value !== 'currentColor') {
    attrs.push(`color="${color.value}"`);
  }

  if (strokeWidth.value && strokeWidth.value !== 2) {
    attrs.push(`[strokeWidth]="${strokeWidth.value}"`);
  }

  if (absoluteStrokeWidth.value) {
    attrs.push(`[absoluteStrokeWidth]="true"`);
  }

  const code = `<ycloud-icon${attrs.join(' ')}></ycloud-icon>`;

  confetti();
  void navigator.clipboard.writeText(code).catch(() => {});
}
</script>

<template>
  <ButtonMenu
    :buttonClass="`confetti-button ${animate ? 'animate' : ''}`"
    id="copy-code-button"
    callOptionOnClick
    :data-confetti-text="isEnglish ? 'Copied' : '已复制'"
    :popoverPosition="popoverPosition"
    :options="[
      { text: isEnglish ? 'Copy JSX' : '复制 JSX', onClick: copyJSX },
      { text: isEnglish ? 'Copy component name' : '复制组件名', onClick: copyComponentName },
      { text: isEnglish ? 'Copy Vue' : '复制 Vue', onClick: copyVue },
      { text: isEnglish ? 'Copy Svelte' : '复制 Svelte', onClick: copyJSX },
      { text: isEnglish ? 'Copy Angular' : '复制 Angular', onClick: copyAngular },
    ]"
  />
</template>

<style src="./confetti.css" />
