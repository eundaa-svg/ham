import { useRef, useEffect, useState } from 'react'
import { useGameStore } from '../../store/useGameStore'

interface Point { x: number; y: number }

function redraw(canvas: HTMLCanvasElement, strokes: Point[][], current: Point[], w: number, h: number) {
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = '#E8E0D0'   // --bg-soft
  ctx.fillRect(0, 0, w, h)

  ctx.strokeStyle = '#1A1614'  // --text
  ctx.lineWidth   = Math.max(1.5, w / 220)
  ctx.lineCap     = 'round'
  ctx.lineJoin    = 'round'

  for (const stroke of strokes) {
    if (stroke.length < 2) continue
    ctx.beginPath()
    ctx.moveTo(stroke[0].x * w, stroke[0].y * h)
    for (let i = 1; i < stroke.length; i++) ctx.lineTo(stroke[i].x * w, stroke[i].y * h)
    ctx.stroke()
  }

  if (current.length >= 2) {
    ctx.beginPath()
    ctx.moveTo(current[0].x * w, current[0].y * h)
    for (let i = 1; i < current.length; i++) ctx.lineTo(current[i].x * w, current[i].y * h)
    ctx.stroke()
  }
}

export default function DrawingCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const isDrawing    = useRef(false)
  const lastPt       = useRef<Point | null>(null)

  const [size, setSize] = useState({ w: 320, h: 200 })

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return
      const w = containerRef.current.clientWidth
      const h = Math.round(Math.min(260, w * 0.6))
      setSize({ w, h })
    }
    update()
    const ro = new ResizeObserver(update)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const drawnStrokes     = useGameStore((s) => s.drawnStrokes)
  const currentStroke    = useGameStore((s) => s.currentStroke)
  const startStroke      = useGameStore((s) => s.startStroke)
  const addPointToStroke = useGameStore((s) => s.addPointToStroke)
  const endStroke        = useGameStore((s) => s.endStroke)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    redraw(canvas, drawnStrokes, currentStroke, size.w, size.h)
  }, [drawnStrokes, currentStroke, size])

  const getNorm = (e: React.PointerEvent): Point => {
    const rect = canvasRef.current!.getBoundingClientRect()
    return {
      x: Math.max(0, Math.min(1, (e.clientX - rect.left) / size.w)),
      y: Math.max(0, Math.min(1, (e.clientY - rect.top)  / size.h)),
    }
  }

  const onDown = (e: React.PointerEvent) => {
    isDrawing.current = true
    const pt = getNorm(e)
    lastPt.current = pt
    startStroke()
    addPointToStroke(pt)
    canvasRef.current?.setPointerCapture(e.pointerId)
  }

  const onMove = (e: React.PointerEvent) => {
    if (!isDrawing.current) return
    const pt = getNorm(e)
    if (lastPt.current) {
      const thr = 3 / size.w
      const dx = pt.x - lastPt.current.x
      const dy = pt.y - lastPt.current.y
      if (dx * dx + dy * dy < thr * thr) return
    }
    lastPt.current = pt
    addPointToStroke(pt)
  }

  const onUp = () => { isDrawing.current = false; lastPt.current = null; endStroke() }
  const onLeave = () => { if (isDrawing.current) { isDrawing.current = false; lastPt.current = null; endStroke() } }

  const empty = drawnStrokes.length === 0 && currentStroke.length === 0

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <canvas
        ref={canvasRef}
        width={size.w}
        height={size.h}
        style={{
          display: 'block', width: '100%',
          borderRadius: 'var(--r-md)',
          border: '1px solid var(--line)',
          backgroundColor: 'var(--bg-soft)',
          cursor: 'crosshair',
          touchAction: 'none',
        }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onLeave}
      />
      {empty && (
        <p className="t-caption" style={{ textAlign: 'center', marginTop: 8 }}>
          Draw something
        </p>
      )}
    </div>
  )
}
