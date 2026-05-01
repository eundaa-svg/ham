import { Canvas } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import { Suspense } from 'react'
import Ground from './Ground'
import HamsterSwarm from './HamsterSwarm'
import PoopField from './PoopField'

export default function Scene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 7, 6], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true }}
    >
      {/* 부드러운 기본 환경광 */}
      <ambientLight intensity={0.75} color="#FFF8F0" />

      {/* 메인 디렉셔널 라이트 — 위 앞쪽에서 */}
      <directionalLight
        position={[3, 8, 5]}
        intensity={0.9}
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

      {/* 보조 라이트 — 반대편에서 약하게 (림 라이트 효과) */}
      <directionalLight
        position={[-3, 4, -2]}
        intensity={0.28}
        color="#E8F0FF"
      />

      {/* 아래쪽 fill light — 얼굴 음영 완화 */}
      <pointLight
        position={[0, 1, 3]}
        intensity={0.22}
        color="#FFF8E8"
      />

      {/* 환경 반사광 */}
      <Suspense fallback={null}>
        <Environment preset="apartment" />
      </Suspense>

      <Ground />
      <HamsterSwarm />
      <PoopField />

      {/* 발 밑 부드러운 그림자 */}
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.35}
        scale={20}
        blur={2.5}
        far={4}
      />
    </Canvas>
  )
}
