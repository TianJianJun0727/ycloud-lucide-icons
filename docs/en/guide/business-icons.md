---
title: Business icons
description: Source, validation, and submission rules for business-specific SVG icons.
---

# Business icons

`business-icons/` stores business-specific SVGs that should not enter the generic icon library.

Generic icons live in `icons/` and follow the 24x24 linear `currentColor` rules with `stroke-width="2"` and metadata. Business icons use minimal cleanup instead: fixed colors, styles, and design-tool noise are removed, while size, stroke details, and geometry are preserved. They also do not enter the generic category and metadata system.

## When to use it

Use `business-icons/` when an SVG:

- contains product, channel, status, or business-object details
- should be maintained as a business source asset instead of a generic package icon
- needs to preserve its original size, stroke width, line caps, line joins, or geometry

If the artwork can become a generic linear icon, keep it in `icons/`.

## Directory

```text
business-icons/<business-category>/<icon-name>.svg
```

Business categories are represented by first-level folders. The allowed folders are:

```text
inbox
menu
chatbot
outlined
filled
basic
filter
```

Business icons do not currently need matching JSON metadata and are not included in the generic icon search or category pages. They are generated into `business` subpath entries in the existing packages instead of being mixed into the generic default entries. Package component exports are still based on the SVG file name and do not include the category name, so SVG file names must remain unique across categories.

## Cleanup And Validation

Business icons run through a dedicated business SVG cleanup pipeline. It does not reuse the generic 24x24 linear icon normalization rules; it only performs minimal cleanup.

Business cleanup will:

- remove `<script>`, `<foreignObject>`, event attributes, and `javascript:` URLs
- remove design-tool noise such as `style`, `class`, unreferenced `id`, and `data-*`
- convert hardcoded `fill` and `stroke` to `currentColor` or keep `none`
- preserve original `width`, `height`, `viewBox`, `stroke-width`, `stroke-linecap`, `stroke-linejoin`, and geometry

Only baseline structure and safety checks run:

- paths must use `business-icons/<business-category>/<icon-name>.svg`
- business category folders must be one of the allowed first-level folders
- file names must be lowercase kebab-case
- the root element must be `<svg>`
- `fill` and `stroke` may only be `currentColor` or `none`
- style and design-tool attributes such as `style`, `class`, and `data-*` are not allowed
- `<script>` and `<foreignObject>` are not allowed
- event attributes such as `onclick` are not allowed
- `javascript:` URLs are not allowed

Run locally:

```sh
node ./scripts/optimizeBusinessSvgs.mts
node ./scripts/checkBusinessSvgSource.mts
```

## Figma plugin submission

When “Business icons” is selected in the Figma plugin, the plugin will:

- choose a business category from a single-select dropdown
- submit files to `business-icons/<business-category>/*.svg`
- clean SVGs with the business SVG rules before submission
- skip `icons/*.json` generation
- skip generic multi-category, tag, and use-case requirements
- only block SVGs that fail the business SVG baseline checks

When “Generic icons” is selected, the plugin keeps using the existing `icons/*.svg` + `icons/*.json` flow.

## Usage

For shared usage across projects, keep installing the existing package and import from the `business` subpath.

### Core package

Install this package when you need SVG strings, data URIs, or shared icon definitions:

```sh
pnpm add @ycloud-web/icons
```

```ts
import {
  businessIcons,
  whatsappBusinessDataUri,
  whatsappBusinessSvg,
} from '@ycloud-web/icons/business';

const svg = whatsappBusinessSvg;
const imageSrc = whatsappBusinessDataUri;
const icon = businessIcons['whatsapp-business'];
```

### React package

React projects can use the business entry in the existing React package:

```sh
pnpm add @ycloud-web/icons-react
```

```tsx
import { WhatsappBusiness } from '@ycloud-web/icons-react/business';

export function ChannelIcon() {
  return <WhatsappBusiness size={24} />;
}
```

React components render an `<img>` backed by the cleaned business SVG data URI.

Other framework packages use the same `business` subpath pattern:

```ts
import { WhatsappBusiness } from '@ycloud-web/icons-preact/business';
import { WhatsappBusiness } from '@ycloud-web/icons-vue/business';
import { WhatsappBusiness } from '@ycloud-web/icons-solid/business';
import { WhatsappBusiness } from '@ycloud-web/icons-svelte/business';
import { WhatsappBusiness } from '@ycloud-web/icons-astro/business';
import { WhatsappBusiness } from '@ycloud-web/icons-react-native/business';
```

The Angular package exports business icon definitions for direct data URI binding:

```ts
import { whatsappBusinessDataUri } from '@ycloud-web/icons-angular';
```

### Static package

Install this package when you need the raw SVG file URL:

```sh
pnpm add @ycloud-web/icons-static
```

```ts
import whatsappBusinessIconUrl from '@ycloud-web/icons-static/business-icons/inbox/whatsapp-business.svg';
```

Business icons only clear fixed colors, styles, and design-tool noise; size, stroke details, and geometry are not rewritten.
