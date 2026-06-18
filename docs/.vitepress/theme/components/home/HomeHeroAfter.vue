<script setup lang="ts">
import { useRouter, withBase } from 'vitepress';
import Badge from '../base/Badge.vue';
import HomeContainer from './HomeContainer.vue';
import { data } from './HomeHeroIconsCard.data';
import FakeInput from '../base/FakeInput.vue';
import { nextTick, provide } from 'vue';
import useSearchShortcut from '../../utils/useSearchShortcut';

const { go } = useRouter();
const iconsSearchPath = withBase('/icons/?focus');

const { shortcutText: kbdSearchShortcut } = useSearchShortcut(() => {
  go(iconsSearchPath);
});

const enableTransitions = () =>
  'startViewTransition' in document &&
  window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

async function handleClick(event: MouseEvent) {
  if (!enableTransitions()) {
    go(iconsSearchPath);
    return;
  }

  await document.startViewTransition(async () => {
    await go(iconsSearchPath);
    await nextTick();
  }).ready;
}
</script>
<template>
  <FakeInput
    @click="go(iconsSearchPath)"
    :shortcut="kbdSearchShortcut"
    class="search-box"
  >
    搜索 {{ data.iconsCount }} 个图标...
  </FakeInput>
</template>

<style scoped>
.search-box {
  view-transition-name: icons-search-box;
  width: 100%;
  margin-top: 24px;
}
</style>
