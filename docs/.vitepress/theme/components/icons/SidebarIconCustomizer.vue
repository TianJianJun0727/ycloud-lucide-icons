<script setup lang="ts">
import { shallowRef, type Ref, watch, computed } from 'vue';
import { useCssVar, syncRef } from '@vueuse/core';
import { useData } from 'vitepress';
import { STYLE_DEFAULTS, useIconStyleContext } from '@theme/composables/useIconStyle';
import RangeSlider from '../base/RangeSlider.vue';
import InputField from '../base/InputField.vue';
import ColorPicker from '../base/ColorPicker.vue';
import ResetButton from '../base/ResetButton.vue';
import Switch from '../base/Switch.vue';

const props = defineProps<{
  rootEl?: Ref<HTMLElement>;
  mode?: 'icon' | 'business';
}>();

const { color, strokeWidth, size, absoluteStrokeWidth } = useIconStyleContext();
const { page } = useData();
const isEnglish = computed(() => page.value?.relativePath?.startsWith?.('en/') ?? false);
const documentRef = shallowRef<HTMLElement | undefined>(
  typeof document !== 'undefined' ? document?.documentElement : undefined,
);

const colorCssVar = useCssVar('--customize-color', props.rootEl?.value ?? documentRef.value, {
  initialValue: `${STYLE_DEFAULTS.color}`,
});

const strokeWidthCssVar = useCssVar(
  '--customize-strokeWidth',
  props.rootEl?.value ?? documentRef.value,
  {
    initialValue: `${STYLE_DEFAULTS.strokeWidth}`,
  },
);

const sizeCssVar = useCssVar('--customize-size', props.rootEl?.value ?? documentRef.value, {
  initialValue: `${STYLE_DEFAULTS.size}`,
});

syncRef(color, colorCssVar, { direction: 'ltr' });
syncRef(strokeWidth, strokeWidthCssVar, { direction: 'ltr' });
syncRef(size, sizeCssVar, { direction: 'ltr' });

function resetStyle() {
  color.value = STYLE_DEFAULTS.color;
  strokeWidth.value = STYLE_DEFAULTS.strokeWidth;
  size.value = STYLE_DEFAULTS.size;
  absoluteStrokeWidth.value = STYLE_DEFAULTS.absoluteStrokeWidth;
}

watch(absoluteStrokeWidth, (enabled) => {
  const htmlEl = document.documentElement;

  htmlEl.classList.toggle('absolute-stroke-width', enabled);
});

const customizingActive = computed(() => {
  return (
    color.value !== STYLE_DEFAULTS.color ||
    size.value !== STYLE_DEFAULTS.size ||
    (props.mode !== 'business' &&
      (strokeWidth.value !== STYLE_DEFAULTS.strokeWidth ||
        absoluteStrokeWidth.value !== STYLE_DEFAULTS.absoluteStrokeWidth))
  );
});
</script>

<template>
  <div
    class="customizer-card"
    :class="{ customized: customizingActive }"
  >
    <div class="card-header">
      <h2 class="card-title">{{ isEnglish ? 'Customize' : '自定义' }}</h2>
      <ResetButton @click="resetStyle"></ResetButton>
    </div>
    <InputField
      id="icon-color"
      :label="isEnglish ? 'Color' : '颜色'"
      class="color-picker-field"
    >
      <template #display>
        <ColorPicker
          v-model="color"
          id="icon-color"
          class="color-picker"
        />
      </template>
    </InputField>

    <InputField
      v-if="mode !== 'business'"
      id="stroke-width"
      :label="isEnglish ? 'Stroke width' : '描边宽度'"
    >
      <template #display>
        <span class="customize-label">{{ strokeWidth }}px</span>
      </template>
      <RangeSlider
        id="stroke-width"
        name="stroke-width"
        v-model="strokeWidth"
        :min="0.5"
        :max="3"
        :step="0.25"
      />
    </InputField>

    <InputField
      id="size"
      :label="isEnglish ? 'Size' : '尺寸'"
    >
      <template #display>
        <span class="customize-label">{{ size }}px</span>
      </template>
      <RangeSlider
        id="size"
        name="size"
        v-model="size"
        :min="16"
        :max="256"
        :step="4"
      />
    </InputField>

    <InputField
      v-if="mode !== 'business'"
      id="absolute-stroke-width"
      :label="isEnglish ? 'Absolute stroke width' : '固定描边宽度'"
    >
      <Switch
        id="absolute-stroke-width"
        name="absolute-stroke-width"
        v-model="absoluteStrokeWidth"
      />
    </InputField>
  </div>
</template>

<style scoped>
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.card-title {
  font-weight: 700;
  color: var(--vp-c-text-1);
  line-height: 32px;
  font-size: 16px;
  /* margin-bottom: 12px; */
}

.customizer-card {
  background: var(--vp-c-bg);
  padding: 12px 24px 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  position: relative;
  z-index: 0;
  border: 1px solid transparent;
  transition: border-color 0.4s ease-in-out;
}

.customizer-card.customized {
  border-color: var(--vp-c-brand);
}

.color-picker-field:deep(.input-label) {
  display: block;
}

.color-picker-field:deep(.display-value) {
  margin-top: 8px;
  width: 100%;
}

.color-picker-field:deep(.color-picker) {
  width: 100%;
}
</style>
