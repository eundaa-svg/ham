import DrawingCanvas from './DrawingCanvas'

// 텍스트 탭 제거 — 드로잉 캔버스만 표시
export default function InputPanel() {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">
        🎨 햄스터에게 그려주기
      </h3>
      <DrawingCanvas />
    </div>
  )
}
