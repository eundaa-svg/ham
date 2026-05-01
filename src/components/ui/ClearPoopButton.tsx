import { useGameStore } from '../../store/useGameStore'

export default function ClearPoopButton() {
  const poops      = useGameStore((s) => s.poops)
  const phase      = useGameStore((s) => s.phase)
  const clearPoops = useGameStore((s) => s.clearPoops)

  // 똥 없거나 pooping 중이면 미표시
  if (poops.length === 0 || phase === 'pooping') return null

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={clearPoops}
        aria-label={`모두 치우기 (${poops.length}개)`}
        style={{
          width: 52, height: 52,
          borderRadius: '50%',
          border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--surface-elev)',
          boxShadow: 'var(--shadow-md)',
          cursor: 'pointer',
          transition: 'transform 0.15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)' }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
      >
        {/* 빗자루 */}
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4.5 15.5l5-5M3.5 16.5h7M11.5 7.5l4-4M14.5 5.5l-1-1M9.5 10.5l1.5 1.5"
            stroke="var(--text)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* 개수 뱃지 */}
      <div style={{
        position: 'absolute', top: -4, right: -4,
        minWidth: 20, height: 20,
        borderRadius: 'var(--radius-pill)',
        background: 'var(--accent)',
        color: '#fff',
        fontSize: 10, fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 4px',
        border: '2px solid var(--surface-elev)',
        pointerEvents: 'none',
      }}>
        {poops.length > 99 ? '99+' : poops.length}
      </div>
    </div>
  )
}
