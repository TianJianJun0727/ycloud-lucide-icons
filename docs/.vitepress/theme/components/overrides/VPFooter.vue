<script setup lang="ts">
import { useData } from 'vitepress';
import { useSidebar } from 'vitepress/dist/client/theme-default/composables/sidebar';
import VPLink from 'vitepress/dist/client/theme-default/components/VPLink.vue';
import { computed } from 'vue';

const { theme } = useData();
const { hasSidebar } = useSidebar();

const githubLink = computed(
  () => theme.value.socialLinks.find(({ icon }) => icon === 'github').link,
);

const links = computed(() => [
  {
    text: 'License',
    href: '/license',
  },
  {
    text: 'Changelog',
    href: `${githubLink.value}/releases`,
  },
  {
    text: 'GitHub',
    href: `${githubLink.value}`,
  },
  {
    text: 'Issues',
    href: `${githubLink.value}/issues`,
  },
]);
</script>

<template>
  <footer
    v-if="theme.footer"
    class="VPFooter"
    :class="{ 'has-sidebar': hasSidebar }"
  >
    <div class="container">
      <nav
        class="links"
        aria-label="Footer"
      >
        <VPLink
          v-for="link in links"
          :href="link.href"
          :key="link.text"
          :rel="link.href.startsWith('http') ? 'noreferrer noopener' : undefined"
        >
          {{ link.text }}
        </VPLink>
      </nav>
      <div class="meta">
        <p
          v-if="theme.footer.message"
          class="message"
          v-html="theme.footer.message"
        ></p>
        <p
          v-if="theme.footer.copyright"
          class="copyright"
          v-html="theme.footer.copyright"
        ></p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.VPFooter {
  position: relative;
  z-index: var(--vp-z-index-footer);
  border-top: 1px solid var(--vp-c-gutter);
  padding: 32px 24px;
  background-color: var(--vp-c-bg);
}

.VPFooter.has-sidebar {
  display: none;
}

.container {
  margin: 0 auto;
  max-width: calc(var(--vp-layout-max-width) - 64px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.message,
.copyright {
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.message {
  margin: 0;
}
.copyright {
  margin: 0;
}

.links {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
}

@media (min-width: 1152px) {
  .VPFooter {
    padding: 32px;
  }

  .container {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }

  .meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
}
</style>
