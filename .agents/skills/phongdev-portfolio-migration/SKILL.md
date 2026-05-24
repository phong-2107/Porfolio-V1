---
name: phongdev-portfolio-migration
description: Build or guide a new React/Vite portfolio project from the current PhongDev portfolio architecture. Use when Codex must analyze this repo, scaffold a compatible new project, migrate reusable components/styles, preserve the Spline hero, GSAP motion, header/sidebar/popup patterns, dark futuristic orange/cyan design language, Fullpage anchors, and safe copy rules.
---

# PhongDev Portfolio Migration

## Purpose

Use this skill to create a new portfolio project that can reuse the current PhongDev source without copying fragile template code blindly. Preserve the visual identity: premium dark futuristic, Spline-first hero, orange CTA, cyan technical support accents, cinematic GSAP motion, and reviewable React + TypeScript + Vite structure.

## Read First

In the source repo, read in this order:

1. `DESIGN_CONTEXT.md` or `DESIGN_CONTEXT.md.md`
2. `design-system.md` or `design-system.md.md`
3. `PROJECT_STRUCTURE.md`
4. `SCROLL_STORYTELLING_CONTEXT.md`
5. `SCROLL_STORYTELLING_MOTION_SYSTEM.md`

Then read the focused reference files bundled with this skill:

- `references/project-map.md` for current architecture, dependency map, and migration risk.
- `references/migration-playbook.md` for the step-by-step build/copy order.
- `references/reusable-components.md` for component-specific copy instructions.

## Stack Contract

Use this baseline unless the user explicitly asks otherwise:

- React 19
- TypeScript
- Vite
- React Router
- Bootstrap
- Global CSS imported through `App.tsx`
- GSAP + `@gsap/react`
- `@fullpage/react-fullpage` only if preserving Home1 snap anchors
- Lenis only as scoped fallback smooth scroll
- AOS/animate.css treated as legacy
- Spline web component in Hero
- Three.js only for isolated experiment routes

Do not add Tailwind or shadcn/ui. Do not rewrite the whole app. Do not change the Spline scene URL unless explicitly asked.

## New Project Target Shape

Prefer this structure for the new project:

```txt
src/
  app/
    providers/
    routes/
  components/
    hero/
    header/
    layout/
    motion/
    sections/
    ui/
    utilities/
  hooks/
    interaction/
    motion/
  lib/
    gsap.ts
    motion.ts
    navigation.ts
  data/
    projects.ts
    skills.ts
    process.ts
    storyChapters.ts
  styles/
    tokens.css
    base.css
    components.css
    motion.css
    story.css
  types/
    story.ts
```

Keep copied legacy template CSS in `src/css/legacy/` only if needed. New shared CSS should go into `src/styles/*`.

## Migration Workflow

1. Inspect current files before copying:
   - `package.json`
   - `vite.config.ts`
   - `src/App.tsx`
   - `src/Routers.tsx`
   - `src/pages/homePages/Home1.tsx`
   - `src/components/hero/HeroV1.tsx`
   - `src/components/hero/useHeroV1Motion.ts`
   - `src/components/hero/HeroV1.timeline.ts`
   - `src/components/header/HeaderV1.tsx`
   - `src/components/header/HeaderMenu.tsx`
   - `src/components/header/HeaderSidebar.tsx`
   - `src/components/utilities/scrollNavigation.ts`
   - `src/components/motion/StoryMotionProvider.tsx`
   - `src/hooks/motion/useStoryReveal.ts`
   - `src/hooks/interaction/useMagneticElements.ts`
   - `src/css/style.css`
   - `src/css/fullpage-motion.css`
   - `src/css/responsive.css`

2. Scaffold the new app before copying feature components:
   - Install matching dependencies.
   - Import Bootstrap and global CSS in `App.tsx`.
   - Create `lib/gsap.ts`, `lib/motion.ts`, `lib/navigation.ts`.
   - Create route shell and Home route.

3. Copy design tokens first:
   - Use `--bg-base #071A1F`, `--bg-deep #020608`, `--bg-surface #102A30`.
   - Use `--text-primary #F8FAFC`, `--text-secondary #A7B4BD`.
   - Use `--accent-orange #FF7A1A`, `--accent-orange-hover #FF9A4D`, `--accent-cyan #12D6DD`.
   - Keep dark 75%, neutral/text 15%, orange 7%, cyan 3%.

4. Copy motion primitives before animated sections:
   - `lib/gsap.ts`
   - `lib/motion.ts`
   - `hooks/motion/useStoryReveal.ts`
   - `hooks/interaction/useMagneticElements.ts`
   - `components/motion/StoryMotionProvider.tsx`

5. Copy layout/navigation:
   - Header shell first.
   - Then sidebar/menu logic.
   - Then `scrollNavigation.ts` and anchor constants.
   - Confirm body overflow is restored when sidebar closes.

6. Copy Hero last:
   - Copy `HeroV1.tsx`, `useHeroV1Motion.ts`, `HeroV1.timeline.ts`.
   - Copy exact Spline viewer URL unless user asks to replace it.
   - Copy hero CSS blocks from `style.css`, `fullpage-motion.css`, and `responsive.css`.
   - Preserve `data-motion`, `data-motion-el`, `data-story-state`, and `robot-guide` selectors.

7. Copy remaining sections only after the app runs:
   - About, Services, Feature, Awards, Team, Price, Testimonial, Contact, Partner, Footer.
   - Move their content into `src/data/*` when restructuring.
   - Replace template-only sections gradually.

8. Verify:
   - Run `npm run build` or `npm.cmd run build` on Windows.
   - Check desktop and mobile hero.
   - Check reduced motion.
   - Check Header logo/Home, sidebar anchors, CTA links, Spline load, and no white background leaks.

## Motion Rules

Use GSAP as the main engine for new animation. Use `gsap.context` or scoped hooks and clean up timelines, ScrollTriggers, listeners, observers, and animation frames.

Do not animate `top`, `left`, `width`, or `height`. Prefer `opacity`, `transform`, and subtle `filter`.

Do not apply AOS and GSAP to the same new element. Treat `data-aos` as legacy. Use `data-motion` for new story motion.

Respect `prefers-reduced-motion`. On reduced motion, set final visible states and clear transform/filter where needed.

## Spline Hero Rules

Preserve this Hero contract:

- Root: `.section.hero.darkGradient`
- Layout: `.hero-sec`, `.custom-container`, `.hero-inner.hero-v1-layout`
- Visual: `.hero-video.anime` with `data-motion="hero-visual"` and `data-motion-el="hero-video"`
- Spline: `<spline-viewer className="hero-spline-viewer" url="https://prod.spline.design/4QDf3qwGtpRrRVFU/scene.splinecode">`
- Content: author info, two-line title, two copy lines, primary/secondary CTA.
- Interactions: pointer parallax, scroll depth, cinematic intro, magnetic CTA, guide activation button.

If the target project does not need the robot guide, remove it as a separate pass after the Hero works. Do not remove guide selectors while copying motion CSS or hooks unless you also remove dependent timelines and CSS.

## Reusable Component Rules

Header/sidebar:

- Copy `HeaderV1`, `HeaderMenu`, `HeaderSidebar`, `scrollNavigation`.
- Preserve Home click behavior: on `/`, move to `hero`; on other routes, navigate to `/`.
- Preserve Home1 anchors: `hero`, `about`, `services`, `feature`, `awards`, `team`, `price`, `testimonial`, `contact`, `partner`, `footer`.
- Restore `document.body.style.overflow` when closing overlays.

Popup/sidebar/modal:

- Keep open state local.
- Lock body scroll only while open.
- Restore body scroll on close and unmount.
- Keep focus-visible styles and accessible labels.

Motion providers:

- Avoid double-mounting `StoryMotionProvider` against the same targets.
- Prefer one route-scoped provider for Home/story pages.
- Use global provider only for non-conflicting generic targets.

Buttons/cards/chips:

- Reuse `.theme-btn`, `[data-motion="magnetic"]`, `.motion-hover`, and story reveal data attributes.
- Keep orange as primary action and cyan as support border/metadata.

## Final Response Checklist

After work, report:

- Files changed.
- Components/styles copied or created.
- Behavior changed.
- Build result.
- Remaining manual checks, especially Spline, mobile, reduced motion, and navigation anchors.
