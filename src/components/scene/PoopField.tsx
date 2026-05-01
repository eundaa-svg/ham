import { useGameStore } from '../../store/useGameStore'
import Poop from './Poop'

// store의 poops 배열 전체를 렌더링
export default function PoopField() {
  const poops = useGameStore((s) => s.poops)

  return (
    <>
      {poops.map((p) => (
        <Poop key={p.id} position={p.position} variantId={p.variantId} />
      ))}
    </>
  )
}
