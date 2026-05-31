import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLoading } from '../../hooks/useLoading';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const { isLoading } = useLoading();
  const lenisRef = useRef<Lenis | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize and destroy scroll smoothing engines based on platform
  useEffect(() => {
    setIsReady(false);

    console.log('SmoothScroll: Initializing Global Lenis smooth scrolling');
    
    const lenis = new Lenis({
      duration: 1.4, // Rich, momentum-filled smooth scroll
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo out
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05, // Subtle responsive scroll booster
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
    gsap.ticker.lagSmoothing(0);

    setIsReady(true); // Mount children AFTER Lenis is created

    return () => {
      console.log('SmoothScroll: Destroying Global Lenis');
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
      lenis.start();
      // Delay ScrollTrigger refresh slightly to allow loading screen exit animation to complete
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 400);
    }
  }, [isLoading, isReady]);

  return (
    <div id="smooth-wrapper" style={{ position: 'relative', zIndex: 10 }}>
      <div id="smooth-content">
        {isReady && children}
      </div>
    </div>
  );
}
