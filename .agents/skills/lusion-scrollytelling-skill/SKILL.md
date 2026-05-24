# lusion-scrollytelling-skill

## Purpose
Use this skill to upgrade a React/Next.js portfolio into a high-end 3D scrollytelling website inspired by Lusion-style interaction design. The goal is not to copy Lusion visually, but to apply the same engineering mindset: scroll as a cinematic timeline, synchronized DOM + WebGL, staged component reveals, performance-first 3D, and polished motion choreography.

## When to use this skill
Use this skill when the user asks to:
- Upgrade a portfolio or landing page with premium scroll animation.
- Build WebGL/Three.js/Spline sections controlled by scroll.
- Add GSAP ScrollTrigger animation to hero, project cards, about, skills, contact, or case-study sections.
- Synchronize 3D objects with DOM sections/cards/images.
- Fix janky scroll, rAF desync, bad performance, layout shift, or animation overload.
- Convert a normal website into scene-based scrollytelling.

## Core inspiration principles
Lusion-style sites are driven by these principles:
1. Scroll is a cinematic timeline, not a basic reveal trigger.
2. Sections are scenes. Each scene has an entry, transformation, and exit.
3. DOM typography, WebGL canvas, masks, card reveals, sound/micro-interactions, and scene transitions should feel choreographed.
4. Prefer one coordinated WebGL canvas over many small WebGL canvases.
5. WebGL visuals must stay synchronized with DOM elements during scroll.
6. Use smooth/controlled scroll only when it improves sync and experience. Avoid unnecessary scroll-jacking.
7. Design for performance from the start: compressed models, lazy loading, reduced geometry, fallback states, mobile simplification.

## Required implementation stack
Preferred stack:
- React or Next.js
- GSAP
- ScrollTrigger
- Lenis for smooth scroll when needed
- Three.js or React Three Fiber for deep WebGL control
- Spline only when model authoring speed matters more than low-level control
- Framer Motion for small UI interactions, not primary scroll timelines
- CSS masks, clip-path, transform, opacity, filter blur, and CSS variables

## Mandatory AI Agent workflow
Before coding, the agent must perform these steps:

### 1. Audit the current project
Inspect:
- package.json
- app/pages/routes structure
- global CSS/Tailwind config
- existing animation libraries
- current hero and section components
- current model/Spline/Three.js integration
- asset sizes and rendering bottlenecks

Do not add heavy libraries blindly. Reuse existing stack where possible.

### 2. Create a scene map
Every scroll section must be described as a scene:

```json
{
  "id": "hero",
  "trigger": "#hero",
  "scrollLength": "160vh",
  "pin": true,
  "dom": ["headline", "subtitle", "cta", "scrollIndicator"],
  "webgl": ["mainModel", "particles"],
  "timeline": [
    "headline reveal",
    "model rotate 0.25 turn",
    "subtitle fade in",
    "camera push in",
    "transition to about"
  ],
  "fallback": "static model image + basic fade"
}
```

### 3. Choose animation ownership
Use this rule:
- GSAP owns scroll-linked timelines.
- Three/R3F owns per-frame rendering and 3D scene state.
- Lenis owns smooth scroll only if needed.
- Framer Motion owns hover/tap/micro-interactions.
- CSS owns simple transitions and masks.

Never let multiple systems fight over the same transform property.

### 4. Build animation tokens
Create shared timing and easing constants:

```ts
export const motion = {
  easeOut: 'power4.out',
  easeInOut: 'power3.inOut',
  revealDuration: 1.1,
  staggerSm: 0.045,
  staggerMd: 0.09,
  scrub: 0.8,
}
```

### 5. Implement scenes one by one
Do not animate the whole site at once. Build in order:
1. Hero pinned scene
2. About transition scene
3. Project card reveal scene
4. Skills/tech orbital or depth scene
5. Contact final scene

### 6. Add responsive and accessibility fallbacks
Must support:
- `prefers-reduced-motion`
- low-end/mobile reduced effects
- static fallback image for 3D model
- no critical text only inside canvas
- semantic HTML remains readable without JS

## Animation patterns

### Text reveal pattern
Use mask wrappers. Animate inner line/word/char.

Required CSS:
```css
.motion-mask {
  overflow: hidden;
  display: block;
}
.motion-line {
  display: block;
  will-change: transform, opacity;
}
```

Required GSAP pattern:
```ts
gsap.from('[data-reveal-line]', {
  yPercent: 120,
  opacity: 0,
  duration: motion.revealDuration,
  stagger: motion.staggerMd,
  ease: motion.easeOut,
  scrollTrigger: {
    trigger: section,
    start: 'top 75%',
  },
})
```

### Pinned hero timeline pattern
```ts
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '#hero-scene',
    start: 'top top',
    end: '+=1800',
    scrub: 0.8,
    pin: true,
    anticipatePin: 1,
  },
})

tl.from('[data-hero-title]', { yPercent: 110, opacity: 0, ease: 'power4.out' })
  .to(model.rotation, { y: Math.PI * 0.4 }, 0)
  .to(camera.position, { z: 4.5 }, 0)
  .from('[data-hero-subtitle]', { y: 40, opacity: 0 }, 0.25)
  .to('[data-scroll-indicator]', { opacity: 0 }, 0.6)
```

### Project card reveal pattern
```ts
gsap.from('[data-project-card]', {
  y: 88,
  scale: 0.94,
  opacity: 0,
  filter: 'blur(14px)',
  duration: 1,
  stagger: 0.12,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '[data-project-grid]',
    start: 'top 72%',
  },
})
```

### WebGL + DOM sync rule
If a 3D object must visually attach to an HTML card, image, or text block:
- Track a proxy DOM element.
- Read layout through `getBoundingClientRect()` sparingly.
- Prefer IntersectionObserver/ResizeObserver for updates.
- Map DOM rect to Three.js coordinates.
- Render all such objects in one shared canvas.
- Avoid one canvas per card.

Recommended architecture:
```txt
<App>
  <GlobalCanvas />
  <SmoothScrollProvider />
  <main>
    <HeroScene />
    <AboutScene />
    <ProjectScene />
    <ContactScene />
  </main>
</App>
```

## Spline usage rules
Use Spline when:
- The design needs fast visual iteration.
- The 3D model is mostly decorative.
- You need simple hover/cursor interactions.

Avoid Spline-only control when:
- Camera and object animation must be deeply scroll-synced.
- You need shader-level effects.
- You need strong performance control.
- Multiple objects must align precisely with DOM elements.

If using Spline in React:
- Wrap the Spline scene in a stable container.
- Animate the wrapper with GSAP.
- Use Spline variables/events only for supported object-level changes.
- Provide fallback poster image for mobile or reduced motion.

## Performance rules
Mandatory:
- Use `will-change` only on animated elements, not globally.
- Animate transform/opacity whenever possible.
- Avoid animating layout properties like top/left/width/height.
- Compress GLB/GLTF with Draco or Meshopt when using Three.js.
- Compress textures; avoid huge 4K textures unless essential.
- Lazy-load below-the-fold 3D scenes.
- Pause or reduce render loop when scene is off-screen.
- Use low-poly/mobile variants.
- Respect `prefers-reduced-motion`.
- Test with Chrome Performance, Lighthouse, and real mobile device.

Performance budget targets:
- Initial JS increase for animation layer: keep minimal.
- Hero 3D model: ideally under 3-5MB compressed.
- Texture max: 1K-2K for most portfolio use cases.
- Maintain stable 60fps desktop; acceptable simplified 30fps mobile.
- Avoid long main-thread tasks above 50ms during scroll.

## Anti-patterns
Do not:
- Add random animations to every component.
- Use multiple WebGL canvases for every project card.
- Pin too many sections on mobile.
- Scroll-jack without a real synchronization reason.
- Put important text inside canvas only.
- Use heavy blur/filter on too many elements during scroll.
- Mix GSAP and Framer Motion on the same property.
- Animate uncompressed 3D assets.
- Ignore reduced motion.

## Agent output requirements
When applying this skill, the AI Agent must output:
1. Current project audit summary.
2. Proposed scene map.
3. File-by-file implementation plan.
4. Exact packages to install, if needed.
5. Code changes.
6. Performance/accessibility checklist.
7. Testing commands.
8. Rollback notes.

## Suggested packages
Use only when needed:
```bash
npm install gsap lenis
npm install three @react-three/fiber @react-three/drei
npm install @14islands/r3f-scroll-rig
npm install framer-motion
```

## Testing checklist
- Scroll works with mouse wheel, trackpad, touch, keyboard.
- No horizontal overflow.
- Pinned sections release correctly.
- Refresh on middle scroll position works.
- Mobile does not over-pin or freeze.
- Reduced motion shows readable static layout.
- Canvas and DOM remain visually aligned.
- No hydration errors in Next.js.
- No layout shift after model/image load.
- FPS remains stable during hero and project transitions.

## Final quality bar
The final result should feel like a designed journey, not a collection of effects. Each scroll moment must either reveal information, transition the viewer to a new scene, or create a meaningful interaction between text, component, and 3D visual.
