import { useRef } from 'react';
import { User, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplineHeroScene from './hero/SplineHeroScene';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 1 } });

    tl.from('.gsap-fade-down', {
      y: -20,
      opacity: 0,
      stagger: 0.1,
    })
      .from(
        '.gsap-fade-up',
        {
          y: 20,
          opacity: 0,
          stagger: 0.1,
        },
        '-=0.5',
      )
      .from(
        '.gsap-scale',
        {
          scale: 0.8,
          opacity: 0,
          duration: 1.2,
        },
        '-=0.8',
      )
      .from(
        '.gsap-side',
        {
          x: 20,
          opacity: 0,
        },
        '-=1',
      );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="hero-shell main-scroll-container relative w-full bg-bg-deep">
      <div className="fixed inset-0 z-[50] h-screen w-screen pointer-events-none spline-canvas-container">
        <div className="h-full w-full spline-canvas-inner">
          <SplineHeroScene />
        </div>
      </div>

      <section className="relative z-20 flex h-screen w-full flex-col font-sans">
        <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
          <h1 className="portfolio-wordmark gsap-scale font-display text-[20vw] font-black uppercase leading-none tracking-tighter opacity-80 md:text-[260px]">
            SPALDING
          </h1>
        </div>

        <header className="gsap-fade-down relative z-50 flex w-full items-center justify-between px-6 py-8 md:px-12 md:py-10">
          <div className="font-display flex flex-col text-2xl font-black italic leading-none tracking-tighter">
            <span>SLAM</span>
            <span className="portfolio-accent">DUNK</span>
          </div>

          <nav className="header-menu-wrap hidden items-center gap-12 text-sm font-medium uppercase tracking-widest md:flex">
            <a href="#" className="hero-nav-link motion-hover is-active border-b-2 pb-1">
              Products
            </a>
            <a href="#" className="hero-nav-link motion-hover">
              Customize
            </a>
            <a href="#" className="hero-nav-link motion-hover">
              Contacts
            </a>
          </nav>

          <div className="flex items-center gap-6">
            <button id="user-profile" className="portfolio-icon-button cursor-pointer rounded-full p-2">
              <User size={24} strokeWidth={1.5} />
            </button>
            <button id="shopping-bag" className="portfolio-icon-button relative cursor-pointer rounded-full p-2">
              <ShoppingBag size={24} strokeWidth={1.5} />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-vivid text-[10px] font-bold text-bg-deep">
                2
              </span>
            </button>
          </div>
        </header>

        <main className="relative z-30 flex flex-1 flex-col justify-between p-6 md:px-12 md:py-10">
          <div className="gsap-fade-up">
            <button className="group flex cursor-pointer items-center gap-4">
              <div className="hero-play-button flex h-12 w-12 items-center justify-center rounded-full">
                <div className="ml-1 h-0 w-0 border-t-[6px] border-b-[6px] border-l-[10px] border-t-transparent border-b-transparent border-l-white"></div>
              </div>
              <span className="portfolio-text-secondary text-[10px] font-semibold uppercase tracking-[0.2em]">
                Promotion video
              </span>
            </button>
          </div>

          <div className="flex flex-col items-end justify-between gap-10 md:flex-row">
            <div className="gsap-fade-up flex min-w-[200px] flex-col gap-1">
              <div className="portfolio-accent font-display text-5xl font-black tracking-tighter md:text-6xl">
                $34.99
              </div>
              <div className="portfolio-text-secondary text-[11px] font-bold uppercase tracking-widest">
                SIZE: 29.5 <span className="portfolio-text-muted mx-2">|</span> OFFICIAL GAME BALL
              </div>
              <div className="portfolio-text-muted mt-12 font-mono text-[10px] uppercase tracking-tighter">
                RU
              </div>
            </div>

            <div className="gsap-fade-up flex flex-1 justify-center">
              <button className="theme-btn theme-btn-primary cursor-pointer rounded-sm px-14 py-5 text-sm font-black uppercase tracking-widest hover:scale-105 active:scale-95">
                ADD TO CART
              </button>
            </div>

            <div className="gsap-fade-up flex items-center gap-4">
              <button className="portfolio-icon-button flex h-14 w-14 cursor-pointer items-center justify-center rounded-full">
                <ArrowLeft size={20} />
              </button>
              <button className="portfolio-icon-button flex h-14 w-14 cursor-pointer items-center justify-center rounded-full">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </main>

        <div className="gsap-side absolute top-1/2 right-12 z-40 hidden -translate-y-1/2 flex-col items-center md:flex">
          <div className="origin-center rotate-90 whitespace-nowrap">
            <span className="portfolio-text-muted text-[10px] font-bold uppercase tracking-[0.5em]">
              90 / 10 SCALE
            </span>
          </div>
        </div>
      </section>

      <section className="hero-section-panel section-2 relative z-20 flex h-screen w-full items-center px-6 md:px-24">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-accent-cyan"></span>
                <span className="portfolio-support text-[10px] font-bold uppercase tracking-[0.3em]">
                  Performance Metrics
                </span>
              </div>
              <h2 className="font-display text-text-primary text-7xl font-black leading-[0.9] md:text-8xl">
                ELITE
                <br />
                CONTROL
              </h2>
            </div>

            <div className="flex flex-col gap-12">
              <div className="hero-metric-line-left flex flex-col gap-3 pl-6">
                <span className="font-display text-4xl font-black text-text-primary">100%</span>
                <span className="portfolio-text-muted text-xs font-bold uppercase tracking-widest">
                  Microfiber Composite
                </span>
                <p className="portfolio-text-secondary max-w-xs text-xs leading-relaxed font-medium font-sans">
                  Exclusive coating material providing superior grip management in all weather conditions.
                </p>
              </div>

              <div className="hero-metric-line-left flex flex-col gap-3 pl-6">
                <span className="font-display text-4xl font-black text-text-primary">0.5mm</span>
                <span className="portfolio-text-muted text-xs font-bold uppercase tracking-widest">
                  Pebble Depth
                </span>
                <p className="portfolio-text-secondary max-w-xs text-xs leading-relaxed font-medium font-sans">
                  Optimized surface texture for precision handling and rotational feedback.
                </p>
              </div>
            </div>
          </div>

          <div className="hidden md:block"></div>
        </div>
      </section>

      <section className="hero-section-panel section-3 relative z-20 flex h-screen w-full items-center px-6 md:px-24">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 md:grid-cols-2">
          <div className="hidden md:block"></div>

          <div className="flex flex-col items-end gap-12 text-right">
            <div className="flex flex-col items-end gap-4">
              <div className="flex items-center gap-3">
                <span className="portfolio-support rounded-full border border-[color:var(--border-cyan)] bg-[rgba(18,214,221,0.08)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em]">
                  Aerodynamics
                </span>
              </div>
              <h2 className="font-display text-text-primary text-7xl font-black leading-[0.9] md:text-8xl">
                PERFECT
                <br />
                FLIGHT
              </h2>
            </div>

            <div className="flex w-full flex-col items-end gap-12">
              <div className="hero-metric-line-right flex flex-col items-end gap-3 pr-6">
                <div className="flex items-center gap-4">
                  <span className="font-display text-4xl font-black text-text-primary">0.85</span>
                  <div className="h-2 w-2 rounded-full bg-accent-cyan"></div>
                </div>
                <span className="portfolio-text-muted text-xs font-bold uppercase tracking-widest">
                  Drag Coefficient
                </span>
              </div>

              <div className="hero-metric-line-right flex flex-col items-end gap-3 pr-6">
                <div className="flex items-center gap-4">
                  <span className="font-display text-4xl font-black text-text-primary">28.5</span>
                  <div className="h-2 w-2 rounded-full bg-accent-cyan"></div>
                </div>
                <span className="portfolio-text-muted text-xs font-bold uppercase tracking-widest">
                  Rotational Stability
                </span>
              </div>

              <p className="portfolio-text-secondary max-w-md text-right text-xs leading-relaxed font-medium font-sans">
                Symmetrically balanced weight distribution ensures true flight path and consistent
                rotation speed, critical for long-range precision.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="hero-section-panel section-4 relative z-20 flex h-screen w-full items-center justify-center overflow-hidden px-6 md:px-24">
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
          <div className="hero-hud-ring-1 absolute h-[300px] w-[300px] rounded-full border md:h-[600px] md:w-[600px]"></div>
          <div className="hero-hud-ring-2 absolute h-[450px] w-[450px] rounded-full border md:h-[900px] md:w-[900px]"></div>
          <div className="hero-hud-ring-3 absolute h-[150px] w-[150px] rounded-full border md:h-[300px] md:w-[300px]"></div>
          <div className="hero-hud-crosshair absolute h-[1px] w-full"></div>
          <div className="hero-hud-crosshair absolute h-full w-[1px]"></div>
          <div className="hero-hud-center absolute h-4 w-4 rounded-full border"></div>
        </div>

        <div className="relative z-30 mx-auto grid w-full max-w-7xl grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col items-start justify-center gap-12">
            <div className="flex flex-col gap-2">
              <span className="portfolio-text-muted text-[10px] font-bold uppercase tracking-[0.4em]">
                Micro-Texture
              </span>
              <div className="flex items-center gap-6">
                <div className="h-16 w-[2px] bg-accent-cyan"></div>
                <div className="flex flex-col">
                  <span className="font-display text-6xl font-black text-text-primary">1.2mm</span>
                  <span className="portfolio-text-muted text-xs font-bold uppercase tracking-widest">
                    Pebble Height
                  </span>
                </div>
              </div>
              <span className="portfolio-text-secondary mt-4 font-mono text-[10px] tracking-tighter">
                ELEVATION: 12.3 deg
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end justify-center gap-12 text-right">
            <div className="flex flex-col items-end gap-2">
              <span className="portfolio-text-secondary mb-4 font-mono text-[10px] tracking-tighter">
                AZIMUTH: 45.2 deg
              </span>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span className="font-display text-6xl font-black text-text-primary">High-Tack</span>
                  <span className="portfolio-text-muted text-xs font-bold uppercase tracking-widest">
                    Coating Spec
                  </span>
                </div>
                <div className="h-16 w-[2px] bg-orange-vivid"></div>
              </div>
              <span className="portfolio-text-muted mt-4 text-[10px] font-bold uppercase tracking-[0.4em]">
                Channel Depth
              </span>
            </div>
          </div>
        </div>
      </section>

      <footer className="fixed bottom-0 left-0 z-50 flex h-4 w-full items-center overflow-hidden bg-orange-vivid">
        <div className="flex animate-marquee items-center gap-8 whitespace-nowrap px-4 text-[8px] font-black uppercase text-bg-deep">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-8">
              <span>Authentic Basketball Series</span>
              <span>|</span>
              <span>Limited Edition Drop</span>
              <span>|</span>
              <span>Slam Dunk Heritage</span>
              <span>|</span>
              <span>High Grip Composite</span>
              <span>|</span>
              <span>Official Weight</span>
              <span>|</span>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
