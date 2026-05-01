import { useGameStore } from '../../store/useGameStore'
import { sampleDrawnPath, sampleTextPath } from '../../lib/pathSampler'

export default function StartButton() {
  const phase       = useGameStore((s) => s.phase)
  const inputMode   = useGameStore((s) => s.inputMode)
  const textInput   = useGameStore((s) => s.textInput)
  const drawnPoints = useGameStore((s) => s.drawnPoints)
  const hamsters    = useGameStore((s) => s.hamsters)

  const setPhase        = useGameStore((s) => s.setPhase)
  const setComputedPath = useGameStore((s) => s.setComputedPath)
  const clearPoops      = useGameStore((s) => s.clearPoops)
  const reset           = useGameStore((s) => s.reset)

  const hasInput =
    inputMode === 'text' ? textInput.trim().length > 0 : drawnPoints.length >= 5

  const handleStart = () => {
    clearPoops()

    const path =
      inputMode === 'text'
        ? sampleTextPath(textInput, 0.15)
        : sampleDrawnPath(drawnPoints, 0.15)

    console.log('[DEBUG] 입력 모드:', inputMode)
    console.log('[DEBUG] 원본 입력:', inputMode === 'text' ? textInput : `${drawnPoints.length}개 점`)
    console.log('[DEBUG] 계산된 경로 점 개수:', path.length)
    console.log('[DEBUG] 첫 5개 점:', path.slice(0, 5))
    console.log('[DEBUG] 마지막 5개 점:', path.slice(-5))

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
