import { useGameStore } from '../../store/useGameStore'
import Hamster from './Hamster'

// 단일 햄스터만 렌더링 (store.hamsters 배열은 항상 1개)
export default function HamsterSwarm() {
  const hamsters = useGameStore((s) => s.hamsters)

  return (
    <>
      {hamsters.map((h) => (
        <Hamster
          key={h.id}
          variantId={h.variantId}
          initialPosition={h.initialPosition}
        />
      ))}
    </>
  )
}
