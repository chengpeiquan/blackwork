# Fluid glass experiment

An opt-in Blackwork material and interaction experiment on `feat/fluid-glass`.

## Preview

The linked blog currently runs at <http://localhost:4832>. The full-width header has
an optical backdrop; its links share a subtle fluid highlight. Scroll a photograph
or the book cover underneath it, then open search with Command-K. Social,
language, theme, and mobile menu controls use the same rounded material.
The duplicate home-page navigation from the first experiment has been removed.
Switch themes with the header control; the site's default theme is dark,
independently of the operating system preference.

## Design references

- [Fluid Functionalism: Fluid Hover](https://www.fluidfunctionalism.com/docs/fluid-hover)
- [Fluid Functionalism source](https://github.com/mickadesign/fluid-functionalism):
  one continuous highlight and nearest-item tracking through gaps.
- [liquid-glass-react](https://github.com/rdev/liquid-glass-react): backdrop-only
  SVG displacement, a clean foreground, and optical edge treatment.
- [Apple HIG: Materials](https://developer.apple.com/design/human-interface-guidelines/materials):
  glass belongs to the navigation/control layer. Regular material prioritizes
  readability; clear material works over visually rich backgrounds. Use it sparingly.

This is an independent web implementation inspired by those approaches. It does
not install either reference library or reproduce the native macOS renderer.
Article text, cards, and search results remain in the content layer.

## API

```tsx
import { Button, FluidGlass, GlassSurface, Input, LayoutHeader } from 'blackwork'

<nav aria-label="Primary navigation">
  <FluidGlass surface={false} variant="subtle" className="flex">
    <a href="/" data-fluid-glass-item aria-current="page">Home</a>
    <a href="/about" data-fluid-glass-item>About</a>
  </FluidGlass>
</nav>

<Button variant="glass">Cancel</Button>
<Button variant="glass-primary">Save</Button>
<Input appearance="glass" aria-label="Search" />
<LayoutHeader appearance="glass">...</LayoutHeader>
<GlassSurface className="rounded-3xl p-4">...</GlassSurface>
```

- `FluidGlass` respects native links/buttons. Use `data-fluid-glass-item` on each
  interactive element; `aria-current` or `aria-selected="true"` supplies the resting
  selection. Keyboard focus takes precedence over the resting selection.
- The group supports horizontal, vertical, and wrapped layouts. Supply layout
  classes and an appropriate radius. `surface={false}` removes the outer track.
- Hovering gaps picks the nearest enabled visible item. Clicking gaps does not
  synthesize actions. Touch uses native focus/selection without simulated hover.
- Animation preserves velocity when interrupted. A single animation frame loop
  updates the lens and stops when settled; it does not rerender the link subtree.
- `GlassSurface` and `GlassMaterial` expose `refraction` (default 56; 0 disables
  displacement), `blur` (default 4), and `material` (`clear`, `regular`, `panel`).
  Its foreground content is separate from its decorative backdrop.
- `Input`, `QuickSearchInput`, `QuickSearchTrigger`, and `LayoutHeader` accept
  `appearance="glass"`. `DialogContent`, `QuickSearchDialog`, and `SheetContent`
  also accept this appearance. Search uses an inline close button aligned to its
  input, and a transparent result layer over the panel material. `ThemeToggle` and `LanguageToggle` accept `variant="glass"`.
  Existing defaults are unchanged. Button loading, disabled, and `asChild`
  contracts are preserved.

## Browser and accessibility behavior

Headers and floating panels use a rounded-rectangle distance field measured in
actual CSS pixels, so straight edges on a wide header refract too. Three SVG
displacement channels create a restrained optical separation; the middle remains
neutral. The independent implementation samples the real page using an SVG URL
inside `backdrop-filter`, then applies blur and saturation. The SVG viewport
matches the actual element. Its tint sits outside the optical layer so RGB
channel blending does not multiply tint opacity.

Do not put a second backdrop filter on the surface host: the header's original
Tailwind blur utility created a backdrop root and prevented the inner optical
layer from sampling the page. The glass variant omits that default utility.
On/off captures over the blog's book cover verify actual edge displacement.

Canvas generates a map only after size changes settle (capped at 240,000 pixels);
it is not a continuous shader. Pointer movement updates a glint once per frame.
Other engines receive CSS blur, translucency, and edge highlights. Optical
surfaces use a minimum 16px blur (20px for panels) and a stronger theme-aware
tint on Safari/Firefox; Chromium retains its existing blur and refraction.
Regular
buttons and inputs use the same CSS material family without per-control SVG
displacement. The static button decoration preserves the `blackwork/rsc` export;
hook-driven optical surfaces stay behind client boundaries.
Safari/Firefox refraction parity is not claimed.

Reduced motion removes the spring and press scaling. Reduced transparency uses
opaque surfaces where the browser supports that media query. Forced colors
removes the decorative lens and retains native selection/focus affordances.
Text stays outside the refracted layer. The browser's normal Tab navigation,
links, form input, and focus indicators remain intact.

## Local workflow

From this Blackwork worktree:

```sh
pnpm install --frozen-lockfile
pnpm --filter blackwork build
pnpm --filter blackwork test
```

From `chengpeiquan.com/.worktrees/fluid-glass`:

```sh
pnpm link ../../../blackwork/.worktrees/fluid-glass/packages/blackwork
pnpm exec next dev --webpack -p 4832
```

Rebuild Blackwork after library edits, then restart the blog. If Next reports
stale/missing linked exports, stop this worktree's dev server and move its `.next`
directory aside before restarting; webpack persisted stale shared chunk exports
during this experiment. Run blog tests only after the library build finishes,
because that build replaces `dist`. The blog's `pnpm-workspace.yaml` override and lockfile encode this
local link and should not be carried into a release. Publication is a separate
step after reviewing the merged library and documentation locally.

## Verification

- Frosted fallback: actual Safari visually checked; Chromium still generates
  its displacement map. The local Playwright WebKit build does not render even
  a minimal backdrop-blur example, so its computed-style checks are not visual
  proof. Firefox visual verification remains outstanding.

- Blackwork library build and declaration generation passed.
- Seven focused tests cover spring reversal, gap/grid hit testing, wide-header edges and the neutral
  optical center, SSR, link composition, and disabled inputs.
- Blog's 31 existing tests and clean TypeScript check passed.
- Chrome checks cover desktop and mobile layouts, both themes, hover/focus and
  resting selection, Command-K search/input/Escape, mobile navigation, and
  reduced motion. Screenshots and a browser report are stored beside the task's
  local preview artifacts at `../../../.artifacts/fluid-glass-v2` (relative to this worktree).
- The package's raw TypeScript command encounters its existing CSS side-effect
  import declaration gap. `tsc --noEmit --noUncheckedSideEffectImports false`
  passes, as does the normal library build. This does not suppress other type
  checks.
