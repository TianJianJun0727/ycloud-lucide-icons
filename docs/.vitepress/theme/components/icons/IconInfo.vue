<script setup lang="ts">
import { IconEntity } from '../../types';
import IconDetailName from './IconDetailName.vue';
import Badge from '../base/Badge.vue';
import CopySVGButton from './CopySVGButton.vue';
import CopyCodeButton from './CopyCodeButton.vue';
import VPButton from 'vitepress/dist/client/theme-default/components/VPButton.vue';
import { useData, useRouter } from 'vitepress';
import { computed } from 'vue';
import deprecationReasonTemplate from '../../../../../tools/build-icons/utils/deprecationReasonTemplate.ts';
import { localizeIconCategories, localizeIconName, localizeIconTags } from '../../utils/iconI18n';
import { resolveBrowserHref, resolveRoutePath } from '../../utils/navigation';

const props = defineProps<{
  icon: IconEntity;
  popoverPosition?: 'top' | 'bottom';
}>();

const { page } = useData();
const { go } = useRouter();

const tags = computed(() => {
  if (!props.icon) return '';
  const displayTags = props.icon.displayTags?.length
    ? props.icon.displayTags
    : localizeIconTags(props.icon.tags, props.icon.i18n?.zh?.tags);
  return displayTags?.join(' • ') ?? '';
});

const displayName = computed(() =>
  localizeIconName(props.icon.name, props.icon.displayName ?? props.icon.i18n?.zh?.name),
);

const displayCategories = computed(() =>
  localizeIconCategories(
    props.icon.categories,
    props.icon.displayCategories ?? props.icon.i18n?.zh?.categories,
  ),
);

const deprecatedTitle = computed(() => {
  if (!props.icon.deprecationReason) return '';
  return deprecationReasonTemplate(props.icon.deprecationReason, {
    componentName: props.icon.name,
    iconName: props.icon.name,
    toBeRemovedInVersion: props.icon.toBeRemovedInVersion,
  });
});

const detailPath = computed(() => `/icons/${props.icon.name}`);
const detailHref = computed(() => resolveBrowserHref(detailPath.value));

function openDetail(event: MouseEvent) {
  event.preventDefault();
  go(resolveRoutePath(detailPath.value));
}
</script>

<template>
  <div class="icon-info">
    <div class="icon-name-wrapper">
      <IconDetailName class="icon-name">
        {{ displayName }}
      </IconDetailName>
      <Badge
        v-if="icon.deprecated"
        class="deprecated-badge"
        :title="deprecatedTitle"
      >
        Deprecated
      </Badge>
    </div>
    <div
      class="tags-scroller"
      v-if="tags.length"
    >
      <p class="icon-tags horizontal-scroller">
        {{ tags }}
      </p>
    </div>
    <div class="group">
      <Badge
        v-for="category in icon.categories"
        class="category"
        :href="`/icons/categories#${category}`"
      >
        {{ displayCategories[icon.categories.indexOf(category)] || category }}
      </Badge>
    </div>

    <div class="group buttons">
      <VPButton
        v-if="!page?.relativePath?.startsWith?.(`icons/${icon.name}`)"
        :href="detailHref"
        text="查看详情"
        @click="openDetail"
      />
      <CopySVGButton
        :name="icon.name"
        :popoverPosition="popoverPosition"
      />
      <CopyCodeButton
        :name="icon.name"
        :popoverPosition="popoverPosition"
      />
    </div>
    <slot name="footer" />
  </div>
</template>

<style scoped>
.group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}
.category {
  text-transform: capitalize;
}
.icon-name {
  margin-right: -36px;
}

.icon-name-wrapper {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-bottom: 4px;
}

.icon-external-lib {
  color: var(--vp-c-brand-dark);
  padding: 4px 12px;
  font-size: 16px;
  font-weight: 600;
  line-height: 28px;
  display: flex;
  gap: 8px;
  align-items: center;
}

.deprecated-badge {
  background-color: var(--vp-c-brand-5);
  margin-left: 40px;
  opacity: 0.8;
}

.deprecated-badge:hover {
  background-color: var(--vp-c-brand-2);
}

.icon-tags {
  font-size: 16px;
  color: var(--vp-c-text-2);
  font-weight: 500;
  line-height: 28px;
  white-space: nowrap;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  margin-top: 0;
  margin-bottom: 0;
}

.tags-scroller {
  position: relative;
  max-width: 100%;
  width: 100%;
  height: 28px;
  padding: 8px 0 16px;
  margin-bottom: 16px;
  margin-top: 8px;
  align-items: center;

  --gradient-background: var(--tags-gradient-background, var(--vp-c-bg-elv));
}
.horizontal-scroller {
  overflow-x: scroll;
  /* Hide Scrollbar */
  -ms-overflow-style: none;
  scrollbar-width: none;
  scrollbar-width: thin; /* can also be normal, or none, to not render scrollbar */
  scrollbar-color: var(--vp-c-text-4) transparent; /* foreground background */
}
.horizontal-scroller::-webkit-scrollbar {
  width: 0;
  display: none;
}

.horizontal-scroller::-webkit-scrollbar-track {
  background: transparent;
}

.horizontal-scroller::-webkit-scrollbar-thumb {
  background: transparent;
  border: none;
}

.tags-scroller::after {
  content: '';
  position: absolute;
  bottom: 0;
  width: 32px;
  height: 100%;
  /* Background Gradient left to right */
  background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, var(--gradient-background) 100%);
  right: 0;
  pointer-events: none;
}

.buttons {
  margin-top: 24px;
}
</style>
