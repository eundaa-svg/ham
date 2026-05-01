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

// ── 메쉬: 네모난 박스형 인형 햄스터 ────────────────────────────────
function HamsterMesh({ variant }: { variant: (typeof HAMSTER_VARIANTS)[0] }) {
  const { bodyColor, bellyColor, faceColor, hasPatch } = variant

  return (
    <>
      {/* 바디 — 큰 둥근 박스 */}
      <RoundedBox
        args={[1.0, 0.95, 1.15]}
        radius={0.35}
        smoothness={6}
        position={[0, 0.5, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={bodyColor} roughness={0.95} metalness={0} />
      </RoundedBox>

      {/* 얼굴 면 — 앞쪽에 살짝 밝은 패널 */}
      <RoundedBox
        args={[0.82, 0.68, 0.05]}
        radius={0.3}
        smoothness={4}
        position={[0, 0.58, 0.6]}
      >
        <meshStandardMaterial color={faceColor} roughness={0.95} metalness={0} />
      </RoundedBox>

      {/* 배 */}
      <RoundedBox
        args={[0.65, 0.46, 0.05]}
        radius={0.22}
        smoothness={4}
        position={[0, 0.24, 0.6]}
      >
        <meshStandardMaterial color={bellyColor} roughness={0.95} metalness={0} />
      </RoundedBox>

      {/* 귀 왼쪽 바깥 */}
      <mesh position={[-0.34, 1.0, 0.08]} rotation={[0.1, 0, -0.15]} castShadow>
        <sphereGeometry args={[0.17, 16, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.95} metalness={0} />
      </mesh>
      {/* 귀 왼쪽 안쪽 (분홍) */}
      <mesh position={[-0.33, 1.0, 0.18]} rotation={[0.1, 0, -0.15]}>
        <sphereGeometry args={[0.10, 12, 12]} />
        <meshStandardMaterial color="#F4A8A8" roughness={0.9} metalness={0} />
      </mesh>

      {/* 귀 오른쪽 바깥 */}
      <mesh position={[0.34, 1.0, 0.08]} rotation={[0.1, 0, 0.15]} castShadow>
        <sphereGeometry args={[0.17, 16, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.95} metalness={0} />
      </mesh>
      {/* 귀 오른쪽 안쪽 (분홍) */}
      <mesh position={[0.33, 1.0, 0.18]} rotation={[0.1, 0, 0.15]}>
        <sphereGeometry args={[0.10, 12, 12]} />
        <meshStandardMaterial color="#F4A8A8" roughness={0.9} metalness={0} />
      </mesh>

      {/* 눈 왼쪽 */}
      <mesh position={[-0.22, 0.65, 0.66]}>
        <sphereGeometry args={[0.075, 16, 16]} />
        <meshStandardMaterial color="#181818" roughness={0.2} metalness={0.4} />
      </mesh>
      {/* 눈 왼쪽 하이라이트 */}
      <mesh position={[-0.20, 0.675, 0.725]}>
        <sphereGeometry args={[0.024, 8, 8]} />
        <meshStandardMaterial
          color="#FFFFFF"
          roughness={0.05}
          emissive="#FFFFFF"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* 눈 오른쪽 */}
      <mesh position={[0.22, 0.65, 0.66]}>
        <sphereGeometry args={[0.075, 16, 16]} />
        <meshStandardMaterial color="#181818" roughness={0.2} metalness={0.4} />
      </mesh>
      {/* 눈 오른쪽 하이라이트 */}
      <mesh position={[0.24, 0.675, 0.725]}>
        <sphereGeometry args={[0.024, 8, 8]} />
        <meshStandardMaterial
          color="#FFFFFF"
          roughness={0.05}
          emissive="#FFFFFF"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* 코 */}
      <mesh position={[0, 0.485, 0.71]}>
        <sphereGeometry args={[0.052, 12, 12]} />
        <meshStandardMaterial color="#D88080" roughness={0.65} metalness={0} />
      </mesh>

      {/* 입 주변 흰 부분 */}
      <RoundedBox
        args={[0.26, 0.17, 0.03]}
        radius={0.08}
        smoothness={4}
        position={[0, 0.385, 0.67]}
      >
        <meshStandardMaterial color="#FFFAF5" roughness={0.95} metalness={0} />
      </RoundedBox>

      {/* 볼 왼쪽 (반투명 분홍) */}
      <mesh position={[-0.36, 0.50, 0.56]}>
        <sphereGeometry args={[0.13, 12, 12]} />
        <meshStandardMaterial
          color="#F5C0BC"
          roughness={0.95}
          transparent
          opacity={0.45}
        />
      </mesh>
      {/* 볼 오른쪽 */}
      <mesh position={[0.36, 0.50, 0.56]}>
        <sphereGeometry args={[0.13, 12, 12]} />
        <meshStandardMaterial
          color="#F5C0BC"
          roughness={0.95}
          transparent
          opacity={0.45}
        />
      </mesh>

      {/* 삼색이 등 패치 */}
      {hasPatch && (
        <RoundedBox
          args={[0.55, 0.05, 0.68]}
          radius={0.1}
          smoothness={4}
          position={[0, 0.98, -0.08]}
        >
          <meshStandardMaterial color="#FFFFFF" roughness={0.95} metalness={0} />
        </RoundedBox>
      )}
    </>
  )
}

// ── 이동 로직 ────────────────────────────────────────────────────
export default function Hamster({ variantId, initialPosition = [0, 0, 0] }: HamsterProps) {
  const variant = HAMSTER_VARIANTS.find((v) => v.id === variantId) ?? HAMSTER_VARIANTS[0]

  const groupRef  = useRef<THREE.Group>(null!)
  const dirVec    = useRef(new THREE.Vector3())
  const targetVec = useRef(new THREE.Vector3())

  const wanderTarget  = useRef(new THREE.Vector3())
  const isIdleRef     = useRef(false)
  const idleTimerRef  = useRef(0)

  const pathIndexRef  = useRef(0)
  const missionDone   = useRef(false)
  const stuckTimerRef = useRef(0)

  const phaseRef = useRef(useGameStore.getState().phase)
  const pathRef  = useRef(useGameStore.getState().computedPath)

  useEffect(() => {
    let prevPhase = useGameStore.getState().phase
    const unsub = useGameStore.subscribe((s) => {
      phaseRef.current = s.phase
      pathRef.current  = s.computedPath

      if (s.phase === 'pooping' && prevPhase !== 'pooping') {
        console.log('[DEBUG] pooping 시작, 경로 점 수:', s.computedPath.length)
        pathIndexRef.current  = 0
        missionDone.current   = false
        isIdleRef.current     = false
        stuckTimerRef.current = 0
        if (s.computedPath.length > 0 && groupRef.current) {
          const fp = s.computedPath[0]
          groupRef.current.position.set(fp.x - 0.3, 0, fp.z - 0.3)
        }
      }
      prevPhase = s.phase
    })
    return unsub
  }, [])

  useEffect(() => {
    groupRef.current.position.set(...initialPosition)
    pickNewTarget(wanderTarget.current)
  }, [])

  useFrame((state, delta) => {
    const group = groupRef.current
    if (!group) return
    const pos = group.position
    const t   = state.clock.elapsedTime

    // ══ POOPING ══════════════════════════════════════════════════
    if (phaseRef.current === 'pooping') {
      if (missionDone.current) return

      const path = pathRef.current
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

      dirVec.current.normalize()
      pos.x += dirVec.current.x * 2.5 * delta
      pos.z += dirVec.current.z * 2.5 * delta
      pos.y  = Math.abs(Math.sin(t * 12)) * 0.04
      group.rotation.y = Math.atan2(dirVec.current.x, dirVec.current.z)
      return
    }

    // ══ WANDER ════════════════════════════════════════════════════
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
    pos.y  = Math.abs(Math.sin(t * 8)) * 0.05
    group.rotation.y = Math.atan2(dirVec.current.x, dirVec.current.z)
  })

  return (
    <group ref={groupRef} scale={[0.5, 0.5, 0.5]}>
      <HamsterMesh variant={variant} />
    </group>
  )
}
