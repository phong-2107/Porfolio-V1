import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SplitTextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function SplitTextReveal({ text, className = '', delay = 0 }: SplitTextRevealProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const words = containerRef.current.querySelectorAll('.reveal-word-inner');
    
    const anim = gsap.fromTo(words, 
      { yPercent: 100, rotate: 3 },
      {
        yPercent: 0,
        rotate: 0,
        duration: 0.8,
        stagger: 0.04,
        ease: 'power3.out',
        delay,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 88%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, [text, delay]);

  return (
    <span ref={containerRef} className={`inline-block overflow-hidden ${className}`}>
      {text.split(' ').map((word, idx) => (
        <span key={idx} className="inline-block overflow-hidden mr-[0.25em] pb-[0.05em]">
          <span className="reveal-word-inner inline-block will-change-transform">
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}
