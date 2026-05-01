import { useGameStore } from '../../store/useGameStore'
import { sampleDrawnPath } from '../../lib/pathSampler'

export default function StartFAB() {
  const phase        = useGameStore((s) => s.phase)
  const drawnStrokes = useGameStore((s) => s.drawnStrokes)
  const poopSpacing  = useGameStore((s) => s.poopSpacing)

  const setPhase        = useGameStore((s) => s.setPhase)
  const setComputedPath = useGameStore((s) => s.setComputedPath)
  const clearPoops      = useGameStore((s) => s.clearPoops)
  const reset           = useGameStore((s) => s.reset)

  const totalPoints = drawnStrokes.reduce((sum, s) => sum + s.length, 0)
  const hasInput    = totalPoints >= 5
  const isPooping   = phase === 'pooping'

  const handlePress = () => {
    if (isPooping) { reset(); return }
    if (!hasInput) return
    clearPoops()
    const path = sampleDrawnPath(drawnStrokes, poopSpacing)
    if (path.length === 0) return
    setComputedPath(path)
    setPhase('pooping')
  }

  const disabled = !isPooping && !hasInput

  return (
    <button
      onClick={handlePress}
      disabled={disabled}
      aria-label={isPooping ? '중단' : '시작'}
      style={{
        width: 64, height: 64,
        borderRadius: '50%',
        border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isPooping
          ? 'var(--surface-elev)'
          : disabled
            ? 'var(--text-subtle)'
            : 'var(--accent)',
        color: isPooping ? 'var(--text-muted)' : '#fff',
        boxShadow: isPooping || disabled ? 'var(--shadow-md)' : 'var(--shadow-fab)',
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transform: isPooping ? 'scale(0.92)' : 'scale(1)',
        transition: 'transform 0.15s, background 0.2s, box-shadow 0.2s',
      }}
    >
      {isPooping ? (
        /* 중단: 스퀘어 아이콘 */
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="4" y="4" width="12" height="12" rx="2" fill="currentColor" />
        </svg>
      ) : (
        /* 시작: 플레이 삼각형 */
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M7 5l12 6-12 6V5z" fill="currentColor" />
        </svg>
      )}
    </button>
  )
}
