<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
import type { IllustrationEntity } from '@theme/types';
import Badge from '../base/Badge.vue';
import IconDetailName from './IconDetailName.vue';
import IllustrationInfoActions from './IllustrationInfoActions.vue';

const props = defineProps<{
  illustration: IllustrationEntity;
  popoverPosition?: 'top' | 'bottom';
  showMetadataDetails?: boolean;
}>();

const { page } = useData();
const isEnglish = computed(() => page.value.relativePath?.startsWith?.('en/') ?? false);
const displayName = computed(() =>
  isEnglish.value
    ? (props.illustration.englishName ?? props.illustration.displayName)
    : props.illustration.displayName,
);
const displayTags = computed(() =>
  isEnglish.value
    ? (props.illustration.englishTags ?? props.illustration.tags ?? [])
    : (props.illustration.tags ?? []),
);
const displayUseCases = computed(() =>
  isEnglish.value
    ? (props.illustration.englishUseCases ?? props.illustration.useCases ?? [])
    : (props.illustration.useCases ?? []),
);
const tags = computed(() => displayTags.value.join(' • '));
const detailPath = computed(
  () => `${isEnglish.value ? '/en' : ''}/illustration-icons/${props.illustration.name}`,
);
const isCurrentDetail = computed(() => {
  const relativePath = page.value.relativePath;
  return (
    relativePath?.startsWith?.(`illustration-icons/${props.illustration.name}`) ||
    relativePath?.startsWith?.(`en/illustration-icons/${props.illustration.name}`)
  );
});
</script>

<template>
  <div class="illustration-info">
    <div class="illustration-name-wrapper">
      <IconDetailName class="illustration-name">
        {{ displayName }}
      </IconDetailName>
    </div>

    <template v-if="showMetadataDetails">
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
        <p class="illustration-tags horizontal-scroller">
          {{ tags }}
        </p>
      </div>
    </template>

    <IllustrationInfoActions
      :name="illustration.name"
      :componentName="illustration.componentName"
      :detailPath="detailPath"
      :detailText="isEnglish ? 'See details' : '查看详情'"
      :isCurrentDetail="isCurrentDetail"
      :popoverPosition="popoverPosition"
    />
  </div>
</template>

<style scoped>
.illustration-info {
  display: flex;
  width: 100%;
  min-width: 0;
  min-height: 0;
  flex-direction: column;
}

.illustration-name-wrapper {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-bottom: 4px;
}

.illustration-name {
  margin-right: -36px;
}

.group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.illustration-tags {
  position: absolute;
  inset: 0;
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 16px;
  font-weight: 500;
  line-height: 28px;
  white-space: nowrap;
}

.tags-scroller {
  position: relative;
  width: 100%;
  max-width: 100%;
  height: 28px;
  padding: 8px 0 16px;
  margin-top: 8px;
  margin-bottom: 16px;
  align-items: center;

  --gradient-background: var(--tags-gradient-background, var(--vp-c-bg-elv));
}

.horizontal-scroller {
  overflow-x: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  scrollbar-color: var(--vp-c-text-4) transparent;
}

.horizontal-scroller::-webkit-scrollbar {
  width: 0;
  display: none;
}

.tags-scroller::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  width: 32px;
  height: 100%;
  pointer-events: none;
  background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, var(--gradient-background) 100%);
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
  color: var(--vp-c-text-2);
  line-height: 1.7;
  list-style: disc;
}

.metadata-list li {
  list-style: disc;
}
</style>
