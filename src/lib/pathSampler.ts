import type { PathPoint } from '../store/useGameStore'

// drawnPoints는 0~1 정규화 좌표 → 3D 월드 좌표로 변환 후 등간격 샘플링
export function sampleDrawnPath(
  rawPoints: { x: number; y: number }[],
  spacing = 0.15,
): PathPoint[] {
  if (rawPoints.length < 2) return []

  // 정규화(0~1) → 월드 좌표: x: -3~3, z: -1.75~1.75
  const worldPts: PathPoint[] = rawPoints.map((p) => ({
    x: (p.x - 0.5) * 6,
    z: (p.y - 0.5) * 3.5,
  }))

  // 누적 거리 기반 등간격 샘플링
  const result: PathPoint[] = [worldPts[0]]
  let accumulated = 0

  for (let i = 1; i < worldPts.length; i++) {
    const prev = worldPts[i - 1]
    const curr = worldPts[i]
    const dx   = curr.x - prev.x
    const dz   = curr.z - prev.z
    accumulated += Math.sqrt(dx * dx + dz * dz)
    if (accumulated >= spacing) {
      result.push(curr)
      accumulated = 0
    }
  }

  return result
}
