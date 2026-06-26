---
title: Icon maintenance
description: How maintainers add, remove, rename, and update icons in YCloud Icons.
---

# Icon maintenance

This page explains how icons are organized and maintained in this repository.

## Files

Each icon is made of two source files:

```text
icons/<icon-name>.svg
icons/<icon-name>.json
```

- `.svg` stores the icon shape.
- `.json` stores stable category IDs, Chinese default metadata, tags, and required English `i18n.en` metadata.

Related files:

- `categories/*.json`: category keys, Chinese titles, and English titles.
- `docs/`: generated documentation pages, search data, category pages, and icon detail pages.

Business-specific icons live in `business-icons/<business-category>/*.svg`, with the first-level folder acting as the category. These SVGs use minimal cleanup: fixed colors, styles, and design-tool noise are removed, while size, stroke details, and geometry are preserved. They also do not need matching JSON metadata or generic category metadata. See [Business icons](/en/guide/business-icons).

## Icon Metadata

YCloud Icons is Chinese-first at the source-data level:

- `name` is the Simplified Chinese icon name.
- `tags` are Simplified Chinese search tags.
- `use-cases` are Simplified Chinese usage phrases. Use an empty array when none are known.
- `categories` are stable category slugs, not display text.
- `i18n.en.name`, `i18n.en.tags`, and `i18n.en.use-cases` are required for English docs and English search. Category translations are maintained in `categories/*.json`.

Example:

```json
{
  "$schema": "../icon.schema.json",
  "use-cases": [],
  "name": "Simplified Chinese icon name",
  "tags": ["Simplified Chinese tag"],
  "categories": ["arrows", "navigation"],
  "i18n": {
    "en": {
      "name": "circle arrow up",
      "tags": ["arrow", "up", "circle"],
      "use-cases": []
    }
  }
}
```

## Add an icon

1. Add `icons/<icon-name>.svg`.
2. Add `icons/<icon-name>.json`.
3. Reuse existing category slugs from `categories/*.json`, unless the change explicitly adds a new category.
4. Run validation.

If the SVG comes from a design tool, optimize it first:

```sh
pnpm optimize
```

## Delete an icon

Delete both files:

```text
icons/<icon-name>.svg
icons/<icon-name>.json
```

Then check whether any alias, deprecation migration, or documentation example still references the icon.

## Update an icon

- Shape only: update `icons/<icon-name>.svg`.
- Metadata only: update `icons/<icon-name>.json`.
- Rename: rename both `.svg` and `.json`, update examples if needed, and add aliases when appropriate.

## Add or update a category

Categories are defined in `categories/*.json`.

```json
{
  "$schema": "../category.schema.json",
  "title": "Simplified Chinese category title",
  "i18n": {
    "en": {
      "title": "Navigation & Places"
    }
  }
}
```

Rules:

- `title` is the Simplified Chinese display title.
- `i18n.en.title` is the English display title.
- `icon` must point to an existing icon.
- Icon metadata may only reference category slugs that already exist or are added in the same change.

## Validation

Run at least:

```sh
pnpm checkIcons
pnpm lint:json
pnpm --dir docs docs:build:no-og
```

If the change affects package exports or runtime behavior, also run the related package build, for example:

```sh
pnpm --filter @ycloud-web/icons-react build
pnpm --filter @ycloud-web/icons-vue build
```
