import { useGameStore } from '../../store/useGameStore'
import { HAMSTER_VARIANTS } from '../../lib/hamsterTypes'
import { FOOD_VARIANTS } from '../../lib/foodTypes'

interface Props {
  onOpenHamster: () => void
  onOpenFood: () => void
  onOpenSettings: () => void
}

export default function TopBar({ onOpenHamster, onOpenFood, onOpenSettings }: Props) {
  const selectedVariantId = useGameStore((s) => s.selectedVariantId)
  const selectedFoodId    = useGameStore((s) => s.selectedFoodId)
  const poops             = useGameStore((s) => s.poops)
  const phase             = useGameStore((s) => s.phase)
  const clearPoops        = useGameStore((s) => s.clearPoops)

  const variant = HAMSTER_VARIANTS.find((v) => v.id === selectedVariantId) ?? HAMSTER_VARIANTS[0]
  const food    = FOOD_VARIANTS.find((f) => f.id === selectedFoodId)       ?? FOOD_VARIANTS[0]

  const canClear = poops.length > 0 && phase !== 'pooping'

  const pillStyle = {
    display: 'flex', alignItems: 'center',
    borderRadius: 'var(--radius-pill)',
    background: 'var(--surface-elev)',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--border)',
  }

  const iconBtnStyle = {
    ...pillStyle,
    width: 40, height: 40, flexShrink: 0,
    justifyContent: 'center',
    borderRadius: '50%',
  }

  return (
    // items-start: 우측 세로 스택이 위에서 쌓이도록
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
      {/* 왼쪽: 햄스터 + 먹이 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {/* 햄스터 pill */}
        <button onClick={onOpenHamster} style={{ ...pillStyle, gap: 8, padding: '7px 12px 7px 7px' }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            overflow: 'hidden', background: 'var(--bg)', flexShrink: 0,
          }}>
            <img src={variant.thumbnail} alt={variant.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
            {variant.name}
          </span>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 1l4 4 4-4" stroke="var(--text-muted)" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* 먹이 pill */}
        <button onClick={onOpenFood} style={{ ...pillStyle, gap: 7, padding: '7px 12px 7px 9px' }}>
          <span style={{ fontSize: 17, lineHeight: 1 }}>{food.emoji}</span>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: food.poopColor, flexShrink: 0,
          }} />
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 1l4 4 4-4" stroke="var(--text-muted)" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* 오른쪽: 설정 + 모두 치우기 세로 스택 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end', marginLeft: 'auto' }}>
        {/* 설정 아이콘 */}
        <button onClick={onOpenSettings} aria-label="똥 설정" style={iconBtnStyle}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <line x1="2" y1="4"  x2="14" y2="4"  stroke="var(--text)" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="2" y1="8"  x2="14" y2="8"  stroke="var(--text)" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="2" y1="12" x2="14" y2="12" stroke="var(--text)" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="5"  cy="4"  r="1.5" fill="var(--surface-elev)" stroke="var(--text)" strokeWidth="1.5"/>
            <circle cx="11" cy="8"  r="1.5" fill="var(--surface-elev)" stroke="var(--text)" strokeWidth="1.5"/>
            <circle cx="6"  cy="12" r="1.5" fill="var(--surface-elev)" stroke="var(--text)" strokeWidth="1.5"/>
          </svg>
        </button>

        {/* 모두 치우기 — 똥 있을 때만 표시 */}
        {poops.length > 0 && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { if (canClear) clearPoops() }}
              disabled={!canClear}
              aria-label={`모두 치우기 (${poops.length}개)`}
              style={{
                ...iconBtnStyle,
                opacity: canClear ? 1 : 0.4,
                cursor: canClear ? 'pointer' : 'not-allowed',
              }}
            >
              {/* 빗자루 아이콘 */}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3.5 12.5l4-4M2.5 13.5h6M9.5 5.5l3.5-3.5M12 4l-1-1"
                  stroke="var(--text)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3.5 12.5l-1 1M7.5 8.5l1 1"
                  stroke="var(--text)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            {/* 똥 개수 뱃지 */}
            <div style={{
              position: 'absolute', top: -4, right: -4,
              minWidth: 18, height: 18,
              borderRadius: 'var(--radius-pill)',
              background: 'var(--accent)',
              color: '#fff',
              fontSize: 10, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 4px',
              pointerEvents: 'none',
            }}>
              {poops.length > 99 ? '99+' : poops.length}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
