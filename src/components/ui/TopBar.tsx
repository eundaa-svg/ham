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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {/* 좌: 브랜드 로고 */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span className="t-display" style={{ fontSize: 17, color: 'var(--text)' }}>ham</span>
        <span className="t-caption" style={{ fontSize: 9 }}>studio</span>
      </div>

      {/* 우: 햄스터 pill + 설정 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* 햄스터 pill */}
        <button
          onClick={onOpenHamster}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '5px 12px 5px 5px',
            borderRadius: 999,
            background: 'var(--surface)',
            border: '1px solid var(--line)',
          }}
        >
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            overflow: 'hidden', background: 'var(--bg-soft)', flexShrink: 0,
          }}>
            <img src={variant.thumbnail} alt={variant.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', letterSpacing: '-0.01em' }}>
            {variant.name}
          </span>
        </button>

        {/* 설정 아이콘 */}
        <button
          onClick={onOpenSettings}
          aria-label="settings"
          style={{
            width: 36, height: 36, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--surface)',
            border: '1px solid var(--line)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 4h6M11 4h1M2 10h1M6 10h6M7 2v4M4 8v4"
              stroke="var(--text)" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
