export function canUseMotionPointer() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const anyFinePointer =
    window.matchMedia('(pointer: fine)').matches ||
    window.matchMedia('(any-pointer: fine)').matches;
  const coarseOnly =
    !anyFinePointer &&
    (window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(any-pointer: coarse)').matches ||
      (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0));

  return !reducedMotion && !coarseOnly;
}
