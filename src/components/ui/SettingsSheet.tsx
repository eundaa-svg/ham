import { useGameStore } from '../../store/useGameStore'

interface Props { onClose: () => void }

export default function SettingsSheet({ onClose }: Props) {
  const poopSize       = useGameStore((s) => s.poopSize)
  const poopSpacing    = useGameStore((s) => s.poopSpacing)
  const poops          = useGameStore((s) => s.poops)
  const phase          = useGameStore((s) => s.phase)
  const setPoopSize    = useGameStore((s) => s.setPoopSize)
  const setPoopSpacing = useGameStore((s) => s.setPoopSpacing)
  const clearPoops     = useGameStore((s) => s.clearPoops)

  const canClear = poops.length > 0 && phase !== 'pooping'

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

          {/* 모두 치우기 */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
            <button
              onClick={() => { if (!canClear) return; clearPoops(); onClose() }}
              disabled={!canClear}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                background: canClear ? 'var(--bg)' : 'transparent',
                border: '1px solid var(--border)',
                color: canClear ? 'var(--text)' : 'var(--text-subtle)',
                opacity: canClear ? 1 : 0.5,
                cursor: canClear ? 'pointer' : 'not-allowed',
                transition: 'opacity 0.15s',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 11l4-4M2 12h6M9 5l3-3M11 4l-1-1"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M5.5 8.5l-2 2M7 7l1.5-1.5" stroke="currentColor"
                  strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span style={{ fontSize: 13, fontWeight: 500 }}>모두 치우기</span>
              {poops.length > 0 && (
                <span style={{
                  fontSize: 11, fontVariantNumeric: 'tabular-nums',
                  padding: '2px 8px', borderRadius: 'var(--radius-pill)',
                  background: 'var(--surface-elev)', color: 'var(--text-muted)',
                }}>
                  {poops.length}
                </span>
              )}
            </button>
          </div>
        </div>

        <div style={{ height: 8 }} />
      </div>
    </>
  )
}
