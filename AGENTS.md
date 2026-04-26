# AGENTS

## UI Composition Rules

- Prefer existing `blackwork` components and layouts for shared UI.
- Do not hand-roll downstream UI in `packages/docs`, `apps/*`, or other consumers when an equivalent `blackwork` component already exists.
- If a shared component is close but not sufficient, extend the `blackwork` component first, then consume that extension from downstream packages.
- Treat consistency with the `blackwork` design system as a higher priority than local convenience or one-off markup.
