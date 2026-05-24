import { useEffect, useRef, useState } from 'react';
import { canUseMotionPointer } from '../../lib/pointer';

type PointerState = {
  hovering: boolean;
  pressed: boolean;
};

export default function MotionCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotPosition = useRef({ x: 0, y: 0 });
  const ringPosition = useRef({ x: 0, y: 0 });
  const targetPosition = useRef({ x: 0, y: 0 });
  const animationFrame = useRef<number | null>(null);
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

    document.body.classList.add('has-motion-cursor');
    document.documentElement.classList.add('has-motion-cursor');
    targetPosition.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
    dotPosition.current = { ...targetPosition.current };
    ringPosition.current = { ...targetPosition.current };

    const render = () => {
      const { x, y } = targetPosition.current;

      dotPosition.current.x += (x - dotPosition.current.x) * 0.42;
      dotPosition.current.y += (y - dotPosition.current.y) * 0.42;
      ringPosition.current.x += (x - ringPosition.current.x) * 0.18;
      ringPosition.current.y += (y - ringPosition.current.y) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPosition.current.x}px, ${dotPosition.current.y}px, 0) translate(-50%, -50%)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPosition.current.x}px, ${ringPosition.current.y}px, 0) translate(-50%, -50%)`;
      }

      animationFrame.current = window.requestAnimationFrame(render);
    };

    const handleMove = (event: MouseEvent | PointerEvent) => {
      targetPosition.current = { x: event.clientX, y: event.clientY };

      if (!visibleRef.current) {
        dotPosition.current = { x: event.clientX, y: event.clientY };
        ringPosition.current = { x: event.clientX, y: event.clientY };
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

    animationFrame.current = window.requestAnimationFrame(render);

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

      if (animationFrame.current !== null) {
        window.cancelAnimationFrame(animationFrame.current);
      }
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
