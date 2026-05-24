# Performance Checklist

## Scroll
- [ ] ScrollTrigger count is reasonable.
- [ ] Pinned sections are limited on mobile.
- [ ] `ScrollTrigger.refresh()` runs after image/model load.
- [ ] No horizontal overflow during pinned transitions.

## DOM animation
- [ ] Mostly transform/opacity.
- [ ] No global `will-change` abuse.
- [ ] Blur/filter usage is limited.
- [ ] Text remains readable without JS.

## WebGL
- [ ] One shared canvas when possible.
- [ ] Models are compressed.
- [ ] Textures are compressed and sized appropriately.
- [ ] Render loop pauses or reduces when off-screen.
- [ ] Mobile fallback exists.

## Accessibility
- [ ] `prefers-reduced-motion` supported.
- [ ] Keyboard scroll and navigation work.
- [ ] Important content is semantic HTML.
- [ ] Color contrast is checked.
