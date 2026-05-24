# Mouse Animation Reference

Use this reference when migrating mouse animation from the old PhongDev portfolio into a new project.

## Exact Files

For the exact current mouse animation, copy:

- `src/components/animated/MotionCursor.tsx`
- `src/hooks/usePointerInteractions.ts`

Mount:

- `usePointerInteractions()` globally.
- `<MotionCursor />` globally.

The current old project mounts both inside `src/components/utilities/Dependency.tsx`.

## Do Not Use For 100% Match

Do not mount these if the request is to match the current old site exactly:

- `MagicCursor.tsx`
- `CursorTrail.tsx`
- `GhostCursor.tsx`

They exist in the repo, but they are not the primary active cursor layer mounted in `Dependency.tsx`.

## Required CSS Blocks

Copy from `src/css/style.css`:

- `.motion-hover`
- `.motion-hover.is-pointer-active`
- `.header-menu-wrap a.motion-hover`
- `.notch-bar-menu-wrap a.motion-hover`
- `.motion-hover.is-pointer-active.theme-btn`
- `.motion-hover.is-pointer-active.service-box`
- `.motion-hover.is-pointer-active.feature-project`
- `.motion-hover.is-pointer-active.pricing-box`
- `.motion-hover.is-pointer-active.team-member-box`
- `.motion-hover.is-pointer-active.testimonial-box`
- `body.has-motion-cursor`
- `.motion-cursor`
- `.motion-cursor--dot`
- `.motion-cursor--ring`
- `.motion-cursor--dot.is-hovering`
- `.motion-cursor--ring.is-hovering`
- `.motion-cursor--dot.is-pressed`
- `.motion-cursor--ring.is-pressed`
- touch/reduced-motion media queries
- `.pricing-box.motion-hover:hover`
- `.testimonial-box.motion-hover:hover`
- `.service-box.motion-hover:hover`
- `.feature-project.motion-hover:hover`
- `.team-member-box.motion-hover:hover`
- `.theme-btn.motion-hover:hover`

## Selector Contract

`usePointerInteractions.ts` targets:

```txt
.theme-btn
.header-menu-wrap a
.notch-bar-menu-wrap a
.service-box
.feature-project
.pricing-box
.team-member-box
.testimonial-box
```

Keep these classes in the new project if an exact visual match is required.

## Exact Visual Values

Custom cursor:

- Dot: `10px`, `#ff6a00`, orange glow.
- Ring: `42px`, white border, transparent white fill, cyan glow.
- Hover dot: `12px`, white.
- Hover ring: `72px`, orange border, orange transparent fill.
- Pressed dot: `6px`.
- Pressed ring: `44px`.
- Cursor z-index: `2147483647`.

Pointer physics:

- Small targets: strength `8`, scale `1.04`, tilt `0`.
- Cards: strength `14`, scale `1.025`, tilt `5`.
- Active transform transition: `0.18s ease-out`.
- Rest transform transition: `0.55s cubic-bezier(0.22, 1, 0.36, 1)`.

## Integration Prompt

```txt
Use the old PhongDev mouse animation exactly.
Copy MotionCursor.tsx, usePointerInteractions.ts, and the exact .motion-hover/.motion-cursor CSS blocks from the old source.
Mount usePointerInteractions() and <MotionCursor /> globally.
Keep the same selectors, sizes, colors, easing, z-index, strength, scale, and tilt values.
Do not mount MagicCursor, CursorTrail, GhostCursor, or any rewritten cursor implementation.
Run npm run build.
```
