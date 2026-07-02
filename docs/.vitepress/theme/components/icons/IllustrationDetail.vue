<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
import CodeGroup from '../base/CodeGroup.vue';
import { data as illustrationData } from '../../../../illustration-icons/illustration.data';
import { data as codeExampleData } from '../../../../illustration-icons/codeExamples.data';

const props = defineProps<{
  locale: 'zh' | 'en';
}>();

const { params } = useData();

const illustration = computed(
  () =>
    illustrationData.illustrations.find((item) => item.name === params.value.name) ??
    illustrationData.illustrations[0],
);
const displayName = computed(() =>
  props.locale === 'en'
    ? illustration.value.englishName || illustration.value.displayName
    : illustration.value.displayName,
);
const tags = computed(() =>
  props.locale === 'en'
    ? (illustration.value.englishTags ?? illustration.value.tags ?? [])
    : (illustration.value.tags ?? []),
);
const useCases = computed(() =>
  props.locale === 'en'
    ? (illustration.value.englishUseCases ?? illustration.value.useCases ?? [])
    : (illustration.value.useCases ?? []),
);
const tabs = computed(() => codeExampleData.codeExamples.map((codeExample) => codeExample.title));
const codeExample = computed(() =>
  codeExampleData.codeExamples
    .map((item) =>
      item.code
        .replace(/\$PascalCase/g, illustration.value.componentName)
        .replace(/\$Path/g, illustration.value.path),
    )
    .join(''),
);
</script>

<template>
  <div class="layout">
    <div class="illustration-previews">
      <div class="preview">
        <div v-html="illustration.svg" />
      </div>
      <div class="small-previews">
        <div class="small-preview">
          <div v-html="illustration.svg" />
        </div>
        <div class="small-preview">
          <div v-html="illustration.svg" />
        </div>
      </div>
    </div>

    <div class="info">
      <div class="metadata">
        <p class="eyebrow">Illustration</p>
        <h1>{{ displayName }}</h1>
        <p class="muted">{{ illustration.path }}</p>

        <div
          v-if="tags.length > 0"
          class="metadata-block"
        >
          <h2>{{ locale === 'en' ? 'Tags' : '标签' }}</h2>
          <div class="tags">
            <span
              v-for="tag in tags"
              :key="tag"
              class="tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <div
          v-if="useCases.length > 0"
          class="metadata-block"
        >
          <h2>{{ locale === 'en' ? 'Use Cases' : '适用场景' }}</h2>
          <ul>
            <li
              v-for="useCase in useCases"
              :key="useCase"
            >
              {{ useCase }}
            </li>
          </ul>
        </div>
      </div>

      <ClientOnly>
        <CodeGroup
          :groups="tabs"
          groupName="illustration-code-example"
          class="code"
        >
          <div
            class="blocks"
            v-html="codeExample"
          />
        </CodeGroup>
      </ClientOnly>
    </div>
  </div>
</template>

<style scoped>
.layout {
  align-items: flex-start;
}

.illustration-previews {
  display: flex;
  gap: 24px;
  justify-content: flex-start;
}

.preview {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 240px;
  height: 240px;
  max-width: 240px;
  flex-shrink: 0;
  margin-bottom: 24px;
  border-radius: 8px;
  background-color: var(--vp-c-bg-alt);
  background-image:
    linear-gradient(var(--vp-c-divider) 1px, transparent 1px),
    linear-gradient(90deg, var(--vp-c-divider) 1px, transparent 1px);
  background-size: 12px 12px;
}

.preview :deep(svg) {
  max-width: 180px;
  max-height: 180px;
  height: auto;
}

.small-previews {
  display: flex;
  gap: 8px;
  flex-shrink: 2;
  align-items: flex-start;
}

.small-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 8px;
  background: var(--vp-c-bg-alt);
}

.small-preview :deep(svg) {
  max-width: 44px;
  max-height: 44px;
  height: auto;
}

.metadata {
  --tags-gradient-background: var(--vp-c-bg);
}

.metadata-block {
  margin-top: 24px;
}

.eyebrow,
.muted {
  color: var(--vp-c-text-2);
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  color: var(--vp-c-text-2);
  padding: 4px 10px;
}

.code {
  margin-top: 24px;
}

@media (min-width: 640px) {
  .layout {
    display: grid;
    grid-template-columns: 240px minmax(0, 1fr);
    gap: 24px;
  }

  .illustration-previews {
    flex-direction: column;
  }
}
</style>
