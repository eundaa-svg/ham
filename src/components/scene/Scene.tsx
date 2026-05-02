import { Canvas } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import { Suspense } from 'react'
import Ground from './Ground'
import HamsterSwarm from './HamsterSwarm'
import PoopField from './PoopField'
import ClickableGround from './ClickableGround'
import ClickRipple from './ClickRipple'

export default function Scene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 7.5, 5.5], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true }}
    >
      <ambientLight intensity={0.7} color="#FFF8F0" />
      <directionalLight
        position={[3, 9, 4]}
        intensity={0.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        color="#FFF5E8"
      />
      <directionalLight position={[-3, 4, -2]} intensity={0.28} color="#E8F0FF" />
      <pointLight position={[0, 1, 3]} intensity={0.22} color="#FFF8E8" />

      <Suspense fallback={null}>
        <Environment preset="apartment" />
      </Suspense>

      <Ground />
      <ClickableGround />   {/* 보이지 않는 클릭 평면 */}
      <ClickRipple />       {/* 클릭 위치 ripple 효과 */}

      <Suspense fallback={null}>
        <HamsterSwarm />
      </Suspense>
      <PoopField />

      <ContactShadows position={[0, 0.01, 0]} opacity={0.35} scale={20} blur={2.5} far={4} />
    </Canvas>
  )
}
