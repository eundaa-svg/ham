import { useState } from 'react'
import { useGameStore } from '../../store/useGameStore'
import DrawingCanvas from './DrawingCanvas'

export default function BottomToolbar() {
  const [isExpanded, setIsExpanded] = useState(true)

  const drawnStrokes      = useGameStore((s) => s.drawnStrokes)
  const clearDrawnStrokes = useGameStore((s) => s.clearDrawnStrokes)
  const totalPoints = drawnStrokes.reduce((sum, s) => sum + s.length, 0)

  return (
    <div style={{
      borderRadius: 'var(--r-lg)',
      overflow: 'hidden',
      background: 'var(--surface)',
      border: '1px solid var(--line)',
      boxShadow: 'var(--shadow-sm)',
    }}>
      {/* 헤더 */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px',
        borderBottom: isExpanded ? '1px solid var(--line)' : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="t-caption">그리기</span>
          {drawnStrokes.length > 0 && (
            <span className="t-mono" style={{ fontSize: 11, color: 'var(--text)', fontWeight: 600 }}>
              {String(drawnStrokes.length).padStart(2, '0')}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {totalPoints > 0 && (
            <button
              onClick={clearDrawnStrokes}
              style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', padding: '4px 8px', letterSpacing: '0.02em' }}
            >
              지우기
            </button>
          )}
          <button
            onClick={() => setIsExpanded((v) => !v)}
            aria-label={isExpanded ? 'collapse' : 'expand'}
            style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d={isExpanded ? 'M2 6.5l3-3 3 3' : 'M2 3.5l3 3 3-3'}
                stroke="var(--text-muted)" strokeWidth="1.4"
                strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 캔버스 */}
      {isExpanded && (
        <div style={{ padding: '10px 12px 12px' }}>
          <DrawingCanvas />
        </div>
      )}
    </div>
  )
}
