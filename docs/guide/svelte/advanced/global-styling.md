---
title: Global Styling - Svelte
description: Learn how to style all YCloud icons globally in your Svelte application using CSS or the YCloud context provider.
---

<script setup>
import Sandpack from '~/.vitepress/theme/components/editors/SandpackSvelte.vue';
</script>

# Global Styling

Adjusting icons can be done by using [color](../basics/color.md), [size](../basics/sizing.md) and [stroke width](../basics/stroke-width.md).
To style all icons globally, you can either use CSS, or use a context provider.

We recommend using CSS for global styling, as it is the most straightforward way to achieve this.
But using CSS prevents you from using props like `size`, `color` and `strokeWidth` on individual icons, since CSS specificity will override these props, to be able to use the props on individual ones you need to use the YCloud context provider.

## Context Provider

YCloud Svelte provides a context API called `setYCloudIconsProps` that allows you to set global default properties for all YCloud icons in your application.
This is useful if you want all icons to share the same size, color, or stroke width by default.

### Setting global defaults

You can call `setYCloudIconsProps` in your main entry file or in a top-level component to set the default properties for all icons.

```js
import { setYCloudIconsProps } from '@ycloud-web/icons-svelte';

setYCloudIconsProps({
  size: 32,
  color: '#4f46e5',
  strokeWidth: 1.5,
});
```

## Style by using CSS

Styling icons is easy to accomplish using CSS.

Every icon has a class attribute applied called `ycloud`. This class name can be used in the CSS file to target all icons that are being used within the app.

- The **color** of the icons can be changed using the [`color`](https://developer.mozilla.org/en-US/docs/Web/CSS/color) CSS property.
- The **size** of the icons can be changed using [`width`](https://developer.mozilla.org/en-US/docs/Web/CSS/width) and [`height`](https://developer.mozilla.org/en-US/docs/Web/CSS/height) CSS properties.
- The **stroke width** of the icons can be changed using the [`stroke-width`](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-width) CSS property.

::: sandpack {template=vite-svelte editorHeight=420 editorWidthPercentage=55}

```css src/icon.css [active]
.ycloud {
  /* Change this! */
  color: #ffadff;
  width: 56px;
  height: 56px;
  stroke-width: 1px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 6px;
}
```

```svelte src/App.svelte
<script>
import CakeSlice from '@ycloud-web/icons-svelte/icons/cake-slice';
import Candy from '@ycloud-web/icons-svelte/icons/candy';
import Apple from '@ycloud-web/icons-svelte/icons/apple';
import Cookie from '@ycloud-web/icons-svelte/icons/cookie';
import Martini from '@ycloud-web/icons-svelte/icons/martini';
import IceCream2 from '@ycloud-web/icons-svelte/icons/ice-cream-2';
import Sandwich from '@ycloud-web/icons-svelte/icons/sandwich';
import Wine from '@ycloud-web/icons-svelte/icons/wine';
import Dessert from '@ycloud-web/icons-svelte/icons/dessert';

import "./icon.css";
</script>

<div class="grid">
  <CakeSlice />
  <Candy />
  <Apple />
  <Cookie />
  <Martini />
  <IceCream2 />
  <Sandwich />
  <Wine />
  <Dessert />
</div>
```

:::

### Absolute stroke width

For global absolute stroke width styling the `vector-effect: non-scaling-stroke` CSS property can be applied to the children. This will keep the stroke-width the same size no matter the size of the icon. See [absolute-stroke-width](../basics/stroke-width.md#absolute-stroke-width) for more info.

::: sandpack {template=vite-svelte editorHeight=420 editorWidthPercentage=55}

```css src/icon.css [active]
.ycloud {
  width: 48px;
  height: 48px;
  stroke-width: 1.5;
}

.ycloud * {
  vector-effect: non-scaling-stroke;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 6px;
}
```

```svelte src/App.svelte
<script>
import TentTree from '@ycloud-web/icons-svelte/icons/tent-tree';
import Caravan from '@ycloud-web/icons-svelte/icons/caravan';
import FlameKindling from '@ycloud-web/icons-svelte/icons/flame-kindling';
import MountainSnow from '@ycloud-web/icons-svelte/icons/mountain-snow';
import Trees from '@ycloud-web/icons-svelte/icons/trees';
import Axe from '@ycloud-web/icons-svelte/icons/axe';
import Map from '@ycloud-web/icons-svelte/icons/map';
import CloudMoon from '@ycloud-web/icons-svelte/icons/cloud-moon';
import Sparkles from '@ycloud-web/icons-svelte/icons/sparkles';

import "./icon.css";
</script>

<div class="grid">
  <TentTree />
  <Caravan />
  <FlameKindling />
  <MountainSnow />
  <Trees />
  <Axe />
  <Map />
  <CloudMoon />
  <Sparkles />
</div>
```

:::
