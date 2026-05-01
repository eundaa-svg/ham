import { useGameStore } from '../../store/useGameStore'
import { HAMSTER_VARIANTS } from '../../lib/hamsterTypes'

export default function HamsterPicker() {
  const selectedVariants = useGameStore((s) => s.selectedVariants)
  const countPerVariant = useGameStore((s) => s.countPerVariant)
  const toggleVariant = useGameStore((s) => s.toggleVariant)
  const setCountPerVariant = useGameStore((s) => s.setCountPerVariant)

  const total = selectedVariants.length * countPerVariant

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-4 w-64">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">🐹 햄스터 선택</h3>

      {/* 5종 컬러 토글 버튼 */}
      <div className="flex gap-2 mb-4">
        {HAMSTER_VARIANTS.map((v) => {
          const isSelected = selectedVariants.includes(v.id)
          return (
            <button
              key={v.id}
              onClick={() => toggleVariant(v.id)}
              title={v.name}
              className="transition-all duration-150"
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: v.bodyColor,
                outline: isSelected ? '2.5px solid #f472b6' : '2.5px solid transparent',
                outlineOffset: 2,
                opacity: isSelected ? 1 : 0.35,
                transform: isSelected ? 'scale(1.12)' : 'scale(1)',
                cursor: 'pointer',
                border: 'none',
              }}
            />
          )
        })}
      </div>

      {/* 종류당 마릿수 조절 */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-600">종류당 마릿수</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCountPerVariant(countPerVariant - 1)}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-bold leading-none transition-colors"
          >
            −
          </button>
          <span className="w-5 text-center text-sm font-semibold text-gray-800">
            {countPerVariant}
          </span>
          <button
            onClick={() => setCountPerVariant(countPerVariant + 1)}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-bold leading-none transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* 총 마릿수 표시 */}
      <p className="text-xs text-gray-400 mt-2 text-right">
        총 {total}마리
      </p>
    </div>
  )
}
