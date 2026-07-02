<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
import { satisfies } from 'semver';
import type { IconGitMetadata, Release } from '@theme/types';
import Badge from '../base/Badge.vue';
import Label from '../base/Label.vue';

const props = defineProps<{
  createdRelease?: Release;
  changedRelease?: Release;
  git?: IconGitMetadata;
}>();

const { page } = useData();
const isEnglish = computed(() => page.value.relativePath?.startsWith?.('en/') ?? false);
const hasMeta = computed(
  () =>
    !!props.createdRelease?.version ||
    !!props.changedRelease?.version ||
    !!props.git?.contributors?.length,
);

function releaseTagLink(version: string) {
  const shouldAddV = satisfies(version, `<0.266.0`);

  return `https://github.com/TianJianJun0727/ycloud-icons/releases/tag/${shouldAddV ? 'v' : ''}${version}`;
}
</script>

<template>
  <div
    v-if="hasMeta"
    class="detail-meta"
  >
    <div
      v-if="createdRelease?.version"
      class="detail-meta-row"
    >
      <Label>{{ isEnglish ? 'Created in:' : '创建于：' }}</Label>
      <Badge
        :href="releaseTagLink(createdRelease.version)"
        :title="createdRelease.date"
      >
        v{{ createdRelease.version }}
      </Badge>
    </div>
    <div
      v-if="changedRelease?.version"
      class="detail-meta-row"
    >
      <Label>{{ isEnglish ? 'Last changed:' : '最后变更：' }}</Label>
      <Badge
        :href="releaseTagLink(changedRelease.version)"
        :title="changedRelease.date"
      >
        v{{ changedRelease.version }}
      </Badge>
    </div>
    <div
      v-if="git?.contributors?.length"
      class="detail-meta-row"
    >
      <Label>{{ isEnglish ? 'Contributors:' : '贡献者：' }}</Label>
      <Badge :title="git.contributors.join(', ')">
        {{ git.contributors.join(', ') }}
      </Badge>
    </div>
  </div>
</template>

<style scoped>
.detail-meta {
  display: flex;
  min-width: 160px;
  flex-direction: column;
  gap: 8px;
  margin-left: auto;
  margin-top: 24px;
}

.detail-meta-row {
  display: flex;
  flex-wrap: nowrap;
  gap: 6px;
  align-items: center;
  justify-content: flex-start;
  white-space: nowrap;
  font-size: 13px;
}

.detail-meta-row :deep(.label) {
  flex: 0 0 auto;
  line-height: 22px;
  font-size: 13px;
}

@media (min-width: 860px) {
  .detail-meta {
    border-left: 1px solid var(--vp-c-divider);
    padding-left: 16px;
    margin-top: 0;
  }
}

@media (min-width: 960px) {
  .detail-meta {
    border-left: none;
    padding-left: 0;
    margin-top: 24px;
  }
}

@media (min-width: 1152px) {
  .detail-meta {
    border-left: 1px solid var(--vp-c-divider);
    padding-left: 16px;
    margin-top: 0;
  }
}
</style>
