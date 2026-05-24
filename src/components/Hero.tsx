import { useRef } from 'react';
import { Github, Mail, ArrowRight, MapPin, Calendar, Linkedin, Twitter, Instagram } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplineHeroScene from './hero/SplineHeroScene';
import { OWNER, SKILLS, PROJECTS, EDUCATION, EXPERIENCE, CERTIFICATIONS } from '../data/portfolio';

gsap.registerPlugin(ScrollTrigger);

// ─── Skill Badge ──────────────────────────────────────────────────────────────
function SkillBadge({ label, accent = 'cyan' }: { label: string; accent?: 'cyan' | 'orange' }) {
  return (
    <span
      className={`inline-block rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${
        accent === 'orange'
          ? 'border-[color:var(--border-orange)] text-[color:var(--accent-orange)] bg-[rgba(255,122,26,0.08)]'
          : 'border-[color:var(--border-cyan)] text-[color:var(--accent-cyan)] bg-[rgba(18,214,221,0.08)]'
      }`}
    >
      {label}
    </span>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ project }: { project: (typeof PROJECTS)[number] }) {
  return (
    <div
      className="group relative flex flex-col gap-5 rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-card)] p-8 transition-all duration-500 hover:border-[color:var(--border-strong)] hover:shadow-[var(--shadow-card)]"
      data-motion="card"
    >
      {/* Tag */}
      <span className="self-start rounded-full bg-[rgba(18,214,221,0.1)] border border-[color:var(--border-cyan)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[color:var(--accent-cyan)]">
        {project.tag}
      </span>

      {/* Title */}
      <div>
        <h3 className="font-display text-3xl font-black text-[color:var(--text-primary)] leading-tight">
          {project.name}
        </h3>
        <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-[color:var(--text-muted)]">
          {project.subtitle}
        </p>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 text-[11px] text-[color:var(--text-secondary)]">
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {project.period}
        </span>
        <span className="opacity-40">|</span>
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
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent-cyan)]" />
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
        className="mt-auto flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[color:var(--accent-orange)] opacity-80 transition-opacity hover:opacity-100"
      >
        <Github size={14} />
        View Source
        <ArrowRight size={14} />
      </a>
    </div>
  );
}

// ─── Main Hero / Portfolio Page ───────────────────────────────────────────────
export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1.2 } });

      tl.from('.gsap-fade-down', { y: -30, opacity: 0, stagger: 0.1 })
        .from('.gsap-social-icons > *', { y: 20, opacity: 0, stagger: 0.1 }, '-=0.8')
        .from('.gsap-left-col', { x: -50, opacity: 0 }, '-=0.8')
        .from('.gsap-right-col', { x: 50, opacity: 0 }, '-=0.8')
        .from('.gsap-scale', { scale: 0.8, opacity: 0, duration: 1.5 }, '-=1.2')
        .from('.gsap-side', { x: 30, opacity: 0 }, '-=1');
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

        {/* Top Bar */}
        <header className="gsap-fade-down relative z-50 flex w-full items-center justify-between px-6 py-8 md:px-12 md:py-10">
          <div className="font-display flex flex-col text-xl font-black italic leading-none tracking-tighter">
            <span className="text-[color:var(--text-primary)]">PHONG</span>
            <span className="portfolio-accent" style={{ color: 'var(--accent-orange)' }}>DEV</span>
          </div>

          <nav className="header-menu-wrap hidden items-center gap-12 text-sm font-medium uppercase tracking-widest md:flex">
            <a href="#about" className="hero-nav-link motion-hover">About</a>
            <a href="#projects" className="hero-nav-link motion-hover">Projects</a>
            <a href="#contact" className="hero-nav-link motion-hover border-b-2 border-[color:var(--accent-orange)] pb-1">Contact</a>
          </nav>

          <div className="flex items-center gap-4">
            <a
              href={`https://${OWNER.github}`}
              target="_blank"
              rel="noreferrer"
              className="portfolio-icon-button flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
            >
              <Github size={20} strokeWidth={1.5} />
            </a>
            <a
              href={`mailto:${OWNER.email}`}
              className="portfolio-icon-button flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
            >
              <Mail size={20} strokeWidth={1.5} />
            </a>
          </div>
        </header>

        {/* Hero Main Content */}
        <main className="relative z-30 flex flex-1 flex-col justify-center px-6 md:px-12 pb-16 md:grid md:grid-cols-[80px_1fr_1.2fr_1fr] md:items-center md:gap-4">
          
          {/* Social Icons (Far Left) */}
          <div className="gsap-social-icons flex flex-row md:flex-col items-center justify-start gap-6 md:gap-8 mb-8 md:mb-0 md:self-end md:pb-8">
            <a
              href={`https://${OWNER.github}`}
              target="_blank"
              rel="noreferrer"
              className="text-[color:var(--text-secondary)] hover:text-[color:var(--accent-orange)] transition-colors duration-300"
              data-motion="magnetic"
            >
              <Github size={22} strokeWidth={1.5} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="text-[color:var(--text-secondary)] hover:text-[color:var(--accent-orange)] transition-colors duration-300"
              data-motion="magnetic"
            >
              <Linkedin size={22} strokeWidth={1.5} />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              className="text-[color:var(--text-secondary)] hover:text-[color:var(--accent-orange)] transition-colors duration-300"
              data-motion="magnetic"
            >
              <Twitter size={22} strokeWidth={1.5} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="text-[color:var(--text-secondary)] hover:text-[color:var(--accent-orange)] transition-colors duration-300"
              data-motion="magnetic"
            >
              <Instagram size={22} strokeWidth={1.5} />
            </a>
          </div>

          {/* Left Content (Name) */}
          <div className="gsap-left-col flex flex-col justify-center gap-4 text-left select-none z-40">
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-[color:var(--accent-cyan)] uppercase mb-1" data-motion="hero-kicker">
                Hello! I'm
              </p>
              <h2 className="font-display text-5xl md:text-7xl font-black leading-[0.9] tracking-tight uppercase text-[color:var(--text-primary)]" data-motion="hero-title">
                NGUYEN<br />
                THANH PHONG
              </h2>
            </div>
            
            <p className="text-[color:var(--text-secondary)] text-sm font-medium max-w-xs leading-relaxed mt-2" data-motion="hero-copy">
              {OWNER.tagline}
            </p>

            <div className="flex flex-col gap-3 mt-4">
              <div className="flex items-center gap-2 text-xs text-[color:var(--text-muted)]">
                <MapPin size={14} className="text-[color:var(--accent-cyan)]" />
                {OWNER.location}
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[color:var(--accent-cyan)] animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[color:var(--accent-cyan)]">
                  Available for Internship
                </span>
              </div>
            </div>
          </div>

          {/* Center (Spacer for 3D model) */}
          <div className="hidden md:block pointer-events-none" />

          {/* Right Content (Roles & CTA) */}
          <div className="gsap-right-col flex flex-col justify-center items-start md:items-end gap-6 text-left md:text-right mt-8 md:mt-0 select-none z-40">
            <div className="flex flex-col items-start md:items-end">
              <p className="text-sm font-semibold tracking-[0.2em] text-[color:var(--accent-cyan)] uppercase mb-1" data-motion="hero-kicker">
                A Creative
              </p>
              <h2 
                className="font-display text-5xl md:text-7xl font-black leading-[0.9] tracking-tight uppercase" 
                data-motion="hero-title"
                style={{
                  WebkitTextStroke: '1.5px var(--accent-cyan)',
                  color: 'transparent',
                  opacity: 0.9
                }}
              >
                FULL-STACK
              </h2>
              <h2 className="font-display text-5xl md:text-7xl font-black leading-[0.9] tracking-tight uppercase text-[color:var(--text-primary)]" data-motion="hero-title">
                DEVELOPER
              </h2>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2 mt-2">
              <span className="font-display text-4xl font-black text-[color:var(--accent-orange)]">{EDUCATION.gpa}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--text-muted)]">GPA · HUTECH</span>
              <span className="text-[9px] text-[color:var(--text-muted)]">{EDUCATION.period}</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-4 w-full md:w-auto md:justify-end">
              <a
                href={`mailto:${OWNER.email}`}
                className="theme-btn theme-btn-primary cursor-pointer rounded-sm px-8 py-4 text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform w-full md:w-auto text-center"
                data-motion="hero-cta"
              >
                HIRE ME
              </a>
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
      <section id="about" className="hero-section-panel section-2 relative z-20 flex h-screen w-full items-center px-6 md:px-24">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[color:var(--accent-cyan)]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[color:var(--accent-cyan)]">
                  Technical Profile
                </span>
              </div>
              <h2 className="font-display text-7xl font-black leading-[0.9] text-[color:var(--text-primary)] md:text-8xl">
                MY<br />STACK
              </h2>
            </div>

            <div className="flex flex-col gap-8">
              <div className="hero-metric-line-left flex flex-col gap-3 pl-6">
                <span className="font-display text-3xl font-black text-[color:var(--text-primary)]">Back-End</span>
                <div className="flex flex-wrap gap-2">
                  {['C#', 'ASP.NET Core', 'Node.js', 'Python', 'Java'].map((s) => (
                    <SkillBadge key={s} label={s} accent="orange" />
                  ))}
                </div>
              </div>
              <div className="hero-metric-line-left flex flex-col gap-3 pl-6">
                <span className="font-display text-3xl font-black text-[color:var(--text-primary)]">Front-End</span>
                <div className="flex flex-wrap gap-2">
                  {['ReactJS', 'JavaScript', 'Bootstrap', 'Tailwind CSS'].map((s) => (
                    <SkillBadge key={s} label={s} accent="cyan" />
                  ))}
                </div>
              </div>
              <div className="hero-metric-line-left flex flex-col gap-3 pl-6">
                <span className="font-display text-3xl font-black text-[color:var(--text-primary)]">Database</span>
                <div className="flex flex-wrap gap-2">
                  {SKILLS.databases.map((s) => (
                    <SkillBadge key={s} label={s} accent="cyan" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:flex flex-col justify-center gap-6">
            <p className="text-sm leading-relaxed text-[color:var(--text-secondary)] max-w-md">
              {OWNER.summary}
            </p>
            <div className="flex flex-col gap-3">
              {SKILLS.tools.map((t) => (
                <div key={t} className="flex items-center gap-3">
                  <span className="h-[1px] w-8 bg-[color:var(--accent-orange)]" />
                  <span className="text-xs font-bold uppercase tracking-widest text-[color:var(--text-secondary)]">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3: PROJECTS
      ══════════════════════════════════════════════════════════════ */}
      <section id="projects" className="hero-section-panel section-3 relative z-20 min-h-screen w-full px-6 py-24 md:px-24">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-16 flex flex-col items-end gap-4">
            <div className="flex items-center gap-3">
              <span
                className="rounded-full border border-[color:var(--border-cyan)] bg-[rgba(18,214,221,0.08)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em]"
                style={{ color: 'var(--accent-cyan)' }}
              >
                Selected Work
              </span>
            </div>
            <h2 className="font-display text-7xl font-black leading-[0.9] text-[color:var(--text-primary)] text-right md:text-8xl">
              PROJECTS
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2" data-motion-group="cards">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          <div className="mt-12 flex justify-center">
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
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 4: EXPERIENCE & CONTACT (HUD Style)
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

        <div className="relative z-30 mx-auto w-full max-w-7xl">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2">

            {/* Experience */}
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[color:var(--text-muted)]">
                  Work Experience
                </span>
                <div className="flex items-center gap-6">
                  <div className="h-16 w-[2px] bg-[color:var(--accent-cyan)]" />
                  <div className="flex flex-col">
                    <span className="font-display text-4xl font-black text-[color:var(--text-primary)]">
                      {EXPERIENCE[0].role}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-[color:var(--text-muted)]">
                      {EXPERIENCE[0].company}
                    </span>
                    <span className="mt-1 text-[11px] text-[color:var(--text-secondary)]">
                      {EXPERIENCE[0].period}
                    </span>
                  </div>
                </div>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-[color:var(--text-secondary)]">
                  {EXPERIENCE[0].description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {EXPERIENCE[0].skills.map((s) => (
                    <SkillBadge key={s} label={s} accent="cyan" />
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="flex flex-col gap-3 pl-8 border-l border-[color:var(--border-subtle)]">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[color:var(--text-muted)]">
                  Certifications
                </span>
                {CERTIFICATIONS.map((c) => (
                  <div key={c.name} className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold text-[color:var(--text-primary)]">{c.name}</span>
                    <span className="text-xs text-[color:var(--text-secondary)]">{c.issuer} · {c.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="flex flex-col items-end justify-center gap-8 text-right">
              <div className="flex flex-col items-end gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[color:var(--text-muted)]">
                  Let's Connect
                </span>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end">
                    <h2 className="font-display text-5xl font-black text-[color:var(--text-primary)] leading-tight md:text-6xl">
                      GET IN<br />TOUCH
                    </h2>
                  </div>
                  <div className="h-16 w-[2px] bg-[color:var(--accent-orange)]" />
                </div>
              </div>

              <div className="flex flex-col items-end gap-4">
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

              <a
                href={`mailto:${OWNER.email}`}
                className="theme-btn theme-btn-primary mt-4 inline-flex cursor-pointer items-center gap-3 rounded-sm px-10 py-5 text-sm font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform"
              >
                SEND EMAIL
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
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
