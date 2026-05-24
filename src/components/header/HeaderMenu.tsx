import { Mail, ChevronDown } from 'lucide-react';
import { scrollToHomeTop, scrollToSection } from '../utilities/scrollNavigation';

interface Props {
  isHamburgActive: boolean;
  onHamburgClick: () => void;
}

export default function HeaderMenu({ isHamburgActive, onHamburgClick }: Props) {
  const handleHomeClick = (event: React.MouseEvent) => {
    event.preventDefault();

    if (window.location.pathname === "/") {
      scrollToHomeTop();
      return;
    }

    window.location.href = "/";
  };

  return (
    <>
      <header className="creative-header-wrap">
        <div className="creative-outer-pill">
          {/* Left: Logo */}
          <div className="creative-logo">
            <a href="/" onClick={handleHomeClick} className="motion-hover">
              <img src="/assets/images/logo-1.png" alt="PhongDev" />
            </a>
          </div>
          
          {/* Center: Inner Nav Pill */}
          <nav className="creative-inner-pill-nav">
            <ul className="creative-menu">
              <li><a href="/" onClick={handleHomeClick} className="motion-hover">HOME</a></li>
              <li>
                <a 
                  href="#projects" 
                  className="motion-hover"
                  onClick={(e) => {
                    e.preventDefault();
                    if (window.location.pathname === "/") scrollToSection('feature' as any);
                    else window.location.href = "/#feature";
                  }}
                >
                  PROJECTS (7)
                </a>
              </li>
              <li>
                <a 
                  href="#about" 
                  className="motion-hover"
                  onClick={(e) => {
                    e.preventDefault();
                    if (window.location.pathname === "/") scrollToSection('about' as any);
                    else window.location.href = "/#about";
                  }}
                >
                  ABOUT
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  className="motion-hover"
                  onClick={(e) => {
                    e.preventDefault();
                    if (window.location.pathname === "/") scrollToSection('contact' as any);
                    else window.location.href = "/#contact";
                  }}
                >
                  CONTACT
                </a>
              </li>
              <li className="has-dropdown">
                <a href="#pages" className="motion-hover">
                  ALL PAGES <ChevronDown size={14} />
                </a>
              </li>
            </ul>
          </nav>

          {/* Right: Contact & CTA */}
          <div className="creative-right-actions">
            <span className="contact-phone">(+84) 0345651206</span>
            <a href="#mail" className="contact-mail-icon motion-hover">
              <Mail size={18} />
            </a>
            <a href="#contact" className="creative-cta-btn motion-hover">
              Get in touch
            </a>
          </div>
        </div>
      </header>

      {/* Hamburg Menu (Floating at top right) */}
      <span 
        className={`hamburg-menu ${isHamburgActive ? "active" : ""}`} 
        onClick={onHamburgClick}
      >
        <span />
        <span />
        <span />
      </span>
    </>
  );
}
