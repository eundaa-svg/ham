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
  const angle  = Math.random() * Math.PI * 2
  const radius = 1.5 + Math.random() * 3.5
  target.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)
}

export default function Hamster({ variantId, initialPosition = [0, 0, 0] }: HamsterProps) {
  const variant = HAMSTER_VARIANTS.find((v) => v.id === variantId) ?? HAMSTER_VARIANTS[0]

  const groupRef  = useRef<THREE.Group>(null!)
  const dirVec    = useRef(new THREE.Vector3())
  const targetVec = useRef(new THREE.Vector3())

  // wander refs
  const wanderTarget   = useRef(new THREE.Vector3())
  const isIdleRef      = useRef(false)
  const idleTimerRef   = useRef(0)

  // pooping refs
  const pathIndexRef   = useRef(0)
  const missionDone    = useRef(false)
  const stuckTimerRef  = useRef(0)   // stuck 감지용

  // store 캐시 refs — useFrame 클로저 안에서 항상 최신 값 접근
  const phaseRef = useRef(useGameStore.getState().phase)
  const pathRef  = useRef(useGameStore.getState().computedPath)

  useEffect(() => {
    // 이전 phase를 추적해서 'pooping'으로 전환될 때만 리셋
    // ⚠️ 핵심 수정: addPoop 등 store 업데이트마다 리셋되는 버그 방지
    let prevPhase = useGameStore.getState().phase

    const unsub = useGameStore.subscribe((s) => {
      phaseRef.current = s.phase
      pathRef.current  = s.computedPath

      // idle/completed → pooping 전환 순간에만 경로 상태 초기화
      if (s.phase === 'pooping' && prevPhase !== 'pooping') {
        console.log('[DEBUG] pooping 시작, 경로 점 수:', s.computedPath.length)
        pathIndexRef.current  = 0
        missionDone.current   = false
        isIdleRef.current     = false
        stuckTimerRef.current = 0

        // 햄스터를 경로 첫 점 근처로 텔레포트
        if (s.computedPath.length > 0 && groupRef.current) {
          const fp = s.computedPath[0]
          groupRef.current.position.set(fp.x - 0.3, 0, fp.z - 0.3)
        }
      }

      prevPhase = s.phase
    })
    return unsub
  }, [])

  // 마운트 시: 초기 위치 + 첫 wander 목적지 설정
  useEffect(() => {
    groupRef.current.position.set(...initialPosition)
    pickNewTarget(wanderTarget.current)
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

      // 모든 점 방문 완료
      if (pathIndexRef.current >= path.length) {
        console.log('[DEBUG] 모든 점 방문 완료! 총:', path.length)
        missionDone.current = true
        useGameStore.getState().setPhase('completed')
        return
      }

      const tp = path[pathIndexRef.current]
      targetVec.current.set(tp.x, 0, tp.z)
      dirVec.current.subVectors(targetVec.current, pos)
      dirVec.current.y = 0
      const dist = dirVec.current.length()

      // 도착 판정 (0.08 → 0.15로 완화)
      if (dist < 0.15) {
        console.log(`[DEBUG] 점 ${pathIndexRef.current}/${path.length} 도착`)
        stuckTimerRef.current = 0

        useGameStore.getState().addPoop({
          id: `poop-${Date.now()}-${Math.random()}`,
          position: [pos.x, 0.06, pos.z],
          rotation: Math.random() * Math.PI * 2,
          spawnedAt: performance.now(),
        })
        pathIndexRef.current++
        return
      }

      // stuck 타임아웃: 2초 이상 한 점에 못 가면 강제 진행
      stuckTimerRef.current += delta
      if (stuckTimerRef.current > 2) {
        console.warn(`[DEBUG] stuck! 강제 진행: 점 ${pathIndexRef.current}`)
        useGameStore.getState().addPoop({
          id: `poop-stuck-${Date.now()}`,
          position: [pos.x, 0.06, pos.z],
          rotation: Math.random() * Math.PI * 2,
          spawnedAt: performance.now(),
        })
        pathIndexRef.current++
        stuckTimerRef.current = 0
        return
      }

      // 목적지를 향해 이동
      dirVec.current.normalize()
      const speed = 2.5
      pos.x += dirVec.current.x * speed * delta
      pos.z += dirVec.current.z * speed * delta
      pos.y  = Math.abs(Math.sin(t * 12)) * 0.04
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
      isIdleRef.current    = true
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

  // scale={0.5}: 전체 크기를 절반으로 축소
  return (
    <group ref={groupRef} scale={[0.5, 0.5, 0.5]}>
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
