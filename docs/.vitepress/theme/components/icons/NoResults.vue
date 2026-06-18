<script setup lang="ts">
import { ref, onMounted, computed, markRaw, shallowReadonly, watch } from 'vue';
import {
  bird,
  squirrel,
  rabbit,
  ghost,
  castle,
  drama,
  dog,
  cat,
  wandSparkles,
  save,
  snowflake,
  cake,
  fish,
  turtle,
  rat,
  worm,
  testTubeDiagonal,
  sword,
} from '../../../data/iconNodes';
import createYCloudIcon from '@ycloud-web/icons-vue/src/createYCloudIcon';
import { useEventListener } from '@vueuse/core';
import VPButton from 'vitepress/dist/client/theme-default/components/VPButton.vue';
import { IconNode } from '../../types';

const { searchQuery, isBrandSearch } = defineProps<{
  searchQuery: string;
  isBrandSearch: boolean;
}>();

defineEmits(['clear']);

interface Placeholder {
  title: string;
  message: string;
  icon: IconNode;
  finePrint?: string;
}

const brandPlaceholders: Placeholder[] = shallowReadonly([
  {
    title: '暂不收录品牌图标',
    message: '你正在搜索 [name]，但 YCloud Icons 不收录品牌 Logo。',
    icon: markRaw(ghost),
  },
  {
    title: '这里没有 [name]',
    message: 'YCloud Icons 只维护通用图标，不维护品牌图标。',
    icon: markRaw(castle),
  },
  {
    title: '[name] 不在图标集中',
    message: '如果你需要品牌图标，可以考虑使用专门的品牌图标库。',
    icon: markRaw(drama),
  },
  {
    title: '未找到 [name]',
    message: '当前图标库没有收录这个品牌图标。',
    icon: markRaw(dog),
  },
  {
    title: '没有 [name] 图标',
    message: '可以尝试搜索更通用的概念图标。',
    icon: markRaw(cat),
  },
  {
    title: '无法加载 [name]',
    message: 'YCloud Icons 当前只维护通用开源图标。',
    icon: markRaw(save),
  },
  {
    title: '[name] 不适合加入这里',
    message: '品牌 Logo 通常涉及授权和一致性问题，因此不会加入主库。',
    icon: markRaw(wandSparkles),
  },
  {
    title: '未收录 [name]',
    message: '可以换一个关键词，搜索功能含义更通用的图标。',
    icon: markRaw(snowflake),
  },
  {
    title: '没有找到 [name]',
    message: 'YCloud Icons 不计划添加品牌 Logo。',
    icon: markRaw(cake),
  },
  {
    title: '这不是缺陷',
    message: '不收录 [name] 是为了保持图标库的通用性和可维护性。',
    icon: markRaw(worm),
  },
  {
    title: '实验没有通过',
    message: '[name] 这类品牌图标不适合放入通用图标库。',
    icon: markRaw(testTubeDiagonal),
  },
  {
    title: '换个关键词试试',
    message: '搜索更通用的含义，可能能找到替代图标。',
    icon: markRaw(sword),
  },
]);

const notFoundPlaceholders: Omit<Placeholder, 'title'>[] = shallowReadonly([
  {
    message: '没有找到匹配的图标。',
    icon: markRaw(bird),
  },
  {
    message: '当前关键词没有匹配结果。',
    icon: markRaw(squirrel),
  },
  {
    message: '这个图标暂时不存在。',
    icon: markRaw(rabbit),
  },
  {
    message: '没有找到符合条件的图标。',
    icon: markRaw(fish),
  },
  {
    message: '这个图标未来可能会加入，但现在还没有。',
    icon: markRaw(turtle),
  },
  {
    message: '当前图标库没有这个图标。',
    icon: markRaw(rat),
  },
]);

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const placeholderIcon = ref<HTMLElement>();
const placeholder = ref<Placeholder>();

watch(
  () => isBrandSearch,
  () => {
    placeholder.value = isBrandSearch
      ? {
          ...randomItem(brandPlaceholders),
          finePrint:
            'YCloud Icons 不接收品牌 Logo，也不计划在未来添加。这主要出于授权限制、设计一致性和长期维护成本的考虑。',
        }
      : {
          title: `没有找到“[name]”`,
          finePrint:
            '这个图标目前还不存在。你可以尝试搜索相近关键词，查看已有请求，或提交一个新的请求。',
          ...randomItem(notFoundPlaceholders),
        };
  },
  { immediate: true },
);
const iconComponent = computed(() => createYCloudIcon('placeholder', placeholder.value.icon));
const flip = ref(false);

onMounted(() => {
  useEventListener(document, 'mousemove', (mouseEvent) => {
    const { width, x } = placeholderIcon.value.getBoundingClientRect();

    const centerX = width / 2 + x;

    flip.value = !isBrandSearch && mouseEvent.x < centerX;
  });
});
</script>

<template>
  <div class="no-results">
    <component
      :is="iconComponent"
      class="placeholder-icon"
      ref="placeholderIcon"
      :class="{ flip }"
      :strokeWidth="1"
    />
    <h2 class="no-results-text">{{ placeholder.title.replace('[name]', searchQuery) }}</h2>
    <p class="no-results-message">
      {{ placeholder.message.replace('[name]', searchQuery) }}
    </p>
    <div class="divider"></div>
    <p
      v-if="placeholder.finePrint"
      class="no-results-fine-print"
    >
      {{ placeholder.finePrint }}
    </p>
    <VPButton
      v-if="isBrandSearch"
      text="前往 Simple Icons"
      theme="brand"
      :href="`https://simpleicons.org/?q=${searchQuery}`"
      target="_blank"
    />
    <VPButton
      v-else
      text="清空搜索并重试"
      theme="brand"
      @click="$emit('clear')"
    />
    <span class="text-divider">or</span>
    <VPButton
      v-if="isBrandSearch"
      text="阅读品牌 Logo 说明"
      theme="alt"
      href="https://github.com/ycloud-icons/@ycloud-web/icons/blob/main/BRAND_LOGOS_STATEMENT.md"
      target="_blank"
    />
    <VPButton
      v-else
      text="搜索 GitHub Issues"
      theme="alt"
      :href="`https://github.com/ycloud-icons/@ycloud-web/icons/issues?q=is%3Aopen+${searchQuery}`"
      target="_blank"
    />
  </div>
</template>

<style scoped>
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-block: 48px;
}

.placeholder-icon {
  width: 96px;
  height: 96px;
  color: var(--vp-c-text-1);
}

.placeholder-icon.flip {
  transform: rotateY(180deg);
}

.no-results-text {
  line-height: 1.35;
  font-size: 24px;
  margin-top: 24px;
  margin-bottom: 8px;
  text-wrap: balance;
}

.no-results-message {
  text-wrap: balance;
}

.no-results-fine-print {
  max-inline-size: 60ch;
  font-size: 14px;
  margin-bottom: 32px;
  color: var(--vp-c-text-2);
  text-wrap: balance;
}

.text-divider {
  margin: 12px 0;
  font-size: 16px;
  color: var(--vp-c-neutral);
}
.divider {
  margin: 24px auto 18px;
  width: 64px;
  height: 1px;
  background-color: var(--vp-c-divider);
}
</style>
