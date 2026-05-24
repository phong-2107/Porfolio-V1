import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollScene({ children, id = 'scene', pinned = false, end = '+=1400' }) {
  const root = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) return

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end,
          scrub: 0.8,
          pin: pinned,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      tl.from('[data-scene-title]', {
        yPercent: 110,
        opacity: 0,
        ease: 'power4.out',
        duration: 1,
      })
        .from('[data-scene-copy]', { y: 48, opacity: 0, duration: 0.8 }, 0.2)
        .from('[data-scene-visual]', { scale: 0.92, opacity: 0, duration: 1 }, 0)
    }, root)

    return () => ctx.revert()
  }, [end, pinned])

  return (
    <section id={id} ref={root} className="relative min-h-screen overflow-hidden">
      {children}
    </section>
  )
}
