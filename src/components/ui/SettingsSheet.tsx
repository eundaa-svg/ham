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

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 40,
          background: 'rgba(0,0,0,0.28)',
          animation: 'fadeIn 0.2s ease-out',
        }}
      />

      <div
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          zIndex: 50,
          background: 'var(--surface-elev)',
          borderRadius: '24px 24px 0 0',
          paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
          animation: 'slideUp 0.25s ease-out',
          maxWidth: 520,
          margin: '0 auto',
          maxHeight: '85vh',
          overflowY: 'auto',
        }}
      >
        {/* Grabber — sticky */}
        <div style={{
          display: 'flex', justifyContent: 'center',
          padding: '12px 0 8px',
          position: 'sticky', top: 0,
          background: 'var(--surface-elev)',
          zIndex: 1,
        }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border-strong)' }} />
        </div>

        {/* 제목 */}
        <div style={{ padding: '4px 20px 16px' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>똥 설정</h3>
        </div>

        {/* ── 먹이 선택 ── */}
        <div style={{ padding: '0 20px' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>먹이</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
            {FOOD_VARIANTS.map((food) => {
              const isSelected = selectedFoodId === food.id
              return (
                <button
                  key={food.id}
                  onClick={() => setSelectedFood(food.id)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    padding: '8px 4px',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'var(--accent-soft)' : 'var(--bg)',
                    border: `2px solid ${isSelected ? 'var(--accent)' : 'transparent'}`,
                    transition: 'all 0.15s',
                    cursor: 'pointer',
                  }}
                >
                  {/* 이모지 */}
                  <div style={{
                    width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, background: 'var(--surface-elev)',
                  }}>
                    {food.emoji}
                  </div>
                  {/* 똥 색 미리보기 */}
                  <div style={{
                    width: 20, height: 6, borderRadius: 'var(--radius-pill)',
                    background: food.poopColor,
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2)',
                  }} />
                  {/* 이름 */}
                  <span style={{
                    fontSize: 10, lineHeight: 1.3, textAlign: 'center',
                    color: isSelected ? 'var(--accent)' : 'var(--text-muted)',
                    fontWeight: isSelected ? 600 : 500,
                  }}>
                    {food.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 디바이더 */}
        <div style={{ margin: '20px 20px', borderTop: '1px solid var(--border)' }} />

        {/* ── 크기 / 간격 슬라이더 ── */}
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* 크기 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <label style={{ fontSize: 13, color: 'var(--text)' }}>크기</label>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>
                {poopSize.toFixed(1)}
              </span>
            </div>
            <input type="range" min="0.5" max="2.0" step="0.1"
              value={poopSize} onChange={(e) => setPoopSize(parseFloat(e.target.value))} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, color: 'var(--text-subtle)' }}>
              <span>작게</span><span>크게</span>
            </div>
          </div>

          {/* 간격 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <label style={{ fontSize: 13, color: 'var(--text)' }}>간격</label>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>
                {poopSpacing.toFixed(3)}
              </span>
            </div>
            <input type="range" min="0.025" max="0.20" step="0.005"
              value={poopSpacing} onChange={(e) => setPoopSpacing(parseFloat(e.target.value))} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, color: 'var(--text-subtle)' }}>
              <span>촘촘</span><span>듬성</span>
            </div>
          </div>
        </div>

        <div style={{ height: 24 }} />
      </div>
    </>
  )
}
