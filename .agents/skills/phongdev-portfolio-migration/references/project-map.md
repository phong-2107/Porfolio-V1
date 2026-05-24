# Project Map

## Current Identity

This source is a React + TypeScript + Vite portfolio moving toward a premium dark futuristic Scroll Storytelling redesign. The visual direction is Spline-first, cinematic, dark, technical, orange/cyan, and motion-driven.

## Current Dependencies

Runtime:

- React 19
- React DOM 19
- React Router DOM 7
- Bootstrap 5
- GSAP 3 and `@gsap/react`
- `@fullpage/react-fullpage`
- Lenis
- AOS and animate.css as legacy
- Three.js and `@types/three`
- React Toastify
- Split Type

Build/dev:

- Vite 6
- TypeScript 5
- ESLint 9
- `@vitejs/plugin-react-swc`

## Core App Files

- `src/main.tsx`: mounts React through `BrowserRouter` and `ErrorBoundary`.
- `src/App.tsx`: imports Bootstrap, AOS CSS, icon CSS, template CSS, app utilities, routes, preloader, scroll top, and current motion providers.
- `src/Routers.tsx`: defines `/`, inner routes, and lazy Three experiment route.
- `src/pages/homePages/Home1.tsx`: main `/` route and main story surface.

## Home1 Section Order

Preserve this order unless the user explicitly asks for content restructuring:

1. `HeaderV1`
2. `HeroV1`
3. `AboutV1`
4. `ServicesV1`
5. `FeatureV1`
6. `AwardsV1`
7. `TeamV1`
8. `PriceV1`
9. `TestimonialV1`
10. `ContactV1`
11. `PartnerV1`
12. `FooterV1`

## Anchor Contract

Preserve:

```txt
hero
about
services
feature
awards
team
price
testimonial
contact
partner
footer
```

Do not rename `feature` to `projects` or `price` to `pricing` until the route, sidebar, scroll button, Fullpage logic, and data model are migrated together.

## Current Hero Files

- `src/components/hero/HeroV1.tsx`: DOM, Spline viewer, CTA, guide activation button, intersection visibility, local hero motion hooks.
- `src/components/hero/useHeroV1Motion.ts`: GSAP ScrollTrigger setup, pointer parallax, reduced motion fallback.
- `src/components/hero/HeroV1.timeline.ts`: cinematic intro, scene drift, depth timeline, text drift.
- `src/hooks/motion/useHeroGuideStory.ts`: interactive guide state and messages.

## Current Motion Files

- `src/lib/gsap.ts`: central GSAP + ScrollTrigger registration.
- `src/lib/motion.ts`: reduced motion helper and selector constants.
- `src/pages/homePages/useHome1Motion.ts`: Home1 route-level motion.
- `src/hooks/useCinematicScroll.ts`: legacy/global `data-wow` cinematic scroll.
- `src/hooks/motion/useStoryReveal.ts`: data-motion story reveal with conflict filters.
- `src/hooks/interaction/useMagneticElements.ts`: magnetic cursor hover for `[data-motion="magnetic"]`.
- `src/components/motion/StoryMotionProvider.tsx`: mounts story reveal and magnetic hooks.
- `src/hooks/usePointerInteractions.ts`: CSS-variable pointer interaction for template targets.

## Current CSS Ownership

- `src/css/style.css`: primary global CSS, tokens, buttons, header/sidebar, hero, robot guide, motion hover, story reveal.
- `src/css/fullpage-motion.css`: Fullpage section behavior and a second set of HeroV1 motion/layout styles.
- `src/css/responsive.css`: responsive template overrides and HeroV1 breakpoints.
- `src/css/aixor-unit-test.css`: large legacy/template compatibility layer.

When copying CSS, search selectors first and extract only needed blocks. Hero styles are split across `style.css`, `fullpage-motion.css`, and `responsive.css`.

## High-Risk Areas

- `HeroV1` because Spline, GSAP, guide state, pointer parallax, and visibility observer are tied together.
- `Home1` because it owns route-level motion and section order.
- `StoryMotionProvider` because current source can mount it globally and route-scoped; avoid duplicate animation ownership in a new app.
- `Dependency.tsx` because AOS is initialized outside Home1 and Lenis is mounted globally.
- Global CSS because selector changes can affect many template pages.
