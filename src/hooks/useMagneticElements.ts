import { useEffect } from 'react';
import gsap from 'gsap';

export function useMagneticElements() {
  useEffect(() => {
    if (window.innerWidth <= 768) return; // Không kích hoạt trên mobile

    const elements = document.querySelectorAll('[data-motion="magnetic"]');
    const cleanups: (() => void)[] = [];

    elements.forEach((el) => {
      const element = el as HTMLElement;
      
      // Tạo quickTo tweens để di chuyển x, y mượt mà hiệu năng cao
      const xTo = gsap.quickTo(element, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      const yTo = gsap.quickTo(element, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });

      const handleMouseMove = (e: MouseEvent) => {
        const bound = element.getBoundingClientRect();
        
        // Tâm vật lý của phần tử
        const elX = bound.left + bound.width / 2;
        const elY = bound.top + bound.height / 2;
        
        // Khoảng cách từ con trỏ chuột đến tâm vật lý
        const deltaX = e.clientX - elX;
        const deltaY = e.clientY - elY;
        
        const distance = Math.hypot(deltaX, deltaY);
        const radius = 65; // Khoảng cách kích hoạt lực hút (px)

        if (distance < radius) {
          // Lực hút kéo về tâm con trỏ chuột (35%)
          const pull = 0.35;
          xTo(deltaX * pull);
          yTo(deltaY * pull);
        } else {
          // Bật nảy về tâm cũ
          xTo(0);
          yTo(0);
        }
      };

      const handleMouseLeave = () => {
        xTo(0);
        yTo(0);
      };

      window.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseleave', handleMouseLeave);

      cleanups.push(() => {
        window.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseleave', handleMouseLeave);
      });
    });

    return () => {
      cleanups.forEach((c) => c());
    };
  }, []);
}
