import type { ReactNode, RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import { getGsap } from '../../lib/gsap';
import { prefersReducedMotion } from '../../lib/motion';

type StoryMotionProviderProps = {
  children?: ReactNode;
  rootRef?: RefObject<HTMLElement | null>;
};

export default function StoryMotionProvider({ children, rootRef }: StoryMotionProviderProps) {
  useGSAP(() => {
    const root = rootRef?.current;
    if (!root) return;

    const { gsap, ScrollTrigger } = getGsap();
    const reduceMotion = prefersReducedMotion();
    const scoped = gsap.utils.selector(root);

    const revealTargets = scoped<HTMLElement>(
      [
        '[data-motion="heading"]',
        '[data-motion="reveal"]',
        '[data-motion="media"]',
        '[data-motion="cta"]',
      ].join(', '),
    );
    const cards = scoped<HTMLElement>('[data-motion="card"]:not([data-project-card])');

    if (reduceMotion) {
      gsap.set([...revealTargets, ...cards], {
        clearProps: 'transform,filter',
        autoAlpha: 1,
      });
      return;
    }

    if (revealTargets.length) {
      gsap.set(revealTargets, {
        autoAlpha: 0,
        y: 42,
        scale: 0.98,
        filter: 'blur(10px)',
        transformOrigin: '50% 50%',
      });

      ScrollTrigger.batch(revealTargets, {
        start: 'top 86%',
        end: 'bottom 18%',
        interval: 0.08,
        batchMax: 5,
        onEnter: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.95,
            stagger: 0.08,
            ease: 'power3.out',
            overwrite: true,
          });
        },
        onLeaveBack: (batch) => {
          gsap.to(batch, {
            autoAlpha: 0,
            y: 30,
            scale: 0.985,
            filter: 'blur(8px)',
            duration: 0.55,
            stagger: 0.04,
            ease: 'power2.in',
            overwrite: true,
          });
        },
      });
    }

    if (cards.length) {
      gsap.set(cards, {
        autoAlpha: 0,
        y: 54,
        scale: 0.965,
        rotateX: -4,
        filter: 'blur(8px)',
        transformPerspective: 1200,
      });

      ScrollTrigger.batch(cards, {
        start: 'top 88%',
        end: 'bottom 14%',
        interval: 0.08,
        batchMax: 4,
        onEnter: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            filter: 'blur(0px)',
            duration: 0.85,
            stagger: 0.09,
            ease: 'power3.out',
            overwrite: true,
          });
        },
        onLeaveBack: (batch) => {
          gsap.to(batch, {
            autoAlpha: 0,
            y: 36,
            scale: 0.975,
            rotateX: -3,
            filter: 'blur(7px)',
            duration: 0.5,
            stagger: 0.04,
            ease: 'power2.in',
            overwrite: true,
          });
        },
      });
    }

    scoped<HTMLElement>('[data-motion="media"]').forEach((element) => {
      gsap.fromTo(
        element,
        { yPercent: 4, scale: 0.94 },
        {
          yPercent: -4,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        },
      );
    });
  }, { scope: rootRef });

  return <>{children}</>;
}
