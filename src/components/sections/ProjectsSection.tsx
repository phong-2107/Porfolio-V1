import { useState, useRef } from 'react';
import { Github, ArrowRight } from 'lucide-react';
import { OWNER, PROJECTS } from '../../data/portfolio';
import ProjectCard from '../ui/ProjectCard';
import ProjectDemoModal from '../ui/ProjectDemoModal';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [isSectionActive, setIsSectionActive] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = section.querySelectorAll('[data-project-card]');

    // Khởi tạo trạng thái ẩn ban đầu của thẻ
    gsap.set(cards, { y: 80, scale: 0.96, opacity: 0, filter: 'blur(8px)' });

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 85%', // Bắt đầu khi phần đầu của section tới 85% viewport
      end: 'bottom 15%', // Tắt khi phần cuối của section qua 15% viewport
      onEnter: () => {
        setIsSectionActive(true);
        gsap.to(cards, {
          y: 0,
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.85,
          stagger: 0.15, // Hiệu ứng xuất hiện lần lượt
          ease: 'power2.out',
          overwrite: 'auto'
        });
      },
      onLeave: () => {
        setIsSectionActive(false);
        gsap.to(cards, {
          y: -80,
          scale: 0.96,
          opacity: 0,
          filter: 'blur(8px)',
          duration: 0.65,
          stagger: 0.1,
          ease: 'power2.in',
          overwrite: 'auto'
        });
      },
      onEnterBack: () => {
        setIsSectionActive(true);
        gsap.to(cards, {
          y: 0,
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.85,
          stagger: 0.15,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      },
      onLeaveBack: () => {
        setIsSectionActive(false);
        gsap.to(cards, {
          y: 80,
          scale: 0.96,
          opacity: 0,
          filter: 'blur(8px)',
          duration: 0.65,
          stagger: 0.1,
          ease: 'power2.in',
          overwrite: 'auto'
        });
      }
    });

    return () => {
      trigger.kill();
    };
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="projects" className="hero-section-panel section-3 relative z-20 min-h-[100dvh] w-full px-6 py-32 md:px-12 lg:px-24">
      <div className="max-w-[1440px] mx-auto w-full flex flex-col gap-16">
        
        {/* Tiêu đề phần (Có spacer động ở Desktop tránh che Monitor khi nó đang fade out) */}
        <div className="w-full flex flex-col lg:flex-row gap-12 justify-between items-start">
          <div className="w-full lg:w-[35%] h-[50px] lg:h-[120px] pointer-events-none hidden lg:block" />
          
          <div className="w-full lg:w-[60%] flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="status-dot-cyan animate-pulse" />
              <span className="font-mono text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-[color:var(--accent-cyan)]">
                // 02 / SELECTED WORK
              </span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.9] text-[color:var(--text-primary)] tracking-tighter flex flex-col mt-2">
              <span className="motion-mask overflow-hidden">
                <span className="motion-line inline-block text-transparent [-webkit-text-stroke:1.5px_rgba(248,250,252,0.2)]" data-reveal-title>
                  SELECTED
                </span>
              </span>
              <span className="motion-mask overflow-hidden">
                <span className="motion-line inline-block text-[color:var(--text-primary)] drop-shadow-[0_0_30px_rgba(255,255,255,0.06)]" data-reveal-title>
                  PROJECTS
                </span>
              </span>
            </h2>
          </div>
        </div>

        {/* Bento Grid bất đối xứng */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 w-full" data-motion-group="cards">
          {PROJECTS.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isSectionActive={isSectionActive}
              onExplore={() => setSelectedProject(project)}
            />
          ))}
        </div>

        {/* Nút xem toàn bộ Github */}
        <div className="mt-8 flex justify-center">
          <a
            href={`https://${OWNER.github}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-full border border-white/10 px-8 py-4 text-xs font-bold uppercase tracking-widest text-[color:var(--text-primary)] transition-all hover:border-[color:var(--accent-orange)] hover:text-[color:var(--accent-orange)] font-mono"
          >
            <Github size={14} />
            All Repositories on GitHub
            <ArrowRight size={14} />
          </a>
        </div>
      </div>

      {/* Modal Trình diễn dự án */}
      <ProjectDemoModal
        project={selectedProject}
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
