import { useEffect } from 'react';
import { canUseMotionPointer } from '../lib/pointer';

const SELECTORS = [
  '.theme-btn',
  '.header-menu-wrap a',
  '.creative-header-wrap a',
  '.notch-bar-menu-wrap a',
  '.hero-play-button',
  '.portfolio-icon-button',
  '.service-box',
  '.feature-project',
  '.pricing-box',
  '.team-member-box',
  '.testimonial-box',
].join(', ');

type MotionProfile = {
  scale: number;
  strength: number;
  tilt: number;
};

function getMotionProfile(element: Element): MotionProfile {
  if (
    element.classList.contains('service-box') ||
    element.classList.contains('feature-project') ||
    element.classList.contains('pricing-box') ||
    element.classList.contains('team-member-box') ||
    element.classList.contains('testimonial-box')
  ) {
    return { strength: 14, scale: 1.025, tilt: 5 };
  }

  return { strength: 8, scale: 1.04, tilt: 0 };
}

function setMotionVariables(element: HTMLElement, x = 0, y = 0, tiltX = 0, tiltY = 0, scale = 1) {
  element.style.setProperty('--motion-x', `${x}px`);
  element.style.setProperty('--motion-y', `${y}px`);
  element.style.setProperty('--motion-tilt-x', `${tiltX}deg`);
  element.style.setProperty('--motion-tilt-y', `${tiltY}deg`);
  element.style.setProperty('--motion-scale', `${scale}`);
}

export function usePointerInteractions() {
  useEffect(() => {
    if (!canUseMotionPointer()) {
      return;
    }

    const elements = new Set<HTMLElement>();
    const cleanupCallbacks = new Map<HTMLElement, () => void>();
    const rectCache = new WeakMap<HTMLElement, DOMRect>();

    const refreshRects = () => {
      elements.forEach((element) => {
        rectCache.set(element, element.getBoundingClientRect());
      });
    };

    const emitHover = (hovering: boolean) => {
      window.dispatchEvent(new CustomEvent('motion-cursor:hover', { detail: { hovering } }));
    };

    const setupElement = (element: HTMLElement) => {
      if (elements.has(element)) return;
      elements.add(element);

      element.classList.add('motion-hover');

      const handleEnter = () => {
        rectCache.set(element, element.getBoundingClientRect());
        element.classList.add('is-pointer-active');
        emitHover(true);
      };

      const handleMove = (event: MouseEvent | PointerEvent) => {
        const rect = rectCache.get(element) ?? element.getBoundingClientRect();
        const profile = getMotionProfile(element);
        const offsetX = event.clientX - (rect.left + rect.width / 2);
        const offsetY = event.clientY - (rect.top + rect.height / 2);
        const normalizedX = rect.width === 0 ? 0 : offsetX / rect.width;
        const normalizedY = rect.height === 0 ? 0 : offsetY / rect.height;

        const x = normalizedX * profile.strength;
        const y = normalizedY * profile.strength;
        const tiltX = profile.tilt === 0 ? 0 : normalizedY * profile.tilt * -1;
        const tiltY = profile.tilt === 0 ? 0 : normalizedX * profile.tilt;

        setMotionVariables(element, x, y, tiltX, tiltY, profile.scale);
      };

      const handleLeave = () => {
        element.classList.remove('is-pointer-active');
        setMotionVariables(element);
        emitHover(false);
      };

      element.addEventListener('mouseenter', handleEnter);
      element.addEventListener('pointerenter', handleEnter);
      element.addEventListener('pointermove', handleMove);
      element.addEventListener('mousemove', handleMove);
      element.addEventListener('mouseleave', handleLeave);
      element.addEventListener('pointerleave', handleLeave);

      cleanupCallbacks.set(element, () => {
        element.classList.remove('motion-hover', 'is-pointer-active');
        setMotionVariables(element);
        element.removeEventListener('mouseenter', handleEnter);
        element.removeEventListener('pointerenter', handleEnter);
        element.removeEventListener('pointermove', handleMove);
        element.removeEventListener('mousemove', handleMove);
        element.removeEventListener('mouseleave', handleLeave);
        element.removeEventListener('pointerleave', handleLeave);
      });
    };

    const checkDOM = () => {
      const currentNodes = document.querySelectorAll<HTMLElement>(SELECTORS);
      currentNodes.forEach(setupElement);
    };

    checkDOM();
    const observer = new MutationObserver(() => {
      checkDOM();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('resize', refreshRects);
    window.addEventListener('scroll', refreshRects, true);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', refreshRects);
      window.removeEventListener('scroll', refreshRects, true);
      cleanupCallbacks.forEach((cleanup) => cleanup());
      elements.clear();
      cleanupCallbacks.clear();
      emitHover(false);
    };
  }, []);
}
