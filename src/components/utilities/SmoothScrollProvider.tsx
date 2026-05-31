import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { useLoading } from '../../hooks/useLoading';
import { getGsap } from '../../lib/gsap';

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const { isLoading } = useLoading();
  const lenisRef = useRef<Lenis | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize and destroy scroll smoothing engines based on platform
  useEffect(() => {
    const { gsap, ScrollTrigger } = getGsap();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setIsReady(false);

    const lenis = new Lenis({
      // Thay vì dùng duration/easing cố định, sử dụng lerp để tạo quán tính (momentum) siêu mượt
      lerp: reduceMotion ? 1 : 0.06, 
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: !reduceMotion,
      // Giảm hệ số cuộn chuột để làm chậm tốc độ cuộn xuống (từ 0.92 -> 0.65)
      wheelMultiplier: reduceMotion ? 1 : 0.65,
      touchMultiplier: 1.15, // Giữ nguyên tốc độ cảm ứng trên mobile để tránh khó chịu
      syncTouch: false,
    });

    lenis.on('scroll', ScrollTrigger.update);
    lenisRef.current = lenis;
    (window as any).lenis = lenis;

    if (isLoading) {
      lenis.stop();
    }

    const updateRaf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateRaf);
    gsap.ticker.lagSmoothing(500, 33);

    setIsReady(true); // Mount children AFTER Lenis is created

    const refreshAfterLayout = () => ScrollTrigger.refresh();
    const refreshTimeout = window.setTimeout(refreshAfterLayout, 250);
    const fontsReady = document.fonts?.ready;
    fontsReady?.then(refreshAfterLayout).catch(() => {});
    window.addEventListener('load', refreshAfterLayout, { once: true });

    return () => {
      window.clearTimeout(refreshTimeout);
      window.removeEventListener('load', refreshAfterLayout);
      lenis.destroy();
      lenisRef.current = null;
      (window as any).lenis = undefined;
      gsap.ticker.remove(updateRaf);
    };
  }, []);

  // Sync loading state with scroll lock/unlock
  useEffect(() => {
    if (!isReady) return;

    const lenis = lenisRef.current;
    if (!lenis) return;

    if (isLoading) {
      lenis.stop();
    } else {
      const { ScrollTrigger } = getGsap();
      lenis.start();
      // Delay ScrollTrigger refresh slightly to allow loading screen exit animation to complete
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 400);
    }
  }, [isLoading, isReady]);

  return (
    <div id="smooth-wrapper" style={{ position: 'relative' }}>
      <div id="smooth-content">
        {isReady && children}
      </div>
    </div>
  );
}
