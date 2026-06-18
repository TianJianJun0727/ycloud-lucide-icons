---
title: Architecture
description: Package naming, component naming, and style entrypoint decisions for YCloud Icons.
---

# Architecture

YCloud Icons is maintained as a multi-package icon monorepo. The current repository keeps a Lucide-compatible package shape so upstream fixes can be reviewed and merged with limited friction while public names, docs, and branding stay under YCloud.

## Package Naming

Public packages use the `@ycloud-web` scope:

- `@ycloud-web/icons` for framework-agnostic JavaScript usage.
- `@ycloud-web/icons-react` for React.
- `@ycloud-web/icons-vue` for Vue.
- `@ycloud-web/icons-data` for normalized icon data.
- `@ycloud-web/icons-svelte`, `@ycloud-web/icons-solid`, `@ycloud-web/icons-preact`, `@ycloud-web/icons-react-native`, `@ycloud-web/icons-angular`, `@ycloud-web/icons-astro`, and `@ycloud-web/icons-static` for the remaining supported package types.

Private build tools can continue using upstream internal names until the public packages are stable.

## Component Naming

Component names stay simple and strongly typed:

```tsx
import { Camera } from '@ycloud-web/icons-react';
```

Avoid suffixing generated component names with `Outline` or `Filled`. That keeps IDE autocomplete, rename refactoring, and import organization predictable.

## Style Variants

Style variants should be represented by source folders and package entrypoints:

```tsx
import { Camera } from '@ycloud-web/icons-react/outline';
import { Camera as FilledCamera } from '@ycloud-web/icons-react/filled';
```

The implementation can generate both entrypoints from the same normalized icon source when the conversion is reliable. If automatic conversion is not reliable for a source icon, the pipeline should allow an explicit style-specific SVG override.

## Upstream Sync

Keep large structural renames separate from package rebranding. Directory names such as `packages/ycloud-react` can remain unchanged while the published package name is `@ycloud-web/icons-react`.
