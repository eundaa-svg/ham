import { canvasToWorld } from './coords'
import type { PathPoint } from '../store/useGameStore'

// ── 드로잉 경로 샘플링 ────────────────────────────────────────────
export function sampleDrawnPath(
  rawPoints: { x: number; y: number }[],
  spacing = 0.18
): PathPoint[] {
  if (rawPoints.length < 2) return []

  const worldPts = rawPoints.map((p) => canvasToWorld(p.x, p.y))

  // 누적 거리 기반 등간격 샘플링
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
// 오프스크린 캔버스에 텍스트 렌더링 → 어두운 픽셀 추출 → 3D 좌표 변환
export function sampleTextPath(text: string, spacing = 0.18): PathPoint[] {
  if (!text.trim()) return []

  const W = 800
  const H = 200
  const canvas = document.createElement('canvas')
  canvas.width  = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = 'black'
  ctx.textAlign     = 'center'
  ctx.textBaseline  = 'middle'
  ctx.font = 'bold 130px sans-serif'
  ctx.fillText(text, W / 2, H / 2)

  const { data } = ctx.getImageData(0, 0, W, H)

  // 3px 간격으로 샘플링 (기존 4 → 3, 더 촘촘)
  const STEP = 3
  const rawPts: PathPoint[] = []

  for (let y = 0; y < H; y += STEP) {
    for (let x = 0; x < W; x += STEP) {
      const r = data[(y * W + x) * 4]
      if (r < 80) {
        rawPts.push({
          x: (x / W - 0.5) * 5.5,
          z: (y / H - 0.5) * 1.8,
        })
      }
    }
  }

  if (rawPts.length === 0) return []

  // 위→아래, 좌→우 순 정렬 (글자를 순서대로 따라가게)
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
