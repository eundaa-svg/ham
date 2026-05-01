import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// 모든 똥은 동일한 진한 브라운 (실제 햄스터 똥 색)
const POOP_COLOR = '#3A2818'

interface PoopProps {
  position: [number, number, number]
  rotation: number   // Y축 랜덤 회전 (spawn 시 결정)
}

export default function Poop({ position, rotation }: PoopProps) {
  const meshRef  = useRef<THREE.Mesh>(null!)
  const spawnTime = useRef(performance.now())

  useFrame(() => {
    const elapsed  = (performance.now() - spawnTime.current) / 1000
    const DURATION = 0.25

    if (elapsed < DURATION) {
      const t    = elapsed / DURATION
      const ease = 1 - Math.pow(1 - t, 3)   // ease-out cubic
      // squash: 납작 → 정상 크기
      meshRef.current.scale.set(1.3 - ease * 0.3, 0.2 + ease * 0.8, 1.3 - ease * 0.3)
    } else {
      meshRef.current.scale.setScalar(1)
    }
  })

  return (
    // 쌀알 모양: 약간 기울어진 타원형, Y축 랜덤 회전으로 자연스러움
    <mesh
      ref={meshRef}
      position={position}
      rotation={[0.3, rotation, 0]}   // 살짝 앞으로 기울임 + 랜덤 Y 회전
      castShadow
    >
      <capsuleGeometry args={[0.035, 0.06, 4, 8]} />
      <meshStandardMaterial color={POOP_COLOR} roughness={0.85} />
    </mesh>
  )
}
