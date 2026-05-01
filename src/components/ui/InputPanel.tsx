import DrawingCanvas from './DrawingCanvas'
import { useGameStore } from '../../store/useGameStore'

export default function InputPanel() {
  const isCollapsed  = useGameStore((s) => s.isInputPanelCollapsed)
  const setCollapsed = useGameStore((s) => s.setInputPanelCollapsed)

  return (
    <div
      style={{
        background: 'var(--surface-elev)',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}
    >
      {/* 헤더 */}
      <button
        onClick={() => setCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between transition-colors"
        style={{
          padding: '12px 16px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
          그리기
        </span>
        <span style={{ fontSize: 16, color: 'var(--text-subtle)', lineHeight: 1 }}>
          {isCollapsed ? '+' : '−'}
        </span>
      </button>

      {/* 드로잉 캔버스 */}
      {!isCollapsed && (
        <div
          style={{
            borderTop: '1px solid var(--border)',
            padding: '12px 16px 16px',
          }}
        >
          <DrawingCanvas />
        </div>
      )}
    </div>
  )
}
