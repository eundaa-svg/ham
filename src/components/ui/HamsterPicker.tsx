import { useGameStore } from '../../store/useGameStore'
import { HAMSTER_VARIANTS } from '../../lib/hamsterTypes'

export default function HamsterPicker() {
  const selectedVariantId = useGameStore((s) => s.selectedVariantId)
  const setSelectedVariant = useGameStore((s) => s.setSelectedVariant)
  const phase = useGameStore((s) => s.phase)

  const selected = HAMSTER_VARIANTS.find((v) => v.id === selectedVariantId)

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-4 w-64">
      <h3 className="text-sm font-semibold text-gray-700 mb-0.5">🐹 햄스터 선택</h3>
      <p className="text-xs text-gray-400 mb-3">한 종류를 선택하세요</p>

      <div className="flex gap-1 justify-around">
        {HAMSTER_VARIANTS.map((v) => {
          const isSelected = selectedVariantId === v.id
          return (
            <button
              key={v.id}
              onClick={() => {
                if (phase === 'pooping') return
                setSelectedVariant(v.id)
              }}
              disabled={phase === 'pooping'}
              className="flex flex-col items-center gap-1 transition-all duration-150"
              style={{
                opacity: phase === 'pooping' ? 0.5 : 1,
                cursor: phase === 'pooping' ? 'not-allowed' : 'pointer',
                transform: isSelected ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: v.bodyColor,
                  outline: isSelected ? '3px solid #f472b6' : '3px solid transparent',
                  outlineOffset: 2,
                  opacity: isSelected ? 1 : 0.5,
                  border: '2px solid rgba(255,255,255,0.8)',
                  boxShadow: isSelected ? '0 2px 8px rgba(244,114,182,0.4)' : '0 1px 3px rgba(0,0,0,0.1)',
                }}
              />
              <span className={`text-[9px] leading-tight text-center max-w-[40px] ${
                isSelected ? 'text-pink-600 font-semibold' : 'text-gray-400'
              }`}>
                {v.name}
              </span>
            </button>
          )
        })}
      </div>

      {selected && (
        <p className="text-xs text-gray-500 mt-3 text-center">
          <span className="font-medium text-gray-700">{selected.name}</span> 햄스터와 그림 그리기 🎨
        </p>
      )}
    </div>
  )
}
