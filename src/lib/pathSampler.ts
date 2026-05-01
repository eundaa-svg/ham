import { canvasToWorld } from './coords'
import type { PathPoint } from '../store/useGameStore'

// ── 드로잉 경로 샘플링 ────────────────────────────────────────────
export function sampleDrawnPath(
  rawPoints: { x: number; y: number }[],
  spacing = 0.15
): PathPoint[] {
  if (rawPoints.length < 2) return []

  const worldPts = rawPoints.map((p) => canvasToWorld(p.x, p.y))

  const result: PathPoint[] = [worldPts[0]]
  let accumulated = 0

  for (let i = 1; i < worldPts.length; i++) {
    const prev = worldPts[i - 1]
    const curr = worldPts[i]
    const dx = curr.x - prev.x
    const dz = curr.z - prev.z
    accumulated += Math.sqrt(dx * dx + dz * dz)
    if (accumulated >= spacing) {
      result.push(curr)
      accumulated = 0
    }
  }

  return result
}

// ── 텍스트 경로 샘플링 ────────────────────────────────────────────
// strokeText로 외곽선만 추출 → 내부 채우기 없이 글자 윤곽을 따라 이동
export function sampleTextPath(text: string, spacing = 0.15): PathPoint[] {
  if (!text.trim()) return []

  const W = 800
  const H = 200
  const canvas = document.createElement('canvas')
  canvas.width  = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, W, H)

  // fillText 대신 strokeText: 글자 외곽선만 그림 → 경로가 윤곽을 따라감
  ctx.strokeStyle  = 'black'
  ctx.lineWidth    = 8          // 외곽선 두께 (픽셀 샘플링이 잘 되도록)
  ctx.textAlign    = 'center'
  ctx.textBaseline = 'middle'
  ctx.font         = 'bold 140px sans-serif'
  ctx.strokeText(text, W / 2, H / 2)

  const { data } = ctx.getImageData(0, 0, W, H)

  // 2px 간격으로 어두운 픽셀 수집
  const STEP = 2
  const rawPts: PathPoint[] = []

  for (let y = 0; y < H; y += STEP) {
    for (let x = 0; x < W; x += STEP) {
      const r = data[(y * W + x) * 4]
      if (r < 100) {
        rawPts.push({
          x: (x / W - 0.5) * 5.5,
          z: (y / H - 0.5) * 1.8,
        })
      }
    }
  }

  if (rawPts.length === 0) return []

  // 위→아래, 좌→우 순 정렬
  rawPts.sort((a, b) => a.z - b.z || a.x - b.x)

  // spacing 기반 다운샘플링
  const result: PathPoint[] = [rawPts[0]]
  for (const pt of rawPts) {
    const last = result[result.length - 1]
    const dx = pt.x - last.x
    const dz = pt.z - last.z
    if (Math.sqrt(dx * dx + dz * dz) >= spacing) {
      result.push(pt)
    }
  }

  return result
}
