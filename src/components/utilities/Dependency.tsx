import MotionCursor from '../animated/MotionCursor';
import { usePointerInteractions } from '../../hooks/usePointerInteractions';

export default function Dependency() {
  usePointerInteractions();

  return <MotionCursor />;
}
