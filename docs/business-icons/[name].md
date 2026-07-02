---
layout: doc
footer: false
aside: false
editLink: false
next: false
prev: false
sidebar: true
---

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import BusinessIconPreview from '~/.vitepress/theme/components/icons/BusinessIconPreview.vue'
import BusinessIconInfo from '~/.vitepress/theme/components/icons/BusinessIconInfo.vue'
import IconDetailBackButton from '~/.vitepress/theme/components/icons/IconDetailBackButton.vue'
import IconDetailMeta from '~/.vitepress/theme/components/icons/IconDetailMeta.vue'
import CodeGroup from '~/.vitepress/theme/components/base/CodeGroup.vue'
import { data } from './codeExamples.data'

const { params } = useData()

const codeExamples = computed(() => {
  const colorMode = params.value.colorMode ?? 'mono'

  return data.codeExamples?.[colorMode] ?? data.codeExamples?.mono ?? []
})

const tabs = computed(() => codeExamples.value.map(
  (codeExample) => codeExample.title) ?? []
)

const codeExample = computed(() => codeExamples.value.map(
    (codeExample) => {
      const pascalCaseName = params.value.componentName
      const camelCaseName = `${pascalCaseName.charAt(0).toLowerCase()}${pascalCaseName.slice(1)}`

      return codeExample.code
        .replace(/\$PascalCase/g, pascalCaseName)
        .replace(/\$CamelCase/g, camelCaseName)
        .replace(/\$Category/g, params.value.category)
        .replace(/\$Name/g, params.value.name)
    }
  ).join('') ?? []
)

</script>

<div :class="$style.layout">
  <div :class="$style.iconPreviews">
    <IconDetailBackButton fallbackHref="/business-icons/" />
    <div :class="$style.preview">
      <BusinessIconPreview
        id="previewer"
        :svg="params.svg"
      />
    </div>
    <div :class="$style.smallPreviews">
      <div :class="$style.smallPreview">
        <BusinessIconPreview
          :svg="params.svg"
          :size="48"
        />
      </div>
      <div :class="$style.smallPreview">
        <BusinessIconPreview
          :svg="params.svg"
          :size="32"
        />
      </div>
      <div :class="$style.smallPreview">
        <BusinessIconPreview
          :svg="params.svg"
          :size="24"
        />
      </div>
    </div>
  </div>
  <div :class="$style.info">
    <div :class="$style.infoHeader">
      <BusinessIconInfo
        :icon="params"
        showMetadataDetails
      />
      <IconDetailMeta
        :createdRelease="params.createdRelease"
        :changedRelease="params.changedRelease"
        :git="params.git"
      />
    </div>
    <ClientOnly>
      <CodeGroup
        :groups="tabs"
        groupName="business-icon-code-example"
        :class="$style.code"
      >
        <div
          class="blocks"
          v-html="codeExample"
        />
      </CodeGroup>
    </ClientOnly>
  </div>
</div>

<style module>
  .layout {
    align-items: flex-start;
  }

  .iconPreviews {
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

  .preview :global(.business-icon-preview) {
    width: calc(var(--customize-size, 24) * 4px);
    height: calc(var(--customize-size, 24) * 4px);
    max-width: 128px;
    max-height: 128px;
  }

  .smallPreviews {
    display: flex;
    gap: 8px;
    flex-shrink: 2;
    align-items: flex-start;
  }

  .smallPreview {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 8px;
    background: var(--vp-c-bg-alt);
  }

  .info {
    --tags-gradient-background: var(--vp-c-bg);
  }

  .infoHeader {
    display: flex;
    gap: 24px;
    align-items: flex-start;
    justify-content: space-between;
  }

  .infoHeader :global(.business-icon-info) {
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

    .iconPreviews {
      flex-direction: column;
    }
  }

  @media (max-width: 959px) {
    .infoHeader {
      display: block;
    }

  }
</style>
