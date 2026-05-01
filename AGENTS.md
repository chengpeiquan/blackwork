# AGENTS

## UI Composition Rules

- Prefer existing `blackwork` components and layouts for shared UI.
- Do not hand-roll downstream UI in `packages/docs`, `apps/*`, or other consumers when an equivalent `blackwork` component already exists.
- If a shared component is close but not sufficient, extend the `blackwork` component first, then consume that extension from downstream packages.
- Treat consistency with the `blackwork` design system as a higher priority than local convenience or one-off markup.

## Test Organization

- Keep package-level tests under that package's `test/` directory.
- Do not place new `*.test.*` or `*.spec.*` files in `scripts/`, `src/`, or package roots unless an existing package-specific convention requires it.
- Root-level script tests may stay under the root `scripts/` directory when they test root repository scripts.

## Commit Organization

- Split commits by package file ownership, or by feature within a file when one file contains unrelated changes.
- Use the Conventional Commit scope for the affected feature area, not a broad package name.
- Avoid generic package scopes such as `blackwork`, `docs`, or `docs-starter` when a more precise feature scope exists.
