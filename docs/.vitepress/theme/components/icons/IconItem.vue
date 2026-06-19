<script setup lang="ts">
import { computed } from 'vue';
import createYCloudIcon from '@ycloud-web/icons-vue/src/createYCloudIcon';
import { useMediaQuery } from '@vueuse/core';
import { useRouter } from 'vitepress';
import getSVGIcon from '../../utils/getSVGIcon';
import useConfetti from '../../composables/useConfetti';
import Tooltip from '../base/Tooltip.vue';
import { resolveBrowserHref, resolveRoutePath } from '../../utils/navigation';

const copiedText = '已复制';

export type IconNode = [elementName: string, attrs: Record<string, string>][];

const props = defineProps<{
  name: string;
  displayName?: string;
  iconNode: IconNode;
  active: boolean;
  customizable?: boolean;
  overlayMode?: boolean;
  hideIcon?: boolean;
}>();

const emit = defineEmits(['setActiveIcon']);

const { go } = useRouter();
const showOverlay = useMediaQuery('(min-width: 860px)');
const { animate, confetti, confettiText } = useConfetti();

const icon = computed(() => {
  if (!props.name || !props.iconNode) return null;
  return createYCloudIcon(props.name, props.iconNode);
});

const href = computed(() => `/icons/${props.name}`);
const browserHref = computed(() => resolveBrowserHref(href.value));
const displayTitle = computed(() =>
  props.displayName && props.displayName !== props.name
    ? `${props.displayName}（${props.name}）`
    : props.name,
);

async function navigateToIcon(event) {
  if (event.shiftKey) {
    event.preventDefault();
    const svgString = getSVGIcon(event.target.firstChild, {
      class: `ycloud ycloud-${props.name}`,
    });

    await navigator.clipboard.writeText(svgString);

    confettiText.value = copiedText;
    confetti();
    return;
  }

  if (props.overlayMode && showOverlay.value) {
    event.preventDefault();

    window.history.pushState({}, '', browserHref.value);
    emit('setActiveIcon', props.name);
  } else {
    event.preventDefault();
    go(resolveRoutePath(href.value));
  }
}
</script>

<template>
  <Tooltip :title="displayTitle">
    <a
      class="icon-button confetti-button vp-raw"
      :href="browserHref"
      @click="navigateToIcon"
      :class="{ active, animate }"
      :aria-label="displayTitle"
      :data-confetti-text="confettiText"
      ref="ref"
    >
      <KeepAlive>
        <component
          v-if="!hideIcon"
          :is="icon"
          class="ycloud-icon"
          :class="{
            customizable,
          }"
        />
      </KeepAlive>
    </a>
  </Tooltip>
</template>

<style src="./confetti.css" />

<style scoped>
.icon-button {
  position: relative;
  display: inline-block;
  border: 1px solid transparent;
  text-align: center;
  font-weight: 600;
  border-radius: 4px;
  white-space: nowrap;
  transition:
    color 0.25s,
    border-color 0.25s,
    background-color 0.25s;
  border-radius: 6px;
  background-color: var(--vp-c-bg-alt);
  display: inline-flex;
  width: 56px;
  height: 56px;
  font-size: 24px;
  color: var(--vp-c-text-1);
}

.floating-diamond {
  position: absolute;
  top: 4px;
  right: 4px;
  color: var(--vp-c-brand);
}

.confetti-button:before,
.confetti-button:after {
  z-index: 100;
}

.confetti-button:before {
  line-height: 80px;
}

.icon-button:active {
  transition:
    color 0.1s,
    border-color 0.1s,
    background-color 0.1s;
}

.icon-button.medium {
  border-radius: 20px;
  padding: 0 20px;
  line-height: 38px;
  font-size: 14px;
}

.icon-button.big {
  border-radius: 24px;
  padding: 0 24px;
  line-height: 46px;
  font-size: 16px;
}

.icon-button:hover {
  border-color: var(--vp-button-alt-hover-border);
  color: var(--vp-button-alt-hover-text);
  background-color: var(--vp-button-alt-hover-bg);
}

.icon-button:active {
  border-color: var(--vp-button-alt-active-border);
  color: var(--vp-button-alt-active-text);
  background-color: var(--vp-button-alt-active-bg);
}

.icon-button.active {
  border-color: var(--vp-c-brand);
}

.ycloud-icon {
  margin: auto;
  pointer-events: none;
}
.ycloud-icon.customizable {
  will-change: width, height, stroke-width, stroke;
  color: var(--customize-color, currentColor);
  stroke-width: var(--customize-strokeWidth, 2);
  width: calc(var(--customize-size, 24) * 1px);
  height: calc(var(--customize-size, 24) * 1px);
  max-width: 3rem;
  max-height: 3rem;
}

html.absolute-stroke-width .ycloud-icon.customizable {
  stroke-width: calc(var(--customize-strokeWidth, 2) * 24 / var(--customize-size, 24));
}
</style>
