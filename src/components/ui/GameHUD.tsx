import { useState } from 'react'
import TopBar from './TopBar'
import BottomToolbar from './BottomToolbar'
import StartFAB from './StartFAB'
import ClearPoopButton from './ClearPoopButton'
import HamsterPickerSheet from './HamsterPickerSheet'
import SettingsSheet from './SettingsSheet'

type Sheet = 'hamster' | 'settings' | null

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
          padding: 'max(16px, env(safe-area-inset-top)) 20px 24px',
          background: 'linear-gradient(to bottom, var(--bg) 50%, transparent)',
          pointerEvents: 'auto',
        }}>
          <TopBar
            onOpenHamster={() => setOpenSheet('hamster')}
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
          padding: '24px 20px max(20px, env(safe-area-inset-bottom))',
          background: 'linear-gradient(to top, var(--bg) 70%, transparent)',
          pointerEvents: 'auto',
        }}>
          <BottomToolbar />
        </div>
      </div>

      {/* 우하단: 모두 치우기(위) + 시작 FAB(아래) */}
      <div style={{
        position: 'fixed',
        bottom: 'calc(max(16px, env(safe-area-inset-bottom)) + 88px)',
        right: 20,
        zIndex: 30,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 12,
      }}>
        <ClearPoopButton />
        <StartFAB />
      </div>

      {/* 바텀 시트들 */}
      {openSheet === 'hamster'  && <HamsterPickerSheet onClose={close} />}
      {openSheet === 'settings' && <SettingsSheet      onClose={close} />}
    </>
  )
}
