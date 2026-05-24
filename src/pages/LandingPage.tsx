import { useRef } from 'react';
import PageShell from '../components/layout/PageShell';
import StoryMotionProvider from '../components/motion/StoryMotionProvider';
import HeroLandingSection from '../components/sections/HeroLandingSection';

export default function LandingPage() {
  const rootRef = useRef<HTMLElement | null>(null);

  return (
    <PageShell ref={rootRef}>
      <StoryMotionProvider rootRef={rootRef} />
      <HeroLandingSection />
    </PageShell>
  );
}
