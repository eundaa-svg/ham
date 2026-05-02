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

function normalizeAngle(angle: number): number {
  while (angle > Math.PI)  angle -= Math.PI * 2
  while (angle < -Math.PI) angle += Math.PI * 2
  return angle
}

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
  return <primitive object={clonedScene} scale={[8, 8, 8]} position={[0, 0.5, 0]} />
}

export default function Hamster({ variantId, initialPosition = [0, 0, 0] }: HamsterProps) {
  const variant = HAMSTER_VARIANTS.find((v) => v.id === variantId) ?? HAMSTER_VARIANTS[0]

  const groupRef    = useRef<THREE.Group>(null!)
  const dirVec      = useRef(new THREE.Vector3())
  const targetVec   = useRef(new THREE.Vector3())
  const velocityRef = useRef(new THREE.Vector3())

  const wanderTarget  = useRef(new THREE.Vector3())
  const isIdleRef     = useRef(false)
  const idleTimerRef  = useRef(0)

  const pathIndexRef  = useRef(0)
  const missionDone   = useRef(false)
  const stuckTimerRef = useRef(0)

  // userTarget 관련 refs
  const userTargetRef    = useRef<{ x: number; z: number } | null>(null)
  const jumpStartRef     = useRef(-1)   // -1이면 점프 없음

  const phaseRef = useRef(useGameStore.getState().phase)
  const pathRef  = useRef(useGameStore.getState().computedPath)

  useEffect(() => {
    let prevPhase = useGameStore.getState().phase
    let prevUserTarget = useGameStore.getState().userTarget

    const unsub = useGameStore.subscribe((s) => {
      phaseRef.current = s.phase
      pathRef.current  = s.computedPath

      // pooping 전환 시 리셋
      if (s.phase === 'pooping' && prevPhase !== 'pooping') {
        console.log('[DEBUG] pooping 시작, 경로 점 수:', s.computedPath.length)
        pathIndexRef.current  = 0
        missionDone.current   = false
        isIdleRef.current     = false
        stuckTimerRef.current = 0
        velocityRef.current.set(0, 0, 0)
        userTargetRef.current = null
        if (s.computedPath.length > 0 && groupRef.current) {
          const fp = s.computedPath[0]
          groupRef.current.position.set(fp.x - 0.3, 0, fp.z - 0.3)
        }
      }
      prevPhase = s.phase

      // userTarget 새로 설정되면 ref 갱신 + 점프 트리거
      if (s.userTarget !== prevUserTarget && s.userTarget !== null) {
        userTargetRef.current = s.userTarget
        jumpStartRef.current  = performance.now()
        isIdleRef.current     = false   // idle 중단하고 바로 출발
      }
      if (s.userTarget === null) {
        userTargetRef.current = null
      }
      prevUserTarget = s.userTarget
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
          position: [pos.x, 0.06, pos.z],   // 햄스터 현재 위치
          rotation: Math.random() * Math.PI * 2,
          foodId: useGameStore.getState().selectedFoodId,
          spawnedAt: performance.now(),
        })
        pathIndexRef.current++
        stuckTimerRef.current = 0
        return
      }

      // 도착
      if (dist < 0.08) {
        stuckTimerRef.current = 0
        useGameStore.getState().addPoop({
          id: `poop-${Date.now()}-${Math.random()}`,
          position: [pos.x, 0.06, pos.z],   // 햄스터 현재 위치
          rotation: Math.random() * Math.PI * 2,
          foodId: useGameStore.getState().selectedFoodId,
          spawnedAt: performance.now(),
        })
        pathIndexRef.current++
        return
      }

      dirVec.current.normalize()
      velocityRef.current.lerp(dirVec.current.clone().multiplyScalar(2.0), Math.min(1, 8 * delta))
      pos.x += velocityRef.current.x * delta
      pos.z += velocityRef.current.z * delta
      smoothRotateY(group, Math.atan2(dirVec.current.x, dirVec.current.z), 10, delta)
      group.rotation.z = Math.sin(t * 14) * 0.04
      return
    }

    // ══ USER TARGET (사용자 클릭 이동) ═════════════════════════
    const ut = userTargetRef.current
    if (ut !== null) {
      dirVec.current.set(ut.x - pos.x, 0, ut.z - pos.z)
      const dist = dirVec.current.length()

      if (dist < 0.15) {
        // 도착 → userTarget 클리어, wander 복귀
        useGameStore.getState().setUserTarget(null)
        userTargetRef.current = null
        isIdleRef.current     = false
        pickNewTarget(wanderTarget.current)
        velocityRef.current.set(0, 0, 0)
        group.rotation.z = 0
        return
      }

      dirVec.current.normalize()
      velocityRef.current.lerp(dirVec.current.clone().multiplyScalar(2.0), Math.min(1, 6 * delta))
      pos.x += velocityRef.current.x * delta
      pos.z += velocityRef.current.z * delta

      // 클릭 직후 살짝 점프
      const jumpElapsed = jumpStartRef.current >= 0
        ? (performance.now() - jumpStartRef.current) / 1000
        : 999
      pos.y = jumpElapsed < 0.3 ? Math.sin(jumpElapsed / 0.3 * Math.PI) * 0.1 : 0

      smoothRotateY(group, Math.atan2(dirVec.current.x, dirVec.current.z), 10, delta)
      group.rotation.z = Math.sin(t * 14) * 0.05
      return
    }

    // ══ WANDER ═════════════════════════════════════════════════
    if (isIdleRef.current) {
      idleTimerRef.current -= delta
      velocityRef.current.lerp(new THREE.Vector3(0, 0, 0), Math.min(1, 6 * delta))
      group.rotation.z = 0
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
    velocityRef.current.lerp(dirVec.current.clone().multiplyScalar(1.5), Math.min(1, 6 * delta))
    pos.x += velocityRef.current.x * delta
    pos.z += velocityRef.current.z * delta
    pos.y  = 0
    smoothRotateY(group, Math.atan2(dirVec.current.x, dirVec.current.z), 8, delta)
    group.rotation.z = Math.sin(t * 12) * 0.035
  })

  return (
    <group ref={groupRef} position={initialPosition}>
      <HamsterModel modelPath={variant.modelPath} />
    </group>
  )
}

HAMSTER_VARIANTS.forEach((v) => useGLTF.preload(v.modelPath))
