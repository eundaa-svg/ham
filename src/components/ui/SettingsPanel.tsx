import { useState } from 'react'
import { useGameStore } from '../../store/useGameStore'

export default function SettingsPanel() {
  const [isOpen, setIsOpen] = useState(false)

  const poopSize       = useGameStore((s) => s.poopSize)
  const poopSpacing    = useGameStore((s) => s.poopSpacing)
  const setPoopSize    = useGameStore((s) => s.setPoopSize)
  const setPoopSpacing = useGameStore((s) => s.setPoopSpacing)

  return (
    <div
      style={{
        background: 'var(--surface-elev)',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        width: 220,
      }}
    >
      {/* 헤더 */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between transition-colors"
        style={{
          padding: '12px 16px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
          설정
        </span>
        <span style={{ fontSize: 16, color: 'var(--text-subtle)', lineHeight: 1 }}>
          {isOpen ? '−' : '+'}
        </span>
      </button>

      {/* 펼쳐진 영역 */}
      {isOpen && (
        <div
          style={{
            borderTop: '1px solid var(--border)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {/* 크기 슬라이더 */}
          <div>
            <div
              className="flex items-center justify-between"
              style={{ marginBottom: 8 }}
            >
              <label style={{ fontSize: 12, color: 'var(--text-muted)' }}>크기</label>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: 'var(--text)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {poopSize.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={poopSize}
              onChange={(e) => setPoopSize(parseFloat(e.target.value))}
            />
            <div
              className="flex justify-between"
              style={{ marginTop: 4, fontSize: 10, color: 'var(--text-subtle)' }}
            >
              <span>작게</span>
              <span>크게</span>
            </div>
          </div>

          {/* 간격 슬라이더 */}
          <div>
            <div
              className="flex items-center justify-between"
              style={{ marginBottom: 8 }}
            >
              <label style={{ fontSize: 12, color: 'var(--text-muted)' }}>간격</label>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: 'var(--text)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {poopSpacing.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.20"
              step="0.005"
              value={poopSpacing}
              onChange={(e) => setPoopSpacing(parseFloat(e.target.value))}
            />
            <div
              className="flex justify-between"
              style={{ marginTop: 4, fontSize: 10, color: 'var(--text-subtle)' }}
            >
              <span>촘촘</span>
              <span>듬성</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
