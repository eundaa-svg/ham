import { useGameStore } from '../../store/useGameStore'
import { HAMSTER_VARIANTS } from '../../lib/hamsterTypes'

interface Props {
  onOpenHamster: () => void
  onOpenSettings: () => void
}

export default function TopBar({ onOpenHamster, onOpenSettings }: Props) {
  const selectedVariantId = useGameStore((s) => s.selectedVariantId)
  const variant = HAMSTER_VARIANTS.find((v) => v.id === selectedVariantId) ?? HAMSTER_VARIANTS[0]

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
      {/* 선택된 햄스터 pill */}
      <button
        onClick={onOpenHamster}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '7px 14px 7px 7px',
          borderRadius: 'var(--radius-pill)',
          background: 'var(--surface-elev)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border)',
        }}
      >
        <div style={{
          width: 30, height: 30, borderRadius: '50%',
          overflow: 'hidden', background: 'var(--bg)', flexShrink: 0,
        }}>
          <img src={variant.thumbnail} alt={variant.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
          {variant.name}
        </span>
        {/* 드롭다운 화살표 */}
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 1l4 4 4-4" stroke="var(--text-muted)" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* 설정 아이콘 버튼 */}
      <button
        onClick={onOpenSettings}
        aria-label="설정"
        style={{
          width: 40, height: 40, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--surface-elev)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border)',
        }}
      >
        {/* 슬라이더/필터 아이콘 */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <line x1="2" y1="4" x2="14" y2="4" stroke="var(--text)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="2" y1="8" x2="14" y2="8" stroke="var(--text)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="2" y1="12" x2="14" y2="12" stroke="var(--text)" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="5" cy="4" r="1.5" fill="var(--surface-elev)" stroke="var(--text)" strokeWidth="1.5"/>
          <circle cx="11" cy="8" r="1.5" fill="var(--surface-elev)" stroke="var(--text)" strokeWidth="1.5"/>
          <circle cx="6" cy="12" r="1.5" fill="var(--surface-elev)" stroke="var(--text)" strokeWidth="1.5"/>
        </svg>
      </button>
    </div>
  )
}
