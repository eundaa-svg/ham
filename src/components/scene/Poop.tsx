import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../store/useGameStore'
import { FOOD_VARIANTS } from '../../lib/foodTypes'

interface PoopProps {
  position: [number, number, number]
  rotation: number
  foodId: string
}

export default function Poop({ position, rotation, foodId }: PoopProps) {
  const meshRef   = useRef<THREE.Mesh>(null!)
  const spawnTime = useRef(performance.now())
  const poopSize  = useGameStore((s) => s.poopSize)

  // spawn 시점의 먹이 색 + 미세한 랜덤 변동 — 이후 먹이가 바뀌어도 이 똥 색은 고정
  const poopColor = useMemo(() => {
    const food = FOOD_VARIANTS.find((f) => f.id === foodId)
    const base = new THREE.Color(food?.poopColor ?? '#3A2818')
    const hsl   = { h: 0, s: 0, l: 0 }
    base.getHSL(hsl)
    hsl.l = Math.max(0.05, Math.min(0.55, hsl.l + (Math.random() - 0.5) * 0.08))
    base.setHSL(hsl.h, hsl.s, hsl.l)
    return `#${base.getHexString()}`
  }, [foodId])

  useFrame(() => {
    const elapsed  = (performance.now() - spawnTime.current) / 1000
    const DURATION = 0.25
    if (elapsed < DURATION) {
      const ease = 1 - Math.pow(1 - elapsed / DURATION, 3)
      meshRef.current.scale.set(
        (1.3 - ease * 0.3) * poopSize,
        (0.2 + ease * 0.8) * poopSize,
        (1.3 - ease * 0.3) * poopSize,
      )
    } else {
      meshRef.current.scale.setScalar(poopSize)
    }
  })

  return (
    <mesh ref={meshRef} position={position} rotation={[0.3, rotation, 0]} castShadow>
      <capsuleGeometry args={[0.035, 0.06, 4, 8]} />
      <meshStandardMaterial color={poopColor} roughness={0.85} />
    </mesh>
  )
}
