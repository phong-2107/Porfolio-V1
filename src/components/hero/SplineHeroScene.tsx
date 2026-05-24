import Spline from '@splinetool/react-spline';
import type { Application } from '@splinetool/runtime';
import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function SplineHeroScene() {
  const spline = useRef<Application | null>(null);
  const monitorObj = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Tránh lặp lại onLoad khi StrictMode render 2 lần
  const [isLoaded, setIsLoaded] = useState(false);

  // useGSAP sẽ quản lý vòng đời và dọn dẹp Timeline/ScrollTrigger khi component unmount
  const { contextSafe } = useGSAP({ scope: containerRef });

  const setupAnimations = contextSafe(() => {
    if (!containerRef.current) return;

    // Ép GPU xử lý ngay từ đầu
    gsap.set(containerRef.current, { scale: 1.35, force3D: true });

    // Thay thế "vw" String bằng Pixel số thực tuyệt đối
    const xOffset = window.innerWidth > 768 ? window.innerWidth * 0.28 : window.innerWidth * 0.4;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".main-scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5, // Giảm từ 1 xuống 0.5 để phản ứng nhanh, bớt tồn đọng (lag)
        invalidateOnRefresh: true,
      }
    });

    tl.to(containerRef.current, {
      x: xOffset,
      scale: 1.8,
      force3D: true, // Kích hoạt Hardware Acceleration
      ease: "none"
    }, 0)
    .to(containerRef.current, {
      x: -xOffset,
      force3D: true,
      ease: "none"
    }, "+=0.5")
    .to(containerRef.current, {
      x: 0,
      scale: 1.35,
      force3D: true,
      ease: "none"
    }, "+=0.5");
  });

  useEffect(() => {
    if (!isLoaded) return;

    const handleWindowHover = contextSafe((e: MouseEvent) => {
      if (!monitorObj.current) return;
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;

      gsap.to(monitorObj.current.rotation, {
        x: -y * 0.4,
        y: x * 0.4,
        duration: 0.5,
        ease: 'power2.out'
      });
    });

    window.addEventListener('mousemove', handleWindowHover);

    // Chặn sự kiện wheel và touch để Spline không "nuốt" scroll của trang, 
    // nhưng vẫn cho phép Spline nhận mousemove để không bị "ngủ đông" (sleep mode).
    const blockScrollPropagation = (e: Event) => {
      e.stopPropagation();
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', blockScrollPropagation, { capture: true, passive: false });
      container.addEventListener('touchstart', blockScrollPropagation, { capture: true, passive: false });
      container.addEventListener('touchmove', blockScrollPropagation, { capture: true, passive: false });
    }

    return () => {
      window.removeEventListener('mousemove', handleWindowHover);
      if (container) {
        container.removeEventListener('wheel', blockScrollPropagation, { capture: true });
        container.removeEventListener('touchstart', blockScrollPropagation, { capture: true });
        container.removeEventListener('touchmove', blockScrollPropagation, { capture: true });
      }
    };
  }, [isLoaded, contextSafe]);

  function onLoad(splineApp: Application) {
    if (isLoaded) return; // Chặn StrictMode chạy 2 lần
    
    spline.current = splineApp;
    monitorObj.current = splineApp.findObjectByName('Monitor');

    setIsLoaded(true);
    setupAnimations();
  }

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full relative z-[10] pointer-events-auto will-change-transform"
      style={{ transformOrigin: 'center center' }}
    >
      <Spline
        scene="https://prod.spline.design/4QDf3qwGtpRrRVFU/scene.splinecode"
        onLoad={onLoad}
      />
    </div>
  );
}
