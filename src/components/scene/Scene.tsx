import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Suspense } from 'react'
import Ground from './Ground'
import HamsterSwarm from './HamsterSwarm'
import PoopField from './PoopField'

export default function Scene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 6, 8], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <Suspense fallback={null}>
        <Environment preset="apartment" />
      </Suspense>

      <Ground />
      <HamsterSwarm />
      <PoopField />
    </Canvas>
  )
}
