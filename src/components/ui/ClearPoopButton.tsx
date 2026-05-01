import { useGameStore } from '../../store/useGameStore'

export default function ClearPoopButton() {
  const poops      = useGameStore((s) => s.poops)
  const phase      = useGameStore((s) => s.phase)
  const clearPoops = useGameStore((s) => s.clearPoops)

  if (poops.length === 0 || phase === 'pooping') return null

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={clearPoops}
        aria-label="clear all"
        style={{
          width: 52, height: 52, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          boxShadow: 'var(--shadow-sm)',
          transition: 'transform 0.15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)' }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
      >
        {/* X 아이콘 */}
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M2 2l9 9M11 2l-9 9"
            stroke="var(--text)" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>

      {/* 개수 뱃지 — 블랙 모노톤 */}
      <div style={{
        position: 'absolute', top: -4, right: -4,
        minWidth: 18, height: 18,
        borderRadius: 999,
        background: 'var(--text)',
        color: 'var(--surface-elev)',
        fontSize: 9, fontWeight: 700,
        letterSpacing: '0.01em',
        fontVariantNumeric: 'tabular-nums',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 4px',
        border: '2px solid var(--bg)',
        pointerEvents: 'none',
      }}>
        {poops.length > 99 ? '99+' : poops.length}
      </div>
    </div>
  )
}
