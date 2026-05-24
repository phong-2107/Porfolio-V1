# AGENTS.md

Stable instructions for Codex agents working on a new PhongDev-style portfolio project.

## Project Context

This project is a React + TypeScript + Vite portfolio based on the current PhongDev source architecture.

Target direction:

- Premium dark futuristic portfolio
- Scroll storytelling
- Spline-first cinematic hero
- GSAP-driven motion
- Orange primary CTA and cyan technical support accents
- Reusable header/sidebar/popup/component system

Current baseline stack:

- React 19
- TypeScript
- Vite
- React Router
- Bootstrap
- GSAP + `@gsap/react`
- Optional `@fullpage/react-fullpage` for Home-style snap anchors
- Optional Lenis fallback smooth scroll
- AOS/animate.css only as legacy, not for new animated elements
- Spline web component in Hero

## Read First

Before editing, read:

1. `DESIGN_CONTEXT.md` if present
2. `design-system.md` if present
3. `PROJECT_STRUCTURE.md` if present
4. `SCROLL_STORYTELLING_CONTEXT.md` if present
5. `SCROLL_STORYTELLING_MOTION_SYSTEM.md` if present
6. `.agents/skills/phongdev-portfolio-migration/SKILL.md` if present

If this project was generated from the old source, also inspect:

- `src/App.tsx`
- `src/app/routes/AppRoutes.tsx` or `src/Routers.tsx`
- `src/components/hero/HeroV1.tsx`
- `src/components/hero/useHeroV1Motion.ts`
- `src/components/hero/HeroV1.timeline.ts`
- `src/components/header/HeaderV1.tsx`
- `src/components/header/HeaderMenu.tsx`
- `src/components/header/HeaderSidebar.tsx`
- `src/components/utilities/scrollNavigation.ts`
- `src/styles/*` and any `src/css/legacy/*`

## Core Rules

- Do not rewrite the whole app.
- Do not introduce Tailwind unless explicitly requested.
- Do not introduce shadcn/ui unless explicitly requested.
- Do not change routing unless explicitly requested.
- Do not change business logic.
- Do not change the existing Spline scene URL unless explicitly requested.
- Do not use AOS and GSAP on the same new element.
- Do not enable Lenis globally if it conflicts with Fullpage or ScrollTrigger.
- Do not animate `top`, `left`, `width`, or `height`.
- Prefer `opacity`, `transform`, and subtle `filter`.
- Respect `prefers-reduced-motion`.
- Keep the dark futuristic orange/cyan palette.
- Use small, reviewable batches.
- Run `npm run build` after code changes.
- Report changed files and build result.

## Design Language

Use:

- Deep dark base, not pure black.
- Orange for primary actions.
- Cyan for metadata, borders, and technical glow.
- Large cinematic typography with readable body copy.
- Subtle glass surfaces and restrained glow.
- Asymmetric editorial layouts over generic equal-card grids.

Avoid:

- Generic agency template sections without portfolio purpose.
- Cyberpunk neon overload.
- Too many gradient text effects.
- Custom heavy cursor systems.
- Motion that does not support story progression.

## Color Tokens

Use these tokens or compatible equivalents:

```css
:root {
  --bg-base: #071A1F;
  --bg-deep: #020608;
  --bg-surface: #102A30;
  --text-primary: #F8FAFC;
  --text-secondary: #A7B4BD;
  --accent-orange: #FF7A1A;
  --accent-orange-hover: #FF9A4D;
  --accent-cyan: #12D6DD;
}
```

Ratio:

```txt
Dark base: 75%
Neutral/text: 15%
Orange accent: 7%
Cyan support: 3%
```

## Hero Rules

Hero is the primary brand anchor.

Preserve:

- Spline viewer URL unless user asks to change it.
- Hero text and CTA readability.
- Cinematic intro.
- Pointer parallax on fine pointer devices.
- Scroll depth if compatible with the page scroll system.
- Magnetic CTA hover.
- Reduced-motion final states.

Expected data attributes:

```txt
data-motion="hero"
data-motion="hero-kicker"
data-motion="hero-title"
data-motion="hero-title-line"
data-motion="hero-copy"
data-motion="hero-cta"
data-motion="hero-visual"
data-motion="magnetic"
```

## Motion Rules

Use GSAP as the main engine.

Motion levels:

1. CSS transitions for hover/focus/active states.
2. GSAP reveal for headings, cards, media, CTA.
3. ScrollTrigger for hero depth and selected pinned storytelling.
4. Spline/Three only for isolated visual anchors.

Clean up:

- GSAP timelines
- ScrollTriggers
- event listeners
- observers
- animation frames

## Reusable Components

Header/sidebar:

- Preserve Home click behavior.
- Preserve section anchor map if Fullpage/Home anchors are used.
- Restore body overflow when closing.

Popup/modal:

- Keep state local.
- Use accessible close controls.
- Restore body overflow on close and unmount.
- Avoid global document side effects without cleanup.

Buttons:

- Use orange primary actions.
- Use cyan only as support.
- Add `data-motion="magnetic"` only when `useMagneticElements` is mounted.

Story sections:

- Prefer data-driven content in `src/data/*`.
- Use `data-motion="heading"`, `reveal`, `card`, `media`, `cta`.
- Use `data-motion-group="cards"` for staggered cards.

## Build Command

Use:

```bash
npm run build
```

On Windows PowerShell if `npm` is blocked:

```bash
npm.cmd run build
```

## After Editing

Report:

- Files changed.
- Behavior changed.
- Components/styles copied or migrated.
- Build result.
- Remaining manual checks.
