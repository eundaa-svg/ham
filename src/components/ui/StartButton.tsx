import { useGameStore } from '../../store/useGameStore'
import { sampleDrawnPath } from '../../lib/pathSampler'

export default function StartButton() {
  const phase        = useGameStore((s) => s.phase)
  const drawnStrokes = useGameStore((s) => s.drawnStrokes)
  const hamsters     = useGameStore((s) => s.hamsters)
  const poopSpacing  = useGameStore((s) => s.poopSpacing)

  const setPhase               = useGameStore((s) => s.setPhase)
  const setComputedPath        = useGameStore((s) => s.setComputedPath)
  const clearPoops             = useGameStore((s) => s.clearPoops)
  const reset                  = useGameStore((s) => s.reset)
  const setInputPanelCollapsed = useGameStore((s) => s.setInputPanelCollapsed)

  const totalPoints = drawnStrokes.reduce((sum, s) => sum + s.length, 0)
  const hasInput    = totalPoints >= 5

  const handleStart = () => {
    clearPoops()
    const path = sampleDrawnPath(drawnStrokes, poopSpacing)
    console.log('[DEBUG] 스트로크 수:', drawnStrokes.length, '/ 경로 점 수:', path.length)
    if (path.length === 0) return
    setComputedPath(path)
    setPhase('pooping')
    setInputPanelCollapsed(true)
  }

  // pooping 중: 중단 버튼
  if (phase === 'pooping') {
    return (
      <button
        onClick={reset}
        style={{
          padding: '12px 24px',
          borderRadius: 'var(--radius-pill)',
          fontSize: 14,
          fontWeight: 600,
          background: 'var(--surface-elev)',
          color: 'var(--text-muted)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
          cursor: 'pointer',
        }}
      >
        중단
      </button>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
      <button
        onClick={handleStart}
        disabled={!hasInput || hamsters.length === 0}
        style={{
          padding: '13px 28px',
          borderRadius: 'var(--radius-pill)',
          fontSize: 14,
          fontWeight: 600,
          background: hasInput ? 'var(--accent)' : 'var(--text-subtle)',
          color: '#FFFFFF',
          border: 'none',
          boxShadow: hasInput ? 'var(--shadow-md)' : 'none',
          opacity: hasInput ? 1 : 0.5,
          cursor: hasInput ? 'pointer' : 'not-allowed',
          transition: 'background 0.15s, box-shadow 0.15s',
        }}
        onMouseEnter={(e) => {
          if (hasInput) e.currentTarget.style.background = 'var(--accent-hover)'
        }}
        onMouseLeave={(e) => {
          if (hasInput) e.currentTarget.style.background = 'var(--accent)'
        }}
      >
        시작
      </button>
      <button
        onClick={() => { clearPoops(); reset() }}
        style={{
          fontSize: 11,
          color: 'var(--text-subtle)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '2px 4px',
        }}
      >
        모두 치우기
      </button>
    </div>
  )
}
