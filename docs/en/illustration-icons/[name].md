---
layout: page
---

<script setup>
import { useData } from 'vitepress'
import PageContainer from '~/.vitepress/theme/components/PageContainer.vue'
import { computed } from 'vue'

const { params } = useData()
const reactExample = computed(() => `import { ${params.value.componentName} } from '@ycloud-web/icons-react/illustration';

export function Example() {
  return <${params.value.componentName} width="100%" height="auto" />;
}`)
</script>

<div class="VPDoc content">
  <PageContainer>
    <div class="illustration-detail">
      <div>
        <p class="eyebrow">Illustration</p>
        <h1>{{ params.displayName }}</h1>
        <p class="muted">{{ params.path }}</p>
      </div>
      <div class="preview" v-html="params.svg" />
      <div class="usage">
        <h2>React</h2>
        <div class="language-tsx vp-adaptive-theme">
          <button title="Copy Code" class="copy" />
          <span class="lang">tsx</span>
          <pre><code v-text="reactExample" /></pre>
        </div>
      </div>
    </div>
  </PageContainer>
</div>

<style scoped>
.illustration-detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
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

.preview {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 280px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  padding: 24px;
}

.preview :deep(svg) {
  max-width: 100%;
  height: auto;
  max-height: 240px;
}
</style>
