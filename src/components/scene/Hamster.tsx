import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '../../store/useGameStore'
import { HAMSTER_VARIANTS } from '../../lib/hamsterTypes'

interface HamsterProps {
  variantId: string
  initialPosition?: [number, number, number]
}

function pickNewTarget(target: THREE.Vector3) {
  const angle  = Math.random() * Math.PI * 2
  const radius = 1.5 + Math.random() * 3.5
  target.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)
}

// 각도를 -PI ~ PI 범위로 정규화 (항상 짧은 방향으로 회전)
function normalizeAngle(angle: number): number {
  while (angle > Math.PI)  angle -= Math.PI * 2
  while (angle < -Math.PI) angle += Math.PI * 2
  return angle
}

// 부드러운 Y축 회전 적용
function smoothRotateY(group: THREE.Group, targetAngle: number, speed: number, delta: number) {
  const diff = normalizeAngle(targetAngle - group.rotation.y)
  group.rotation.y += diff * Math.min(1, speed * delta)
}

function HamsterModel({ modelPath }: { modelPath: string }) {
  const { scene } = useGLTF(modelPath)

  const clonedScene = useMemo(() => {
    const cloned = scene.clone(true)
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow    = true
        child.receiveShadow = true
      }
    })
    return cloned
  }, [scene])

  return (
    <primitive
      object={clonedScene}
      scale={[8, 8, 8]}
      position={[0, 0.5, 0]}
    />
  )
}

export default function Hamster({ variantId, initialPosition = [0, 0, 0] }: HamsterProps) {
  const variant = HAMSTER_VARIANTS.find((v) => v.id === variantId) ?? HAMSTER_VARIANTS[0]

  const groupRef  = useRef<THREE.Group>(null!)
  const dirVec    = useRef(new THREE.Vector3())
  const targetVec = useRef(new THREE.Vector3())
  const velocityRef = useRef(new THREE.Vector3())  // 관성용 속도 벡터

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
        velocityRef.current.set(0, 0, 0)
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

    // ══ POOPING ════════════════════════════════════════════════
    if (phaseRef.current === 'pooping') {
      if (missionDone.current) return

      const path = pathRef.current
      if (pathIndexRef.current >= path.length) {
        console.log('[DEBUG] 모든 점 방문 완료! 총:', path.length)
        missionDone.current = true
        velocityRef.current.set(0, 0, 0)
        useGameStore.getState().setPhase('completed')
        return
      }

      const tp = path[pathIndexRef.current]
      targetVec.current.set(tp.x, 0, tp.z)
      dirVec.current.subVectors(targetVec.current, pos)
      dirVec.current.y = 0
      const dist = dirVec.current.length()

      // stuck 타임아웃 (3초)
      stuckTimerRef.current += delta
      if (stuckTimerRef.current > 3) {
        console.warn(`[DEBUG] stuck! 강제 진행: 점 ${pathIndexRef.current}`)
        useGameStore.getState().addPoop({
          id: `poop-stuck-${Date.now()}`,
          position: [tp.x, 0.06, tp.z],
          rotation: Math.random() * Math.PI * 2,
          spawnedAt: performance.now(),
        })
        pathIndexRef.current++
        stuckTimerRef.current = 0
        return
      }

      // 도착
      if (dist < 0.10) {
        console.log(`[DEBUG] 점 ${pathIndexRef.current}/${path.length} 도착`)
        stuckTimerRef.current = 0
        useGameStore.getState().addPoop({
          id: `poop-${Date.now()}-${Math.random()}`,
          position: [tp.x, 0.06, tp.z],
          rotation: Math.random() * Math.PI * 2,
          spawnedAt: performance.now(),
        })
        pathIndexRef.current++
        return
      }

      // 이동 — 관성 적용, y 고정
      dirVec.current.normalize()
      const targetVel = dirVec.current.clone().multiplyScalar(2.0)
      velocityRef.current.lerp(targetVel, Math.min(1, 8 * delta))
      pos.x += velocityRef.current.x * delta
      pos.z += velocityRef.current.z * delta
      // pos.y 건드리지 않음 (바닥 고정)

      // 부드러운 회전
      smoothRotateY(group, Math.atan2(dirVec.current.x, dirVec.current.z), 10, delta)

      // 이동 중 좌우 워들 (y 방향 아닌 z축 회전)
      group.rotation.z = Math.sin(t * 14) * 0.04
      return
    }

    // ══ WANDER ═════════════════════════════════════════════════
    if (isIdleRef.current) {
      idleTimerRef.current -= delta
      velocityRef.current.lerp(new THREE.Vector3(0, 0, 0), Math.min(1, 6 * delta))
      group.rotation.z = 0   // 멈추면 워들 제거
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

    // 이동 — 관성 적용, y 고정
    dirVec.current.normalize()
    const targetVel = dirVec.current.clone().multiplyScalar(1.5)
    velocityRef.current.lerp(targetVel, Math.min(1, 6 * delta))
    pos.x += velocityRef.current.x * delta
    pos.z += velocityRef.current.z * delta
    // pos.y 건드리지 않음

    // 부드러운 회전
    smoothRotateY(group, Math.atan2(dirVec.current.x, dirVec.current.z), 8, delta)

    // 이동 중 좌우 워들
    group.rotation.z = Math.sin(t * 12) * 0.035
  })

  return (
    <group ref={groupRef} position={initialPosition}>
      <HamsterModel modelPath={variant.modelPath} />
    </group>
  )
}

HAMSTER_VARIANTS.forEach((v) => useGLTF.preload(v.modelPath))
