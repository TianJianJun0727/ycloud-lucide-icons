# Business Icons

This directory stores business-specific SVG icons that do not follow the generic
YCloud linear icon rules.

Use this directory for icons that need filled shapes or product-specific visual
details.

Place icons in `business-icons/<category>/<icon-name>.svg`. Allowed categories
are `inbox`, `menu`, `chatbot`, `outlined`, `filled`, `basic`, and `filter`.

These files are not processed by the generic `icons/*.svg` SVGO cleanup
pipeline. They use a lighter business cleanup that clears colors, style
attributes, and design-tool noise while preserving geometry and stroke details.
They are still validated for basic SVG safety and structure.

Current rules:

- File names must use lowercase kebab-case, for example `whatsapp-business.svg`.
- Category folders must use one of the allowed names above.
- The root element must be `<svg>`.
- `<script>` and `<foreignObject>` are not allowed.
- Event handler attributes such as `onclick` are not allowed.
- `fill` and `stroke` must be `currentColor` or `none` after cleanup.
- `style`, `class`, unreferenced `id`, and `data-*` attributes are not allowed.
- `javascript:` URLs are not allowed.
