import { useGameStore } from '../../store/useGameStore'

export default function ClearPoopButton() {
  const poops      = useGameStore((s) => s.poops)
  const phase      = useGameStore((s) => s.phase)
  const clearPoops = useGameStore((s) => s.clearPoops)
  const reset      = useGameStore((s) => s.reset)

  // 똥이 없으면 미표시
  if (poops.length === 0) return null

  const isDisabled = phase === 'pooping'

  return (
    <button
      onClick={() => { if (!isDisabled) { clearPoops(); reset() } }}
      disabled={isDisabled}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '9px 14px',
        borderRadius: 'var(--radius-pill)',
        background: 'var(--surface-elev)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border)',
        opacity: isDisabled ? 0.4 : 1,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        transition: 'opacity 0.15s',
      }}
    >
      {/* 빗자루 아이콘 */}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 12l3.5-3.5M1.5 12.5h5M8.5 5.5l3-3M10.5 3.5l-1-1"
          stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M5.5 8.5l-2 2M7 7l1.5-1.5" stroke="var(--text-muted)"
          strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>
        모두 치우기
      </span>
      <span style={{ fontSize: 10, color: 'var(--text-subtle)', fontVariantNumeric: 'tabular-nums' }}>
        {poops.length}
      </span>
    </button>
  )
}
