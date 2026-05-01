import { useState } from 'react'
import TopBar from './TopBar'
import BottomToolbar from './BottomToolbar'
import StartFAB from './StartFAB'
import ClearPoopButton from './ClearPoopButton'
import HamsterPickerSheet from './HamsterPickerSheet'
import FoodPickerSheet from './FoodPickerSheet'
import SettingsSheet from './SettingsSheet'

type Sheet = 'hamster' | 'food' | 'settings' | null

export default function GameHUD() {
  const [openSheet, setOpenSheet] = useState<Sheet>(null)
  const close = () => setOpenSheet(null)

  return (
    <>
      {/* 상단 바 */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 20,
        pointerEvents: 'none',
      }}>
        <div style={{
          padding: 'max(16px, env(safe-area-inset-top)) 16px 16px',
          background: 'linear-gradient(to bottom, var(--bg) 55%, transparent)',
          pointerEvents: 'auto',
        }}>
          <TopBar
            onOpenHamster={() => setOpenSheet('hamster')}
            onOpenFood={() => setOpenSheet('food')}
            onOpenSettings={() => setOpenSheet('settings')}
          />
        </div>
      </div>

      {/* 하단 툴바 */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 20,
        pointerEvents: 'none',
        maxWidth: 520,
        margin: '0 auto',
      }}>
        <div style={{
          padding: '16px 16px max(16px, env(safe-area-inset-bottom))',
          background: 'linear-gradient(to top, var(--bg) 65%, transparent)',
          pointerEvents: 'auto',
        }}>
          <BottomToolbar />
        </div>
      </div>

      {/* 좌하단: 모두 치우기 (똥 있을 때만 노출) */}
      <div style={{
        position: 'fixed',
        bottom: 'calc(max(16px, env(safe-area-inset-bottom)) + 88px)',
        left: 20,
        zIndex: 30,
      }}>
        <ClearPoopButton />
      </div>

      {/* 우하단: 시작 FAB */}
      <div style={{
        position: 'fixed',
        bottom: 'calc(max(16px, env(safe-area-inset-bottom)) + 88px)',
        right: 20,
        zIndex: 30,
      }}>
        <StartFAB />
      </div>

      {/* 바텀 시트들 */}
      {openSheet === 'hamster'  && <HamsterPickerSheet onClose={close} />}
      {openSheet === 'food'     && <FoodPickerSheet    onClose={close} />}
      {openSheet === 'settings' && <SettingsSheet      onClose={close} />}
    </>
  )
}
