import { useState } from 'react'
import { useGameStore } from '../../store/useGameStore'
import DrawingCanvas from './DrawingCanvas'

export default function BottomToolbar() {
  const [isExpanded, setIsExpanded] = useState(true)

  const drawnStrokes     = useGameStore((s) => s.drawnStrokes)
  const clearDrawnStrokes = useGameStore((s) => s.clearDrawnStrokes)
  const totalPoints = drawnStrokes.reduce((sum, s) => sum + s.length, 0)

  return (
    <div style={{
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      background: 'var(--surface-elev)',
      boxShadow: 'var(--shadow-md)',
      border: '1px solid var(--border)',
    }}>
      {/* 헤더 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>그리기</span>
          {drawnStrokes.length > 0 && (
            <span style={{
              fontSize: 10, fontWeight: 600,
              padding: '2px 7px',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--accent-soft)',
              color: 'var(--accent)',
            }}>
              {drawnStrokes.length}획
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {totalPoints > 0 && (
            <button
              onClick={clearDrawnStrokes}
              style={{
                fontSize: 11, padding: '5px 10px',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-muted)',
                background: 'transparent', border: 'none',
              }}
            >
              지우기
            </button>
          )}
          <button
            onClick={() => setIsExpanded((v) => !v)}
            aria-label={isExpanded ? '접기' : '펼치기'}
            style={{
              width: 28, height: 28,
              borderRadius: 'var(--radius-sm)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: 'none',
              color: 'var(--text-muted)',
            }}
          >
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path
                d={isExpanded ? 'M1 6l5-5 5 5' : 'M1 2l5 5 5-5'}
                stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 캔버스 */}
      {isExpanded && (
        <div style={{
          borderTop: '1px solid var(--border)',
          padding: '10px 12px 12px',
        }}>
          <DrawingCanvas />
        </div>
      )}
    </div>
  )
}
