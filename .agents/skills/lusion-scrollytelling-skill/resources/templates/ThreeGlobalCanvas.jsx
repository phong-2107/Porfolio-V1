import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'

export function ThreeGlobalCanvas({ children }) {
  return (
    <Canvas
      className="pointer-events-none fixed inset-0 z-0"
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 6], fov: 45 }}
    >
      <Suspense fallback={null}>{children}</Suspense>
    </Canvas>
  )
}
