<script setup lang="ts">
import { computed } from 'vue';
import { useData, withBase } from 'vitepress';
import VPLink from 'vitepress/dist/client/theme-default/components/VPLink.vue';
import { data } from './BusinessCategoryList.data';
import SidebarTitle from './SidebarTitle.vue';

const { page } = useData();
const isEnglish = computed(() => page.value.relativePath?.startsWith?.('en/') ?? false);
const overviewHref = computed(() => (isEnglish.value ? '/en/business-icons/' : '/business-icons/'));

const headers = computed(() => {
  const pagePath = isEnglish.value ? '/en/business-icons/' : '/business-icons/';

  return data.categories.map(({ name, title, englishTitle, iconCount }) => ({
    level: 2,
    link: `${withBase(pagePath)}#${name}`,
    title: isEnglish.value ? englishTitle : title,
    iconCount,
    name,
  }));
});
</script>

<template>
  <div class="business-category-list">
    <SidebarTitle>{{ isEnglish ? 'View' : '视图' }}</SidebarTitle>
    <VPLink
      class="sidebar-link sidebar-text active"
      :href="overviewHref"
    >
      {{ isEnglish ? 'All' : '全部' }}
    </VPLink>
    <SidebarTitle>{{ isEnglish ? 'Categories' : '分类' }}</SidebarTitle>
    <div class="content">
      <div class="outline-marker" />
      <nav aria-labelledby="doc-outline-aria-label">
        <ul class="root">
          <li v-for="{ link, title, iconCount, name } in headers">
            <a
              class="outline-link"
              :href="link"
              :title="title"
              :class="{ inactive: iconCount === 0 }"
            >
              <span>{{ title }}</span>
              <span
                class="icon-count"
                :aria-label="
                  isEnglish ? `${iconCount} icons in ${title}` : `${title} 分类下的图标数量`
                "
              >
                {{ iconCount }}
              </span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.business-category-list {
  margin-top: 8px;
}

.sidebar-text {
  line-height: 24px;
  font-size: 14px;
  display: block;
  transition: color 0.25s;
  padding: 4px 0;
}

.sidebar-link {
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.sidebar-link:hover,
.sidebar-link.active {
  color: var(--vp-c-brand);
}

.content {
  margin-top: 12px;
  position: relative;
  border-left: 1px solid var(--vp-c-divider);
  padding-left: 16px;
  font-size: 13px;
  font-weight: 500;
}

.outline-marker {
  position: absolute;
  top: 32px;
  left: -1px;
  z-index: 0;
  opacity: 0;
  width: 1px;
  height: 18px;
  background-color: var(--vp-c-brand);
}

.root {
  position: relative;
  z-index: 1;
}

.outline-link {
  display: flex;
  align-items: baseline;
  line-height: 28px;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.5s;
  font-weight: 500;
}

.outline-link:hover,
.outline-link.active {
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}

.outline-link.inactive {
  color: var(--vp-c-text-4);
  pointer-events: none;
}

.icon-count {
  opacity: 0.5;
  margin-left: auto;
  font-size: 11px;
  font-weight: 400;
}

.outline-link.inactive .icon-count {
  opacity: 0;
}
</style>
