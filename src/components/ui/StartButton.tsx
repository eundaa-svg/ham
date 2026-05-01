import { useGameStore } from '../../store/useGameStore'
import { sampleDrawnPath } from '../../lib/pathSampler'

export default function StartButton() {
  const phase       = useGameStore((s) => s.phase)
  const drawnPoints = useGameStore((s) => s.drawnPoints)
  const hamsters    = useGameStore((s) => s.hamsters)

  const setPhase        = useGameStore((s) => s.setPhase)
  const setComputedPath = useGameStore((s) => s.setComputedPath)
  const clearPoops      = useGameStore((s) => s.clearPoops)
  const reset           = useGameStore((s) => s.reset)

  const hasInput = drawnPoints.length >= 5

  const handleStart = () => {
    clearPoops()

    const path = sampleDrawnPath(drawnPoints, 0.15)

    console.log('[DEBUG] 드로잉 점 수:', drawnPoints.length)
    console.log('[DEBUG] 경로 점 수:', path.length)
    console.log('[DEBUG] 첫 5개 점:', path.slice(0, 5))

    if (path.length === 0) {
      console.error('[DEBUG] 경로가 비어있음!')
      return
    }

    setComputedPath(path)
    setPhase('pooping')
  }

  if (phase === 'pooping') {
    return (
      <button
        onClick={reset}
        className="px-6 py-3 rounded-2xl bg-gray-200 text-gray-600 font-medium shadow-lg hover:bg-gray-300 transition"
      >
        ⏹ 중단
      </button>
    )
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={handleStart}
        disabled={!hasInput || hamsters.length === 0}
        className={`px-6 py-3 rounded-2xl font-medium shadow-lg transition ${
          hasInput && hamsters.length > 0
            ? 'bg-pink-300 hover:bg-pink-400 text-pink-900 cursor-pointer'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        ▶ 시작!
      </button>
      <button
        onClick={() => { clearPoops(); reset() }}
        className="text-xs text-gray-400 hover:text-gray-700 transition"
      >
        💩 똥 모두 치우기
      </button>
    </div>
  )
}
