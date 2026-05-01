import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../store/useGameStore'

export default function ClickRipple() {
  const userTarget = useGameStore((s) => s.userTarget)

  const ringRef      = useRef<THREE.Mesh>(null!)
  const matRef       = useRef<THREE.MeshBasicMaterial>(null!)
  const [pos, setPos] = useState<{ x: number; z: number } | null>(null)
  const startTime    = useRef(0)
  const prevTarget   = useRef<typeof userTarget>(null)

  useEffect(() => {
    // userTarget이 새로 설정될 때만 ripple 시작
    if (userTarget && userTarget !== prevTarget.current) {
      setPos({ x: userTarget.x, z: userTarget.z })
      startTime.current = performance.now()
    }
    prevTarget.current = userTarget
  }, [userTarget])

  useFrame(() => {
    if (!pos || !ringRef.current || !matRef.current) return
    const elapsed = (performance.now() - startTime.current) / 1000
    const DURATION = 0.55

    if (elapsed >= DURATION) {
      matRef.current.opacity = 0
      return
    }

    const t = elapsed / DURATION
    const scale   = 0.2 + t * 1.8
    const opacity = (1 - t) * 0.7

    ringRef.current.scale.set(scale, scale, scale)
    matRef.current.opacity = opacity
  })

  if (!pos) return null

  return (
    <mesh
      ref={ringRef}
      position={[pos.x, 0.02, pos.z]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <ringGeometry args={[0.2, 0.28, 32]} />
      <meshBasicMaterial
        ref={matRef}
        color="#F26B5E"
        transparent
        opacity={0.7}
        depthWrite={false}
      />
    </mesh>
  )
}
