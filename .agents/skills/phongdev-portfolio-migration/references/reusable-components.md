# Reusable Components

## HeroV1

Copy together:

- `src/components/hero/HeroV1.tsx`
- `src/components/hero/useHeroV1Motion.ts`
- `src/components/hero/HeroV1.timeline.ts`
- `src/hooks/motion/useHeroGuideStory.ts`
- `src/components/utilities/Bulge.tsx`

Required CSS selectors:

- `.section.hero.darkGradient`
- `.hero-sec`
- `.hero-inner.hero-v1-layout`
- `.hero-content-left`
- `.author-info`
- `.hero-title-wrapper`
- `.hero-title-main`
- `.hero-desc`
- `.hero-cta-group`
- `.hero-video`
- `.hero-spline-viewer`
- `.hero-tech-label`
- `.hero-device-trigger`
- `.hero-activation-*`
- `.robot-guide*`
- `.hero [data-motion="..."]`

Required assets:

- `/assets/images/btn-arrow.svg`

Spline contract:

```tsx
<spline-viewer
  className="hero-spline-viewer"
  url="https://prod.spline.design/4QDf3qwGtpRrRVFU/scene.splinecode"
></spline-viewer>
```

Keep `@ts-ignore` or add a TypeScript custom element declaration before removing it.

## Header

Copy together:

- `src/components/header/HeaderV1.tsx`
- `src/components/header/HeaderMenu.tsx`
- `src/components/header/HeaderSidebar.tsx`
- `src/components/social/SocialShareV1.tsx`
- `src/components/utilities/scrollNavigation.ts`

Required CSS selectors:

- `.header-menu-wrap`
- `.custom-container`
- `.custom-row`
- `.logo`
- `.navbar`
- `.menu`
- `.dropdown-menu-item`
- `.header-right-info`
- `.scroll-to-show-menu`
- `.hamburg-menu`
- `.header-sidebar-wrap`
- `.header-sidebar-content`
- `.close-header-sidebar`
- `.sidebar-menu`

Required assets:

- `/assets/images/logo-1.png`
- `/assets/images/sidebarbg.png`

## Popup/Sidebar Pattern

Use this pattern for reusable popup-like UI:

- Component owns `isOpen`.
- On open, set `document.body.style.overflow = "hidden"`.
- On close, restore `document.body.style.overflow = "auto"` or previous value.
- On unmount, always restore overflow.
- Use a close button with `aria-label`.
- Keep overlay and panel selectors separate.
- Avoid placing GSAP and AOS attributes on the same popup element.

## Motion Provider

Copy:

- `src/components/motion/StoryMotionProvider.tsx`
- `src/hooks/motion/useStoryReveal.ts`
- `src/hooks/interaction/useMagneticElements.ts`
- `src/lib/gsap.ts`
- `src/lib/motion.ts`

Use `data-motion`:

```txt
heading
reveal
card
media
cta
magnetic
hero
hero-kicker
hero-title
hero-title-line
hero-copy
hero-cta
hero-visual
```

Use `data-motion-group`:

```txt
cards
chips
words
```

Do not target:

- `[data-wow]`
- `[data-aos]`
- complex Hero targets already owned by `useHeroV1Motion`
- robot-guide targets unless changing `useHeroGuideStory`

## Button System

Reuse:

- `.theme-btn`
- `.hero-cta-primary`
- `.hero-cta-secondary`
- `[data-motion="magnetic"]`
- `.motion-hover`

Behavior:

- Orange gradient for primary actions.
- Cyan for border/metadata/support.
- Magnetic hover only on fine pointer devices where possible.
- Reduced motion disables transform-heavy effects.

## Section Components

Safe to copy early:

- `AboutV1`
- `ServicesV1`
- `FeatureV1`
- `ContactV1`
- `FooterV1`

Copy later or replace:

- `TeamV1`
- `PriceV1`
- `PartnerV1`
- `TestimonialV1`
- `AwardsV1`

These may still carry template/agency assumptions. Convert to story chapters and data-driven content after the app builds.
