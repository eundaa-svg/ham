import { useGameStore } from '../../store/useGameStore'
import { sampleDrawnPath, sampleTextPath } from '../../lib/pathSampler'

export default function StartButton() {
  const phase = useGameStore((s) => s.phase)
  const inputMode = useGameStore((s) => s.inputMode)
  const textInput = useGameStore((s) => s.textInput)
  const drawnPoints = useGameStore((s) => s.drawnPoints)
  const hamsters = useGameStore((s) => s.hamsters)

  const setPhase = useGameStore((s) => s.setPhase)
  const setComputedPath = useGameStore((s) => s.setComputedPath)
  const setHamsterAssignments = useGameStore((s) => s.setHamsterAssignments)
  const reset = useGameStore((s) => s.reset)
  const clearPoops = useGameStore((s) => s.clearPoops)

  // 입력이 유효한지 (시작 버튼 활성화 조건)
  const hasInput =
    inputMode === 'text' ? textInput.trim().length > 0 : drawnPoints.length >= 5

  const handleStart = () => {
    // 1) 입력 → 3D 경로 점 배열
    const path =
      inputMode === 'text'
        ? sampleTextPath(textInput, 0.25)
        : sampleDrawnPath(drawnPoints, 0.25)

    if (path.length < 2) return

    // 2) 경로 점을 햄스터 수만큼 라운드로빈으로 분배
    const assignments: Record<string, number[]> = {}
    hamsters.forEach((h) => { assignments[h.id] = [] })
    path.forEach((_, idx) => {
      const h = hamsters[idx % hamsters.length]
      assignments[h.id].push(idx)
    })

    setComputedPath(path)
    setHamsterAssignments(assignments)
    // completedCount 리셋은 reset()이 처리하므로 여기선 phase만 전환
    useGameStore.setState({ completedCount: 0 })
    setPhase('pooping')
  }

  // ─── pooping 중 ──────────────────────────────────────────────
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

  // ─── idle / completed ────────────────────────────────────────
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
