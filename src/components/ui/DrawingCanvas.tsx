import { useRef, useEffect, useState } from 'react'
import { useGameStore } from '../../store/useGameStore'

interface Point { x: number; y: number }

function drawStrokes(
  canvas: HTMLCanvasElement,
  strokes: Point[][],
  current: Point[],
  w: number,
  h: number,
) {
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = getComputedStyle(document.documentElement)
    .getPropertyValue('--bg').trim() || '#F2EBDD'
  ctx.fillRect(0, 0, w, h)

  ctx.strokeStyle = '#3A2818'
  ctx.lineWidth   = Math.max(2, w / 140)
  ctx.lineCap     = 'round'
  ctx.lineJoin    = 'round'

  for (const stroke of strokes) {
    if (stroke.length < 2) continue
    ctx.beginPath()
    ctx.moveTo(stroke[0].x * w, stroke[0].y * h)
    for (let i = 1; i < stroke.length; i++) {
      ctx.lineTo(stroke[i].x * w, stroke[i].y * h)
    }
    ctx.stroke()
  }

  if (current.length >= 2) {
    ctx.beginPath()
    ctx.moveTo(current[0].x * w, current[0].y * h)
    for (let i = 1; i < current.length; i++) {
      ctx.lineTo(current[i].x * w, current[i].y * h)
    }
    ctx.stroke()
  }
}

export default function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawing = useRef(false)
  const lastPt    = useRef<Point | null>(null)

  const [isExpanded, setIsExpanded] = useState(false)

  const CANVAS_W = isExpanded ? 560 : 280
  const CANVAS_H = isExpanded ? 360 : 160

  const drawnStrokes      = useGameStore((s) => s.drawnStrokes)
  const currentStroke     = useGameStore((s) => s.currentStroke)
  const startStroke       = useGameStore((s) => s.startStroke)
  const addPointToStroke  = useGameStore((s) => s.addPointToStroke)
  const endStroke         = useGameStore((s) => s.endStroke)
  const clearDrawnStrokes = useGameStore((s) => s.clearDrawnStrokes)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawStrokes(canvas, drawnStrokes, currentStroke, CANVAS_W, CANVAS_H)
  }, [drawnStrokes, currentStroke, CANVAS_W, CANVAS_H])

  const getNormalized = (e: React.PointerEvent): Point => {
    const rect = canvasRef.current!.getBoundingClientRect()
    return {
      x: Math.max(0, Math.min(1, (e.clientX - rect.left) / CANVAS_W)),
      y: Math.max(0, Math.min(1, (e.clientY - rect.top)  / CANVAS_H)),
    }
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    isDrawing.current = true
    const pt = getNormalized(e)
    lastPt.current = pt
    startStroke()
    addPointToStroke(pt)
    canvasRef.current?.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing.current) return
    const pt = getNormalized(e)
    if (lastPt.current) {
      const threshold = 3 / CANVAS_W
      const dx = pt.x - lastPt.current.x
      const dy = pt.y - lastPt.current.y
      if (dx * dx + dy * dy < threshold * threshold) return
    }
    lastPt.current = pt
    addPointToStroke(pt)
  }

  const handlePointerUp = () => {
    isDrawing.current = false
    lastPt.current    = null
    endStroke()
  }

  const handlePointerLeave = () => {
    if (isDrawing.current) {
      isDrawing.current = false
      lastPt.current    = null
      endStroke()
    }
  }

  const handleExpandToggle = () => {
    const total = drawnStrokes.reduce((s, st) => s + st.length, 0)
    if (total > 0) {
      if (!window.confirm('확대/축소하면 현재 그림이 지워져요. 계속할까요?')) return
      clearDrawnStrokes()
    }
    setIsExpanded((v) => !v)
  }

  const totalPoints = drawnStrokes.reduce((s, st) => s + st.length, 0) + currentStroke.length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* 컨트롤 바 */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleExpandToggle}
          className="transition-colors"
          style={{
            padding: '5px 10px',
            borderRadius: 'var(--radius-sm)',
            fontSize: 11,
            fontWeight: 500,
            background: isExpanded ? 'var(--accent-soft)' : 'var(--bg)',
            color: isExpanded ? 'var(--accent)' : 'var(--text-muted)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {isExpanded ? '축소' : '크게'}
        </button>
        <button
          onClick={clearDrawnStrokes}
          style={{
            fontSize: 11,
            color: 'var(--text-subtle)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
          }}
        >
          지우기
        </button>
      </div>

      {/* 캔버스 */}
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        style={{
          display: 'block',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          backgroundColor: 'var(--bg)',
          cursor: 'crosshair',
          touchAction: 'none',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
      />

      {totalPoints === 0 && (
        <p
          style={{
            fontSize: 11,
            color: 'var(--text-subtle)',
            textAlign: 'center',
          }}
        >
          마우스로 모양을 그려보세요
        </p>
      )}
    </div>
  )
}
