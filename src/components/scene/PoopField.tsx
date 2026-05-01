import { useGameStore } from '../../store/useGameStore'
import Poop from './Poop'

export default function PoopField() {
  const poops = useGameStore((s) => s.poops)
  return (
    <>
      {poops.map((p) => (
        <Poop key={p.id} position={p.position} rotation={p.rotation} foodId={p.foodId} />
      ))}
    </>
  )
}
