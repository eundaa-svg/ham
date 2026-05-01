import type { PathPoint } from '../store/useGameStore'

interface Point { x: number; y: number }

// 정규화(0~1) → 월드 좌표
function toWorld(p: Point): PathPoint {
  return { x: (p.x - 0.5) * 6, z: (p.y - 0.5) * 3.5 }
}

// 선형 보간 기반 등간격 리샘플링
// 원본 점 분포와 무관하게 정확히 spacing 거리마다 새 점을 보간 생성
function resampleByDistance(pts: PathPoint[], spacing: number): PathPoint[] {
  if (pts.length < 2) return pts

  const result: PathPoint[] = [pts[0]]
  let lastPt = pts[0]
  let carry  = 0   // 이전 세그먼트에서 남은 거리

  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]
    const curr = pts[i]
    const dx   = curr.x - prev.x
    const dz   = curr.z - prev.z
    const segLen = Math.sqrt(dx * dx + dz * dz)
    if (segLen < 1e-9) continue

    // carry(이전 세그먼트 잔여)를 포함해 이 세그먼트 안에서 몇 개의 점 생성 가능한지
    let distAlongSeg = spacing - carry   // 첫 샘플링 점까지 남은 거리

    while (distAlongSeg <= segLen) {
      const t = distAlongSeg / segLen
      const newPt: PathPoint = {
        x: prev.x + dx * t,
        z: prev.z + dz * t,
      }
      result.push(newPt)
      lastPt = newPt
      distAlongSeg += spacing
    }

    // 이 세그먼트를 다 썼을 때 남은 거리를 carry로 이월
    carry = segLen - (distAlongSeg - spacing)
  }

  return result
}

// 스트로크 배열 → 3D 경로 점 배열
// stroke 내부에서만 등간격 샘플링 (stroke 간 연결선엔 점 없음)
export function sampleDrawnPath(
  strokes: Point[][],
  spacing = 0.08,
): PathPoint[] {
  if (!strokes || strokes.length === 0) return []

  const result: PathPoint[] = []

  strokes.forEach((stroke) => {
    if (stroke.length < 2) return
    const worldPts = stroke.map(toWorld)
    const sampled  = resampleByDistance(worldPts, spacing)
    result.push(...sampled)
  })

  return result
}
