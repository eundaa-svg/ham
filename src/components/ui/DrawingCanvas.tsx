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
  ctx.fillStyle = '#FAF6EE'
  ctx.fillRect(0, 0, w, h)

  ctx.strokeStyle = '#3A2818'
  ctx.lineWidth   = Math.max(2, w / 140)
  ctx.lineCap     = 'round'
  ctx.lineJoin    = 'round'

  // 완료된 스트로크들: stroke마다 beginPath() → 서로 연결 안 됨
  for (const stroke of strokes) {
    if (stroke.length < 2) continue
    ctx.beginPath()
    ctx.moveTo(stroke[0].x * w, stroke[0].y * h)
    for (let i = 1; i < stroke.length; i++) {
      ctx.lineTo(stroke[i].x * w, stroke[i].y * h)
    }
    ctx.stroke()
  }

  // 현재 그리는 중인 스트로크
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
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const isDrawing  = useRef(false)
  const lastPt     = useRef<Point | null>(null)

  const [isExpanded, setIsExpanded] = useState(false)

  const CANVAS_W = isExpanded ? 560 : 280
  const CANVAS_H = isExpanded ? 360 : 160

  const drawnStrokes   = useGameStore((s) => s.drawnStrokes)
  const currentStroke  = useGameStore((s) => s.currentStroke)
  const startStroke    = useGameStore((s) => s.startStroke)
  const addPointToStroke = useGameStore((s) => s.addPointToStroke)
  const endStroke      = useGameStore((s) => s.endStroke)
  const clearDrawnStrokes = useGameStore((s) => s.clearDrawnStrokes)

  // 스트로크 또는 캔버스 크기 변경 시 다시 그리기
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

  // 캔버스 밖으로 나가면 stroke 종료
  const handlePointerLeave = () => {
    if (isDrawing.current) {
      isDrawing.current = false
      lastPt.current    = null
      endStroke()
    }
  }

  const handleExpandToggle = () => {
    const totalPoints = drawnStrokes.reduce((s, stroke) => s + stroke.length, 0)
    if (totalPoints > 0) {
      if (!window.confirm('확대/축소하면 현재 그림이 지워져요. 계속할까요?')) return
      clearDrawnStrokes()
    }
    setIsExpanded((v) => !v)
  }

  const totalPoints = drawnStrokes.reduce((s, stroke) => s + stroke.length, 0)
    + currentStroke.length

  return (
    <div className="flex flex-col gap-2">
      {/* 컨트롤 바 */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleExpandToggle}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-pink-100 hover:bg-pink-200 text-pink-700 text-xs font-medium transition"
        >
          {isExpanded
            ? <><span>🔍−</span><span>축소</span></>
            : <><span>🔍+</span><span>크게 그리기</span></>}
        </button>
        <button
          onClick={clearDrawnStrokes}
          className="text-xs text-gray-400 hover:text-gray-700 transition px-2"
        >
          지우기
        </button>
      </div>

      {/* 캔버스 */}
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        className="rounded-lg cursor-crosshair touch-none block"
        style={{ border: '1.5px solid #E0D5C0', backgroundColor: '#FAF6EE' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
      />

      {totalPoints === 0 && (
        <p className="text-xs text-gray-400 text-center">
          💡 마우스로 모양을 그려보세요
        </p>
      )}
    </div>
  )
}
