import { useRef } from 'react';
import { motion } from 'motion/react';
import { Github, Mail, ArrowRight, MapPin, Calendar, Linkedin, Twitter, Instagram } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplineHeroScene from './hero/SplineHeroScene';
import { OWNER, SKILLS, PROJECTS, EDUCATION, EXPERIENCE, CERTIFICATIONS } from '../data/portfolio';
import ScrambleText from './utilities/ScrambleText';
import { useMagneticElements } from '../hooks/useMagneticElements';

gsap.registerPlugin(ScrollTrigger);

// ─── Skill Badge ──────────────────────────────────────────────────────────────
function SkillBadge({ label, accent = 'cyan' }: { label: string; accent?: 'cyan' | 'orange' }) {
  return (
    <span
      className={`inline-block rounded-full border px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em] font-mono ${
        accent === 'orange'
          ? 'border-[color:var(--border-orange)] text-[color:var(--accent-orange)] bg-[rgba(255,69,0,0.06)]'
          : 'border-[color:var(--border-cyan)] text-[color:var(--accent-cyan)] bg-[rgba(204,255,0,0.05)]'
      }`}
    >
      {label}
    </span>
  );
}

function ProjectCard({ project }: { project: (typeof PROJECTS)[number] }) {
  return (
    <motion.div
      className="group relative rounded-[2rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface-card)] p-1.5 transition-all duration-500"
      data-motion="card"
      data-project-card
      whileHover={{
        y: -8,
        borderColor: 'var(--border-strong)',
        boxShadow: 'var(--shadow-card)',
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <div className="flex flex-col gap-5 rounded-[calc(2rem-6px)] bg-[#0a0d16]/40 p-7 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] h-full">
        {/* Tag */}
        <span className="self-start rounded-full bg-[rgba(204,255,0,0.06)] border border-[color:var(--border-cyan)] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[color:var(--accent-cyan)] font-mono">
          {project.tag}
        </span>

        {/* Title */}
        <div>
          <h3 className="font-display text-2xl font-black text-[color:var(--text-primary)] leading-tight tracking-tight">
            {project.name}
          </h3>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[color:var(--text-muted)] font-mono">
            {project.subtitle}
          </p>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 text-[10px] text-[color:var(--text-secondary)] font-mono">
          <span className="flex items-center gap-1.5">
            <Calendar size={11} className="text-[color:var(--accent-orange)]" />
            {project.period}
          </span>
          <span className="opacity-30">|</span>
          <span>{project.role}</span>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed text-[color:var(--text-secondary)]">
          {project.description}
        </p>

        {/* Highlights */}
        <ul className="flex flex-col gap-2">
          {project.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2 text-xs text-[color:var(--text-secondary)]">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[color:var(--accent-cyan)]" />
              {h}
            </li>
          ))}
        </ul>

        {/* Stack */}
        <div className="flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <SkillBadge key={s} label={s} accent={project.accent as 'cyan' | 'orange'} />
          ))}
        </div>

        {/* GitHub Link */}
        <a
          href={`https://${project.github}`}
          target="_blank"
          rel="noreferrer"
          className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[color:var(--accent-orange)] opacity-80 transition-opacity hover:opacity-100 font-mono"
        >
          <Github size={13} />
          <span>View Source</span>
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </motion.div>
  );
}

// ─── Main Hero / Portfolio Page ───────────────────────────────────────────────
export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Kích hoạt tương tác vi mô hút nam châm
  useMagneticElements();

  useGSAP(
    () => {
      // 1. Entrance timeline
      const entryTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1.2 } });

      entryTl.from('.gsap-fade-down', { y: -30, opacity: 0, stagger: 0.1 })
        .from('.gsap-social-icons > *', { y: 20, opacity: 0, stagger: 0.1 }, '-=0.8')
        .from('.gsap-left-col', { x: -50, opacity: 0 }, '-=0.8')
        .from('.gsap-right-col', { x: 50, opacity: 0 }, '-=0.8')
        .from('.gsap-scale', { scale: 0.8, opacity: 0, duration: 1.5 }, '-=1.2')
        .from('.gsap-side', { x: 30, opacity: 0 }, '-=1');

      // 2. Responsive detection
      const isDesktop = window.innerWidth > 768;

      // 3. Section 2 (About / My Stack) Pinning & Staged Reveal
      if (isDesktop) {
        const aboutTl = gsap.timeline({
          scrollTrigger: {
            trigger: '#about',
            start: 'top top',
            end: '+=1200',
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
          }
        });

        aboutTl.from('#about [data-reveal-title]', { yPercent: 105, rotate: 3, opacity: 0, stagger: 0.1, ease: 'power4.out' })
          .from('#about .hero-metric-line-left', { x: -50, opacity: 0, stagger: 0.15, ease: 'power3.out' }, '-=0.4')
          .from('#about [data-reveal-desc]', { y: 30, opacity: 0, ease: 'power3.out' }, '-=0.5')
          .from('#about [data-reveal-tool]', { scale: 0.8, opacity: 0, stagger: 0.08, ease: 'power3.out' }, '-=0.3');
      } else {
        gsap.from('#about [data-reveal-title]', {
          yPercent: 100,
          rotate: 3,
          opacity: 0,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#about',
            start: 'top 85%',
          }
        });
        gsap.from('#about .hero-metric-line-left', {
          x: -30,
          opacity: 0,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#about',
            start: 'top 75%',
          }
        });
      }

      // 4. Section 3 (Projects) Grid Reveal
      gsap.from('#projects [data-reveal-title]', {
        yPercent: 105,
        rotate: -3,
        opacity: 0,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '#projects',
          start: 'top 85%',
        }
      });

      gsap.from('#projects [data-project-card]', {
        y: 90,
        scale: 0.94,
        opacity: 0,
        filter: 'blur(12px)',
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '[data-motion-group="cards"]',
          start: 'top 75%',
        }
      });

      // 4.5. Section Career Timeline & Scroll Animations
      gsap.fromTo(
        ".timeline-line-progress",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".timeline-container",
            start: "top 40%",
            end: "bottom 60%",
            scrub: true,
          },
        }
      );
      
      gsap.fromTo(
        ".timeline-tracer-dot",
        { top: "0%" },
        {
          top: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: ".timeline-container",
            start: "top 40%",
            end: "bottom 60%",
            scrub: true,
          },
        }
      );

      gsap.utils.toArray(".career-item").forEach((item: any) => {
        const left = item.querySelector(".career-left");
        const right = item.querySelector(".career-right");
        const year = item.querySelector(".career-year");
        const node = item.querySelector(".career-item-node");

        const itemTl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "top 55%",
            toggleActions: "play none none reverse",
          },
        });

        if (left) {
          itemTl.fromTo(
            left,
            { x: -40, opacity: 0, filter: "blur(4px)" },
            { x: 0, opacity: 1, filter: "blur(0px)", duration: 0.6, ease: "power2.out" }
          );
        }
        if (right) {
          itemTl.fromTo(
            right,
            { x: 40, opacity: 0, filter: "blur(4px)" },
            { x: 0, opacity: 1, filter: "blur(0px)", duration: 0.6, ease: "power2.out" },
            0
          );
        }
        if (year) {
          itemTl.fromTo(
            year,
            { scale: 0.8, opacity: 0.4 },
            { scale: 1.1, opacity: 1, color: "var(--accent-orange)", duration: 0.4, ease: "back.out(1.5)" },
            0
          );
        }
        if (node) {
          itemTl.fromTo(
            node,
            { scale: 1, backgroundColor: "var(--bg-surface)", borderColor: "var(--border-strong)", boxShadow: "none" },
            {
              scale: 1.3,
              backgroundColor: "var(--accent-orange)",
              borderColor: "var(--accent-orange)",
              boxShadow: "0 0 12px var(--accent-orange)",
              duration: 0.4,
              ease: "back.out(1.5)",
            },
            0
          );
        }
      });

      // 5. Section 4 (Contact HUD) Pinning & Reveals
      if (isDesktop) {
        const contactTl = gsap.timeline({
          scrollTrigger: {
            trigger: '#contact',
            start: 'top top',
            end: '+=1000',
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
          }
        });

        contactTl.from('#contact [data-reveal-title]', { yPercent: 105, rotate: 3, opacity: 0, stagger: 0.1, ease: 'power4.out' })
          .from('#contact .hero-hud-ring-1, #contact .hero-hud-ring-2, #contact .hero-hud-ring-3', { scale: 0.8, opacity: 0, ease: 'power3.out' }, 0)
          .to('#contact .hero-hud-ring-1', { rotation: 120 }, 0)
          .to('#contact .hero-hud-ring-2', { rotation: -90 }, 0)
          .to('#contact .hero-hud-ring-3', { rotation: 60 }, 0)
          .from('#contact [data-reveal-certifications]', { x: -60, opacity: 0, ease: 'power3.out' }, '-=0.4')
          .from('#contact [data-reveal-contact]', { x: 60, opacity: 0, ease: 'power3.out' }, '-=0.4');
      } else {
        gsap.from('#contact [data-reveal-title]', {
          yPercent: 100,
          rotate: 3,
          opacity: 0,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#contact',
            start: 'top 85%',
          }
        });
        gsap.from('#contact [data-reveal-certifications]', {
          x: -40,
          opacity: 0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#contact',
            start: 'top 75%',
          }
        });
        gsap.from('#contact [data-reveal-contact]', {
          x: 40,
          opacity: 0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#contact',
            start: 'top 70%',
          }
        });
      }
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="hero-shell main-scroll-container relative w-full bg-bg-deep">
      {/* ── Sticky 3D Canvas ── */}
      <div className="fixed inset-0 z-[10] h-screen w-screen pointer-events-none 3d-canvas-container">
        <div className="h-full w-full 3d-canvas-inner">
          <SplineHeroScene />
        </div>
      </div>

      {/* ── Background Halo Glow (behind 3D model) ── */}
      <div className="fixed inset-0 z-[9] pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.08)_0%,rgba(242,92,5,0.04)_45%,rgba(5,7,12,0)_75%)] blur-[160px]" />
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1: HERO INTRO
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative z-20 flex h-screen w-full flex-col font-sans overflow-hidden">
        {/* Wordmark */}
        <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none z-0">
          <h1 className="portfolio-wordmark gsap-scale font-display text-[18vw] font-black uppercase leading-none tracking-tighter opacity-[0.03] md:text-[220px]">
            PHONG
          </h1>
        </div>



        {/* Hero Main Content */}
        <main className="relative z-30 flex flex-1 flex-col justify-center px-6 md:px-12 pb-16 md:grid md:grid-cols-[80px_1fr_1.2fr_1fr] md:items-center md:gap-4">
          
          {/* Social Icons (Far Left) */}
          <div className="gsap-social-icons flex flex-row md:flex-col items-center justify-start gap-6 md:gap-8 mb-8 md:mb-0 md:self-end md:pb-8">
            <motion.a
              href={`https://${OWNER.github}`}
              target="_blank"
              rel="noreferrer"
              className="text-[color:var(--text-secondary)] transition-colors duration-300"
              data-motion="magnetic"
              whileHover={{ scale: 1.18, rotate: 6, color: 'var(--accent-orange)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <Github size={22} strokeWidth={1.5} />
            </motion.a>
            <motion.a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="text-[color:var(--text-secondary)] transition-colors duration-300"
              data-motion="magnetic"
              whileHover={{ scale: 1.18, rotate: 6, color: 'var(--accent-orange)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <Linkedin size={22} strokeWidth={1.5} />
            </motion.a>
            <motion.a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              className="text-[color:var(--text-secondary)] transition-colors duration-300"
              data-motion="magnetic"
              whileHover={{ scale: 1.18, rotate: 6, color: 'var(--accent-orange)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <Twitter size={22} strokeWidth={1.5} />
            </motion.a>
            <motion.a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="text-[color:var(--text-secondary)] transition-colors duration-300"
              data-motion="magnetic"
              whileHover={{ scale: 1.18, rotate: 6, color: 'var(--accent-orange)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <Instagram size={22} strokeWidth={1.5} />
            </motion.a>
          </div>

          {/* Left Content (Name) */}
          <div className="gsap-left-col flex flex-col justify-center gap-4 text-left select-none z-40">
            <div>
              <div className="font-serif italic text-lg tracking-wide text-[color:var(--accent-orange)] normal-case mb-1" data-motion="hero-kicker">
                <ScrambleText text="Hello! I'm" />
              </div>
              <div className="relative flex flex-col items-start leading-[0.8]">
                {/* Background hollow name */}
                <h2 
                  className="font-display text-5xl md:text-8xl font-black uppercase tracking-tighter" 
                  data-motion="hero-title"
                  style={{
                    WebkitTextStroke: '1px rgba(255, 255, 255, 0.12)',
                    color: 'transparent',
                    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 100%)',
                    WebkitBackgroundClip: 'text',
                    opacity: 0.95
                  }}
                >
                  NGUYEN
                </h2>
                {/* Foreground solid name, overlapping */}
                <h2 
                  className="font-display text-5xl md:text-8xl font-black uppercase tracking-tighter text-white mt-[-0.8rem] md:mt-[-2rem] drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]" 
                  data-motion="hero-title"
                >
                  THANH PHONG
                </h2>
              </div>
            </div>
            
            <p className="text-[color:var(--text-secondary)] text-sm font-medium max-w-xs leading-relaxed mt-2" data-motion="hero-copy">
              {OWNER.tagline}
            </p>

            <div className="flex flex-col gap-3 mt-4 font-mono">
              <div className="flex items-center gap-2 text-xs text-[color:var(--text-muted)]">
                <MapPin size={14} className="text-[color:var(--accent-cyan)]" />
                <span>{OWNER.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent-cyan)] animate-pulse" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[color:var(--accent-cyan)]">
                  Available for Internship
                </span>
              </div>
            </div>
          </div>

          {/* Center (Spacer for 3D model) */}
          <div className="hidden md:block pointer-events-none" />

          {/* Right Content (Roles & CTA) */}
          <div className="gsap-right-col flex flex-col justify-center items-start gap-6 text-left mt-8 md:mt-0 select-none z-40">
            <div className="flex flex-col items-start">
              <div className="font-serif italic text-lg tracking-wide text-[color:var(--accent-orange)] normal-case mb-1" data-motion="hero-kicker">
                <ScrambleText text="A Creative" />
              </div>
              <div className="relative flex flex-col items-start leading-[0.8]">
                {/* Background hollow role */}
                <h2 
                  className="font-display text-5xl md:text-8xl font-black uppercase tracking-tighter" 
                  data-motion="hero-title"
                  style={{
                    WebkitTextStroke: '1px rgba(255, 255, 255, 0.12)',
                    color: 'transparent',
                    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 100%)',
                    WebkitBackgroundClip: 'text',
                    opacity: 0.95
                  }}
                >
                  FULL-STACK
                </h2>
                {/* Foreground solid role, overlapping */}
                <h2 
                  className="font-display text-5xl md:text-8xl font-black uppercase tracking-tighter text-white mt-[-0.8rem] md:mt-[-2rem] drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]" 
                  data-motion="hero-title"
                >
                  DEVELOPER
                </h2>
              </div>
            </div>

            <div className="flex flex-col items-start gap-1.5 mt-2 font-mono">
              <span className="text-4xl font-black text-[color:var(--accent-orange)] tracking-tight">{EDUCATION.gpa}</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-[color:var(--text-muted)]">GPA · HUTECH</span>
              <span className="text-[9px] text-[color:var(--text-muted)]">{EDUCATION.period}</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-4 w-full md:w-auto">
              <motion.a
                href={`mailto:${OWNER.email}`}
                className="group relative flex items-center justify-between gap-6 cursor-pointer rounded-full bg-gradient-to-r from-[color:var(--accent-orange)] to-[color:var(--accent-orange-hover)] pl-8 pr-3 py-3 text-xs font-extrabold uppercase tracking-widest text-white shadow-[var(--shadow-orange)] w-full md:w-auto"
                data-motion="magnetic"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <span>HIRE ME</span>
                <motion.span 
                  className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center"
                  whileHover={{ x: 4, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 12 }}
                >
                  <ArrowRight size={14} />
                </motion.span>
              </motion.a>
            </div>
          </div>

        </main>

        {/* Side Label */}
        <div className="gsap-side absolute top-1/2 right-4 md:right-8 z-40 hidden -translate-y-1/2 flex-col items-center md:flex">
          <div className="origin-center rotate-90 whitespace-nowrap">
            <span className="text-[color:var(--text-muted)] text-[9px] font-bold uppercase tracking-[0.5em]">
              {OWNER.role} · {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2: SKILLS & TECH STACK
      ══════════════════════════════════════════════════════════════ */}
      <section id="about" className="hero-section-panel section-2 relative z-20 flex min-h-screen w-full items-center justify-center px-6 py-24 md:px-24">
        <div className="w-full max-w-7xl flex flex-col md:flex-row gap-12 justify-between items-center">
          
          {/* Left Content Area (Takes 55% width) */}
          <div className="w-full md:w-[55%] flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent-cyan)] animate-pulse" />
                <span className="font-serif italic text-lg text-[color:var(--accent-cyan)] tracking-wide">
                  Technical Profile
                </span>
              </div>
              <h2 className="font-display text-7xl font-black leading-[0.9] text-[color:var(--text-primary)] md:text-8xl tracking-tight">
                <span className="motion-mask">
                  <span className="motion-line" data-reveal-title>MY</span>
                </span>
                <span className="motion-mask">
                  <span className="motion-line" data-reveal-title>STACK</span>
                </span>
              </h2>
            </div>

            {/* Grid of stacks */}
            <div className="flex flex-col gap-6">
              <div className="hero-metric-line-left flex flex-col gap-2.5 pl-6">
                <span className="font-display text-2xl font-black text-[color:var(--text-primary)]">Back-End</span>
                <div className="flex flex-wrap gap-2">
                  {['C#', 'ASP.NET Core', 'Node.js', 'Python', 'Java'].map((s) => (
                    <SkillBadge key={s} label={s} accent="orange" />
                  ))}
                </div>
              </div>
              <div className="hero-metric-line-left flex flex-col gap-2.5 pl-6">
                <span className="font-display text-2xl font-black text-[color:var(--text-primary)]">Front-End</span>
                <div className="flex flex-wrap gap-2">
                  {['ReactJS', 'JavaScript', 'Bootstrap', 'Tailwind CSS'].map((s) => (
                    <SkillBadge key={s} label={s} accent="cyan" />
                  ))}
                </div>
              </div>
              <div className="hero-metric-line-left flex flex-col gap-2.5 pl-6">
                <span className="font-display text-2xl font-black text-[color:var(--text-primary)]">Database</span>
                <div className="flex flex-wrap gap-2">
                  {SKILLS.databases.map((s) => (
                    <SkillBadge key={s} label={s} accent="cyan" />
                  ))}
                </div>
              </div>
            </div>

            {/* Summary & Tools (moved from Col 2) */}
            <div className="flex flex-col gap-5 border-t border-[color:var(--border-subtle)] pt-6 mt-2">
              <p className="text-sm leading-relaxed text-[color:var(--text-secondary)]" data-reveal-desc>
                {OWNER.summary}
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {SKILLS.tools.map((t) => (
                  <div key={t} className="flex items-center gap-2" data-reveal-tool>
                    <span className="h-[1px] w-6 bg-[color:var(--accent-orange)]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--text-secondary)] font-mono">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Spacer for 3D Model (Takes 40% width) */}
          <div className="w-full md:w-[40%] h-[300px] md:h-[400px] pointer-events-none" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3: PROJECTS
      ══════════════════════════════════════════════════════════════ */}
      <section id="projects" className="hero-section-panel section-3 relative z-20 min-h-screen w-full px-6 py-24 md:px-24">
        <div className="w-full flex flex-col md:flex-row gap-12 justify-between items-start">
          {/* Left Column Spacer for 3D Model (Takes 40% width) */}
          <div className="w-full md:w-[40%] h-[300px] md:h-[400px] pointer-events-none" />

          {/* Right Column Content (Takes 55% width) */}
          <div className="w-full md:w-[55%] flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent-cyan)] animate-pulse" />
                <span className="font-serif italic text-lg text-[color:var(--accent-cyan)] tracking-wide">
                  Selected Work
                </span>
              </div>
              <h2 className="font-display text-7xl font-black leading-[0.9] text-[color:var(--text-primary)] md:text-8xl tracking-tight">
                <span className="motion-mask">
                  <span className="motion-line" data-reveal-title>PROJECTS</span>
                </span>
              </h2>
            </div>

            <div className="flex flex-col gap-8" data-motion-group="cards">
              {PROJECTS.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            <div className="mt-4 flex justify-start">
              <a
                href={`https://${OWNER.github}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-full border border-[color:var(--border-strong)] px-8 py-4 text-sm font-bold uppercase tracking-widest text-[color:var(--text-primary)] transition-all hover:border-[color:var(--accent-orange)] hover:text-[color:var(--accent-orange)]"
              >
                <Github size={16} />
                All Repositories on GitHub
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3.5: CAREER & EXPERIENCE (moncy.dev-inspired)
      ══════════════════════════════════════════════════════════════ */}
      <section id="career" className="hero-section-panel career-section relative z-20 min-h-screen w-full px-6 py-24 md:px-24">
        <div className="w-full flex flex-col md:flex-row gap-12 justify-between items-start">
          
          {/* Left Column Content (Takes 55% width) */}
          <div className="w-full md:w-[55%] flex flex-col">
            {/* Header */}
            <div className="mb-12 flex flex-col items-start gap-4">
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent-orange)] animate-pulse" />
                <span className="font-serif italic text-lg text-[color:var(--accent-orange)] tracking-wide">
                  Milestones
                </span>
              </div>
              <h2 className="font-display text-5xl md:text-8xl font-black uppercase tracking-tight text-[color:var(--text-primary)]">
                <span className="motion-mask">
                  <span className="motion-line" data-reveal-title>MY CAREER &</span>
                </span>
                <br />
                <span className="motion-mask">
                  <span className="motion-line" data-reveal-title>EXPERIENCE</span>
                </span>
              </h2>
            </div>

            {/* Timeline Container (shifted left asymmetric layout) */}
            <div className="timeline-container timeline-asymmetric-container relative mt-8 w-full">
              {/* Axis line */}
              <div className="timeline-axis">
                <div className="timeline-line-base" />
                <div className="timeline-line-progress" />
              </div>

              {/* Glowing Tracer Dot */}
              <div className="timeline-tracer-dot" />

              {/* Timeline Items */}
              {EXPERIENCE.map((item, idx) => (
                <div key={idx} className="career-item">
                  {/* Left Side (Empty on desktop, handles year on mobile) */}
                  <div className="career-left">
                    <span className="career-mobile-year">{item.year}</span>
                  </div>

                  {/* Center Node / Year Column */}
                  <div className="career-center">
                    <div className="career-item-node" />
                    <span className="career-year">{item.year}</span>
                  </div>

                  {/* Right Side (Desktop text-left: Job title & Description combined) */}
                  <div className="career-right">
                    <h3 className="font-display text-2xl font-black text-[color:var(--text-primary)] leading-tight">
                      {item.role}
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-[color:var(--accent-cyan)] mt-1.5 font-mono">
                      {item.company}
                    </p>
                    <p className="text-[10px] text-[color:var(--text-muted)] mt-1 font-mono">
                      {item.period}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-[color:var(--text-secondary)]">
                      {item.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 justify-start">
                      {item.skills.map((s) => (
                        <SkillBadge key={s} label={s} accent="cyan" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column Spacer for 3D Model (Takes 40% width) */}
          <div className="w-full md:w-[40%] h-[300px] md:h-[400px] pointer-events-none" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 4: CONTACT & CERTIFICATIONS (HUD Style)
      ══════════════════════════════════════════════════════════════ */}
      <section
        id="contact"
        className="hero-section-panel section-4 relative z-20 flex min-h-screen w-full items-center justify-center overflow-hidden px-6 py-24 md:px-24"
      >
        {/* HUD Background Rings */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <div className="hero-hud-ring-1 absolute h-[300px] w-[300px] rounded-full border md:h-[600px] md:w-[600px]" />
          <div className="hero-hud-ring-2 absolute h-[450px] w-[450px] rounded-full border md:h-[900px] md:w-[900px]" />
          <div className="hero-hud-ring-3 absolute h-[150px] w-[150px] rounded-full border md:h-[300px] md:w-[300px]" />
          <div className="hero-hud-crosshair absolute h-[1px] w-full" />
          <div className="hero-hud-crosshair absolute h-full w-[1px]" />
          <div className="hero-hud-center absolute h-4 w-4 rounded-full border" />
        </div>

        <div className="w-full flex flex-col md:flex-row gap-12 justify-between items-center relative z-30">
          
          {/* Left Column Content (Takes 55% width, holds both items) */}
          <div className="w-full md:w-[55%] grid grid-cols-1 gap-12 md:grid-cols-2">
            {/* Certifications */}
            <div className="flex flex-col gap-6" data-reveal-certifications>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[color:var(--text-muted)]">
                  Credentials
                </span>
                <div className="flex items-center gap-6">
                  <div className="h-16 w-[2px] bg-[color:var(--accent-cyan)]" />
                  <div className="flex flex-col">
                    <span className="font-display text-4xl font-black text-[color:var(--text-primary)]">
                      CERTIFICATIONS
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[color:var(--text-muted)]">
                      Verified Achievements
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-6 mt-4 pl-8 border-l border-[color:var(--border-subtle)]">
                {CERTIFICATIONS.map((c) => (
                  <div key={c.name} className="flex flex-col gap-1 transition-all duration-300 hover:translate-x-2">
                    <span className="text-base font-bold text-[color:var(--text-primary)]">{c.name}</span>
                    <span className="text-xs text-[color:var(--text-secondary)] font-mono">{c.issuer} · {c.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="flex flex-col items-start justify-center gap-8 text-left" data-reveal-contact>
              <div className="flex flex-col items-start gap-2">
                <span className="font-serif italic text-lg text-[color:var(--accent-orange)] tracking-wide">
                  Let's Connect
                </span>
                <div className="flex items-center gap-6">
                  <div className="h-16 w-[2px] bg-[color:var(--accent-orange)]" />
                  <div className="flex flex-col items-start">
                    <h2 className="font-display text-5xl font-black text-[color:var(--text-primary)] leading-tight md:text-6xl tracking-tight">
                      <span className="motion-mask">
                        <span className="motion-line" data-reveal-title>GET IN</span>
                      </span>
                      <span className="motion-mask">
                        <span className="motion-line" data-reveal-title>TOUCH</span>
                      </span>
                    </h2>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start gap-4">
                <a
                  href={`mailto:${OWNER.email}`}
                  className="group flex items-center gap-3 text-lg font-bold text-[color:var(--text-primary)] transition-colors hover:text-[color:var(--accent-orange)]"
                >
                  <Mail size={18} />
                  {OWNER.email}
                </a>
                <p className="text-sm text-[color:var(--text-secondary)]">{OWNER.phone}</p>
                <p className="flex items-center gap-2 text-sm text-[color:var(--text-secondary)]">
                  <MapPin size={14} />
                  {OWNER.location}
                </p>
                <a
                  href={`https://${OWNER.github}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm font-bold text-[color:var(--text-secondary)] transition-colors hover:text-[color:var(--accent-cyan)]"
                >
                  <Github size={16} />
                  {OWNER.github}
                </a>
              </div>

              <motion.a
                href={`mailto:${OWNER.email}`}
                className="group relative inline-flex items-center justify-between gap-6 cursor-pointer rounded-full bg-gradient-to-r from-[color:var(--accent-orange)] to-[color:var(--accent-orange-hover)] pl-8 pr-3 py-3 text-xs font-extrabold uppercase tracking-widest text-white shadow-[var(--shadow-orange)]"
                data-motion="magnetic"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <span>SEND EMAIL</span>
                <motion.span 
                  className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center"
                  whileHover={{ x: 4, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 12 }}
                >
                  <ArrowRight size={14} />
                </motion.span>
              </motion.a>
            </div>
          </div>

          {/* Right Column Spacer for 3D Model (Takes 40% width) */}
          <div className="w-full md:w-[40%] h-[300px] md:h-[400px] pointer-events-none" />
        </div>
      </section>

      {/* ── Footer Ticker ── */}
      <footer className="fixed bottom-0 left-0 z-50 flex h-5 w-full items-center overflow-hidden bg-[color:var(--accent-orange)]">
        <div className="flex animate-marquee items-center gap-8 whitespace-nowrap px-4 text-[8px] font-black uppercase text-bg-deep">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-8">
              <span>{OWNER.nameEn}</span>
              <span>|</span>
              <span>{OWNER.role}</span>
              <span>|</span>
              <span>phongg.dev@gmail.com</span>
              <span>|</span>
              <span>Open to Internship</span>
              <span>|</span>
              <span>{EDUCATION.universityEn}</span>
              <span>|</span>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
