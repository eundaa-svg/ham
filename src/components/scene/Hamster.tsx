import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '../../store/useGameStore'

interface HamsterProps {
  variantId: string
  initialPosition?: [number, number, number]
}

const MODEL_PATH   = '/models/golden_ham.glb'
const BUTT_OFFSET  = 0.6   // 엉덩이까지 거리 (월드 단위)

function pickNewTarget(target: THREE.Vector3) {
  const angle  = Math.random() * Math.PI * 2
  const radius = 1.5 + Math.random() * 3.5
  target.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)
}

// 햄스터 엉덩이 위치 계산 (진행 방향 반대)
function getButtPosition(pos: THREE.Vector3, rotY: number): [number, number, number] {
  return [
    pos.x - Math.sin(rotY) * BUTT_OFFSET,
    0.06,
    pos.z - Math.cos(rotY) * BUTT_OFFSET,
  ]
}

export default function Hamster({ variantId, initialPosition = [0, 0, 0] }: HamsterProps) {
  const { scene } = useGLTF(MODEL_PATH)

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
    console.log('[GLB] 최상위 자식 수:', scene.children.length)
  }, [scene])

  // ── refs ────────────────────────────────────────────────────────
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

      const tp      = path[pathIndexRef.current]
      const nextIdx = Math.min(pathIndexRef.current + 1, path.length - 1)
      const nextTp  = path[nextIdx]

      // 다음 점 방향으로 BUTT_OFFSET만큼 앞선 위치를 목표로 삼음
      // → 엉덩이가 tp 위치를 지날 때 똥이 정확히 경로 위에 찍힘
      const moveDir = new THREE.Vector3(
        nextTp.x - tp.x,
        0,
        nextTp.z - tp.z,
      )
      if (moveDir.length() > 0.001) moveDir.normalize()

      targetVec.current.set(
        tp.x + moveDir.x * BUTT_OFFSET,
        0,
        tp.z + moveDir.z * BUTT_OFFSET,
      )

      dirVec.current.subVectors(targetVec.current, pos)
      dirVec.current.y = 0
      const dist = dirVec.current.length()

      if (dist < 0.15) {
        console.log(`[DEBUG] 점 ${pathIndexRef.current}/${path.length} 도착`)
        stuckTimerRef.current = 0

        // 엉덩이(진행 방향 반대) 위치에 똥 spawn
        const buttPos = getButtPosition(pos, group.rotation.y)
        useGameStore.getState().addPoop({
          id: `poop-${Date.now()}-${Math.random()}`,
          position: buttPos,
          rotation: Math.random() * Math.PI * 2,
          spawnedAt: performance.now(),
        })
        pathIndexRef.current++
        return
      }

      // stuck 타임아웃
      stuckTimerRef.current += delta
      if (stuckTimerRef.current > 2) {
        console.warn(`[DEBUG] stuck! 강제 진행: 점 ${pathIndexRef.current}`)
        const buttPos = getButtPosition(pos, group.rotation.y)
        useGameStore.getState().addPoop({
          id: `poop-stuck-${Date.now()}`,
          position: buttPos,
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
        scale={[8, 8, 8]}
        position={[0, 0.5, 0]}
      />
    </group>
  )
}

useGLTF.preload(MODEL_PATH)
