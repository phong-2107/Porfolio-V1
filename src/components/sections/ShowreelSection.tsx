import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { ArrowDownRight } from 'lucide-react';
import { getGsap } from '../../lib/gsap';

const { gsap, ScrollTrigger } = getGsap();

export default function ShowreelSection() {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textRefs = useRef<HTMLSpanElement[]>([]);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const orbRef = useRef<HTMLDivElement>(null);

  // Clear refs on render to avoid infinite growth during HMR
  textRefs.current = [];
  cardRefs.current = [];

  useGSAP(() => {
    if (!containerRef.current) return;

    // 1. Text Reveal Animation (Staggered Slide Up)
    gsap.fromTo(textRefs.current, 
      { y: 150, opacity: 0, rotateZ: 2 },
      {
        y: 0,
        opacity: 1,
        rotateZ: 0,
        stagger: 0.15,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
        }
      }
    );

    // 2. Video Scale & Fade Reveal (Tối ưu: Bỏ filter blur cực nặng trên video)
    gsap.fromTo(videoRef.current,
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
        }
      }
    );

    // 3. HUD Cards Stagger Reveal
    gsap.fromTo(cardRefs.current,
      { x: 50, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 1.2,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 65%',
        }
      }
    );

    // 4. Orb Floating Animation (Infinite Sine Wave)
    if (orbRef.current) {
      // Float up and down
      gsap.to(orbRef.current, {
        y: -40,
        duration: 3.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
      // Entry pop
      gsap.fromTo(orbRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 0.9,
          duration: 1.5,
          ease: 'elastic.out(1, 0.6)',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 60%',
          }
        }
      );
    }

    // 5. Video Native Optimization
    // Gỡ bỏ hoàn toàn việc dùng JS (ScrollTrigger) để ép Play/Pause video.
    // Trình duyệt hiện đại tự động tạm ngưng render các thẻ <video> khi cuộn khuất khỏi màn hình.
    // Việc can thiệp bằng JS dễ gây lỗi Promise và làm video bị đứng (frozen).

  }, { scope: containerRef });

  const addToRefs = (el: any, refArray: { current: any[] }) => {
    if (el && !refArray.current.includes(el)) {
      refArray.current.push(el);
    }
  };

  return (
    <section 
      ref={containerRef}
      id="showreel" 
      className="hero-section-panel relative z-20 flex min-h-[100dvh] w-full items-center justify-center px-6 py-32 md:px-24 overflow-hidden"
    >
      {/* Background ambient glow matching the tech theme with subtle cyan/orange radial blending */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(79,166,154,0.025)_0%,rgba(198,107,61,0.01)_50%,transparent_80%)]" />

      {/* Main Container - Full Width Fluid */}
      <div data-section-content className="section-focal-wrapper w-full px-4 md:px-[4vw] max-w-[1920px] mx-auto relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT: Typography */}
          <div className="lg:col-span-4 flex flex-col justify-center text-center lg:text-left z-20">
            <h2 className="font-display font-black uppercase leading-[0.85] tracking-[-0.04em] text-[clamp(5rem,10vw,9rem)]">
              <span className="block overflow-hidden pb-2">
                <span ref={(el) => addToRefs(el, textRefs)} className="block text-[color:var(--text-primary)]">
                  WHAT
                </span>
              </span>
              <span className="block overflow-hidden pb-4">
                <span 
                  ref={(el) => addToRefs(el, textRefs)} 
                  className="block text-[color:var(--accent-orange)] drop-shadow-[0_0_30px_rgba(198,107,61,0.4)]"
                >
                  I DO
                </span>
              </span>
            </h2>
          </div>

          {/* CENTER: Video */}
          <div className="lg:col-span-4 flex justify-center relative z-10 pointer-events-none">
            <div className="relative w-full max-w-[700px] aspect-square lg:aspect-auto lg:h-[800px] flex items-center justify-center transform-gpu scale-110 lg:scale-[1.35] will-change-transform">
              <video
                ref={videoRef}
                src="/assets/videos/Video-V1_2.webm"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-contain mix-blend-screen"
              />
            </div>
          </div>

          {/* RIGHT: HUD Cards */}
          <div className="lg:col-span-4 flex flex-col gap-10 relative z-20">
            
            {/* Premium Multi-layered Physical Glass Orb */}
            <div 
              ref={orbRef} 
              className="absolute -right-8 lg:-right-16 top-1/2 -translate-y-1/2 w-20 h-20 pointer-events-none z-10 hidden md:block"
            >
              {/* Soft ambient orange backlight */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[40px] opacity-40 mix-blend-screen pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(198, 107, 61, 0.35) 0%, transparent 70%)',
                }}
              />
              {/* Soft ambient cyan backlight */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[40px] opacity-35 mix-blend-screen pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(79, 166, 154, 0.3) 0%, transparent 70%)',
                }}
              />
              {/* Physical Glass sphere shell with cyan-orange refraction gradient */}
              <div 
                className="absolute inset-0 rounded-full border border-[color:var(--border-strong)] backdrop-blur-md"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, rgba(244, 239, 231, 0.16) 0%, rgba(79, 166, 154, 0.15) 50%, rgba(8, 7, 6, 0.68) 100%)',
                  boxShadow: 'inset 0 2px 4px rgba(244, 239, 231, 0.22), 0 8px 24px rgba(0, 0, 0, 0.48)',
                }}
              />
            </div>

            {/* Card 1: DEVELOP (Cyan Technical Accents) */}
            <div 
              ref={(el) => addToRefs(el, cardRefs)}
              data-motion="card"
              className="group relative rounded-2xl border border-dashed border-[color:var(--border-strong)]/40 bg-[color:var(--bg-surface)]/10 p-8 md:p-10 transition-[border-color,background-color,box-shadow] duration-500 hover:border-[color:var(--accent-cyan)] hover:bg-[color:var(--accent-cyan)]/5"
            >
              {/* Technical corner brackets */}
              <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-[color:var(--text-secondary)]/30 rounded-tl-lg transition-colors duration-300 group-hover:border-[color:var(--accent-cyan)] -translate-x-[1px] -translate-y-[1px]" />
              <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-[color:var(--text-secondary)]/30 rounded-tr-lg transition-colors duration-300 group-hover:border-[color:var(--accent-cyan)] translate-x-[1px] -translate-y-[1px]" />
              <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-[color:var(--text-secondary)]/30 rounded-bl-lg transition-colors duration-300 group-hover:border-[color:var(--accent-cyan)] -translate-x-[1px] translate-y-[1px]" />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-[color:var(--text-secondary)]/30 rounded-br-lg transition-colors duration-300 group-hover:border-[color:var(--accent-cyan)] translate-x-[1px] translate-y-[1px]" />

              {/* HUD Data overlays */}
              <div className="absolute top-3.5 right-6 pointer-events-none opacity-25 group-hover:opacity-60 transition-opacity duration-300">
                <span className="font-mono text-[8px] font-bold tracking-widest text-[color:var(--text-secondary)]">
                  SYS_DEV.LOG // VER_1.2
                </span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent-cyan)] animate-pulse" />
                <span className="font-mono text-[10px] font-bold uppercase text-[color:var(--accent-cyan)] tracking-[0.2em]">
                  // 02.1 / CORE TECHNOLOGY
                </span>
              </div>

              <h3 className="font-display text-3xl font-black uppercase text-[color:var(--text-primary)] mb-4 tracking-wide group-hover:text-[color:var(--accent-cyan)] transition-colors duration-300">
                DEVELOP
              </h3>
              <p className="font-sans text-sm md:text-base text-[color:var(--text-secondary)] leading-relaxed max-w-[90%] font-medium">
                Started building websites with JavaScript and PHP, now I craft them with TypeScript, React, Express, Node, ... and a little bit of magic!
              </p>

              {/* Arrow Icon Box */}
              <div className="absolute bottom-6 right-6 w-10 h-10 border border-[color:var(--border-strong)] flex items-center justify-center transition-[transform,border-color,background-color] duration-300 group-hover:border-[color:var(--accent-cyan)] group-hover:bg-[color:var(--accent-cyan)]/10 group-hover:-translate-y-1 group-hover:scale-105">
                <ArrowDownRight size={18} className="text-[color:var(--text-secondary)] group-hover:text-[color:var(--accent-cyan)] transition-colors duration-300" />
              </div>
            </div>

            {/* Card 2: DESIGN (Orange Creative Accents) */}
            <div 
              ref={(el) => addToRefs(el, cardRefs)}
              data-motion="card"
              className="group relative rounded-2xl border border-dashed border-[color:var(--border-strong)]/40 bg-[color:var(--bg-surface)]/10 p-8 md:p-10 transition-[border-color,background-color,box-shadow] duration-500 hover:border-[color:var(--accent-orange)] hover:bg-[color:var(--accent-orange)]/5"
            >
              {/* Technical corner brackets */}
              <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-[color:var(--text-secondary)]/30 rounded-tl-lg transition-colors duration-300 group-hover:border-[color:var(--accent-orange)] -translate-x-[1px] -translate-y-[1px]" />
              <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-[color:var(--text-secondary)]/30 rounded-tr-lg transition-colors duration-300 group-hover:border-[color:var(--accent-orange)] translate-x-[1px] -translate-y-[1px]" />
              <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-[color:var(--text-secondary)]/30 rounded-bl-lg transition-colors duration-300 group-hover:border-[color:var(--accent-orange)] -translate-x-[1px] translate-y-[1px]" />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-[color:var(--text-secondary)]/30 rounded-br-lg transition-colors duration-300 group-hover:border-[color:var(--accent-orange)] translate-x-[1px] translate-y-[1px]" />

              {/* HUD Data overlays */}
              <div className="absolute top-3.5 right-6 pointer-events-none opacity-25 group-hover:opacity-60 transition-opacity duration-300">
                <span className="font-mono text-[8px] font-bold tracking-widest text-[color:var(--text-secondary)]">
                  SYS_DSN.REF // VER_1.0
                </span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent-orange)] animate-pulse" />
                <span className="font-mono text-[10px] font-bold uppercase text-[color:var(--accent-orange)] tracking-[0.2em]">
                  // 02.2 / CREATIVE DIRECTION
                </span>
              </div>

              <h3 className="font-display text-3xl font-black uppercase text-[color:var(--text-primary)] mb-4 tracking-wide group-hover:text-[color:var(--accent-orange)] transition-colors duration-300">
                DESIGN
              </h3>
              <p className="font-sans text-sm md:text-base text-[color:var(--text-secondary)] leading-relaxed max-w-[90%] font-medium">
                I started designing as my hobby, but like all good hobbies, it slowly crept into my career—now it won't leave me alone!
              </p>

              {/* Arrow Icon Box */}
              <div className="absolute bottom-6 right-6 w-10 h-10 border border-[color:var(--border-strong)] flex items-center justify-center transition-[transform,border-color,background-color] duration-300 group-hover:border-[color:var(--accent-orange)] group-hover:bg-[color:var(--accent-orange)]/10 group-hover:-translate-y-1 group-hover:scale-105">
                <ArrowDownRight size={18} className="text-[color:var(--text-secondary)] group-hover:text-[color:var(--accent-orange)] transition-colors duration-300" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
