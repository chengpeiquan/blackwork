---
name: blackwork-ui
description: Design, build, or review polished React interfaces that consume the Blackwork UI package. Use for Blackwork page composition, content sites, product pages, settings panels, visual tools, responsive layout, dark mode, or UI quality work; use the shadcn skill separately for upstream shadcn CLI and registry operations.
---

# Blackwork UI

Build interfaces that feel deliberately composed, not merely assembled from valid components. Preserve the product's own identity while using Blackwork for shared structure, behavior, and visual rhythm.

## Establish the Contract

Before changing UI:

1. Read the consuming project's instructions and existing layout wrappers.
2. Inspect its installed `blackwork` version and the package's actual exports or TypeScript declarations. Do not copy APIs from another project blindly.
3. Identify the surface as content, product/marketing, or application/workbench. A product can contain more than one surface.
4. Inspect a nearby successful screen before introducing a new composition.

Read [references/package-contract.md](references/package-contract.md) when selecting imports, configuring styles/theme, using RSC or forms, or handling version differences.

## Compose the Interface

- Set hierarchy and responsive behavior before polishing individual controls.
- Use existing Blackwork components and variants first. Use Tailwind utilities for layout and responsive composition; add traditional CSS only for theme tokens, prose, third-party integration, browser-specific behavior, or effects Tailwind cannot express clearly.
- Use semantic theme tokens for application chrome. Raw colors are acceptable only for an intentional brand, data, status, or generated-output color.
- Keep one visible page title. Panel headings describe their local group and use compact typography.
- Use cards for bounded groups of controls or repeated self-contained items. Do not wrap whole page sections in cards, nest cards, or turn every region into a card.
- Use icons for familiar compact actions. Every icon-only action needs an accessible name and a tooltip that explains the action; disabled actions still need an explanation when it is not obvious.
- Keep controls near the object they affect. Separate primary actions from secondary utilities through placement and variant, not arbitrary color.
- Treat spacing as a small rhythm, normally based on 2, 3, 4, 6, 8, and 12 Tailwind steps. Avoid unrelated one-off gaps that make adjacent groups look accidental.

For articles, docs, lists, product pages, and shared site chrome, read [references/content-and-product.md](references/content-and-product.md). For editors, generators, dashboards, settings-heavy tools, canvases, and previews, read [references/workbench.md](references/workbench.md).

## Work With shadcn

Blackwork and shadcn have different ownership boundaries:

- Import the installed Blackwork API from `blackwork`, `blackwork/rsc`, or `blackwork/form` as supported by the installed version.
- Do not run `shadcn add`, `init`, `apply`, or overwrite operations to modify an npm-installed Blackwork component.
- Use the shadcn skill when the user is explicitly managing local shadcn source, a registry, or a preset. Adapt the resulting pattern to Blackwork's installed API rather than assuming upstream Radix or Base UI code is drop-in compatible.
- Extend a project-local wrapper when behavior is application-specific. Change Blackwork itself only when the behavior is broadly reusable and the task includes library work.

## Verify the Result

For a material UI change, inspect the rendered result rather than treating type-checking as visual validation.

- Check at least one representative desktop and mobile viewport.
- Check light and dark modes when the product supports them.
- Confirm no overlap, clipping, accidental horizontal page scroll, unstable resizing, or unreadable text.
- Confirm the primary task is visible without hunting, tab order follows the visual order, and icon actions expose names/tooltips.
- For fixed-format previews or canvases, verify the real content renders, retains its aspect ratio, and remains usable at narrow widths.
- Reuse the project's normal lint, type-check, and test commands. Do not invent command names from another Blackwork consumer.

When reviewing an existing screen, report concrete hierarchy, composition, responsive, theme, and interaction failures. Do not recommend a wholesale redesign when a focused correction can restore the established system.
