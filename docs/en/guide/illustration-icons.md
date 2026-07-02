---
title: Illustrations
description: Source, validation, and usage rules for illustration SVG assets.
---

# Illustrations

`illustration-icons/` stores illustration SVG assets that should not enter the generic icon or business icon systems.

Illustrations are usually larger, more detailed, and keep fixed colors. They are intended for empty states, onboarding, result pages, error pages, and other page-level visual communication. They do not follow the generic 24x24 linear icon rules, and they do not use the business icon mono, duotone, or multicolor cleanup rules.

## When to use it

Use `illustration-icons/` when an SVG:

- is a page-level illustration rather than a small control icon
- needs to keep fixed colors, gradients, opacity, or complex layers
- only needs width and height customization
- does not fit `icons/` or `business-icons/`

If the artwork should be reused as a 24px UI icon, put it in `icons/` or `business-icons/` instead.

## Directory

```text
illustration-icons/<illustration-name>.svg
illustration-icons/<illustration-name>.json
illustration-icons/index.json
illustration-icons/metadata/index.json
illustration-icons/names/index.json
docs/public/metadata/illustration-icons.json
docs/public/metadata/names/illustration-icons.json
```

Illustrations need same-name per-SVG metadata JSON for search, AI illustration selection, and docs. The root `illustration-icons/index.json` is generated; `illustration-icons/metadata/index.json` and `illustration-icons/names/index.json` are the latest repository snapshots used directly by the Figma plugin, GitHub checks, and skills lookup. During docs builds, those source snapshots are copied to `docs/public/metadata/illustration-icons.json` and `docs/public/metadata/names/illustration-icons.json` as deployed URL fallbacks.

File names must be lowercase kebab-case and directly determine package export names:

```text
illustration-icons/empty-page.svg -> EmptyPage
```

## Cleanup And Validation

Illustrations do not run color conversion or size cleanup. Fixed colors, gradients, width, height, and viewBox values are preserved from the source SVG whenever possible.

Baseline validation checks:

- paths must use `illustration-icons/<illustration-name>.svg`
- same-name metadata must exist at `illustration-icons/<illustration-name>.json`
- file names must be lowercase kebab-case
- the root element must be `<svg>`
- `<script>` and `<foreignObject>` are not allowed
- event attributes such as `onclick` are not allowed
- `javascript:` URLs are not allowed
- root `illustration-icons/index.json` must match `node ./scripts/writeIllustrationIndex.mts`
- `illustration-icons/metadata/index.json` and `illustration-icons/names/index.json` must match `node ./scripts/writeAssetMetadata.mts`; `docs/public/metadata` is copied during docs builds

Run locally:

```sh
node ./scripts/writeIllustrationIndex.mts
node ./scripts/writeAssetMetadata.mts
node ./scripts/checkIllustrationSvgSource.mts
```

## Figma plugin submission

When “Illustrations” is selected in the Figma plugin, the plugin will:

- submit files to `illustration-icons/*.svg`
- submit matching `illustration-icons/*.json`
- skip color conversion
- skip size cleanup
- skip `icons/*.json` generation, but create illustration same-name metadata JSON
- skip generic multi-category, tag, and use-case requirements
- only block SVGs that fail the illustration SVG baseline safety checks

After the plugin opens a PR, GitHub workflows handle illustrations like generic icons and business icons:

- `fix-icon-source` refreshes and formats `illustration-icons/index.json`, same-name metadata JSON, and repository snapshots; `docs/public/metadata` is copied during docs builds
- PR lint runs `pnpm lint:svg:illustration`
- same-repository Figma illustration PRs can enter the auto-merge flow
- after merging to `main`, a Figma PR that includes `illustration-icons/*.svg` triggers the icon release flow and publishes a new npm version

When “Generic icons” is selected, the plugin keeps using the existing `icons/*.svg` + `icons/*.json` flow. When “Business icons” is selected, it keeps using the `business-icons/<color-mode>/*.svg` flow.

## Usage

Illustrations are generated into `illustration` subpath entries in the existing packages instead of being mixed into the generic default entries.

### React package

```sh
pnpm add @ycloud-web/icons-react
```

```tsx
import { EmptyPage } from '@ycloud-web/icons-react/illustration';

export function EmptyState() {
  return (
    <EmptyPage
      width="100%"
      height="auto"
      alt="No data"
    />
  );
}
```

Illustration components default to `width="100%"` and `height="auto"`. They do not support `color`, because illustrations keep fixed source colors.

Other framework packages use the same `illustration` subpath pattern:

```ts
import { EmptyPage } from '@ycloud-web/icons-preact/illustration';
import { EmptyPage } from '@ycloud-web/icons-vue/illustration';
import { EmptyPage } from '@ycloud-web/icons-solid/illustration';
import { EmptyPage } from '@ycloud-web/icons-svelte/illustration';
import { EmptyPage } from '@ycloud-web/icons-astro/illustration';
import { EmptyPage } from '@ycloud-web/icons-react-native/illustration';
```

The Angular package exports illustration definitions that can be rendered as inline SVG or serialized by your application:

```ts
import { getIllustration } from '@ycloud-web/icons-angular/illustration';

const emptyPage = getIllustration('empty-page');
```

### Static package

Install this package when you need the raw SVG file URL:

```sh
pnpm add @ycloud-web/icons-static
```

```ts
import emptyPageUrl from '@ycloud-web/icons-static/illustration-icons/empty-page.svg';
```

### Data package

Install this package when you need structured SVG definitions or data URIs:

```sh
pnpm add @ycloud-web/icons-data
```

```ts
import { getIllustration, illustrations } from '@ycloud-web/icons-data/illustration';

const emptyPage = getIllustration('empty-page');
const sameIllustration = illustrations['empty-page'];
```
