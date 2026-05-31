import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

let registered = false;

export function getGsap() {
  if (!registered) {
    gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);
    registered = true;
  }

  return { gsap, ScrollTrigger, ScrollToPlugin };
}
