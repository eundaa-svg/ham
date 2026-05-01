import DrawingCanvas from './DrawingCanvas'
import { useGameStore } from '../../store/useGameStore'

export default function InputPanel() {
  const isCollapsed  = useGameStore((s) => s.isInputPanelCollapsed)
  const setCollapsed = useGameStore((s) => s.setInputPanelCollapsed)

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden">
      {/* 헤더 — 항상 표시, 클릭으로 접기/펼치기 */}
      <button
        onClick={() => setCollapsed(!isCollapsed)}
        className="w-full px-4 py-3 flex items-center justify-between gap-2 hover:bg-white/40 transition"
      >
        <div className="flex items-center gap-2">
          <span className="text-base">🎨</span>
          <span className="text-sm font-semibold text-gray-700">햄스터에게 그려주기</span>
        </div>
        <span className="text-xs text-gray-400">
          {isCollapsed ? '▲ 펼치기' : '▼ 접기'}
        </span>
      </button>

      {/* 드로잉 캔버스 — 펼쳐진 상태에서만 표시 */}
      {!isCollapsed && (
        <div className="px-4 pb-4">
          <DrawingCanvas />
        </div>
      )}
    </div>
  )
}
