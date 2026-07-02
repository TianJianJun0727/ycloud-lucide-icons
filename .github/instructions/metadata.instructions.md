---
applyTo: 'icons/*.json,business-icons/**/*.json,illustration-icons/*.json'
---

# YCloud Icons Metadata

Icon metadata lives next to the SVG source:

- generic icons: `icons/*.json`, validated by `icon.schema.json`
- business icons: `business-icons/<color-mode>/*.json`, validated by
  `scripts/checkAssetMetadata.mts`
- illustrations: `illustration-icons/*.json`, validated by
  `scripts/checkAssetMetadata.mts`

Each asset JSON must have the same basename as its SVG file, for example
`home.svg` and `home.json`.

YCloud Icons uses Simplified Chinese as the default metadata language. English
metadata lives under `i18n.en`.

## Required Shape

Generic icon metadata must include:

- `$schema`: usually `../icon.schema.json`.
- `name`: Simplified Chinese display name.
- `tags`: Simplified Chinese search tags.
- `categories`: category slugs from `categories/*.json`.
- `use-cases`: Simplified Chinese product or UI use cases.
- `i18n.en.name`: English display name.
- `i18n.en.tags`: English search tags.
- `i18n.en.use-cases`: English product or UI use cases.

Business icon and illustration metadata use the same localized naming, tags, and
use-case fields, but do not include `categories`. Their `$schema` points to
`asset-metadata.schema.json`:

- business icons usually use `../../asset-metadata.schema.json`
- illustrations usually use `../asset-metadata.schema.json`

Do not add `contributors`. This project no longer keeps per-icon contributor
metadata.

Do not add `i18n.en.categories`. Generic icon category translations live in
`categories/*.json`; business icons and illustrations do not use generic icon
categories.

## Names

`name` must be natural Simplified Chinese. `i18n.en.name` must be natural
English and should not be a kebab-case or snake_case slug.

The filename is still the canonical icon identifier used by packages and docs.
Use it as source context, but do not blindly copy it into display names or tags.

## Tags

Top-level `tags` are Simplified Chinese search terms. `i18n.en.tags` are English
search terms.

Rules:

- Chinese tags and English tags do not need to have the same length or order.
- Deduplicate each tag array.
- Prefer short, practical search terms used by designers and frontend
  developers.
- Keep common technical terms as-is when Chinese users search that way, such as
  API, CSS, JSON, SVG, GitHub, Wi-Fi, 3D.
- Do not include the word `icon`.
- Do not preserve weak dictionary meanings when they do not match the icon's
  category or use case.
- Treat English metadata as the source of truth when translating Chinese tags:
  filename, `i18n.en.name`, `i18n.en.tags`, and `i18n.en.use-cases`.

## Use Cases

`use-cases` and `i18n.en.use-cases` describe concrete product or UI scenarios.
They are optional in meaning but required by schema as arrays; empty arrays are
allowed only for transitional data and should generally be filled when touching a
file.

Rules:

- Keep Simplified Chinese and English use cases paired by index.
- Keep both arrays the same length and order when non-empty.
- Use concise phrases without trailing punctuation.
- Prefer concrete UI/product scenarios over generic words.
- If both languages are missing, generate English use cases first from the icon
  name, English tags, and category context, then translate them to Simplified
  Chinese.

## Categories

`categories` contains category slugs only. Valid slugs are the JSON filenames in
`categories/*.json` and the enum values in `icon.schema.json`.

When selecting an existing category, keep the slug exactly as-is. When creating a
new category, add a matching `categories/<slug>.json` file with:

- `title`: Simplified Chinese category title.
- `i18n.en.title`: English category title.
- optional `description` / `i18n.en.description`.
- optional `weight`.

Do not invent category translations inside icon JSON files.

## Automation

GitHub PR automation may normalize metadata:

- `fix-icon-source.yml` runs on same-repository PRs that change icons or
  categories. It optimizes SVG, completes bilingual generic metadata, refreshes
  business/illustration metadata indexes, formats JSON, and validates
  the result.
- `pull-request-metadata-suggestions.yml` can be run manually with a PR number
  when reviewers want optional AI metadata suggestions. For Figma/Portal-created
  PRs, it does not suggest categories because the designer already selected them.
- `checkIconMetadata.mts` enforces icon Chinese defaults, English `i18n.en`
  fields, deduplicated tags/categories, and no `i18n.en.categories`.
- `checkCategoryMetadata.mts` enforces category Chinese titles and English
  `i18n.en.title`.
- `checkAssetMetadata.mts` enforces same-name business/illustration metadata,
  and generated repository snapshots in `*/metadata/index.json`. Docs builds
  copy those metadata snapshots into `docs/public/metadata`.

For local bulk polishing, use `pnpm polish:tags -- --use-cases --write` with an
OpenAI-compatible AI provider configured through `AI_API_KEY`, `AI_BASE_URL`,
and `AI_MODEL`.
