<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
import CodeGroup from '../base/CodeGroup.vue';
import { data as illustrationData } from '../../../../illustration-icons/illustration.data';
import { data as codeExampleData } from '../../../../illustration-icons/codeExamples.data';
import IconDetailBackButton from './IconDetailBackButton.vue';
import IconDetailMeta from './IconDetailMeta.vue';
import IllustrationInfo from './IllustrationInfo.vue';
import IllustrationPreview from './IllustrationPreview.vue';

const props = defineProps<{
  locale: 'zh' | 'en';
}>();

const { params } = useData();

const illustration = computed(
  () =>
    illustrationData.illustrations.find((item) => item.name === params.value.name) ??
    illustrationData.illustrations[0],
);
const tabs = computed(() => codeExampleData.codeExamples.map((codeExample) => codeExample.title));
const codeExample = computed(() =>
  codeExampleData.codeExamples
    .map((item) =>
      item.code
        .replace(/\$(?:<[^>]+>)*PascalCase/g, illustration.value.componentName)
        .replace(/\$(?:<[^>]+>)*Name/g, illustration.value.name)
        .replace(/\$(?:<[^>]+>)*Path/g, illustration.value.path),
    )
    .join(''),
);
</script>

<template>
  <div class="layout">
    <div class="illustration-previews">
      <IconDetailBackButton
        :fallbackHref="locale === 'en' ? '/en/illustration-icons/' : '/illustration-icons/'"
      />
      <div class="preview">
        <IllustrationPreview
          id="previewer"
          :svg="illustration.svg"
        />
      </div>
      <div class="small-previews">
        <div class="small-preview">
          <IllustrationPreview :svg="illustration.svg" />
        </div>
        <div class="small-preview">
          <IllustrationPreview :svg="illustration.svg" />
        </div>
        <div class="small-preview">
          <IllustrationPreview :svg="illustration.svg" />
        </div>
      </div>
    </div>

    <div class="info">
      <div class="info-header">
        <IllustrationInfo
          :illustration="illustration"
          showMetadataDetails
        />
        <IconDetailMeta
          :createdRelease="illustration.createdRelease"
          :changedRelease="illustration.changedRelease"
          :git="illustration.git"
        />
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
  width: 100%;
  max-width: calc(var(--vp-layout-max-width) - 64px);
  margin: 0 auto;
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
  width: min(100%, 200px);
  height: auto;
  max-width: 200px;
  max-height: 180px;
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
  width: min(100%, 44px);
  height: auto;
  max-width: 44px;
  max-height: 44px;
}

.info {
  --tags-gradient-background: var(--vp-c-bg);
}

.info-header {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  justify-content: space-between;
}

.info-header :deep(.illustration-info) {
  flex: 1 1 auto;
  min-width: 0;
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

  .small-previews {
    flex-direction: row;
  }
}

@media (max-width: 959px) {
  .info-header {
    display: block;
  }
}
</style>
