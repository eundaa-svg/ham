import { useGameStore } from '../../store/useGameStore'
import DrawingCanvas from './DrawingCanvas'

export default function InputPanel() {
  const inputMode = useGameStore((s) => s.inputMode)
  const textInput = useGameStore((s) => s.textInput)
  const setInputMode = useGameStore((s) => s.setInputMode)
  const setTextInput = useGameStore((s) => s.setTextInput)

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-4 w-80">
      {/* 텍스트 / 그리기 탭 */}
      <div className="flex gap-1 mb-3 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setInputMode('text')}
          className={`flex-1 py-1.5 rounded-md text-sm transition-all ${
            inputMode === 'text'
              ? 'bg-white shadow-sm font-medium text-gray-800'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          ✏️ 텍스트
        </button>
        <button
          onClick={() => setInputMode('drawing')}
          className={`flex-1 py-1.5 rounded-md text-sm transition-all ${
            inputMode === 'drawing'
              ? 'bg-white shadow-sm font-medium text-gray-800'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          🎨 그리기
        </button>
      </div>

      {/* 입력 영역 */}
      {inputMode === 'text' ? (
        <div>
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="햄스터들에게 그려줄 글자를 입력하세요"
            maxLength={10}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white/90 focus:outline-none focus:border-pink-300 text-sm text-gray-800 placeholder-gray-400"
          />
          <p className="text-xs text-gray-400 mt-1 text-right">
            {textInput.length} / 10
          </p>
        </div>
      ) : (
        <DrawingCanvas />
      )}
    </div>
  )
}
