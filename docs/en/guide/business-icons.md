---
title: Business icons
description: Source, validation, and submission rules for business-specific SVG icons.
---

# Business icons

`business-icons/` stores business-specific SVGs that should not enter the generic icon library.

Generic icons live in `icons/` and follow the 24x24 linear `currentColor` rules with `stroke-width="2"` and metadata. Business icons are split by color mode into mono, duotone, and multicolor sources. They use dedicated cleanup and validation rules, and they do not enter the generic category and metadata system.

## When to use it

Use `business-icons/` when an SVG:

- contains product, channel, status, or business-object details
- should be maintained as a business source asset instead of a generic package icon
- needs to preserve its original size, stroke width, line caps, line joins, or geometry

If the artwork can become a generic linear icon, keep it in `icons/`.

## Directory

```text
business-icons/<color-mode>/<icon-name>.svg
business-icons/<color-mode>/index.json
business-icons/index.json
```

Business icon first-level folders now represent color modes instead of business categories. Each folder keeps its Chinese and English display title in `business-icons/<color-mode>/index.json`. The root `business-icons/index.json` is generated for validation, the Figma plugin, docs, package generation, and duplicate-name checks.

The current allowed folders are:

```text
mono
duotone
multicolor
```

Business icons do not need per-SVG metadata JSON and are not included in the generic icon metadata system. They are generated into `business` subpath entries in the existing packages instead of being mixed into the generic default entries. Package component exports are still based on the SVG file name and do not include the color mode, so SVG file names must remain unique across color-mode folders.

## Cleanup And Validation

Business icons run through a dedicated business SVG cleanup pipeline. It does not reuse the generic 24x24 linear icon normalization rules, and it does not rewrite size, stroke details, or geometry.

Business cleanup will:

- remove `<script>`, `<foreignObject>`, event attributes, and `javascript:` URLs
- remove design-tool noise such as `style`, `class`, unreferenced `id`, and `data-*`
- `mono`: convert hardcoded `fill` and `stroke` to `currentColor`, or keep `none`
- `duotone`: convert white fills/strokes to `var(--business-icon-secondary-color)` and all other colors to `var(--business-icon-primary-color)`, without relying on path order
- `multicolor`: keep fixed colors from the source SVG
- preserve original `width`, `height`, `viewBox`, `stroke-width`, `stroke-linecap`, `stroke-linejoin`, and geometry

Only baseline structure and safety checks run:

- paths must use `business-icons/<color-mode>/<icon-name>.svg`
- color-mode folders must include `business-icons/<color-mode>/index.json`
- root `business-icons/index.json` must match `node ./scripts/writeBusinessIconIndex.mts`
- file names must be lowercase kebab-case
- the root element must be `<svg>`
- `mono` `fill` and `stroke` may only be `currentColor` or `none`
- `duotone` `fill` and `stroke` may only be `var(--business-icon-primary-color)`, `var(--business-icon-secondary-color)`, or `none`
- `multicolor` may keep fixed colors, but still runs through the safety checks
- style and design-tool attributes such as `style`, `class`, and `data-*` are not allowed
- `<script>` and `<foreignObject>` are not allowed
- event attributes such as `onclick` are not allowed
- `javascript:` URLs are not allowed

Run locally:

```sh
node ./scripts/optimizeBusinessSvgs.mts
node ./scripts/writeBusinessIconIndex.mts
node ./scripts/checkBusinessSvgSource.mts
```

## Figma plugin submission

When “Business icons” is selected in the Figma plugin, the plugin will:

- choose Mono, Duotone, or Multicolor
- submit files to `business-icons/<color-mode>/*.svg`
- clean SVGs with the business SVG rules before submission
- skip `icons/*.json` generation
- skip generic multi-category, tag, and use-case requirements
- only block SVGs that fail the business SVG baseline checks

When “Generic icons” is selected, the plugin keeps using the existing `icons/*.svg` + `icons/*.json` flow.

## Usage

For shared usage across projects, keep installing the existing package and import from the `business` subpath.

### Core package

Install this package when you need structured SVG definitions or a shared icon index:

```sh
pnpm add @ycloud-web/icons
```

```ts
import {
  businessIcons,
  getBusinessIcon,
} from '@ycloud-web/icons/business';

const icon = getBusinessIcon('billing');
const rootAttrs = icon.attrs;
const children = icon.node;
const sameIcon = businessIcons['billing'];
```

### React package

React projects can use the business entry in the existing React package:

```sh
pnpm add @ycloud-web/icons-react
```

```tsx
import { Billing } from '@ycloud-web/icons-react/business';

export function ChannelIcon() {
  return (
    <Billing
      size={24}
      color="#111827"
    />
  );
}
```

React business icon components render inline `<svg>`. `mono` and `duotone` support `size` and `color`; `duotone` also supports `secondaryColor`, defaulting to `#fff`. `multicolor` keeps fixed source colors and only supports size changes.

```tsx
import { Shopify } from '@ycloud-web/icons-react/business';

export function DuotoneIcon() {
  return (
    <Shopify
      size={24}
      color="#111827"
      secondaryColor="#fff"
    />
  );
}
```

Other framework packages use the same `business` subpath pattern:

```ts
import { Billing } from '@ycloud-web/icons-preact/business';
import { Billing } from '@ycloud-web/icons-vue/business';
import { Billing } from '@ycloud-web/icons-solid/business';
import { Billing } from '@ycloud-web/icons-svelte/business';
import { Billing } from '@ycloud-web/icons-astro/business';
import { Billing } from '@ycloud-web/icons-react-native/business';
```

The Angular package exports business icon definitions that can be rendered as inline SVG or serialized by your application:

```ts
import { getBusinessIcon } from '@ycloud-web/icons-angular';

const billing = getBusinessIcon('billing');
```

### Static package

Install this package when you need the raw SVG file URL:

```sh
pnpm add @ycloud-web/icons-static
```

```ts
import billingIconUrl from '@ycloud-web/icons-static/business-icons/mono/billing.svg';
```

Business icons also generate a separate icon font. It is not mixed into the generic `font/ycloud.css` output:

```css
@import '@ycloud-web/icons-static/business-font/ycloud-business.css';
```

```html
<div class="business-icon-billing"></div>
```

Static SVGs and data packages keep the cleaned color tokens. During component package generation, duotone primary and secondary tokens are converted to framework props; multicolor icons always keep their fixed source colors.
