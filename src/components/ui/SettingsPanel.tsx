import { useState } from 'react'
import { useGameStore } from '../../store/useGameStore'

export default function SettingsPanel() {
  const [isOpen, setIsOpen] = useState(false)

  const poopSize    = useGameStore((s) => s.poopSize)
  const poopSpacing = useGameStore((s) => s.poopSpacing)
  const setPoopSize    = useGameStore((s) => s.setPoopSize)
  const setPoopSpacing = useGameStore((s) => s.setPoopSpacing)

  const applyPreset = (size: number, spacing: number) => {
    setPoopSize(size)
    setPoopSpacing(spacing)
  }

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden">
      {/* 헤더 — 클릭으로 접기/펼치기 */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full px-4 py-3 flex items-center justify-between gap-2 hover:bg-white/40 transition"
      >
        <div className="flex items-center gap-2">
          <span className="text-base">⚙️</span>
          <span className="text-sm font-semibold text-gray-700">똥 설정</span>
        </div>
        <span className="text-xs text-gray-400">{isOpen ? '▲' : '▼'}</span>
      </button>

      {/* 펼쳐진 영역 */}
      {isOpen && (
        <div className="px-4 pb-4 w-60 space-y-4">
          {/* 똥 크기 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-gray-600">💩 똥 크기</label>
              <span className="text-xs font-semibold text-pink-600">{poopSize.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={poopSize}
              onChange={(e) => setPoopSize(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
              <span>작게</span>
              <span>크게</span>
            </div>
          </div>

          {/* 똥 간격 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-gray-600">📏 똥 간격</label>
              <span className="text-xs font-semibold text-pink-600">{poopSpacing.toFixed(3)}</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.20"
              step="0.005"
              value={poopSpacing}
              onChange={(e) => setPoopSpacing(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
              <span>촘촘하게</span>
              <span>듬성듬성</span>
            </div>
          </div>

          {/* 프리셋 버튼 */}
          <div>
            <p className="text-[11px] text-gray-500 mb-1.5">빠른 설정</p>
            <div className="flex gap-1.5">
              <button
                onClick={() => applyPreset(0.7, 0.06)}
                className="flex-1 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 transition"
              >
                🌾 깔끔
              </button>
              <button
                onClick={() => applyPreset(1.0, 0.10)}
                className="flex-1 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 transition"
              >
                🐹 기본
              </button>
              <button
                onClick={() => applyPreset(1.5, 0.16)}
                className="flex-1 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 transition"
              >
                💩 빅
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
