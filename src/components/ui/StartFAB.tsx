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
  const disabled    = !isPooping && !hasInput

  const handlePress = () => {
    if (isPooping) { reset(); return }
    if (!hasInput) return
    clearPoops()
    const path = sampleDrawnPath(drawnStrokes, poopSpacing)
    if (path.length === 0) return
    setComputedPath(path)
    setPhase('pooping')
  }

  return (
    <button
      onClick={handlePress}
      disabled={disabled}
      aria-label={isPooping ? 'stop' : 'start'}
      style={{
        width: 64, height: 64,
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isPooping ? 'var(--surface)' : disabled ? 'var(--bg-soft)' : 'var(--text)',
        color: isPooping ? 'var(--text-muted)' : 'var(--surface-elev)',
        border: isPooping || disabled ? '1px solid var(--line)' : 'none',
        boxShadow: disabled ? 'none' : 'var(--shadow-md)',
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transform: isPooping ? 'scale(0.94)' : 'scale(1)',
        transition: 'transform 0.15s, background 0.2s',
      }}
    >
      {isPooping ? (
        /* 진행중: 점 3개 pulse */
        <div style={{ display: 'flex', gap: 3 }}>
          {[0, 0.2, 0.4].map((delay) => (
            <span key={delay} style={{
              width: 4, height: 4, borderRadius: '50%',
              background: 'currentColor',
              animation: `pulse 1s ease-in-out infinite`,
              animationDelay: `${delay}s`,
            }} />
          ))}
        </div>
      ) : (
        /* 시작: 플레이 삼각형 */
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3.5 2l9 5-9 5V2z" fill="currentColor" />
        </svg>
      )}
    </button>
  )
}
