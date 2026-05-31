import { useEffect } from 'react';
import { getGsap } from '../lib/gsap';
import { canUseMotionPointer } from '../lib/pointer';

type QuickTo = (value: number) => void;

type MagneticState = {
  xTo: QuickTo;
  yTo: QuickTo;
  scaleTo: QuickTo;
};

function getDepth(element: HTMLElement) {
  const value = Number(element.dataset.hoverDepth);
  return Number.isFinite(value) && value > 0 ? value : 0.34;
}

export function useMagneticElements() {
  useEffect(() => {
    if (!canUseMotionPointer()) return;

    const { gsap } = getGsap();
    const states = new WeakMap<HTMLElement, MagneticState>();
    const cleanups = new Map<HTMLElement, () => void>();
    const emitHover = (hovering: boolean) => {
      window.dispatchEvent(new CustomEvent('motion-cursor:hover', { detail: { hovering } }));
    };

    const resetElement = (element: HTMLElement) => {
      const state = states.get(element);
      state?.xTo(0);
      state?.yTo(0);
      state?.scaleTo(1);
    };

    const setupElement = (element: HTMLElement) => {
      if (cleanups.has(element)) return;

      const state = {
        xTo: gsap.quickTo(element, 'x', { duration: 0.7, ease: 'elastic.out(1, 0.42)' }),
        yTo: gsap.quickTo(element, 'y', { duration: 0.7, ease: 'elastic.out(1, 0.42)' }),
        scaleTo: gsap.quickTo(element, 'scale', { duration: 0.45, ease: 'power3.out' }),
      };
      states.set(element, state);

      const handlePointerMove = (event: PointerEvent) => {
        const rect = element.getBoundingClientRect();
        const deltaX = event.clientX - (rect.left + rect.width / 2);
        const deltaY = event.clientY - (rect.top + rect.height / 2);
        const radius = Math.max(72, Math.min(rect.width, rect.height) * 0.8);
        const distance = Math.hypot(deltaX, deltaY);
        const pull = Math.max(0, 1 - distance / radius) * getDepth(element);

        state.xTo(deltaX * pull);
        state.yTo(deltaY * pull);
        state.scaleTo(1 + pull * 0.075);
      };

      const handlePointerEnter = () => {
        element.classList.add('is-magnetic-active');
        emitHover(true);
      };

      const handlePointerLeave = () => {
        element.classList.remove('is-magnetic-active');
        resetElement(element);
        emitHover(false);
      };

      element.addEventListener('pointerenter', handlePointerEnter);
      element.addEventListener('pointermove', handlePointerMove);
      element.addEventListener('pointerleave', handlePointerLeave);

      cleanups.set(element, () => {
        element.removeEventListener('pointerenter', handlePointerEnter);
        element.removeEventListener('pointermove', handlePointerMove);
        element.removeEventListener('pointerleave', handlePointerLeave);
        element.classList.remove('is-magnetic-active');
        gsap.killTweensOf(element);
        gsap.set(element, { clearProps: 'x,y,scale' });
      });
    };

    const scan = () => {
      document.querySelectorAll<HTMLElement>('[data-motion="magnetic"]').forEach(setupElement);
    };

    scan();
    const observer = new MutationObserver(scan);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      cleanups.forEach((cleanup) => cleanup());
      cleanups.clear();
      emitHover(false);
    };
  }, []);
}
