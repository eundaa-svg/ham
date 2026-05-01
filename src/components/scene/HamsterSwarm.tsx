import { useGameStore } from '../../store/useGameStore'
import Hamster from './Hamster'

export default function HamsterSwarm() {
  const hamsters = useGameStore((s) => s.hamsters)

  return (
    <>
      {hamsters.map((h) => (
        <Hamster
          key={h.id}
          hamsterId={h.id}
          variantId={h.variantId}
          initialPosition={h.initialPosition}
        />
      ))}
    </>
  )
}
