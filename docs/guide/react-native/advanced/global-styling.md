---
title: Global Styling - React Native
description: Learn how to style all YCloud icons globally in your React Native application using CSS or the YCloud context provider.
---

# Global Styling

Adjusting icons can be done by using [color](../basics/color.md), [size](../basics/sizing.md) and [stroke width](../basics/stroke-width.md).
To style all icons globally, you can use a context provider.

## Context Provider

For global styling using a context provider, you can use the `YCloudIconsProvider` component that is provided by the `@ycloud-web/icons-react-native` package.

```tsx
import { YCloudIconsProvider, Home } from '@ycloud-web/icons-react-native';

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
