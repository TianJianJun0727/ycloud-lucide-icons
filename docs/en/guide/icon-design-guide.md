---
title: Icon design guide
description: SVG and metadata rules for contributing icons to YCloud Icons.
---

# Icon design guide

YCloud Icons keeps a consistent linear SVG style across all framework packages. Each icon should be clear at 24px, easy to theme with CSS, and simple enough to maintain long term.

## Canvas

- Use a `24x24` viewBox.
- Keep the icon visually centered.
- Prefer simple paths and basic SVG shapes.
- Avoid unnecessary groups, editor metadata, inline styles, classes, filters, masks, and transforms.

## Stroke and Fill

Icons should be themeable by the generated packages.

- Do not hard-code brand colors in source icons.
- Do not rely on inline `style` attributes.
- Do not add explicit `fill` values for outline icons unless the shape requires it.
- Use consistent stroke behavior with the existing icon set.

## Allowed SVG Elements

Source SVG files should stay simple. Prefer:

- `<path d>`
- `<line x1 x2>`
- `<polygon points>`
- `<polyline points>`
- `<circle cx cy r>`
- `<ellipse cx cy rx ry>`
- `<rect x y width height rx>`

Avoid `<use>`. Once SVGs are inlined into HTML, referenced IDs are hard to keep globally unique and can create rendering bugs.

## Metadata

Every icon needs a matching JSON metadata file. YCloud Icons is Chinese-first in source data:

- `name` is the Simplified Chinese display name.
- `tags` are Simplified Chinese search tags.
- `categories` are stable category slugs used by build scripts and validation.
- `i18n.en` is required and provides English icon names and search tags. Category translations live in `categories/*.json`.

Recommended structure:

```json
{
  "$schema": "../icon.schema.json",
  "use-cases": [],
  "name": "Simplified Chinese icon name",
  "tags": ["Simplified Chinese tag"],
  "categories": ["tools"],
  "i18n": {
    "en": {
      "name": "plus",
      "tags": ["add", "create"]
    }
  }
}
```

## Categories

Category files are also Chinese-first:

```json
{
  "$schema": "../category.schema.json",
  "title": "Simplified Chinese category title",
  "icon": "compass",
  "i18n": {
    "en": {
      "title": "Navigation & Places"
    }
  }
}
```

Only add a new category when the existing category set cannot describe the icon. Otherwise, reuse existing category slugs.

## Validation

Before submitting icon changes, run:

```sh
pnpm checkIcons
pnpm lint:json
pnpm --dir docs docs:build:no-og
```
