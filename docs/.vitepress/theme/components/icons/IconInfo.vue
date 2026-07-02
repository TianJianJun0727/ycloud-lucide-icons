<script setup lang="ts">
import { IconEntity } from '@theme/types';
import IconDetailName from './IconDetailName.vue';
import Badge from '../base/Badge.vue';
import { useData } from 'vitepress';
import { computed } from 'vue';
import deprecationReasonTemplate from '@tools/build-icons/utils/deprecationReasonTemplate.ts';
import IconInfoActions from './IconInfoActions.vue';

const props = defineProps<{
  icon: IconEntity;
  popoverPosition?: 'top' | 'bottom';
  showMetadataDetails?: boolean;
}>();

const { page } = useData();
const isEnglish = computed(() => page.value.relativePath?.startsWith?.('en/') ?? false);

const displayTags = computed(() => {
  if (!props.icon) return [];
  return isEnglish.value
    ? (props.icon.englishTags ?? props.icon.displayTags ?? props.icon.tags)
    : (props.icon.displayTags ?? props.icon.tags);
});

const displayUseCases = computed(() => {
  if (!props.icon) return [];
  return isEnglish.value
    ? (props.icon.englishUseCases ?? props.icon.displayUseCases ?? props.icon.useCases ?? [])
    : (props.icon.displayUseCases ?? props.icon.useCases ?? []);
});

const displayName = computed(() =>
  isEnglish.value
    ? (props.icon.englishName ?? props.icon.name)
    : (props.icon.displayName ?? props.icon.name),
);

const displayCategories = computed(() =>
  isEnglish.value
    ? (props.icon.englishCategories ?? props.icon.displayCategories ?? props.icon.categories)
    : (props.icon.displayCategories ?? props.icon.categories),
);

const tags = computed(() => displayTags.value.join(' • '));

const deprecatedTitle = computed(() => {
  if (!props.icon.deprecationReason) return '';
  return deprecationReasonTemplate(props.icon.deprecationReason, {
    componentName: props.icon.name,
    iconName: props.icon.name,
    toBeRemovedInVersion: props.icon.toBeRemovedInVersion,
  });
});

const detailPath = computed(() => `${isEnglish.value ? '/en' : ''}/icons/${props.icon.name}`);

const isCurrentDetail = computed(() => {
  const relativePath = page.value.relativePath;
  return (
    relativePath?.startsWith?.(`icons/${props.icon.name}`) ||
    relativePath?.startsWith?.(`en/icons/${props.icon.name}`)
  );
});

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
        {{ isEnglish ? 'Deprecated' : '已弃用' }}
      </Badge>
    </div>
    <template v-if="showMetadataDetails">
      <div
        v-if="icon.categories.length > 0"
        class="metadata-section"
      >
        <div class="metadata-title">{{ isEnglish ? 'Categories' : '分类' }}</div>
        <div class="group metadata-badges">
          <Badge
            v-for="category in icon.categories"
            :key="category"
            class="category"
            :href="`${isEnglish ? '/en' : ''}/icons/categories#${category}`"
          >
            {{ displayCategories[icon.categories.indexOf(category)] || category }}
          </Badge>
        </div>
      </div>
      <div
        v-if="displayTags.length > 0"
        class="metadata-section"
      >
        <div class="metadata-title">{{ isEnglish ? 'Tags' : '标签' }}</div>
        <div class="group metadata-badges">
          <Badge
            v-for="tag in displayTags"
            :key="tag"
          >
            {{ tag }}
          </Badge>
        </div>
      </div>
      <div
        v-if="displayUseCases.length > 0"
        class="metadata-section"
      >
        <div class="metadata-title">{{ isEnglish ? 'Use cases' : '使用场景' }}</div>
        <ul class="metadata-list">
          <li
            v-for="useCase in displayUseCases"
            :key="useCase"
          >
            {{ useCase }}
          </li>
        </ul>
      </div>
    </template>
    <template v-else>
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
          :key="category"
          class="category"
          :href="`${isEnglish ? '/en' : ''}/icons/categories#${category}`"
        >
          {{ displayCategories[icon.categories.indexOf(category)] || category }}
        </Badge>
      </div>
    </template>

    <IconInfoActions
      :name="icon.name"
      :detailPath="detailPath"
      :detailText="isEnglish ? 'See details' : '查看详情'"
      :isCurrentDetail="isCurrentDetail"
      :popoverPosition="popoverPosition"
    />
    <slot name="footer" />
  </div>
</template>

<style scoped>
.icon-info {
  display: flex;
  width: 100%;
  min-width: 0;
  min-height: 0;
  flex-direction: column;
}

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
  -ms-overflow-style: none;
  scrollbar-width: none;
  scrollbar-width: thin;
  scrollbar-color: var(--vp-c-text-4) transparent;
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
  background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, var(--gradient-background) 100%);
  right: 0;
  pointer-events: none;
}

.metadata-section {
  margin: 12px 0 0;
}

.metadata-title {
  margin-bottom: 8px;
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 700;
}

.metadata-badges {
  margin-bottom: 0;
}

.metadata-list {
  margin: 0;
  padding-left: 20px;
  list-style: disc;
  color: var(--vp-c-text-2);
  line-height: 1.7;
}

.metadata-list li {
  list-style: disc;
}

.buttons {
  flex: 0 0 auto;
  margin-top: 24px;
}
</style>
