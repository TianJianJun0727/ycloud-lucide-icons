---
title: Global Styling - React
description: Learn how to style all YCloud icons globally in your React application using CSS or the YCloud context provider.
---

<script setup>
import Sandpack from '~/.vitepress/theme/components/editors/Sandpack.vue';
</script>

# Global Styling

Adjusting icons can be done by using [color](../basics/color.md), [size](../basics/sizing.md) and [stroke width](../basics/stroke-width.md).
To style all icons globally, you can either use CSS, or use a context provider.

We recommend using CSS for global styling, as it is the most straightforward way to achieve this.
But using CSS prevents you from using props like `size`, `color` and `strokeWidth` on individual icons, since CSS specificity will override these props, to be able to use the props on individual ones you need to use the YCloud context provider.

## Context Provider

For global styling using a context provider, you can use the `YCloudProvider` component that is provided by the `@ycloud-web/icons-react` package.

<!-- TODO: Add codesandbox example -->

```tsx
import { YCloudProvider, Home } from '@ycloud-web/icons-react';

const App = () => (
  <YCloudProvider
    color="red"
    size={48}
    strokeWidth={2}
  >
    <Home />
  </YCloudProvider>
);
```

This will apply the `color`, `size` and `strokeWidth` props to all icons that are children of the `YCloudProvider`.

## Style by using CSS

Styling icons is easy to accomplish using CSS.

Every icon has a class attribute applied called `ycloud`. This class name can be used in the CSS file to target all icons that are being used within the app.

- The **color** of the icons can be changed using the [`color`](https://developer.mozilla.org/en-US/docs/Web/CSS/color) CSS property.
- The **size** of the icons can be changed using [`width`](https://developer.mozilla.org/en-US/docs/Web/CSS/width) and [`height`](https://developer.mozilla.org/en-US/docs/Web/CSS/height) CSS properties.
- The **stroke width** of the icons can be changed using the [`stroke-width`](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-width) CSS property.

::: sandpack {template=react editorHeight=300 dependencies="@ycloud-web/icons-react"}

```css icon.css [active]
.ycloud {
  /* Change this! */
  color: #ffadff;
  width: 56px;
  height: 56px;
  stroke-width: 1px;
}

.app {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 6px;
}
```

```jsx App.js
import {
  CakeSlice,
  Candy,
  Apple,
  Cookie,
  Martini,
  IceCream2,
  Sandwich,
  Wine,
  Dessert,
} from '@ycloud-web/icons-react';
import './icon.css';

function App() {
  return (
    <div className="app">
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

::: sandpack {template=react editorHeight=300 dependencies="@ycloud-web/icons-react"}

```css icon.css [active]
.ycloud {
  width: 48px;
  height: 48px;
  stroke-width: 1.5;
}

.ycloud * {
  vector-effect: non-scaling-stroke;
}

.app {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 6px;
}
```

```jsx App.js
import {
  TentTree,
  Caravan,
  FlameKindling,
  MountainSnow,
  Trees,
  Axe,
  Map,
  CloudMoon,
  Sparkles,
} from '@ycloud-web/icons-react';
import './icon.css';

function App() {
  return (
    <div className="app">
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
