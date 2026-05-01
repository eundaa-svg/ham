import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// 햄스터별 똥 색 (조금씩 다름)
const POOP_COLORS: Record<string, string> = {
  gray:     '#4A3520',
  beige:    '#5C3D1E',
  brown:    '#3D2817',
  white:    '#5A4226',
  tricolor: '#3A2818',
}

interface PoopProps {
  position: [number, number, number]
  variantId: string
}

export default function Poop({ position, variantId }: PoopProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const spawnTime = useRef(performance.now())

  useFrame(() => {
    const elapsed = (performance.now() - spawnTime.current) / 1000
    const DURATION = 0.3

    if (elapsed < DURATION) {
      // ease-out cubic
      const t = elapsed / DURATION
      const ease = 1 - Math.pow(1 - t, 3)
      // spawn 시 납작하게 → 원래 크기로 늘어남 (squash)
      meshRef.current.scale.set(1.2 - ease * 0.2, 0.3 + ease * 0.7, 1.2 - ease * 0.2)
    } else {
      meshRef.current.scale.setScalar(1)
    }
  })

  const color = POOP_COLORS[variantId] ?? '#4A3520'

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <capsuleGeometry args={[0.06, 0.08, 4, 8]} />
      <meshStandardMaterial color={color} roughness={0.7} />
    </mesh>
  )
}
