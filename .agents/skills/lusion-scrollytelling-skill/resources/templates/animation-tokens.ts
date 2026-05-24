export const motion = {
  easeOut: 'power4.out',
  easeInOut: 'power3.inOut',
  revealDuration: 1.1,
  fastDuration: 0.55,
  staggerSm: 0.045,
  staggerMd: 0.09,
  scrub: 0.8,
} as const

export const breakpoints = {
  mobile: 768,
  tablet: 1024,
} as const

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
