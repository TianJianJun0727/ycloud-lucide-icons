---
title: Architecture
description: How YCloud Icons source data, generation scripts, packages, documentation, and releases are organized.
---

# Architecture

YCloud Icons is not a single component package. It is a multi-package repository built around one shared icon source. The architecture has three core goals:

- maintain every icon from one source of truth
- generate consistent output for every supported framework
- keep documentation, package publishing, and version history derived from repository facts

The main flow looks like this:

```text
icons/*.svg + icons/*.json
business-icons/<color-mode>/*.svg + business-icons/<color-mode>/index.json
illustration-icons/*.svg
  -> validation and SVG optimization
  -> package generation for each framework
  -> documentation data generation
  -> documentation deployment and npm publishing
```

## Repository Layers

The repository is organized into five practical layers.

### 1. Source Data

The source of truth lives in:

```text
icons/
categories/
business-icons/
illustration-icons/
```

- `icons/*.svg`: the icon artwork
- `icons/*.json`: icon metadata, such as categories, tags, and localized display data
- `categories/*.json`: category definitions, Chinese titles, and English titles
- `business-icons/<color-mode>/*.svg`: business-specific icon artwork; the first-level folder must be `mono`, `duotone`, or `multicolor`
- `business-icons/<color-mode>/index.json`: localized business color-mode titles
- `business-icons/index.json`: generated index consumed by validation, the Figma plugin, docs, and package generation
- `illustration-icons/*.svg`: illustration artwork that keeps its original colors and size attributes
- `illustration-icons/index.json`: generated index consumed by validation, the Figma plugin, docs, and package generation

The icon shape and the icon meaning are both stored in source control instead of being scattered through documentation or framework components. Generic icons have per-icon metadata. Business icons keep color-mode folder metadata only. Illustrations keep SVG files plus a generated index. Business icon and illustration package export names are derived from file names.

### 2. Generation And Validation

The generation layer turns raw source data into consumable output:

```text
scripts/
tools/
```

Typical scripts include:

- `scripts/optimizeSvgs.mts`: optimizes SVG files and removes unnecessary attributes
- `scripts/checkIconsAndCategories.mts`: validates icon and category references
- `scripts/syncPackageVersions.mts`: syncs package versions
- `scripts/writeChangelog.mts`: generates changelog content from Git tags and commits

This layer does not own UI behavior. It owns normalization, validation, and automation.

### 3. Package Output

Framework packages live in:

```text
packages/
```

Each package consumes the same icon data and exposes it in the shape expected by its target runtime. The repository does not maintain separate icon sets for React, Vue, Svelte, Solid, and other frameworks.

### 4. Documentation And Preview

The documentation site lives in:

```text
docs/
docs/scripts/
```

The icon wall, category pages, detail pages, related icons, and release metadata are generated from the same source data used by the packages.

### 5. Maintenance And Automation

Maintenance workflows live in:

```text
agents/
.github/
```

- `agents/`: workflow instructions for repository automation
- `.github/`: CI, release, and documentation deployment workflows

This layer describes how the repository is maintained over time.

## Why SVG And JSON Are Separate

Each generic icon is represented by two files:

```text
icons/<name>.svg
icons/<name>.json
```

This split keeps visual data and semantic data separate.

It has a few practical benefits:

- metadata can change without touching SVG artwork
- localized names, search keywords, tags, and categories can be maintained in JSON
- every framework package reads the same metadata
- validation scripts can check missing categories, missing localized fields, and invalid references

Business icons use a different model:

```text
business-icons/<color-mode>/<name>.svg
business-icons/<color-mode>/index.json
business-icons/index.json
```

Business icons do not keep a JSON file next to every SVG. The first-level folder represents the color mode: `mono` converts fixed colors to `currentColor`, `duotone` maps white to the secondary token and all other colors to the primary token, and `multicolor` keeps fixed colors. The root `business-icons/index.json` is generated for the Figma plugin color-mode selector, docs, duplicate-name checks, and package generation.

## Package Structure

Packages are grouped by responsibility.

### Core Runtime

- `packages/icons`

This package is framework-agnostic and targets plain JavaScript or shared runtime use cases.

### Framework Packages

Examples:

- `packages/icons-react`
- `packages/icons-vue`
- `packages/icons-svelte`
- `packages/icons-solid`
- `packages/icons-preact`
- `packages/icons-react-native`
- `packages/icons-angular`
- `packages/icons-astro`

These packages wrap the same icon node data with framework-specific component APIs.

For example:

```tsx
import { Camera } from '@ycloud-web/icons-react';
```

Stable component names keep IDE autocomplete, TypeScript hints, and rename refactors predictable.

### Static Assets

- `packages/icons-static`

This package targets generic SVG files, business SVG files, SVG sprites, generic Icon Font output, business Icon Font output, and other non-component usage.

### Data And Shared Utilities

- `packages/icons-data`
- `packages/icons-shared`

`packages/icons-data` now exposes structured icon data for each asset family:

- The main entry exports generic icon node data and generic builders.
- The `business` subpath exports business icon SVG definition objects and index data.
- The `illustration` subpath exports illustration SVG definition objects and index data.

These packages avoid duplicating icon data, shared helpers, and common types across framework packages.

## Why Directory Names Match npm Package Names

Public packages are published under the `@ycloud-web` scope, while local package folders use the package name without the scope:

- `@ycloud-web/icons` -> `packages/icons`
- `@ycloud-web/icons-react` -> `packages/icons-react`
- `@ycloud-web/icons-vue` -> `packages/icons-vue`
- `@ycloud-web/icons-data` -> `packages/icons-data`

This keeps the package directory, `package.json`, CI jobs, documentation links, and npm package identity aligned.

## Style Entrypoints

The current release ships one outline-style icon set. When generated outline, filled, or other style variants are added later, YCloud Icons should prefer explicit style entrypoints over a runtime `theme` string.

This keeps tree-shaking predictable and preserves strong component names. Style conversion should happen during generation, not at runtime, and generated variants should only be published when the conversion is reliable.

## Documentation Generation

The documentation site consumes generated data rather than maintaining a separate icon catalog by hand.

Documentation scripts generate:

- icon node data
- icon detail data
- category metadata
- business icon color-mode and detail data
- related icon relationships
- release metadata
- changelog content
- popularity or sorting data

This means icon additions, category changes, localized names, and release tags can flow into the documentation automatically.

## Version And Release Strategy

Git tags and GitHub releases are the real version source.

The release flow is designed so that:

- npm packages are published from the release version
- package versions are synchronized back to the repository after a successful release
- the documentation homepage and changelog read from tag and release metadata
- changelog pages prefer persisted bilingual notes from `changelogs/releases/v*.json`
- documentation deployment can run independently from package publishing

During a release, the current version's bilingual release notes are generated once and committed back to `main` as `changelogs/releases/vX.Y.Z.json`. Later documentation builds read this persisted file first, so the site shows curated Chinese and English notes instead of falling back to commit titles or GitHub compare pages.

This avoids version drift between the documentation site and the published packages.

## Why This Structure

The current structure is optimized for long-term maintenance:

- one source for icon artwork
- one metadata model for search and localization
- one generation pipeline for all framework packages
- one documentation site generated from repository data
- one release source based on tags and releases

That keeps YCloud Icons usable as a product-facing icon library while still being straightforward to maintain as a repository.
