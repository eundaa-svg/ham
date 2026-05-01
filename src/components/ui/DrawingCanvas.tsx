import { useRef, useEffect, useState } from 'react'
import { useGameStore } from '../../store/useGameStore'

const CANVAS_W = 280
const CANVAS_H = 160

export default function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const lastPointRef = useRef<{ x: number; y: number } | null>(null)

  const drawnPoints = useGameStore((s) => s.drawnPoints)
  const addDrawnPoint = useGameStore((s) => s.addDrawnPoint)
  const clearDrawnPoints = useGameStore((s) => s.clearDrawnPoints)

  // drawnPoints가 바뀔 때마다 캔버스 다시 그리기
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)

    // 배경
    ctx.fillStyle = '#FAF6EE'
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

    if (drawnPoints.length < 2) return

    // 드로잉 선
    ctx.strokeStyle = '#6B5444'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(drawnPoints[0].x, drawnPoints[0].y)
    for (let i = 1; i < drawnPoints.length; i++) {
      ctx.lineTo(drawnPoints[i].x, drawnPoints[i].y)
    }
    ctx.stroke()
  }, [drawnPoints])

  // 캔버스 엘리먼트 기준 좌표 계산
  const getPos = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDrawing(true)
    const pos = getPos(e)
    lastPointRef.current = pos
    addDrawnPoint(pos)
    // 드래그 중 캔버스 밖으로 나가도 계속 추적
    canvasRef.current?.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing) return
    const pos = getPos(e)
    // 너무 가까운 점은 무시 (노이즈 제거)
    if (lastPointRef.current) {
      const dx = pos.x - lastPointRef.current.x
      const dy = pos.y - lastPointRef.current.y
      if (dx * dx + dy * dy < 9) return  // 3px 미만 이동 무시
    }
    lastPointRef.current = pos
    addDrawnPoint(pos)
  }

  const handlePointerUp = () => {
    setIsDrawing(false)
    lastPointRef.current = null
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        className="rounded-lg cursor-crosshair touch-none"
        style={{ border: '1px solid #E0D5C0', display: 'block' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />
      <button
        onClick={clearDrawnPoints}
        className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
      >
        지우기
      </button>
    </div>
  )
}
