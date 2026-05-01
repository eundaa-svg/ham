import HamsterPicker from './HamsterPicker'
import InputPanel from './InputPanel'
import StartButton from './StartButton'
import SettingsPanel from './SettingsPanel'

export default function GameHUD() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* 좌상단: 햄스터 선택 */}
      <div className="absolute top-6 left-6 pointer-events-auto">
        <HamsterPicker />
      </div>

      {/* 우상단: 설정 */}
      <div className="absolute top-6 right-6 pointer-events-auto">
        <SettingsPanel />
      </div>

      {/* 하단 중앙: 그리기 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto max-w-[90vw]">
        <InputPanel />
      </div>

      {/* 우하단: 시작 */}
      <div className="absolute bottom-6 right-6 pointer-events-auto">
        <StartButton />
      </div>
    </div>
  )
}
