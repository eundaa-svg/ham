import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { HAMSTER_VARIANTS } from '../../lib/hamsterTypes'
import { useGameStore } from '../../store/useGameStore'

interface HamsterProps {
  hamsterId: string
  variantId: string
  initialPosition?: [number, number, number]
}

// 바닥 원 반경 안에서 랜덤 wander target 선택
function pickNewTarget(target: THREE.Vector3) {
  const angle = Math.random() * Math.PI * 2
  const radius = Math.random() * 5.5
  target.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)
}

export default function Hamster({ hamsterId, variantId, initialPosition = [0, 0, 0] }: HamsterProps) {
  const variant = HAMSTER_VARIANTS.find((v) => v.id === variantId) ?? HAMSTER_VARIANTS[0]

  // ── 씬 refs ──────────────────────────────────────────────────
  const groupRef = useRef<THREE.Group>(null!)
  // 매 프레임 Vector3 할당 방지용 pre-allocated 벡터
  const dirVec = useRef(new THREE.Vector3())
  const targetVec = useRef(new THREE.Vector3())

  // ── wander 상태 refs ─────────────────────────────────────────
  const wanderTarget = useRef(new THREE.Vector3())
  const isIdleRef = useRef(false)
  const idleTimerRef = useRef(0)

  // ── pooping 상태 refs ────────────────────────────────────────
  const pathIndexRef = useRef(0)      // 현재 향하는 점 (내 담당 인덱스 내 위치)
  const stepsSincePoop = useRef(0)    // 마지막 똥 이후 도착한 점 수
  const missionDone = useRef(false)   // 내 구간을 다 돌았는지

  // ── store 구독 (ref 캐싱으로 useFrame 내 클로저 문제 방지) ──
  const phaseRef = useRef(useGameStore.getState().phase)
  const pathRef = useRef(useGameStore.getState().computedPath)
  const assignRef = useRef(useGameStore.getState().hamsterAssignments)

  useEffect(() => {
    // store 변경을 ref에 동기화 (구독)
    const unsub = useGameStore.subscribe((s) => {
      phaseRef.current = s.phase
      pathRef.current = s.computedPath
      assignRef.current = s.hamsterAssignments
    })
    return unsub
  }, [])

  // addPoop / reportHamsterDone은 렌더와 무관하므로 직접 getState() 사용
  const addPoop = () => {
    const pos = groupRef.current.position
    useGameStore.getState().addPoop({
      id: `poop-${Date.now()}-${Math.random()}`,
      position: [pos.x, 0.06, pos.z],
      variantId,
      spawnedAt: performance.now(),
    })
  }

  // ── 마운트 시 초기 위치 + wander 목적지 설정 ─────────────────
  useEffect(() => {
    groupRef.current.position.set(...initialPosition)
    pickNewTarget(wanderTarget.current)
  }, [])

  // ── phase가 pooping으로 바뀔 때 pooping 상태 초기화 ──────────
  useEffect(() => {
    const unsub = useGameStore.subscribe((s) => {
      if (s.phase === 'pooping') {
        pathIndexRef.current = 0
        stepsSincePoop.current = 0
        missionDone.current = false
        isIdleRef.current = false
      }
    })
    return unsub
  }, [])

  // ── 매 프레임 업데이트 ────────────────────────────────────────
  useFrame((state, delta) => {
    const group = groupRef.current
    if (!group) return
    const pos = group.position
    const t = state.clock.elapsedTime

    if (phaseRef.current === 'pooping') {
      // ═══ POOPING 모드 ═══════════════════════════════════════
      if (missionDone.current) return

      const myIndices = assignRef.current[hamsterId] ?? []
      if (myIndices.length === 0) {
        missionDone.current = true
        useGameStore.getState().reportHamsterDone()
        return
      }

      if (pathIndexRef.current >= myIndices.length) {
        if (!missionDone.current) {
          missionDone.current = true
          useGameStore.getState().reportHamsterDone()
        }
        return
      }

      const globalIdx = myIndices[pathIndexRef.current]
      const targetPoint = pathRef.current[globalIdx]
      if (!targetPoint) { pathIndexRef.current++; return }

      // 목적지 벡터 설정
      targetVec.current.set(targetPoint.x, 0, targetPoint.z)
      dirVec.current.subVectors(targetVec.current, pos)
      dirVec.current.y = 0
      const distance = dirVec.current.length()

      if (distance < 0.1) {
        // 도착 → 똥 여부 결정
        stepsSincePoop.current++
        const POOP_EVERY = 2 // N점마다 1번
        if (stepsSincePoop.current >= POOP_EVERY) {
          addPoop()
          stepsSincePoop.current = 0
        }
        pathIndexRef.current++
        return
      }

      // pooping 중 이동 (wander보다 약간 빠름)
      dirVec.current.normalize()
      const speed = 2.5
      pos.x += dirVec.current.x * speed * delta
      pos.z += dirVec.current.z * speed * delta
      pos.y = Math.abs(Math.sin(t * 10)) * 0.06
      group.rotation.y = Math.atan2(dirVec.current.x, dirVec.current.z)
    } else {
      // ═══ WANDER 모드 ════════════════════════════════════════
      if (isIdleRef.current) {
        // 대기 중: 살짝 흔들림
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
        wanderTarget.current.z - pos.z
      )
      const distance = dirVec.current.length()

      if (distance < 0.1) {
        isIdleRef.current = true
        idleTimerRef.current = 0.5 + Math.random() * 1.5
        return
      }

      dirVec.current.normalize()
      const speed = 1.5
      pos.x += dirVec.current.x * speed * delta
      pos.z += dirVec.current.z * speed * delta
      pos.y = Math.abs(Math.sin(t * 8)) * 0.06
      group.rotation.y = Math.atan2(dirVec.current.x, dirVec.current.z)
    }
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
