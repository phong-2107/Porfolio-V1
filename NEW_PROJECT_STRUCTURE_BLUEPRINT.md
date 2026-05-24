# New Project Structure Blueprint

Use this blueprint when creating a new project from the current PhongDev portfolio. The goal is to make component and style migration easy without inheriting every legacy template dependency at once.

## Recommended Structure

```txt
new-portfolio/
  public/
    assets/
      images/
      fonts/
  src/
    app/
      providers/
        AppProviders.tsx
      routes/
        AppRoutes.tsx
    components/
      hero/
        HeroV1.tsx
        HeroV1.timeline.ts
        useHeroV1Motion.ts
      header/
        HeaderV1.tsx
        HeaderMenu.tsx
        HeaderSidebar.tsx
      layout/
        PageShell.tsx
      motion/
        StoryMotionProvider.tsx
      sections/
        AboutSection.tsx
        CraftSection.tsx
        ProjectsSection.tsx
        ProcessSection.tsx
        ContactSection.tsx
      ui/
        Button.tsx
        Card.tsx
        Popup.tsx
        SectionHeading.tsx
      utilities/
        Bulge.tsx
        RoutesScrollToTop.tsx
        ScrollToTopButton.tsx
        scrollNavigation.ts
    hooks/
      interaction/
        useMagneticElements.ts
      motion/
        useStoryReveal.ts
        useHeroGuideStory.ts
    lib/
      gsap.ts
      motion.ts
      navigation.ts
    data/
      process.ts
      projects.ts
      skills.ts
      storyChapters.ts
    styles/
      tokens.css
      base.css
      components.css
      motion.css
      hero.css
      story.css
      responsive.css
    types/
      story.ts
    App.tsx
    main.tsx
    vite-env.d.ts
  index.html
  package.json
  vite.config.ts
  tsconfig.json
  AGENTS.md
```

## Copy Order

1. Copy `package.json` dependency list, then install cleanly.
2. Create portable `vite.config.ts` with React dedupe.
3. Copy assets required by Header and Hero.
4. Copy design tokens into `src/styles/tokens.css`.
5. Copy base body/root styles into `src/styles/base.css`.
6. Copy `lib/*` and `hooks/*` motion/interaction primitives.
7. Copy `StoryMotionProvider`.
8. Copy `HeaderV1`, `HeaderMenu`, `HeaderSidebar`, and `scrollNavigation`.
9. Copy `HeroV1`, hero motion hooks, Spline viewer setup, and hero CSS.
10. Copy sections gradually and convert content into `src/data/*`.

## Style Ownership

Use:

- `tokens.css`: color, spacing, typography, radius, shadows, easing.
- `base.css`: `html`, `body`, `#root`, focus-visible, generic media behavior.
- `components.css`: buttons, cards, chips, header/sidebar, popup primitives.
- `motion.css`: `[data-motion]`, reduced-motion rules, motion hover.
- `hero.css`: HeroV1, Spline viewer, robot guide, device trigger.
- `story.css`: chapter shells, section rhythm, project/process layouts.
- `responsive.css`: targeted breakpoints.

Avoid copying all of `style.css` forever. If you must copy it during migration, place it in `src/css/legacy/style.css`, then extract stable pieces into `src/styles/*`.

## Design Tokens

```css
:root {
  --bg-base: #071A1F;
  --bg-deep: #020608;
  --bg-surface: #102A30;
  --bg-surface-hover: #163B43;

  --text-primary: #F8FAFC;
  --text-secondary: #A7B4BD;
  --text-muted: rgba(167, 180, 189, 0.68);

  --accent-orange: #FF7A1A;
  --accent-orange-hover: #FF9A4D;
  --accent-cyan: #12D6DD;
  --accent-mint: #46CF98;

  --border-subtle: rgba(248, 250, 252, 0.08);
  --border-strong: rgba(248, 250, 252, 0.14);
  --border-cyan: rgba(18, 214, 221, 0.24);
  --border-orange: rgba(255, 122, 26, 0.28);

  --surface-glass: rgba(7, 26, 31, 0.72);
  --surface-card: rgba(16, 42, 48, 0.82);

  --shadow-card: 0 24px 80px rgba(0, 0, 0, 0.28);
  --shadow-orange: 0 18px 60px rgba(255, 122, 26, 0.18);
  --shadow-cyan: 0 18px 60px rgba(18, 214, 221, 0.12);

  --radius-sm: 10px;
  --radius-md: 18px;
  --radius-lg: 28px;
  --radius-pill: 999px;

  --container: 1180px;
  --container-wide: 1360px;
  --section-y: clamp(80px, 12vw, 160px);

  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-soft: cubic-bezier(0.16, 1, 0.3, 1);
}
```

## Story Chapter Mapping

```txt
hero        -> Arrival
about       -> Signal
services    -> Craft
feature     -> Proof / Selected Work
awards      -> Proof / credibility
team        -> Method / workflow if rewritten
price       -> Optional; remove or repurpose if not portfolio-relevant
testimonial -> Social proof
contact     -> Invitation
partner     -> Optional ecosystem/support
footer      -> Closing
```

## Required Checks

Run:

```bash
npm run build
```

Manual checks:

- Spline loads in Hero and does not block text or CTA.
- Header Home returns to Hero.
- Sidebar anchors match section names.
- Mobile 375 and 430 do not overflow horizontally.
- Reduced motion disables transform-heavy animation.
- No AOS and GSAP on the same new element.
