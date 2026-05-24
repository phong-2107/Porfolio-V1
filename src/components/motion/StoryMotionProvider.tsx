import type { ReactNode, RefObject } from 'react';

type StoryMotionProviderProps = {
  children?: ReactNode;
  rootRef?: RefObject<HTMLElement | null>;
};

export default function StoryMotionProvider({ children }: StoryMotionProviderProps) {
  return <>{children}</>;
}
