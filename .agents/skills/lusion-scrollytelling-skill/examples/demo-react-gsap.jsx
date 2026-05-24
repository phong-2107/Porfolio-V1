import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function DemoHeroScene() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=1800',
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
        },
      })

      tl.from('[data-title-line]', {
        yPercent: 120,
        opacity: 0,
        stagger: 0.08,
        ease: 'power4.out',
      })
        .from('[data-hero-copy]', { y: 44, opacity: 0 }, 0.25)
        .to('[data-model-shell]', { scale: 1.12, rotate: 4 }, 0)
        .to('[data-scroll-indicator]', { opacity: 0 }, 0.65)
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="hero-scene" className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      <div data-model-shell className="absolute inset-0 grid place-items-center opacity-80">
        {/* Spline or Three.js model goes here */}
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6">
        <h1 className="text-6xl font-black leading-none tracking-tight md:text-8xl">
          <span className="block overflow-hidden"><span data-title-line className="block">Frontend</span></span>
          <span className="block overflow-hidden"><span data-title-line className="block">3D Portfolio</span></span>
        </h1>
        <p data-hero-copy className="mt-6 max-w-xl text-lg text-white/70">
          Scroll-driven WebGL, GSAP choreography, and cinematic project storytelling.
        </p>
        <span data-scroll-indicator className="absolute bottom-8 left-6 text-xs uppercase tracking-[0.3em] text-white/50">
          Scroll to explore
        </span>
      </div>
    </section>
  )
}
