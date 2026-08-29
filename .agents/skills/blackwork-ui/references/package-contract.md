# Package Contract

Use this reference to avoid confusing an installed Blackwork package with locally owned shadcn source.

## Discover the Installed API

1. Read the consumer's `package.json` and lockfile to resolve the Blackwork version.
2. Inspect `node_modules/blackwork/package.json` exports and its declaration files when an API is uncertain.
3. Prefer existing imports and wrappers in the consumer when they match the installed version.
4. Check the current Blackwork documentation for the same major/minor version when available.

Blackwork versions can differ in primitive implementation, exports, component props, and icon handling. For example, an older consumer may still expose an icon entry that a newer release removed. Never propagate that old import into a current project without verifying it.

## Entry Points

Use only entry points exported by the installed package:

- `blackwork`: client-capable UI, layouts, theme controls, widgets, hooks, and utilities.
- `blackwork/rsc`: server-renderable components provided by that version. Prefer this in Server Components when the needed export exists.
- `blackwork/form`: Blackwork's TanStack Form integration. Install its optional peer dependency only when this entry is used.
- `blackwork/tailwind.css`: normal Tailwind v4 consumer entry, including Blackwork sources and theme styles.
- Lower-level theme/global CSS entries: use only when the consumer intentionally needs tokens without scanning Blackwork component classes.

Do not mark an entire route as client-rendered merely to import one interactive primitive. Keep the page/server shell on the server and isolate the interactive control in a client component.

## Theme Setup

- Mount the theme provider once near the application root.
- Place the theme bootstrap script where the installed version documents it so the initial theme does not flash.
- Keep the script and provider storage key/default theme aligned.
- Use semantic colors such as background, foreground, muted, border, card, popover, primary, and destructive for interface chrome.
- Treat an export canvas, artwork, document page, photo, or other generated artifact as domain content. It may intentionally remain light while the surrounding app is dark; frame the boundary clearly instead of recoloring the artifact blindly.

## Styling Ownership

Blackwork owns component appearance and states. Consumer `className` should primarily control placement, width, responsive behavior, and composition. Prefer component props and variants over overriding colors, typography, focus styles, or internal geometry.

Use project-local wrappers for recurring product compositions such as a settings section, icon link button, article sidebar block, or preview panel. A wrapper must remove meaningful repetition or encode product behavior; do not create forwarding wrappers that add no contract.

## shadcn Boundary

A `components.json` file signals local shadcn ownership, not ownership of npm-installed Blackwork source. The shadcn CLI may manage a separate local component tree, but it must not overwrite package internals. When examples differ, the installed Blackwork types are authoritative.
