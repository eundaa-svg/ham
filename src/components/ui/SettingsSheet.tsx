import { useGameStore } from '../../store/useGameStore'
import { FOOD_VARIANTS } from '../../lib/foodTypes'

interface Props { onClose: () => void }

export default function SettingsSheet({ onClose }: Props) {
  const poopSize        = useGameStore((s) => s.poopSize)
  const poopSpacing     = useGameStore((s) => s.poopSpacing)
  const selectedFoodId  = useGameStore((s) => s.selectedFoodId)
  const setPoopSize     = useGameStore((s) => s.setPoopSize)
  const setPoopSpacing  = useGameStore((s) => s.setPoopSpacing)
  const setSelectedFood = useGameStore((s) => s.setSelectedFood)

  const selectedFood = FOOD_VARIANTS.find((f) => f.id === selectedFoodId)

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 40,
        background: 'rgba(26, 22, 20, 0.4)',
        animation: 'fadeIn 0.2s ease-out',
      }} />

      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        zIndex: 50,
        background: 'var(--surface)',
        borderRadius: 'var(--r-xl) var(--r-xl) 0 0',
        borderTop: '1px solid var(--line)',
        paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
        animation: 'slideUp 0.28s cubic-bezier(0.32, 0.72, 0, 1)',
        maxWidth: 500, margin: '0 auto',
        maxHeight: '85vh', overflowY: 'auto',
      }}>
        {/* Grabber */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px', position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 1 }}>
          <div style={{ width: 36, height: 3, borderRadius: 2, background: 'var(--line-bold)' }} />
        </div>

        {/* 헤더 */}
        <div style={{ padding: '16px 28px 0' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <h3 className="t-display" style={{ fontSize: 22, color: 'var(--text)' }}>Settings</h3>
            <span className="t-caption">03</span>
          </div>
          <div style={{ height: 1, background: 'var(--line)', marginTop: 12 }} />
        </div>

        {/* 먹이 선택 */}
        <div style={{ padding: '20px 28px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span className="t-caption">Food</span>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', letterSpacing: '-0.01em' }}>
              {selectedFood?.name}
            </span>
          </div>

          {/* 가로 스크롤 색상 선택 */}
          <div style={{
            display: 'flex', gap: 16, overflowX: 'auto',
            margin: '0 -28px', padding: '0 28px 4px',
            scrollbarWidth: 'none',
          }}>
            {FOOD_VARIANTS.map((food) => {
              const isSelected = selectedFoodId === food.id
              return (
                <button
                  key={food.id}
                  onClick={() => setSelectedFood(food.id)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                    flexShrink: 0,
                  }}
                >
                  {/* 컬러 dot */}
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: food.poopColor,
                    transform: isSelected ? 'scale(1)' : 'scale(0.82)',
                    opacity: isSelected ? 1 : 0.45,
                    border: isSelected ? `2px solid var(--text)` : '2px solid transparent',
                    boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                    transition: 'all 0.15s',
                  }} />
                  <span style={{
                    fontSize: 10, letterSpacing: '-0.01em',
                    fontWeight: isSelected ? 600 : 400,
                    color: isSelected ? 'var(--text)' : 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                  }}>
                    {food.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 디바이더 */}
        <div style={{ height: 1, background: 'var(--line)', margin: '24px 28px 0' }} />

        {/* 슬라이더 */}
        <div style={{ padding: '20px 28px 0', display: 'flex', flexDirection: 'column', gap: 28 }}>
          {/* Size */}
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
              <span className="t-caption">Size</span>
              <span className="t-mono" style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                {poopSize.toFixed(2)}
              </span>
            </div>
            <input type="range" min="0.5" max="2.0" step="0.1"
              value={poopSize} onChange={(e) => setPoopSize(parseFloat(e.target.value))} />
          </div>

          {/* Spacing */}
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
              <span className="t-caption">Spacing</span>
              <span className="t-mono" style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                {poopSpacing.toFixed(3)}
              </span>
            </div>
            <input type="range" min="0.025" max="0.20" step="0.005"
              value={poopSpacing} onChange={(e) => setPoopSpacing(parseFloat(e.target.value))} />
          </div>
        </div>

        <div style={{ height: 28 }} />
      </div>
    </>
  )
}
