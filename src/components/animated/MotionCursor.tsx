import { useEffect, useRef, useState } from 'react';
import { canUseMotionPointer } from '../../lib/pointer';
import { getGsap } from '../../lib/gsap';

type PointerState = {
  hovering: boolean;
  pressed: boolean;
};

export default function MotionCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(false);
  const [visible, setVisible] = useState(false);
  const [pointerState, setPointerState] = useState<PointerState>({
    hovering: false,
    pressed: false,
  });

  useEffect(() => {
    if (!canUseMotionPointer()) {
      return;
    }

    const { gsap } = getGsap();
    const dot = dotRef.current;
    const ring = ringRef.current;

    if (!dot || !ring) {
      return;
    }

    document.body.classList.add('has-motion-cursor');
    document.documentElement.classList.add('has-motion-cursor');

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: window.innerWidth / 2, y: window.innerHeight / 2 });
    const dotXTo = gsap.quickTo(dot, 'x', { duration: 0.18, ease: 'power3.out' });
    const dotYTo = gsap.quickTo(dot, 'y', { duration: 0.18, ease: 'power3.out' });
    const ringXTo = gsap.quickTo(ring, 'x', { duration: 0.52, ease: 'power3.out' });
    const ringYTo = gsap.quickTo(ring, 'y', { duration: 0.52, ease: 'power3.out' });

    const handleMove = (event: MouseEvent | PointerEvent) => {
      dotXTo(event.clientX);
      dotYTo(event.clientY);
      ringXTo(event.clientX);
      ringYTo(event.clientY);

      if (!visibleRef.current) {
        gsap.set([dot, ring], { x: event.clientX, y: event.clientY });
        visibleRef.current = true;
        setVisible(true);
      }
    };

    const handleEnter = () => {
      visibleRef.current = true;
      setVisible(true);
    };
    const handleLeave = () => {
      visibleRef.current = false;
      setVisible(false);
    };
    const handleDown = () => setPointerState((state) => ({ ...state, pressed: true }));
    const handleUp = () => setPointerState((state) => ({ ...state, pressed: false }));
    const handleHoverChange = (event: Event) => {
      const detail = (event as CustomEvent<{ hovering: boolean }>).detail;
      setPointerState((state) => ({ ...state, hovering: detail.hovering }));
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseenter', handleEnter);
    window.addEventListener('mouseleave', handleLeave);
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('motion-cursor:hover', handleHoverChange as EventListener);

    return () => {
      document.body.classList.remove('has-motion-cursor');
      document.documentElement.classList.remove('has-motion-cursor');
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseenter', handleEnter);
      window.removeEventListener('mouseleave', handleLeave);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('motion-cursor:hover', handleHoverChange as EventListener);
      gsap.killTweensOf([dot, ring]);
    };
  }, []);

  const visibilityClass = visible ? 'is-visible' : '';
  const hoverClass = pointerState.hovering ? 'is-hovering' : '';
  const pressedClass = pointerState.pressed ? 'is-pressed' : '';

  return (
    <>
      <div
        ref={ringRef}
        className={`motion-cursor motion-cursor--ring ${visibilityClass} ${hoverClass} ${pressedClass}`.trim()}
        aria-hidden="true"
      />
      <div
        ref={dotRef}
        className={`motion-cursor motion-cursor--dot ${visibilityClass} ${hoverClass} ${pressedClass}`.trim()}
        aria-hidden="true"
      />
    </>
  );
}
