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
    // 이전 똥 제거 후 경로 계산
    clearPoops()

    const path =
      inputMode === 'text'
        ? sampleTextPath(textInput, 0.18)      // 촘촘한 spacing
        : sampleDrawnPath(drawnPoints, 0.18)

    if (path.length === 0) return

    setComputedPath(path)
    setPhase('pooping')
  }

  // ── pooping 중: 중단 버튼 ────────────────────────────────────
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

  // ── idle / completed ─────────────────────────────────────────
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
