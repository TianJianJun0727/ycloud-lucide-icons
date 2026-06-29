# Business Icons

This directory stores business-specific SVG icons that do not follow the generic
YCloud linear icon rules.

Use this directory for icons that need filled shapes or product-specific visual
details.

Place icons in `business-icons/<category>/<icon-name>.svg`. Each category also
keeps a `business-icons/<category>/index.json` file for its Chinese title,
English title, and sort weight. The root `business-icons/index.json` is
generated and consumed by validation, the Figma plugin, docs, package
generation, and duplicate-name checks.

Allowed categories are `inbox`, `menu`, `chatbot`, `outlined`, `filled`,
`basic`, and `filter`.

These files are not processed by the generic `icons/*.svg` SVGO cleanup
pipeline. They use a lighter business cleanup that clears colors, style
attributes, and design-tool noise while preserving geometry and stroke details.
They are still validated for basic SVG safety and structure.

Package outputs are flat by icon name, so SVG file names must be unique across
all business categories. For example, `business-icons/menu/billing.svg` exports
`Billing` from framework business subpaths and `billingDataUri` from core data
subpaths, including `@ycloud-web/icons/business` and
`@ycloud-web/icons-data/business`.

Usage examples:

```tsx
import { Billing } from '@ycloud-web/icons-react/business';
```

```ts
import { billingDataUri } from '@ycloud-web/icons-data/business';
```

```html
<link
  rel="stylesheet"
  href="@ycloud-web/icons-static/business-font/ycloud-business.css"
/>

<div class="business-icon-billing"></div>
```

Current rules:

- File names must use lowercase kebab-case, for example `whatsapp-business.svg`.
- Category folders must use one of the allowed names above.
- Category folders must include `index.json`.
- The root `business-icons/index.json` must match `node ./scripts/writeBusinessIconIndex.mts`.
- The root element must be `<svg>`.
- `<script>` and `<foreignObject>` are not allowed.
- Event handler attributes such as `onclick` are not allowed.
- `fill` and `stroke` must be `currentColor` or `none` after cleanup.
- `style`, `class`, unreferenced `id`, and `data-*` attributes are not allowed.
- `javascript:` URLs are not allowed.
