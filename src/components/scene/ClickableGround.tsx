import { ThreeEvent } from '@react-three/fiber'
import { useGameStore } from '../../store/useGameStore'

// 보이지 않는 클릭 평면 — 사용자 탭/클릭을 3D 좌표로 변환
export default function ClickableGround() {
  const setUserTarget = useGameStore((s) => s.setUserTarget)
  const phase         = useGameStore((s) => s.phase)

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (phase === 'pooping') return   // 똥 싸는 중엔 무시
    e.stopPropagation()
    const x = Math.max(-4, Math.min(4, e.point.x))
    const z = Math.max(-3, Math.min(3, e.point.z))
    setUserTarget({ x, z })
  }

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.001, 0]}   // Ground보다 살짝 위에
      onClick={handleClick}
    >
      <planeGeometry args={[20, 20]} />
      {/* visible={false}: 보이지 않지만 클릭 감지 */}
      <meshBasicMaterial visible={false} />
    </mesh>
  )
}
