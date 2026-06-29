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
import IconPreview from '~/.vitepress/theme/components/icons/IconPreview.vue'
import IconPreviewSmall from '~/.vitepress/theme/components/icons/IconPreviewSmall.vue'
import IconInfo from '~/.vitepress/theme/components/icons/IconInfo.vue'
import IconShowcase from '~/.vitepress/theme/components/icons/IconShowcase.vue'
import RelatedIcons from '~/.vitepress/theme/components/icons/RelatedIcons.vue'
import CodeGroup from '~/.vitepress/theme/components/base/CodeGroup.vue'
import { data } from './codeExamples.data'
import { toCamelCase, toPascalCase } from '@ycloud-web/shared'

const { params } = useData()

const tabs = computed(() => data.codeExamples?.map(
  (codeExample) => codeExample.title) ?? []
)

const codeExample = computed(() => data.codeExamples?.map(
    (codeExample) => {
      const pascalCaseName = toPascalCase( params.value.name)
      const camelCaseName = toCamelCase(params.value.name)

      return codeExample.code
        .replace(/\$(?:<[^>]+>)*PascalCase/g, pascalCaseName)
        .replace(/\$CamelCase/g, camelCaseName)
        .replace(/\$Name/g, params.value.name)
    }
  ).join('') ?? []
)
</script>

<div :class="$style.layout">
  <div :class="$style.iconPreviews">
    <IconPreview
      id="previewer"
      :name="params.name"
      :iconNode="params.iconNode"
      :class="$style.preview"
    />
    <IconPreviewSmall
      :name="params.name"
      :iconNode="params.iconNode"
       :class="$style.smallPreview"
    />
  </div>
  <div >
    <div :class="$style.info">
      <IconInfo :icon="params" />
    </div>
    <ClientOnly>
      <CodeGroup
        :groups="tabs"
        groupName="icon-code-example"
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

<div class="icon-page-sections">
  <IconShowcase
  :name="params.name"
  :displayName="params.displayName"
  :englishName="params.englishName"
  :iconNode="params.iconNode"
  />

<RelatedIcons
  v-if="params.relatedIcons"
  :icons="params.relatedIcons"
  />

</div>

<style module>
  .preview {
    grid-area: preview;
    margin-bottom: 24px;
    max-width: 240px;
    width: 240px;
    flex-shrink: 0;
  }

  .layout {
    align-items: flex-start;
  }

  .info {
    --tags-gradient-background: var(--vp-c-bg);
  }

  .iconPreviews {
    display: flex;
    justify-content: flex-start;
    gap: 24px;
  }

  .smallPreview {
    flex-shrink: 2;
    flex-direction: column;
    align-items: flex-start;
  }

  @media (min-width: 640px) {
    .layout {
      align-items: flex-start;
      display: grid;
      grid-template-columns: 240px minmax(0, 1fr);
      gap: 24px;
    }

    .preview {
      margin: 0 auto;
    }

    .iconPreviews {
      flex-direction: column;
    }

    .smallPreview {
      flex-direction: row;
      align-items: center;
    }
  }

  @media (min-width: 860px) {
    .info {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
  }

  @media (min-width: 960px) {
    .info {
      display: block;
      justify-content: space-between;
      align-items: flex-start;
    }
  }

  @media (min-width: 1152px) {
    .info {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
  }
</style>

<style>
  .icon-page-sections h2.title {
    text-align: center;
    font-weight: 500;
    margin-block-end: 64px;
    padding-top: 32px;
  }
</style>
