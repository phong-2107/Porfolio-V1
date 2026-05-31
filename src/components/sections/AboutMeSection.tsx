import { useRef } from 'react';
import { Github, Linkedin, Twitter, Instagram } from 'lucide-react';
import { OWNER } from '../../data/portfolio';
import { useGSAP } from '@gsap/react';
import { getGsap } from '../../lib/gsap';

const { gsap } = getGsap();

export default function AboutMeSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Helper function to split text into words for staggered cinematic reveals
  const renderRevealText = (text: string, highlightWords: string[] = [], highlightClass = "") => {
    return text.split(' ').map((word, idx) => {
      // Strip punctuation for matching
      const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
      const isHighlighted = highlightWords.includes(cleanWord);
      return (
        <span key={idx} className="inline-block overflow-hidden mr-[0.25em] pb-[0.05em]">
          <span className={`about-reveal-word inline-block will-change-transform ${isHighlighted ? highlightClass : ""}`}>
            {word}
          </span>
        </span>
      );
    });
  };

  // Khởi chạy các hoạt ảnh liên tục và tương tác chuột (3D Hover Tilt)
  useGSAP((context, contextSafe) => {
    const section = sectionRef.current;
    if (!section) return;

    // Hiệu ứng bay bổng liên tục của Quả Cầu
    gsap.to('.about-orb', {
      y: '+=20',
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });

    // Tương tác xoay 3D (Mouse Hover Tilt) cho ảnh chân dung
    const avatarCard = section.querySelector('.about-avatar-card');
    if (avatarCard) {
      const tiltX = gsap.quickTo(avatarCard, 'rotateY', { duration: 0.5, ease: 'power2.out' });
      const tiltY = gsap.quickTo(avatarCard, 'rotateX', { duration: 0.5, ease: 'power2.out' });
      const glowX = gsap.quickTo('.about-avatar-glow', 'xPercent', { duration: 0.5, ease: 'power2.out' });
      const glowY = gsap.quickTo('.about-avatar-glow', 'yPercent', { duration: 0.5, ease: 'power2.out' });

      const onMouseMove = contextSafe((e: MouseEvent) => {
        const rect = avatarCard.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const rotY = (x / (rect.width / 2)) * 14;
        const rotX = -(y / (rect.height / 2)) * 14;

        const glowOffsetValX = (x / (rect.width / 2)) * 12;
        const glowOffsetValY = (y / (rect.height / 2)) * 12;

        tiltX(rotY);
        tiltY(rotX);
        glowX(glowOffsetValX);
        glowY(glowOffsetValY);
      });

      const onMouseLeave = contextSafe(() => {
        tiltX(0);
        tiltY(0);
        glowX(0);
        glowY(0);
      });

      avatarCard.addEventListener('mousemove', onMouseMove);
      avatarCard.addEventListener('mouseleave', onMouseLeave);

      return () => {
        avatarCard.removeEventListener('mousemove', onMouseMove);
        avatarCard.removeEventListener('mouseleave', onMouseLeave);
      };
    }
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="about-me" className="hero-section-panel about-me-section relative z-20 w-full overflow-hidden">
      <div className="section-focal-wrapper w-full min-h-[100dvh] flex items-center justify-center px-6 py-24 md:px-24">
        {/* Hiệu ứng màu nền nhẹ cho phần này */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_20%_40%,rgba(var(--accent-cyan-rgb),0.02)_0%,transparent_60%)] pointer-events-none" />

        {/* Quả Cầu Phát Sáng Thủy Tinh (Đã tách phần Hào quang cực mịn phía sau và quả cầu phía trước) */}
        <div 
          className="about-orb absolute top-24 right-[10%] w-16 h-16 pointer-events-none z-10 hidden md:block"
        >
          {/* Vầng hào quang mịn tỏa rộng phía sau */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full pointer-events-none blur-[48px] opacity-60 mix-blend-screen"
            style={{
              background: 'radial-gradient(circle, rgba(var(--accent-cyan-rgb), 0.4) 0%, rgba(var(--accent-cyan-rgb), 0.1) 45%, transparent 75%)',
            }}
          />
          {/* Quả cầu thủy tinh vật lý phía trước */}
          <div 
            className="absolute inset-0 rounded-full border border-[color:var(--border-strong)] backdrop-blur-sm"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(244, 239, 231, 0.18) 0%, rgba(var(--accent-cyan-rgb), 0.2) 55%, rgba(8, 7, 6, 0.6) 100%)',
              boxShadow: 'inset 0 2px 4px rgba(244, 239, 231, 0.25), 0 8px 16px rgba(0, 0, 0, 0.4)',
            }}
          />
        </div>

        <div data-section-content className="w-full px-4 md:px-[4vw] max-w-[1920px] mx-auto flex flex-col md:flex-row gap-16 items-center justify-between relative z-10">
          
          {/* Cột Trái: Các liên kết mạng xã hội dọc + Ảnh chân dung Sci-Fi nâng cấp */}
          <div className="w-full md:w-[50%] flex items-center justify-center md:justify-start gap-8 md:gap-12">
            
            {/* Menu Mạng Xã Hội Dọc */}
            <div className="about-socials flex flex-col items-center gap-6 justify-center">
              <a
                href={`https://${OWNER.github}`}
                target="_blank"
                rel="noreferrer"
                className="text-[color:var(--text-secondary)] hover:text-[color:var(--accent-orange)] transition-colors"
                data-motion="magnetic"
              >
                <Github size={20} strokeWidth={1.5} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="text-[color:var(--text-secondary)] hover:text-[color:var(--accent-orange)] transition-colors"
                data-motion="magnetic"
              >
                <Linkedin size={20} strokeWidth={1.5} />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="text-[color:var(--text-secondary)] hover:text-[color:var(--accent-orange)] transition-colors"
                data-motion="magnetic"
              >
                <svg 
                  viewBox="0 0 24 24" 
                  width="18" 
                  height="18" 
                  fill="currentColor"
                  className="transition-colors hover:text-[color:var(--accent-orange)]"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="text-[color:var(--text-secondary)] hover:text-[color:var(--accent-orange)] transition-colors"
                data-motion="magnetic"
              >
                <Instagram size={20} strokeWidth={1.5} />
              </a>
            </div>

            {/* Vùng chứa Ảnh chân dung thật và Khung hình Sci-Fi nâng cấp (To hơn 100%) */}
            <div className="about-avatar relative group flex items-center justify-center" style={{ perspective: '1000px' }}>
              
              {/* Lớp ánh sáng phát quang phía sau (Cyan & Orange backlight) */}
              <div className="about-avatar-glow absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--accent-orange-rgb),0.12)_0%,rgba(var(--accent-cyan-rgb),0.05)_50%,transparent_100%)] blur-[50px] opacity-75 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2rem] scale-110" />

              {/* Hộp bo viền Sci-Fi Glassmorphism (Kích thước to hơn 100%) */}
              <div className="about-avatar-card relative rounded-[2rem] border border-[color:var(--border-subtle)] bg-[color:var(--bg-deep)]/20 p-3.5 backdrop-blur-md shadow-2xl transition-all duration-500 group-hover:border-[color:var(--border-strong)] group-hover:shadow-[0_30px_60px_rgba(var(--accent-orange-rgb),0.12)] w-[300px] h-[380px] sm:w-[460px] sm:h-[560px] flex items-center justify-center transform-style-preserve-3d backface-hidden">
                
                {/* Sci-Fi Corner Brackets */}
                {/* Top-Left Bracket */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[color:var(--accent-orange)] rounded-tl-[2rem] transition-colors duration-500 group-hover:border-[color:var(--accent-cyan)]" />
                {/* Top-Right Bracket */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[color:var(--accent-orange)] rounded-tr-[2rem] transition-colors duration-500 group-hover:border-[color:var(--accent-cyan)]" />
                {/* Bottom-Left Bracket */}
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[color:var(--accent-orange)] rounded-bl-[2rem] transition-colors duration-500 group-hover:border-[color:var(--accent-cyan)]" />
                {/* Bottom-Right Bracket */}
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[color:var(--accent-orange)] rounded-br-[2rem] transition-colors duration-500 group-hover:border-[color:var(--accent-cyan)]" />

                {/* Technical Labels (Sci-Fi Overlay) */}
                <div className="absolute top-3 left-6 z-20 flex items-center gap-1.5 pointer-events-none opacity-45 group-hover:opacity-75 transition-opacity duration-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent-orange)] animate-pulse" />
                  <span className="font-mono text-[8px] font-bold uppercase tracking-wider text-[color:var(--text-secondary)]">
                    SYS_BIO.REF // VER_1.0
                  </span>
                </div>
                <div className="absolute bottom-3 right-6 z-20 pointer-events-none opacity-45 group-hover:opacity-75 transition-opacity duration-500">
                  <span className="font-mono text-[8px] font-bold uppercase tracking-widest text-[color:var(--text-secondary)]">
                    LOC.SYS_EST: VN
                  </span>
                </div>

                {/* Animated Scanner Laser Line */}
                <div className="absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[color:var(--accent-cyan)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-scanner-line pointer-events-none z-20" />

                {/* Real Portrait Image */}
                <img
                  src="/assets/images/avatars/avatar-2-isolated.png"
                  alt="Portrait Photo"
                  className="w-full h-full object-cover rounded-[1.6rem] filter saturate-[0.82] contrast-[1.05] transition-all duration-700 group-hover:scale-[1.02] group-hover:saturate-100"
                />
              </div>
              
              {/* Lớp lưới kỹ thuật ảo ảnh mờ */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.008)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.008)_1px,transparent_1px)] bg-[size:16px_16px] rounded-[2rem] pointer-events-none border border-transparent group-hover:border-white/5 transition-all duration-500" />
            </div>

          </div>

          {/* Cột Phải: Đoạn tự giới thiệu */}
          <div className="about-text w-full md:w-[48%] flex flex-col gap-6 text-left">
            
            <div className="flex items-center gap-3">
              <span className="status-dot-cyan animate-pulse" />
              <span className="about-kicker font-mono text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-[color:var(--accent-cyan)]">
                // 02.5 / ABOUT ME
              </span>
            </div>

            <p className="font-sans text-xl sm:text-2xl md:text-3xl text-[color:var(--text-primary)] leading-[1.35] tracking-tight font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              {renderRevealText(
                "I'm a creative developer & designer with a passion for blending technical expertise with creative edge.",
                ["creative", "developer", "designer"],
                "font-serif italic font-normal text-[color:var(--accent-orange)]"
              )}
            </p>

            <p className="about-desc text-sm leading-relaxed text-[color:var(--text-secondary)] font-normal border-l border-[color:var(--accent-cyan)]/20 pl-5">
              Driven by curiosity, I always try to explore and learn new skills to push the boundaries of what is possible on the web. Crafting unique interactive experiences, cinematically styling interfaces, and optimizing performances are core values of my workflow.
            </p>

            {/* Asymmetric Micro-Bento Metrics Grid */}
            <div className="about-metrics grid grid-cols-2 gap-4 mt-4 w-full">
              {/* Metric 1 */}
              <div className="about-metric-card relative overflow-hidden rounded-2xl border border-white/5 bg-[color:var(--bg-deep)]/30 p-5 backdrop-blur-md transition-all duration-300 hover:border-[color:var(--border-subtle)] hover:bg-[color:var(--bg-surface)]/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] flex flex-col gap-1">
                <span className="font-display font-black text-3xl text-[color:var(--text-primary)] tracking-tight">04+</span>
                <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[color:var(--accent-cyan)]">// YEARS_EXPERIENCE</span>
                <div className="absolute -right-6 -bottom-6 w-12 h-12 rounded-full bg-[color:var(--accent-cyan)]/5 blur-xl pointer-events-none" />
              </div>

              {/* Metric 2 */}
              <div className="about-metric-card relative overflow-hidden rounded-2xl border border-white/5 bg-[color:var(--bg-deep)]/30 p-5 backdrop-blur-md transition-all duration-300 hover:border-[color:var(--border-subtle)] hover:bg-[color:var(--bg-surface)]/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] flex flex-col gap-1">
                <span className="font-display font-black text-3xl text-[color:var(--accent-orange)] tracking-tight">24+</span>
                <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[color:var(--text-secondary)]">// SHIPPED_PROJECTS</span>
                <div className="absolute -right-6 -bottom-6 w-12 h-12 rounded-full bg-[color:var(--accent-orange)]/5 blur-xl pointer-events-none" />
              </div>

              {/* Metric 3 */}
              <div className="about-metric-card relative overflow-hidden rounded-2xl border border-white/5 bg-[color:var(--bg-deep)]/30 p-5 backdrop-blur-md transition-all duration-300 hover:border-[color:var(--border-subtle)] hover:bg-[color:var(--bg-surface)]/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] flex flex-col gap-1">
                <span className="font-display font-black text-3xl text-[color:var(--text-primary)] tracking-tight">08+</span>
                <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[color:var(--accent-cyan)]">// CORE_TECHNOLOGIES</span>
                <div className="absolute -right-6 -bottom-6 w-12 h-12 rounded-full bg-[color:var(--accent-cyan)]/5 blur-xl pointer-events-none" />
              </div>

              {/* Metric 4 */}
              <div className="about-metric-card relative overflow-hidden rounded-2xl border border-white/5 bg-[color:var(--bg-deep)]/30 p-5 backdrop-blur-md transition-all duration-300 hover:border-[color:var(--border-subtle)] hover:bg-[color:var(--bg-surface)]/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] flex flex-col gap-1">
                <span className="font-sans font-medium text-lg leading-tight text-[color:var(--text-primary)] tracking-tight flex items-center gap-1.5 pt-1.5">
                  <span className="w-2 h-2 rounded-full bg-[color:var(--accent-orange)] animate-pulse" />
                  CREATIVE
                </span>
                <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[color:var(--accent-orange)]">// DESIGN_MINDSET</span>
                <div className="absolute -right-6 -bottom-6 w-12 h-12 rounded-full bg-[color:var(--accent-orange)]/5 blur-xl pointer-events-none" />
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
