import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '../../store/useGameStore'

interface HamsterProps {
  variantId: string
  initialPosition?: [number, number, number]
}

const MODEL_PATH = '/models/golden_ham.glb'

function pickNewTarget(target: THREE.Vector3) {
  const angle  = Math.random() * Math.PI * 2
  const radius = 1.5 + Math.random() * 3.5
  target.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)
}

export default function Hamster({ variantId, initialPosition = [0, 0, 0] }: HamsterProps) {
  const { scene } = useGLTF(MODEL_PATH)

  // 여러 인스턴스가 같은 GLB를 공유할 수 있도록 clone
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

  useEffect(() => {
    console.log('[GLB] 모델 로드 완료:', MODEL_PATH)
    console.log('[GLB] scene 객체:', scene)
    console.log('[GLB] 최상위 자식 수:', scene.children.length)
  }, [scene])

  // ── 이동 refs ──────────────────────────────────────────────────
  const groupRef  = useRef<THREE.Group>(null!)
  const dirVec    = useRef(new THREE.Vector3())
  const targetVec = useRef(new THREE.Vector3())

  // wander
  const wanderTarget  = useRef(new THREE.Vector3())
  const isIdleRef     = useRef(false)
  const idleTimerRef  = useRef(0)

  // pooping
  const pathIndexRef  = useRef(0)
  const missionDone   = useRef(false)
  const stuckTimerRef = useRef(0)

  // store 값 ref 캐싱 (useFrame 클로저 문제 방지)
  const phaseRef = useRef(useGameStore.getState().phase)
  const pathRef  = useRef(useGameStore.getState().computedPath)

  useEffect(() => {
    let prevPhase = useGameStore.getState().phase
    const unsub = useGameStore.subscribe((s) => {
      phaseRef.current = s.phase
      pathRef.current  = s.computedPath

      // idle → pooping 전환 순간에만 리셋 (addPoop 때마다 리셋되는 버그 방지)
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

  // 마운트 시 초기 위치 + wander 첫 목적지
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

    // ══ WANDER ═════════════════════════════════════════════════
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
    <group ref={groupRef} position={initialPosition}>
      <primitive
        object={clonedScene}
        scale={[6, 6, 6]}
        position={[0, 0.5, 0]}   // 바닥 묻힘 방지용 y 오프셋
      />
    </group>
  )
}

// 앱 시작 시 미리 로드
useGLTF.preload(MODEL_PATH)
