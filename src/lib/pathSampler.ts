import { canvasToWorld } from './coords'
import type { PathPoint } from '../store/useGameStore'

// ── 드로잉 경로 샘플링 ──────────────────────────────────────────
// raw 픽셀 점들을 월드 좌표로 변환 후 spacing 간격으로 솎아냄
export function sampleDrawnPath(
  rawPoints: { x: number; y: number }[],
  spacing = 0.25
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

// ── 텍스트 경로 샘플링 ──────────────────────────────────────────
// 오프스크린 캔버스에 텍스트를 렌더링한 뒤,
// 어두운 픽셀만 추출해 3D 월드 좌표로 변환
export function sampleTextPath(text: string, spacing = 0.25): PathPoint[] {
  if (!text.trim()) return []

  const W = 800
  const H = 200
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  // 흰 배경
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, W, H)

  // 텍스트 렌더링 (한글 포함)
  ctx.fillStyle = 'black'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = 'bold 130px sans-serif'
  ctx.fillText(text, W / 2, H / 2)

  const { data } = ctx.getImageData(0, 0, W, H)

  // 어두운 픽셀(r < 80) 수집 — 4px 간격으로 샘플링해서 수량 제어
  const SAMPLE_STEP = 4
  const rawWorldPts: PathPoint[] = []

  for (let y = 0; y < H; y += SAMPLE_STEP) {
    for (let x = 0; x < W; x += SAMPLE_STEP) {
      const r = data[(y * W + x) * 4]
      if (r < 80) {
        // 800×200 캔버스 → 월드 x: -2.75~2.75, z: -0.9~0.9
        rawWorldPts.push({
          x: (x / W - 0.5) * 5.5,
          z: (y / H - 0.5) * 1.8,
        })
      }
    }
  }

  if (rawWorldPts.length === 0) return []

  // 가로줄 순서(y→x)로 정렬해 왼쪽-위부터 오른쪽-아래 방향으로 경로 형성
  rawWorldPts.sort((a, b) => a.z - b.z || a.x - b.x)

  // spacing 기반 다운샘플링
  const result: PathPoint[] = [rawWorldPts[0]]
  for (const pt of rawWorldPts) {
    const last = result[result.length - 1]
    const dx = pt.x - last.x
    const dz = pt.z - last.z
    if (Math.sqrt(dx * dx + dz * dz) >= spacing) {
      result.push(pt)
    }
  }

  return result
}
