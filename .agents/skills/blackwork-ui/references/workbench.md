# Application And Workbench Surfaces

Use this reference for visual generators, editors, dashboards, settings-heavy pages, toolbars, canvases, and live previews.

## Start With Task Priority

Identify these regions before styling:

1. The primary result or working surface.
2. Controls that change that result.
3. The primary completion action, such as export or save.
4. Secondary utilities and status.

The result should remain easy to find. On desktop, a proven starting layout is a narrower control column beside a wider preview column. On mobile, show the result and its primary action before lengthy settings when reviewing the result is the main loop. Change that order only when setup must occur before any result can exist.

## Panels And Controls

- Group related settings in a bounded panel with a compact title. Use a shared settings-panel wrapper when multiple groups repeat the same header/content structure.
- Keep panel titles around normal body or small-heading scale. A settings panel is not a hero.
- Put header actions in one stable row; allow labels to wrap or move below the title when width is insufficient.
- Use the control that matches the value: toggles for booleans, segmented/toggle groups for a few exclusive modes, selects or menus for larger option sets, sliders/steppers/inputs for numbers, and swatches for color.
- Avoid duplicating the same setting in the toolbar and panel unless the toolbar is a deliberate shortcut with synchronized state.
- Keep destructive/reset actions visually separate from the primary save/export action.

## Toolbars

- Use compact icon buttons for familiar actions such as copy, reset, zoom, undo, redo, or download. Use text or icon-plus-text for the primary command when recognition matters.
- Keep every icon-only control square and stable in size. Add an accessible name and a tooltip; the tooltip describes the action or the reason a disabled action is unavailable.
- Group related tools with a small consistent gap. Use separators only between meaningful groups.
- Do not mix multiple arbitrary button heights in one toolbar.

## Canvas And Preview

- Give fixed-format output an explicit aspect ratio and responsive size constraints. Dynamic content must not resize the surrounding toolbar or panel.
- Center the artifact in an overflow region. At narrow widths, choose intentional scaling or local scrolling according to whether detail or whole-result visibility matters.
- Keep canvas background, radius, gap, and other exported properties in domain state; do not silently bind them to the site theme.
- In dark mode, use semantic dark chrome around the artifact. A deliberately white output is valid, but its frame and separation must make that choice look intentional.
- Loading and empty states occupy the same stable preview footprint as the final content where practical.

## Responsive Behavior

- Define desktop grid spans and mobile order explicitly.
- Remove decorative panel framing on mobile when it wastes space, but preserve hierarchy and controls.
- Respect safe-area insets for bottom actions and horizontally scrolling previews.
- Do not let wide canvases cause page-level horizontal scrolling; scrolling belongs to the preview region.
- Test the longest localized labels and real generated content, not only placeholders.

## Visual Acceptance

Reject the result when any of these are true:

- The page title, panel title, and toolbar compete at the same scale.
- Controls look scattered because their gaps and alignments do not establish groups.
- A primary action moves when labels, loading state, or preview content changes.
- Dark mode changes only the page background while panels and overlays remain visually unrelated.
- The mobile view is merely a clipped desktop grid.
- A canvas is blank, distorted, cropped without intent, or overlaps controls.
- Familiar icon actions have no name or tooltip.
