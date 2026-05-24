import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, prefersReducedMotion } from './animation-tokens'

gsap.registerPlugin(ScrollTrigger)

export function createTextReveal(scope: Element | Document = document) {
  if (prefersReducedMotion()) return

  const sections = gsap.utils.toArray<HTMLElement>('[data-reveal-section]', scope)

  sections.forEach((section) => {
    const lines = section.querySelectorAll('[data-reveal-line]')

    gsap.from(lines, {
      yPercent: 120,
      opacity: 0,
      duration: motion.revealDuration,
      stagger: motion.staggerMd,
      ease: motion.easeOut,
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
      },
    })
  })
}

export function createProjectReveal() {
  if (prefersReducedMotion()) return

  gsap.from('[data-project-card]', {
    y: 88,
    scale: 0.94,
    opacity: 0,
    filter: 'blur(14px)',
    duration: 1,
    stagger: 0.12,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '[data-project-grid]',
      start: 'top 72%',
    },
  })
}

export function refreshScroll() {
  ScrollTrigger.refresh()
}
