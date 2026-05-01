import { useGameStore } from '../../store/useGameStore'

export default function ClearPoopButton() {
  const poops      = useGameStore((s) => s.poops)
  const phase      = useGameStore((s) => s.phase)
  const clearPoops = useGameStore((s) => s.clearPoops)

  if (poops.length === 0 || phase === 'pooping') return null

  return (
    <button
      onClick={clearPoops}
      aria-label="똥 치우기"
      style={{
        height: 44,
        padding: '0 18px',
        borderRadius: 999,
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        boxShadow: 'var(--shadow-sm)',
        transition: 'background 0.15s, border-color 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--text)'
        e.currentTarget.style.borderColor = 'var(--text)'
        e.currentTarget.querySelectorAll<HTMLElement>('span, svg').forEach((el) => {
          el.style.color = 'var(--surface-elev)'
        })
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--surface)'
        e.currentTarget.style.borderColor = 'var(--line)'
        e.currentTarget.querySelectorAll<HTMLElement>('span, svg').forEach((el) => {
          el.style.color = 'var(--text)'
        })
      }}
    >
      {/* 휴지통 아이콘 */}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
        style={{ color: 'var(--text)', transition: 'color 0.15s', flexShrink: 0 }}>
        <path d="M2 4h10M5 4V2.5h4V4M3 4l.5 8h7L11 4M5.5 6.5v3.5M8.5 6.5v3.5"
          stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {/* 텍스트 */}
      <span style={{
        fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em',
        color: 'var(--text)', transition: 'color 0.15s',
      }}>
        똥 치우기
      </span>
    </button>
  )
}
