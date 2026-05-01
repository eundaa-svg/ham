import HamsterPicker from './HamsterPicker'
import InputPanel from './InputPanel'
import StartButton from './StartButton'

// 외곽: pointer-events-none → Canvas 조작 유지
// 각 패널: pointer-events-auto
export default function GameHUD() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* 좌상단: 햄스터 선택 */}
      <div className="absolute top-4 left-4 pointer-events-auto">
        <HamsterPicker />
      </div>

      {/* 하단 중앙: 드로잉 입력 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto max-w-[90vw]">
        <InputPanel />
      </div>

      {/* 우하단: 시작 / 중단 버튼 */}
      <div className="absolute bottom-4 right-4 pointer-events-auto">
        <StartButton />
      </div>
    </div>
  )
}
