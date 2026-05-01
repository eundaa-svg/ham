import { useGameStore } from '../../store/useGameStore'

interface Props { onClose: () => void }

export default function SettingsSheet({ onClose }: Props) {
  const poopSize       = useGameStore((s) => s.poopSize)
  const poopSpacing    = useGameStore((s) => s.poopSpacing)
  const setPoopSize    = useGameStore((s) => s.setPoopSize)
  const setPoopSpacing = useGameStore((s) => s.setPoopSpacing)

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 40,
          background: 'rgba(0,0,0,0.28)',
          animation: 'fadeIn 0.2s ease-out',
        }}
      />

      <div
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          zIndex: 50,
          background: 'var(--surface-elev)',
          borderRadius: '24px 24px 0 0',
          paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
          animation: 'slideUp 0.25s ease-out',
          maxWidth: 520,
          margin: '0 auto',
        }}
      >
        {/* Grabber */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 8px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border-strong)' }} />
        </div>

        {/* 제목 */}
        <div style={{ padding: '4px 20px 16px' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>똥 설정</h3>
        </div>

        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* 크기 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <label style={{ fontSize: 13, color: 'var(--text)' }}>크기</label>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>
                {poopSize.toFixed(1)}
              </span>
            </div>
            <input type="range" min="0.5" max="2.0" step="0.1"
              value={poopSize} onChange={(e) => setPoopSize(parseFloat(e.target.value))} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, color: 'var(--text-subtle)' }}>
              <span>작게</span><span>크게</span>
            </div>
          </div>

          {/* 간격 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <label style={{ fontSize: 13, color: 'var(--text)' }}>간격</label>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>
                {poopSpacing.toFixed(2)}
              </span>
            </div>
            <input type="range" min="0.05" max="0.20" step="0.005"
              value={poopSpacing} onChange={(e) => setPoopSpacing(parseFloat(e.target.value))} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, color: 'var(--text-subtle)' }}>
              <span>촘촘</span><span>듬성</span>
            </div>
          </div>
        </div>

        <div style={{ height: 24 }} />
      </div>
    </>
  )
}
