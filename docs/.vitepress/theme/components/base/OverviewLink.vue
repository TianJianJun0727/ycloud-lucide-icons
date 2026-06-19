<script setup lang="ts">
import { computed } from 'vue';
import VPLink from 'vitepress/dist/client/theme-default/components/VPLink.vue';

const props = defineProps<{
  href?: string;
  title?: string;
  desc?: string;
}>();

const textMap: Record<string, string> = {
  Overview: '概览',
  'Getting started': '快速开始',
  Basics: '基础',
  Color: '颜色',
  Sizing: '尺寸',
  'Stroke width': '描边宽度',
  Advanced: '进阶',
  Typescript: 'TypeScript',
  Accessibility: '无障碍',
  'Global styling': '全局样式',
  'Filled icons': '填充图标',
  'Aliased Names': '别名',
  'Combining icons': '组合图标',
  'Dynamic icon component': '动态图标组件',
  'SVG Files & Sprite': 'SVG 文件和 Sprite',
  'Icon Font': '图标字体',
  'Javascript modules': 'JavaScript 模块',
  'Use in Node.js': '在 Node.js 中使用',
  'Use in JS projects': '在 JavaScript 项目中使用',
};

const descMap: Record<string, string> = {
  'Learn how to get started with YCloud.': '了解如何开始使用 YCloud Icons。',
  'Learn how to get started with YCloud for Angular.': '了解如何在 Angular 中使用 YCloud Icons。',
  'Learn how to get started with YCloud for Astro.': '了解如何在 Astro 中使用 YCloud Icons。',
  'Learn how to get started with YCloud for PReact.': '了解如何在 Preact 中使用 YCloud Icons。',
  'Learn how to get started with YCloud React Native':
    '了解如何在 React Native 中使用 YCloud Icons。',
  'Learn how to get started with YCloud for React.': '了解如何在 React 中使用 YCloud Icons。',
  'Learn how to get started with YCloud for Svelte.': '了解如何在 Svelte 中使用 YCloud Icons。',
  'Learn how to get started with YCloud for Vue.': '了解如何在 Vue 中使用 YCloud Icons。',
  'Learn how to get started with YCloud static.': '了解如何使用 YCloud Icons 静态资源。',
  'Adjust the color of your icons': '调整图标颜色。',
  'Adjust the size of your icons': '调整图标尺寸。',
  'Adjust the stroke width of your icons': '调整图标描边宽度。',
  'All exported types and how to use them': '查看导出的类型以及使用方式。',
  'Making your icons accessible': '让图标对更多用户可访问。',
  'Apply global styles to all icons': '为所有图标应用全局样式。',
  'Apply options and styles globally': '全局应用选项和样式。',
  'Using filled icons in @ycloud-web/icons-angular':
    '在 @ycloud-web/icons-angular 中使用填充图标。',
  'Using filled icons in @ycloud-web/icons-preact': '在 @ycloud-web/icons-preact 中使用填充图标。',
  'Using filled icons in @ycloud-web/icons-react-native':
    '在 @ycloud-web/icons-react-native 中使用填充图标。',
  'Using filled icons in @ycloud-web/icons-react': '在 @ycloud-web/icons-react 中使用填充图标。',
  'Using filled icons in @ycloud-web/icons-solid': '在 @ycloud-web/icons-solid 中使用填充图标。',
  'Using filled icons in @ycloud-web/icons-svelte': '在 @ycloud-web/icons-svelte 中使用填充图标。',
  'Using filled icons in @ycloud-web/icons-vue': '在 @ycloud-web/icons-vue 中使用填充图标。',
  'Using filled icons in ycloud': '在 ycloud 中使用填充图标。',
  'Using aliased icon names': '使用图标别名。',
  'Combine multiple icons into one': '将多个图标组合成一个。',
  'Dynamically import icons as needed': '按需动态导入图标。',
  'Overview of using YCloud icons as static assets in your projects':
    '了解如何在项目中以静态资源方式使用 YCloud Icons。',
  'Use icons as images in your project': '在项目中以图片方式使用图标。',
  'Use SVG sprites in your project': '在项目中使用 SVG Sprite。',
  'Use icons as a web font in your project': '在项目中以 Web Font 方式使用图标。',
  'Use YCloud in your Node.js projects': '在 Node.js 项目中使用 YCloud Icons。',
  'Use YCloud in your JavaScript projects': '在 JavaScript 项目中使用 YCloud Icons。',
};

const localizedTitle = computed(() => (props.title ? textMap[props.title] ?? props.title : ''));
const localizedDesc = computed(() => (props.desc ? descMap[props.desc] ?? props.desc : ''));
</script>

<template>
  <VPLink
    class="overview-link"
    :href="href"
  >
    <span class="title">
      {{ localizedTitle }}
    </span>
    <span
      v-if="desc"
      class="desc"
    >
      {{ localizedDesc }}
    </span>
  </VPLink>
</template>

<style scoped>
.overview-link {
  display: block;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 11px 16px 13px;
  width: 100%;
  height: 100%;
  transition: border-color 0.25s;
  text-decoration: none;
}

.overview-link:hover {
  border-color: var(--vp-c-brand-1);
}

.desc {
  display: block;
  line-height: 20px;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  margin-top: 2px;
}

.title {
  display: block;
  line-height: 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  transition: color 0.25s;
}
</style>
