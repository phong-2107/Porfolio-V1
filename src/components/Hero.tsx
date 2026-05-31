import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplineHeroScene from './hero/SplineHeroScene';
import { useMagneticElements } from '../hooks/useMagneticElements';
import { useLoading } from '../hooks/useLoading';

// Import Modular Sections
import HeroIntroSection from './sections/HeroIntroSection';
import TechnicalProfileSection from './sections/TechnicalProfileSection';
import AboutMeSection from './sections/AboutMeSection';
import ShowreelSection from './sections/ShowreelSection';
import ProjectsSection from './sections/ProjectsSection';
import CareerSection from './sections/CareerSection';
import ContactSection from './sections/ContactSection';
import StoryChapterHUD from './ui/StoryChapterHUD';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { revealApp } = useLoading();

  // Kích hoạt tương tác vi mô hút nam châm
  useMagneticElements();

  // ── Effect 1: Entrance animation (waits for revealApp from loading screen) ──
  useEffect(() => {
    console.log("Hero: useEffect runs, revealApp =", revealApp);
    if (!revealApp) return;
    console.log("Hero: Entrance animation starts!");

    const ctx = gsap.context(() => {
      const headerEl = document.querySelector('.creative-header-wrap');

      gsap.set('.canvas-3d-container', { scale: 1.5, filter: 'blur(20px)', opacity: 0 });
      if (headerEl) {
        gsap.set(headerEl, { y: -50, scale: 1.08, opacity: 0 });
      }
      gsap.set('.gsap-left-col > *', { y: 35, opacity: 0 });
      gsap.set('.gsap-right-col > *', { y: 35, opacity: 0 });
      gsap.set('.gsap-social-icons > *', { y: 25, opacity: 0 });
      gsap.set('.gsap-side', { x: 30, opacity: 0 });
      gsap.set('.scroll-down-indicator', { y: 20, opacity: 0 });

      const entryTl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      entryTl
        .to('.canvas-3d-container', { scale: 1, filter: 'blur(0px)', opacity: 1, duration: 2.2, ease: 'power3.out' }, 0)
        .to(headerEl || [], { y: 0, scale: 1, opacity: 1, duration: 1.6, ease: 'back.out(1.2)' }, 0.2)
        .to('.gsap-left-col > *', { y: 0, opacity: 1, stagger: 0.12, duration: 1.2 }, 0.4)
        .to('.gsap-right-col > *', { y: 0, opacity: 1, stagger: 0.12, duration: 1.2 }, 0.6)
        .to('.gsap-social-icons > *', { y: 0, opacity: 1, stagger: 0.08, duration: 1.0, ease: 'power3.out' }, 0.8)
        .to('.gsap-side', { x: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }, 1.0)
        .to('.scroll-down-indicator', { y: 0, opacity: 1, duration: 1.0, ease: 'power3.out' }, 1.2);
    });

    return () => ctx.revert();
  }, [revealApp]);

  // ── Effect 2: Section scroll reveals (runs on mount, independent of revealApp) ──
  useEffect(() => {
    const isDesktop = window.innerWidth > 768;

    // Explicitly set initial state for all section titles so GSAP can animate FROM them correctly
    gsap.set('[data-reveal-title]', { yPercent: 100, rotate: 3, opacity: 0 });

    let onMouseMove: any = null;
    if (isDesktop) {
      const halo = document.querySelector('.bg-halo-glow');
      if (halo) {
        const xTo = gsap.quickTo(halo, 'x', { duration: 1.6, ease: 'power2.out' });
        const yTo = gsap.quickTo(halo, 'y', { duration: 1.6, ease: 'power2.out' });

        onMouseMove = (e: MouseEvent) => {
          const moveX = (e.clientX - window.innerWidth / 2) * 0.12;
          const moveY = (e.clientY - window.innerHeight / 2) * 0.12;
          xTo(moveX);
          yTo(moveY);
        };
        window.addEventListener('mousemove', onMouseMove);
      }
    }

    const ctx = gsap.context(() => {
      // ── Background Glow Color Shifting (Storytelling Colors) ──
      if (isDesktop) {
        // Technical Profile (#about): Mineral Teal
        ScrollTrigger.create({
          trigger: '#about',
          start: 'top 60%',
          end: 'bottom 60%',
          onEnter: () => {
            gsap.to('.bg-halo-glow', {
              '--glow-color-1': 'rgba(79, 166, 154, 0.22)',
              '--glow-color-2': 'rgba(79, 166, 154, 0.06)',
              duration: 1.5,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          },
          onLeaveBack: () => {
            gsap.to('.bg-halo-glow', {
              '--glow-color-1': 'rgba(198, 107, 61, 0.20)',
              '--glow-color-2': 'rgba(79, 166, 154, 0.06)',
              duration: 1.5,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          }
        });

        // Career (#career): Aged Copper
        ScrollTrigger.create({
          trigger: '#career',
          start: 'top 60%',
          end: 'bottom 60%',
          onEnter: () => {
            gsap.to('.bg-halo-glow', {
              '--glow-color-1': 'rgba(198, 107, 61, 0.24)',
              '--glow-color-2': 'rgba(198, 107, 61, 0.07)',
              duration: 1.5,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          },
          onLeaveBack: () => {
            gsap.to('.bg-halo-glow', {
              '--glow-color-1': 'rgba(79, 166, 154, 0.22)',
              '--glow-color-2': 'rgba(79, 166, 154, 0.06)',
              duration: 1.5,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          }
        });

        // Projects (#projects): Olive Smoke / Mineral Teal
        ScrollTrigger.create({
          trigger: '#projects',
          start: 'top 60%',
          end: 'bottom 60%',
          onEnter: () => {
            gsap.to('.bg-halo-glow', {
              '--glow-color-1': 'rgba(121, 133, 107, 0.20)',
              '--glow-color-2': 'rgba(79, 166, 154, 0.05)',
              duration: 1.5,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          },
          onLeaveBack: () => {
            gsap.to('.bg-halo-glow', {
              '--glow-color-1': 'rgba(198, 107, 61, 0.24)',
              '--glow-color-2': 'rgba(198, 107, 61, 0.07)',
              duration: 1.5,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          }
        });

        // Contact (#contact): Dull Brass / Aged Copper
        ScrollTrigger.create({
          trigger: '#contact',
          start: 'top 60%',
          end: 'bottom 60%',
          onEnter: () => {
            gsap.to('.bg-halo-glow', {
              '--glow-color-1': 'rgba(184, 155, 98, 0.18)',
              '--glow-color-2': 'rgba(198, 107, 61, 0.05)',
              duration: 1.5,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          },
          onLeaveBack: () => {
            gsap.to('.bg-halo-glow', {
              '--glow-color-1': 'rgba(121, 133, 107, 0.20)',
              '--glow-color-2': 'rgba(79, 166, 154, 0.05)',
              duration: 1.5,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          }
        });
      }

      // Scroll progress bar
      gsap.to('.scroll-progress-bar', {
        width: '100%', ease: 'none',
        scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.1 }
      });

      // Fade out scroll indicator only when reaching the bottom of the page
      gsap.to('.scroll-down-indicator', {
        opacity: 0,
        y: 15,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: containerRef.current || undefined,
          start: 'bottom-250 bottom', // Starts fading when we are 250px away from the bottom of the page
          end: 'bottom bottom',       // Fully hidden at the bottom
          scrub: 0.5
        }
      });

      // Nav link tracker
      ScrollTrigger.create({
        start: 0, end: 300,
        onToggle: (self) => {
          if (self.isActive) {
            document.querySelectorAll('.creative-menu a').forEach(a => a.classList.remove('active'));
            document.querySelectorAll('.creative-menu a[href="/"]').forEach(a => a.classList.add('active'));
          }
        }
      });

      const subSections = [
        { id: 'about', selector: '.creative-menu a[href="#about"]' },
        { id: 'projects', selector: '.creative-menu a[href="#projects"]' },
        { id: 'career', selector: '.creative-menu a[href="#projects"]' },
        { id: 'contact', selector: '.creative-menu a[href="#contact"]' }
      ];
      subSections.forEach((sec) => {
        const el = document.getElementById(sec.id);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el, start: 'top 40%', end: 'bottom 40%',
          onToggle: (self) => {
            if (self.isActive) {
              document.querySelectorAll('.creative-menu a').forEach(a => a.classList.remove('active'));
              document.querySelectorAll(sec.selector).forEach(a => a.classList.add('active'));
            }
          }
        });
      });



      // ── Section 2 (About / My Stack) ──
      if (isDesktop) {
        const aboutTl = gsap.timeline({
          scrollTrigger: { trigger: '#about', start: 'top top', end: '+=1200', scrub: 0.8, pin: true, anticipatePin: 1 }
        });
        aboutTl
          .fromTo('#about [data-reveal-title]',
            { yPercent: 105, rotate: 3, opacity: 0 },
            { yPercent: 0, rotate: 0, opacity: 1, stagger: 0.1, ease: 'power4.out' }
          )
          .from('#about .hero-metric-line-left', { x: -50, opacity: 0, stagger: 0.15, ease: 'power3.out' }, '-=0.4')
          .from('#about [data-reveal-desc]', { y: 30, opacity: 0, ease: 'power3.out' }, '-=0.5')
          .from('#about [data-reveal-tool]', { scale: 0.8, opacity: 0, stagger: 0.08, ease: 'power3.out' }, '-=0.3');
      } else {
        gsap.fromTo('#about [data-reveal-title]',
          { yPercent: 100, rotate: 3, opacity: 0 },
          {
            yPercent: 0, rotate: 0, opacity: 1, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: '#about', start: 'top 85%' }
          }
        );
        gsap.from('#about .hero-metric-line-left', {
          x: -30, opacity: 0, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '#about', start: 'top 75%' }
        });
      }

      // ── Section 2.5 (About Me / BIO_DATA) ──
      const aboutMeTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#about-me',
          start: 'top 82%',
          end: 'bottom 20%',
          toggleActions: 'play reverse play reverse'
        }
      });
      aboutMeTl
        // 1. Reveal kicker with letter-spacing expand
        .fromTo('#about-me .about-kicker',
          { opacity: 0, x: -30, letterSpacing: '0.4em' },
          { opacity: 1, x: 0, letterSpacing: '0.25em', duration: 0.9, ease: 'power3.out' }
        )
        // 2. 3D pop & slide of avatar card
        .fromTo('#about-me .about-avatar-card', 
          { x: -100, rotateY: -20, rotateX: 5, z: -80, opacity: 0, filter: 'blur(10px)' },
          { x: 0, rotateY: 0, rotateX: 0, z: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power4.out' },
          '-=0.7'
        )
        // 3. Staggered cinematic word-by-word reveal (using custom split-text spans)
        .fromTo('#about-me .about-reveal-word',
          { yPercent: 110, rotate: 2, opacity: 0 },
          { yPercent: 0, rotate: 0, opacity: 1, duration: 0.75, stagger: 0.025, ease: 'power3.out' },
          '-=0.9'
        )
        // 4. Slide up the description text
        .fromTo('#about-me .about-desc',
          { y: 30, opacity: 0, filter: 'blur(4px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' },
          '-=0.6'
        )
        // 5. Staggered pop of micro-bento metrics grid panels (using elastic/back ease)
        .fromTo('#about-me .about-metric-card',
          { scale: 0.88, y: 30, opacity: 0, filter: 'blur(4px)' },
          { scale: 1, y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, stagger: 0.08, ease: 'back.out(1.4)' },
          '-=0.6'
        )
        // 6. Staggered float-up of vertical social icons
        .fromTo('#about-me .about-socials > *', 
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.06, ease: 'power3.out' },
          '-=0.8'
        )
        // 7. Glass orb reveal
        .fromTo('#about-me .about-orb', 
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.2, ease: 'elastic.out(1, 0.6)' },
          '-=1.2'
        );

      // ── Section 3 (Projects) ──
      gsap.fromTo('#projects [data-reveal-title]',
        { yPercent: 105, rotate: -3, opacity: 0 },
        {
          yPercent: 0, rotate: 0, opacity: 1, ease: 'power4.out',
          scrollTrigger: { trigger: '#projects', start: 'top 85%', toggleActions: 'play reverse play reverse' }
        }
      );


      // ── Section Career Title ──
      gsap.fromTo('#career [data-reveal-title]',
        { yPercent: 105, rotate: 3, opacity: 0 },
        {
          yPercent: 0, rotate: 0, opacity: 1, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '#career', start: 'top 85%' }
        }
      );

      // ── Career Timeline Animations ──
      gsap.fromTo('.timeline-line-progress', { scaleY: 0 }, {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: '.timeline-container', start: 'top 40%', end: 'bottom 60%', scrub: true }
      });
      gsap.fromTo('.timeline-tracer-dot', { top: '0%' }, {
        top: '100%', ease: 'none',
        scrollTrigger: { trigger: '.timeline-container', start: 'top 40%', end: 'bottom 60%', scrub: true }
      });
      gsap.utils.toArray('.career-item').forEach((item: any) => {
        const left = item.querySelector('.career-left');
        const right = item.querySelector('.career-right');
        const year = item.querySelector('.career-year');
        const node = item.querySelector('.career-item-node');
        const itemTl = gsap.timeline({
          scrollTrigger: { trigger: item, start: 'top 55%', toggleActions: 'play none none reverse' }
        });
        if (left) itemTl.fromTo(left, { x: -40, opacity: 0, filter: 'blur(4px)' }, { x: 0, opacity: 1, filter: 'blur(0px)', duration: 0.6, ease: 'power2.out' });
        if (right) itemTl.fromTo(right, { x: 40, opacity: 0, filter: 'blur(4px)' }, { x: 0, opacity: 1, filter: 'blur(0px)', duration: 0.6, ease: 'power2.out' }, 0);
        if (year) itemTl.fromTo(year, { scale: 0.8, opacity: 0.4 }, { scale: 1.1, opacity: 1, color: 'var(--accent-orange)', duration: 0.4, ease: 'back.out(1.5)' }, 0);
        if (node) itemTl.fromTo(node, { scale: 1, backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-strong)', boxShadow: 'none' }, { scale: 1.3, backgroundColor: 'var(--accent-orange)', borderColor: 'var(--accent-orange)', boxShadow: '0 0 12px var(--accent-orange)', duration: 0.4, ease: 'back.out(1.5)' }, 0);
      });

      // ── Section 4 (Contact HUD) ──
      if (isDesktop) {
        const contactTl = gsap.timeline({
          scrollTrigger: { trigger: '#contact', start: 'top top', end: '+=1000', scrub: 0.8, pin: true, anticipatePin: 1 }
        });
        contactTl
          .fromTo('#contact [data-reveal-title]',
            { yPercent: 105, rotate: 3, opacity: 0 },
            { yPercent: 0, rotate: 0, opacity: 1, stagger: 0.1, ease: 'power4.out' }
          )
          .from('#contact .hero-hud-ring-1, #contact .hero-hud-ring-2, #contact .hero-hud-ring-3', { scale: 0.8, opacity: 0, ease: 'power3.out' }, 0)
          .to('#contact .hero-hud-ring-1', { rotation: 120 }, 0)
          .to('#contact .hero-hud-ring-2', { rotation: -90 }, 0)
          .to('#contact .hero-hud-ring-3', { rotation: 60 }, 0)
          .from('#contact [data-reveal-certifications]', { x: -60, opacity: 0, ease: 'power3.out' }, '-=0.4')
          .from('#contact [data-reveal-contact]', { x: 60, opacity: 0, ease: 'power3.out' }, '-=0.4');
      } else {
        gsap.fromTo('#contact [data-reveal-title]',
          { yPercent: 100, rotate: 3, opacity: 0 },
          {
            yPercent: 0, rotate: 0, opacity: 1, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: '#contact', start: 'top 85%' }
          }
        );
        gsap.from('#contact [data-reveal-certifications]', { x: -40, opacity: 0, ease: 'power3.out', scrollTrigger: { trigger: '#contact', start: 'top 75%' } });
        gsap.from('#contact [data-reveal-contact]', { x: 40, opacity: 0, ease: 'power3.out', scrollTrigger: { trigger: '#contact', start: 'top 70%' } });
      }

      // ── Cinematic Camera-Focus Transitions between Sections ──
      const sectionsToFocus = ['#about', '#about-me', '#showreel', '#career', '#projects', '#contact'];
      sectionsToFocus.forEach((secId) => {
        const sec = document.querySelector(secId);
        if (!sec) return;
        const inner = sec.querySelector('.section-focal-wrapper');
        if (!inner) return;

        // Apply hardware acceleration class dynamically
        inner.classList.add('gpu-accelerated-focus');

        // Set responsive initial transition state (scaled down on mobile to preserve frame rates)
        const initialY = isDesktop ? 120 : 50;
        const initialScale = isDesktop ? 0.88 : 0.95;
        const initialBlur = isDesktop ? 'blur(16px)' : 'blur(4px)';

        gsap.set(inner, { 
          y: initialY,
          scale: initialScale, 
          filter: initialBlur, 
          opacity: 0,
          transformOrigin: 'top center'
        });

        // Animates lens focus and scale in sync with scroll progress
        gsap.to(inner, {
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          opacity: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sec,
            start: isDesktop ? 'top 90%' : 'top 95%', // Starts early as section enters screen
            end: isDesktop ? 'top 55%' : 'top 70%',   // Resolves mid-screen for maximum readability
            scrub: 0.8,       // Generous fluid momentum
            onLeave: () => {
              // Clear hardware-intensive props once section is fully in view to preserve performance
              gsap.set(inner, { clearProps: 'filter,scale,y' });
            },
            onEnterBack: () => {
              // Re-apply states if user scrolls back up so it can scrub blur/scale again
              gsap.set(inner, { scale: 1, filter: 'blur(0px)', opacity: 1, y: 0 });
            }
          }
        });
      });
    });

    return () => {
      ctx.revert();
      if (onMouseMove) {
        window.removeEventListener('mousemove', onMouseMove);
      }
    };
  }, []);

  const isClient = typeof document !== 'undefined';

  return (
    <div ref={containerRef} className="hero-shell main-scroll-container relative w-full">
      {/* ── Fixed Scroll Progress Bar ── */}
      {isClient && createPortal(
        <div className="scroll-progress-bar" />,
        document.body
      )}

      {/* ── Sticky 3D Canvas ── */}
      {isClient && createPortal(
        <div className="fixed inset-0 z-[2] h-screen w-screen pointer-events-none canvas-3d-container">
          <div className="h-full w-full canvas-3d-inner">
            <SplineHeroScene />
          </div>
        </div>,
        document.body
      )}

      {/* ── Background Halo Glow (behind 3D model) ── */}
      {isClient && createPortal(
        <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden flex items-center justify-center">
          <div 
            className="bg-halo-glow w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full blur-[160px]"
            style={{
              ['--glow-color-1' as any]: 'rgba(198, 107, 61, 0.20)',
              ['--glow-color-2' as any]: 'rgba(79, 166, 154, 0.06)',
              background: 'radial-gradient(circle, var(--glow-color-1) 0%, var(--glow-color-2) 50%, transparent 100%)',
              mixBlendMode: 'screen' as any
            }}
          />
        </div>,
        document.body
      )}

      {/* ── Scroll Down Indicator ── */}
      {isClient && createPortal(
        <div className="scroll-down-indicator fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 pointer-events-none">
          <div className="scroll-indicator-mouse">
            <div className="scroll-indicator-wheel" />
          </div>
          <span className="text-[9px] font-mono font-bold tracking-[0.25em] text-[color:var(--text-secondary)] opacity-65 uppercase">
            Scroll Down
          </span>
        </div>,
        document.body
      )}

      {/* ── Story Chapter HUD (Side Navigation Dock) ── */}
      {isClient && createPortal(
        <StoryChapterHUD />,
        document.body
      )}

      {/* Modular Section Rendering */}
      <HeroIntroSection />
      <TechnicalProfileSection />
      <AboutMeSection />
      <ShowreelSection />
      <CareerSection />
      <ProjectsSection />
      <ContactSection />
    </div>
  );
}
