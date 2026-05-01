import { useRef, useEffect, useState } from 'react'
import { useGameStore } from '../../store/useGameStore'

// 정규화 좌표(0~1)를 캔버스 픽셀로 변환해서 그리기
function redrawCanvas(
  canvas: HTMLCanvasElement,
  points: { x: number; y: number }[],
  w: number,
  h: number,
) {
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = '#FAF6EE'
  ctx.fillRect(0, 0, w, h)

  if (points.length < 2) return

  ctx.strokeStyle = '#6B5444'
  ctx.lineWidth   = Math.max(2, w / 140)   // 캔버스 크기에 비례한 선 굵기
  ctx.lineCap     = 'round'
  ctx.lineJoin    = 'round'
  ctx.beginPath()
  // 정규화 좌표 → 픽셀 좌표
  ctx.moveTo(points[0].x * w, points[0].y * h)
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x * w, points[i].y * h)
  }
  ctx.stroke()
}

export default function DrawingCanvas() {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const isDrawing   = useRef(false)
  const lastPt      = useRef<{ x: number; y: number } | null>(null)

  const [isExpanded, setIsExpanded] = useState(false)

  // 현재 캔버스 크기
  const CANVAS_W = isExpanded ? 560 : 280
  const CANVAS_H = isExpanded ? 360 : 160

  const drawnPoints     = useGameStore((s) => s.drawnPoints)
  const addDrawnPoint   = useGameStore((s) => s.addDrawnPoint)
  const clearDrawnPoints = useGameStore((s) => s.clearDrawnPoints)

  // drawnPoints 또는 캔버스 크기가 바뀔 때마다 다시 그리기
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    redrawCanvas(canvas, drawnPoints, CANVAS_W, CANVAS_H)
  }, [drawnPoints, CANVAS_W, CANVAS_H])

  // 포인터 위치를 정규화 좌표(0~1)로 변환
  const getNormalized = (e: React.PointerEvent) => {
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
    addDrawnPoint(pt)
    canvasRef.current?.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing.current) return
    const pt = getNormalized(e)
    if (lastPt.current) {
      // 정규화 좌표 기준 최소 이동 거리 (약 3px / 캔버스폭)
      const threshold = 3 / CANVAS_W
      const dx = pt.x - lastPt.current.x
      const dy = pt.y - lastPt.current.y
      if (dx * dx + dy * dy < threshold * threshold) return
    }
    lastPt.current = pt
    addDrawnPoint(pt)
  }

  const handlePointerUp = () => {
    isDrawing.current = false
    lastPt.current    = null
  }

  const handleExpandToggle = () => {
    // 그림이 있으면 confirm
    if (drawnPoints.length > 0) {
      if (!window.confirm('확대/축소하면 현재 그림이 지워져요. 계속할까요?')) return
      clearDrawnPoints()
    }
    setIsExpanded((v) => !v)
  }

  return (
    <div className="flex flex-col gap-2">
      {/* 컨트롤 바 */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleExpandToggle}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-pink-100 hover:bg-pink-200 text-pink-700 text-xs font-medium transition"
        >
          {isExpanded ? (
            <><span>🔍−</span><span>축소</span></>
          ) : (
            <><span>🔍+</span><span>크게 그리기</span></>
          )}
        </button>
        <button
          onClick={clearDrawnPoints}
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
      />

      {/* 안내 문구 */}
      {drawnPoints.length === 0 && (
        <p className="text-xs text-gray-400 text-center">
          💡 마우스로 모양을 그려보세요
        </p>
      )}
      {isExpanded && drawnPoints.length === 0 && (
        <p className="text-xs text-gray-400 text-center">
          넓게 그릴수록 더 정확하게 표현돼요
        </p>
      )}
    </div>
  )
}
