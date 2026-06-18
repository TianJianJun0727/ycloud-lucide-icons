---
title: Typescript - Solid
description: Learn about the different types exported by the `@ycloud-web/icons-solid` package and how to use them in your Solid application.
---

# TypeScript Support

List of exported types from the `@ycloud-web/icons-solid` package.
These can be used to type your components when using YCloud icons in a TypeScript React project

## `YCloudIconsProps`

Exports all props that can be passed to an icon component and any other SVG attributes, see: [SVG Presentation Attributes on MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation).

```ts
interface YCloudIconsProps extends SVGAttributes {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  absoluteStrokeWidth?: boolean;
  [key: string]: any; // Any other SVG attributes
}
```

### Using `YCloudIconsProps`

You can use the `YCloudIconsProps` interface to type your custom icon components or when you need to work with icon props.

```tsx
import { type YCloudIconsProps } from '@ycloud-web/icons-solid';
import { Camera } from '@ycloud-web/icons-solid';

const WrapIcon = (props: YCloudIconsProps) => {
  return <Camera {...props} />;
};

export default WrapIcon;
```

## `YCloudIcon`

Type for individual icon components.

```ts
type YCloudIcon = (props: YCloudIconsProps) => JSX.Element;
```

### Using `YCloudIcon`

You can use the `YCloudIcon` type when you need to work with icon components directly.

```tsx
import { type YCloudIcon, Camera } from '@ycloud-web/icons-solid';

interface ButtonProps {
  icon: YCloudIcon;
  label: string;
}

const IconButton = ({ icon: Icon, label }) => {
  return (
    <button aria-label={label}>
      <Icon size={16} />
    </button>
  );
};

export default IconButton;
```

## `IconNode`

Type for the raw SVG structure of an icon. This is an array of SVG elements and their attributes to render the icon.
Not commonly used directly in application code. But can be useful for advanced use cases, such as using custom icons or [with YCloud Icons Lab](./with-ycloud-lab).

```ts
type IconNode = [elementName: string, attrs: Record<string, string | number>][];
```

### Using `IconNode`

You can use the `IconNode` type when you need to work with the raw SVG structure of an icon.

```tsx
import { type IconNode, Icon } from '@ycloud-web/icons-solid';

const customIcon: IconNode = [
  ['circle', { cx: 12, cy: 12, r: 10 }],
  ['line', { x1: 12, y1: 8, x2: 12, y2: 12 }],
  ['line', { x1: 12, y1: 16, x2: 12, y2: 16 }],
];

const MyCustomIcon = () => {
  return (
    <Icon
      iconNode={customIcon}
      size={24}
      color="blue"
    />
  );
};

export default MyCustomIcon;
```
