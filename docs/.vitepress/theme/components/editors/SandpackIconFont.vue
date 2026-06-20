<script lang="ts" setup>
import Sandpack from './Sandpack.vue';
import { ycloudFontDataUrl } from '../../../data/fontDataUrl';
import ycloudFontCss from '../../../../../packages/icons-static/font/ycloud.css?raw';

const fontCss = ycloudFontCss.replace(
  /@font-face\s*\{[\s\S]*?\}\s*/,
  `@font-face {
  font-family: "ycloud";
  src: url("${ycloudFontDataUrl}") format("woff2");
}
`,
);

const files = {
  '/index.html': {
    active: true,
    code: `<!doctype html>
<html>
  <head>
    <title>YCloud Icons Icon Font</title>
  </head>
  <body>
    <main id="app"></main>
    <script type="module" src="/index.js"><\\/script>
  </body>
</html>`,
  },
  '/index.js': {
    code: `import './styles.css';

const icons = ['house', 'camera', 'bell', 'heart'];
const app = document.querySelector('#app');

app.innerHTML = icons
  .map(
    (name) => \`
      <button class="icon-button" type="button" aria-label="\${name}">
        <i class="icon-\${name}" aria-hidden="true"></i>
        <span>\${name}</span>
      </button>
    \`,
  )
  .join('');`,
  },
  '/styles.css': {
    code: `${fontCss}

body {
  min-height: 100vh;
  margin: 0;
  display: grid;
  place-items: center;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

#app {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  padding: 24px;
}

.icon-button {
  width: 104px;
  height: 88px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  color: #111827;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 8px 24px rgba(17, 24, 39, 0.08);
}

.icon-button i {
  font-size: 28px;
  line-height: 1;
}

.icon-button span {
  font-size: 13px;
  color: #4b5563;
}
`,
  },
};

const options = {
  showTabs: true,
  editorHeight: 480,
  editorWidthPercentage: 60,
};
</script>

<template>
  <Sandpack
    template="vanilla"
    :files="files"
    :options="options"
  />
</template>
