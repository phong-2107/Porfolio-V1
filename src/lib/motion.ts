export const motionSelectors = {
  heroRoot: '.main-scroll-container',
  magnetic: '[data-motion="magnetic"]',
} as const;

export function prefersReducedMotion() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
