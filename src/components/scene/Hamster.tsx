import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { HAMSTER_VARIANTS } from '../../lib/hamsterTypes'
import { useGameStore } from '../../store/useGameStore'

interface HamsterProps {
  variantId: string
  initialPosition?: [number, number, number]
}

function pickNewTarget(target: THREE.Vector3) {
  const angle = Math.random() * Math.PI * 2
  const radius = 1.5 + Math.random() * 3.5
  target.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)
}

export default function Hamster({ variantId, initialPosition = [0, 0, 0] }: HamsterProps) {
  const variant = HAMSTER_VARIANTS.find((v) => v.id === variantId) ?? HAMSTER_VARIANTS[0]

  const groupRef   = useRef<THREE.Group>(null!)
  const dirVec     = useRef(new THREE.Vector3())  // 매 프레임 재사용
  const targetVec  = useRef(new THREE.Vector3())

  // wander
  const wanderTarget  = useRef(new THREE.Vector3())
  const isIdleRef     = useRef(false)
  const idleTimerRef  = useRef(0)

  // pooping
  const pathIndexRef  = useRef(0)
  const missionDone   = useRef(false)

  // store 값을 ref로 캐싱 — useFrame 클로저 안에서 항상 최신 값 사용
  const phaseRef = useRef(useGameStore.getState().phase)
  const pathRef  = useRef(useGameStore.getState().computedPath)

  useEffect(() => {
    const unsub = useGameStore.subscribe((s) => {
      phaseRef.current = s.phase
      pathRef.current  = s.computedPath
    })
    return unsub
  }, [])

  // 마운트 시: 초기 위치 + 첫 wander 목적지 설정
  useEffect(() => {
    groupRef.current.position.set(...initialPosition)
    pickNewTarget(wanderTarget.current)
  }, [])

  // phase가 pooping으로 바뀌면 경로 상태 초기화
  useEffect(() => {
    const unsub = useGameStore.subscribe((s) => {
      if (s.phase === 'pooping') {
        pathIndexRef.current = 0
        missionDone.current  = false
        isIdleRef.current    = false
      }
    })
    return unsub
  }, [])

  useFrame((state, delta) => {
    const group = groupRef.current
    if (!group) return
    const pos = group.position
    const t   = state.clock.elapsedTime

    // ══════════ POOPING ══════════════════════════════════════════
    if (phaseRef.current === 'pooping') {
      if (missionDone.current) return

      const path = pathRef.current
      if (pathIndexRef.current >= path.length) {
        // 모든 점 방문 완료
        if (!missionDone.current) {
          missionDone.current = true
          useGameStore.getState().setPhase('completed')
        }
        return
      }

      const tp = path[pathIndexRef.current]
      targetVec.current.set(tp.x, 0, tp.z)
      dirVec.current.subVectors(targetVec.current, pos)
      dirVec.current.y = 0
      const dist = dirVec.current.length()

      if (dist < 0.08) {
        // 도착 → 이 점에 똥 spawn
        useGameStore.getState().addPoop({
          id: `poop-${Date.now()}-${Math.random()}`,
          position: [pos.x, 0.06, pos.z],
          variantId,
          spawnedAt: performance.now(),
        })
        pathIndexRef.current++
        return
      }

      dirVec.current.normalize()
      const speed = 3.5
      pos.x += dirVec.current.x * speed * delta
      pos.z += dirVec.current.z * speed * delta
      pos.y  = Math.abs(Math.sin(t * 12)) * 0.05
      group.rotation.y = Math.atan2(dirVec.current.x, dirVec.current.z)
      return
    }

    // ══════════ WANDER ═══════════════════════════════════════════
    if (isIdleRef.current) {
      idleTimerRef.current -= delta
      pos.y = Math.sin(t * 4) * 0.02
      if (idleTimerRef.current <= 0) {
        isIdleRef.current = false
        pickNewTarget(wanderTarget.current)
      }
      return
    }

    dirVec.current.set(
      wanderTarget.current.x - pos.x,
      0,
      wanderTarget.current.z - pos.z,
    )
    const dist = dirVec.current.length()

    if (dist < 0.1) {
      isIdleRef.current   = true
      idleTimerRef.current = 0.5 + Math.random() * 1.5
      return
    }

    dirVec.current.normalize()
    pos.x += dirVec.current.x * 1.5 * delta
    pos.z += dirVec.current.z * 1.5 * delta
    pos.y  = Math.abs(Math.sin(t * 8)) * 0.06
    group.rotation.y = Math.atan2(dirVec.current.x, dirVec.current.z)
  })

  const { bodyColor, bellyColor, cheekColor, hasPatch } = variant

  return (
    <group ref={groupRef}>
      {/* 몸통 */}
      <RoundedBox args={[1, 0.85, 1.2]} radius={0.3} smoothness={4} position={[0, 0.45, 0]} castShadow>
        <meshStandardMaterial color={bodyColor} roughness={0.7} />
      </RoundedBox>

      {/* 배 */}
      <RoundedBox args={[0.7, 0.4, 0.3]} radius={0.2} smoothness={4} position={[0, 0.3, 0.55]}>
        <meshStandardMaterial color={bellyColor} roughness={0.8} />
      </RoundedBox>

      {/* 귀 왼쪽 */}
      <mesh position={[-0.3, 0.95, -0.3]} scale={[0.18, 0.22, 0.12]}>
        <sphereGeometry args={[1, 10, 10]} />
        <meshStandardMaterial color={bodyColor} roughness={0.8} />
      </mesh>

      {/* 귀 오른쪽 */}
      <mesh position={[0.3, 0.95, -0.3]} scale={[0.18, 0.22, 0.12]}>
        <sphereGeometry args={[1, 10, 10]} />
        <meshStandardMaterial color={bodyColor} roughness={0.8} />
      </mesh>

      {/* 눈 왼쪽 */}
      <mesh position={[-0.18, 0.65, 0.55]} scale={0.06}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} />
      </mesh>

      {/* 눈 오른쪽 */}
      <mesh position={[0.18, 0.65, 0.55]} scale={0.06}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} />
      </mesh>

      {/* 볼 왼쪽 */}
      <mesh position={[-0.32, 0.5, 0.5]} scale={0.12}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color={cheekColor} transparent opacity={0.7} roughness={0.9} />
      </mesh>

      {/* 볼 오른쪽 */}
      <mesh position={[0.32, 0.5, 0.5]} scale={0.12}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color={cheekColor} transparent opacity={0.7} roughness={0.9} />
      </mesh>

      {/* 코 */}
      <mesh position={[0, 0.55, 0.62]} scale={0.05}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#D89090" roughness={0.8} />
      </mesh>

      {/* 삼색이 등 패치 */}
      {hasPatch && (
        <RoundedBox args={[0.5, 0.05, 0.7]} radius={0.05} smoothness={4} position={[0, 0.88, 0]}>
          <meshStandardMaterial color="#FFFFFF" roughness={0.85} />
        </RoundedBox>
      )}
    </group>
  )
}
