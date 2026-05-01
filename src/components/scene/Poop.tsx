import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../store/useGameStore'

const POOP_COLOR = '#3A2818'

interface PoopProps {
  position: [number, number, number]
  rotation: number
}

export default function Poop({ position, rotation }: PoopProps) {
  const meshRef   = useRef<THREE.Mesh>(null!)
  const spawnTime = useRef(performance.now())

  // poopSize를 구독 — 슬라이더 변경 시 이미 spawn된 똥도 즉시 반영
  const poopSize = useGameStore((s) => s.poopSize)

  useFrame(() => {
    const elapsed  = (performance.now() - spawnTime.current) / 1000
    const DURATION = 0.25

    if (elapsed < DURATION) {
      const t    = elapsed / DURATION
      const ease = 1 - Math.pow(1 - t, 3)
      // squash 애니메이션 + poopSize 배율 적용
      const sx = (1.3 - ease * 0.3) * poopSize
      const sy = (0.2 + ease * 0.8) * poopSize
      meshRef.current.scale.set(sx, sy, sx)
    } else {
      meshRef.current.scale.setScalar(poopSize)
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={[0.3, rotation, 0]}
      castShadow
    >
      <capsuleGeometry args={[0.035, 0.06, 4, 8]} />
      <meshStandardMaterial color={POOP_COLOR} roughness={0.85} />
    </mesh>
  )
}
