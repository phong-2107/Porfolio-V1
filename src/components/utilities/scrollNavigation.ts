import type { SectionAnchor } from '../../lib/navigation';

export function scrollToSection(section: SectionAnchor) {
  if (typeof document === 'undefined') {
    return;
  }

  document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function scrollToHomeTop() {
  if (typeof window === 'undefined') {
    return;
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}
