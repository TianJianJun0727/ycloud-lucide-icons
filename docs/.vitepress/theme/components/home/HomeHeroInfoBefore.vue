<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
import Badge from '../base/Badge.vue';
import { moveRight } from '@data/iconNodes';
import { Icon } from '@ycloud-web/icons-vue';
import { data } from './HomeHeroInfoBefore.data';
import RocketDuotoneIcon from './RocketDuotoneIcon.ts';

const { page } = useData();
const isEnglish = computed(() => page.value.relativePath?.startsWith?.('en/') ?? false);

function withLocale(path: string) {
  if (!isEnglish.value || path.startsWith('/en/') || path === '/en') {
    return path;
  }

  return `/en${path}`;
}

const changelogHref = computed(() => withLocale(data.changelogHref));
const installationHref = computed(() => withLocale(data.installationHref));
const installationText = computed(() => (isEnglish.value ? 'Installation' : '安装'));
</script>

<template>
  <div class="info">
    <Badge :href="changelogHref">
      {{ data.version }}
    </Badge>
    <Badge
      class="badge-special confetti-button animate"
      :href="installationHref"
    >
      <Icon :iconNode="RocketDuotoneIcon" />
      {{ installationText }}
      <Icon
        :iconNode="moveRight"
        class=""
      />
    </Badge>
  </div>
</template>

<style scoped>
.info {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  justify-content: center;
}

@media (min-width: 960px) {
  .info {
    justify-content: flex-start;
  }
}

.badge {
  display: inline-flex;
  gap: 8px;
  padding: 4px 8px;
}

.badge-special {
  font-weight: 500;
  color: var(--vp-c-brand-1);
  text-underline-offset: 2px;
  align-items: center;
}

.badge-special::before,
.badge-special::after {
  animation-delay: 0.5s !important;
  animation-duration: 5s !important;
  animation-iteration-count: infinite !important;
  animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1) !important;
  transform: translateX(32px);
}
</style>

<style>
@import '../icons/confetti.css';
</style>
