# Migration Playbook

## Phase 0: Decide Target Scope

Choose one target:

- Minimal copy: new app reuses Hero, Header, Contact, core CSS tokens, and motion primitives.
- Full portfolio copy: new app reuses Home1 section order, all main sections, legacy CSS, and routes.
- Storytelling rebuild: new app uses the current design language and motion hooks, but sections are rebuilt around chapter data.

Prefer minimal copy first, then add sections.

## Phase 1: Scaffold New App

Use Vite React TypeScript. Install current dependencies:

```bash
npm install @fullpage/react-fullpage @gsap/react aos bootstrap gsap lenis react-countup react-router-dom react-simple-scroll-up react-toastify split-type three
npm install -D @types/aos @types/react @types/react-dom @types/three @vitejs/plugin-react-swc eslint typescript vite
```

Use a portable Vite config:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
});
```

Do not alias React or React DOM to local Windows paths.

## Phase 2: Create Foundation Folders

Create:

```txt
src/app/providers
src/app/routes
src/components/hero
src/components/header
src/components/motion
src/components/sections
src/components/ui
src/components/utilities
src/hooks/interaction
src/hooks/motion
src/lib
src/data
src/styles
src/types
```

If copying legacy files directly, temporarily keep:

```txt
src/css
src/jsonData
public/assets
```

## Phase 3: Import CSS Safely

In `App.tsx`, import CSS in this order:

```ts
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "aos/dist/aos.css";
import "react-toastify/dist/ReactToastify.css";

import "./css/line-awesome.min.css";
import "./css/iconoir.css";
import "./css/fontawesome.min.css";
import "./css/animate.min.css";

import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/components.css";
import "./styles/motion.css";
import "./styles/story.css";
```

If using legacy CSS, import it before new override files:

```ts
import "./css/aixor-unit-test.css";
import "./css/style.css";
import "./css/responsive.css";
import "./css/fullpage-motion.css";
```

## Phase 4: Copy Core Utilities

Copy or recreate:

- `src/lib/gsap.ts`
- `src/lib/motion.ts`
- `src/lib/navigation.ts`
- `src/components/utilities/scrollNavigation.ts`
- `src/components/utilities/RoutesScrollToTop.tsx`
- `src/components/utilities/ScrollToTopButton.tsx`

If Fullpage is not used in the new app, keep `scrollNavigation.ts` but make Fullpage usage a fallback check, not a hard dependency.

## Phase 5: Copy Motion Primitives

Copy:

- `src/hooks/motion/useStoryReveal.ts`
- `src/hooks/interaction/useMagneticElements.ts`
- `src/hooks/usePointerInteractions.ts`
- `src/components/motion/StoryMotionProvider.tsx`

Mount `StoryMotionProvider` once per scope. For a story Home route, prefer:

```tsx
const rootRef = useRef<HTMLDivElement | null>(null);

return (
  <div className="phongdev-main home1-cinematic" ref={rootRef}>
    <StoryMotionProvider rootRef={rootRef} />
    ...
  </div>
);
```

Avoid also mounting an unscoped global `StoryMotionProvider` unless generic page targets are separate.

## Phase 6: Copy Header/Sidebar

Copy:

- `HeaderV1.tsx`
- `HeaderMenu.tsx`
- `HeaderSidebar.tsx`
- `SocialShareV1.tsx` if used
- required assets: `logo-1.png`, `sidebarbg.png`

Preserve:

- Logo/Home click returns to `hero` on `/`.
- From other routes, Home navigates to `/`.
- Sidebar section links use the Home anchor map.
- Body overflow is restored on close and unmount.

## Phase 7: Copy Hero/Spline

Copy:

- `HeroV1.tsx`
- `useHeroV1Motion.ts`
- `HeroV1.timeline.ts`
- `useHeroGuideStory.ts` if keeping interactive guide
- `Bulge.tsx`
- `btn-arrow.svg`

Install or include the Spline viewer script in `index.html` if the target app does not already have it:

```html
<script type="module" src="https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js"></script>
```

Keep the current scene URL:

```txt
https://prod.spline.design/4QDf3qwGtpRrRVFU/scene.splinecode
```

Do not copy another WebGL hero into the same viewport.

## Phase 8: Copy Section Components

Copy sections gradually:

- About and Services first.
- Feature/projects next.
- Contact and Footer after navigation works.
- Awards, Team, Price, Testimonial, Partner only if still useful for the new story.

Move hard-coded content into:

- `src/data/projects.ts`
- `src/data/skills.ts`
- `src/data/process.ts`
- `src/data/storyChapters.ts`

## Phase 9: Verify

Run:

```bash
npm run build
```

On Windows PowerShell if blocked:

```bash
npm.cmd run build
```

Manual checks:

- Desktop hero at 1440 and 1280.
- Tablet/mobile at 768, 430, 375.
- Spline appears and does not cover title/CTA.
- CTA links are clickable.
- Header Home and sidebar anchors work.
- No white background leak.
- Reduced motion shows final states.
- No console errors from duplicate ScrollTriggers or missing assets.
