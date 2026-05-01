import { useGameStore } from '../../store/useGameStore'
import { HAMSTER_VARIANTS } from '../../lib/hamsterTypes'

export default function HamsterPicker() {
  const selectedVariantId = useGameStore((s) => s.selectedVariantId)
  const setSelectedVariant = useGameStore((s) => s.setSelectedVariant)
  const phase = useGameStore((s) => s.phase)

  const selected = HAMSTER_VARIANTS.find((v) => v.id === selectedVariantId)

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-4 w-56">
      <h3 className="text-sm font-semibold text-gray-700 mb-0.5">🐹 햄스터 선택</h3>
      <p className="text-xs text-gray-400 mb-3">한 마리를 골라주세요</p>

      {/* 5종 라디오 버튼 (컬러 동그라미) */}
      <div className="flex gap-2 justify-between">
        {HAMSTER_VARIANTS.map((v) => {
          const isSelected = selectedVariantId === v.id
          return (
            <button
              key={v.id}
              onClick={() => {
                // pooping 중에는 선택 변경 불가
                if (phase === 'pooping') return
                setSelectedVariant(v.id)
              }}
              title={v.name}
              disabled={phase === 'pooping'}
              className="transition-all duration-150"
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: v.bodyColor,
                // 선택된 것: 분홍 링 + 약간 확대
                outline: isSelected ? '3px solid #f472b6' : '3px solid transparent',
                outlineOffset: 2,
                opacity: phase === 'pooping' ? 0.5 : isSelected ? 1 : 0.45,
                transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                cursor: phase === 'pooping' ? 'not-allowed' : 'pointer',
                border: 'none',
              }}
            />
          )
        })}
      </div>

      {/* 선택된 햄스터 이름 */}
      {selected && (
        <p className="text-xs text-gray-500 mt-3 text-center">
          <span className="font-medium text-gray-700">{selected.name}</span>와 그림 그리기 🎨
        </p>
      )}
    </div>
  )
}
