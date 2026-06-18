---
title: Global Styling - Solid
description: Learn how to style all YCloud icons globally in your Solid application using CSS or the YCloud context provider.
---

<script setup>
import Sandpack from '~/.vitepress/theme/components/editors/Sandpack.vue'
</script>

# Global Styling

Adjusting icons can be done by using [color](../basics/color.md), [size](../basics/sizing.md) and [stroke width](../basics/stroke-width.md).
To style all icons globally, you can either use CSS, or use a context provider.

We recommend using CSS for global styling, as it is the most straightforward way to achieve this.
But using CSS prevents you from using props like `size`, `color` and `strokeWidth` on individual icons, since CSS specificity will override these props, to be able to use the props on individual ones you need to use the YCloud context provider.

## Context Provider

For global styling using a context provider, you can use the `YCloudIconsProvider` component that is provided by the `@ycloud-web/icons-solid` package.

<!-- TODO: Replace this with live example after release -->

```tsx
import { YCloudIconsProvider, Home } from '@ycloud-web/icons-solid';

const App = () => (
  <YCloudIconsProvider
    color="red"
    size={48}
    strokeWidth={2}
  >
    <Home />
  </YCloudIconsProvider>
);
```

This will apply the `color`, `size` and `strokeWidth` props to all icons that are children of the `YCloudIconsProvider`.

## Style by using CSS

Styling icons is easy to accomplish using CSS.

Every icon has a class attribute applied called `ycloud`. This class name can be used in the CSS file to target all icons that are being used within the app.

- The **color** of the icons can be changed using the [`color`](https://developer.mozilla.org/en-US/docs/Web/CSS/color) CSS property.
- The **size** of the icons can be changed using [`width`](https://developer.mozilla.org/en-US/docs/Web/CSS/width) and [`height`](https://developer.mozilla.org/en-US/docs/Web/CSS/height) CSS properties.
- The **stroke width** of the icons can be changed using the [`stroke-width`](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-width) CSS property.

::: sandpack {template=vite-solid editorHeight=300 editorWidthPercentage=60 dependencies="@ycloud-web/icons-solid"}

```css icon.css [active]
.ycloud {
  /* Change this! */
  color: #ffadff;
  width: 48px;
  height: 48px;
  stroke-width: 1px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 6px;
}
```

```tsx App.tsx
import CakeSlice from '@ycloud-web/icons-solid/icons/cake-slice';
import Candy from '@ycloud-web/icons-solid/icons/candy';
import Apple from '@ycloud-web/icons-solid/icons/apple';
import Cookie from '@ycloud-web/icons-solid/icons/cookie';
import Martini from '@ycloud-web/icons-solid/icons/martini';
import IceCream2 from '@ycloud-web/icons-solid/icons/ice-cream-2';
import Sandwich from '@ycloud-web/icons-solid/icons/sandwich';
import Wine from '@ycloud-web/icons-solid/icons/wine';
import Dessert from '@ycloud-web/icons-solid/icons/dessert';
import './icon.css';

function App() {
  return (
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
  );
}

export default App;
```

:::

### Absolute stroke width

For global absolute stroke width styling the `vector-effect: non-scaling-stroke` CSS property can be applied to the children. This will keep the stroke-width the same size no matter the size of the icon. See [absolute-stroke-width](../basics/stroke-width.md#absolute-stroke-width) for more info.

::: sandpack {template=vite-solid editorHeight=300 editorWidthPercentage=60 dependencies="@ycloud-web/icons-solid"}

```css icon.css [active]
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

```tsx App.tsx
import TentTree from '@ycloud-web/icons-solid/icons/tent-tree';
import Caravan from '@ycloud-web/icons-solid/icons/caravan';
import FlameKindling from '@ycloud-web/icons-solid/icons/flame-kindling';
import MountainSnow from '@ycloud-web/icons-solid/icons/mountain-snow';
import Trees from '@ycloud-web/icons-solid/icons/trees';
import Axe from '@ycloud-web/icons-solid/icons/axe';
import Map from '@ycloud-web/icons-solid/icons/map';
import CloudMoon from '@ycloud-web/icons-solid/icons/cloud-moon';
import Sparkles from '@ycloud-web/icons-solid/icons/sparkles';
import './icon.css';

function App() {
  return (
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
  );
}

export default App;
```

:::
