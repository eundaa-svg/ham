import type { PathPoint } from '../store/useGameStore'

interface Point { x: number; y: number }

// 정규화 좌표(0~1) → 월드 좌표
function toWorld(p: Point): PathPoint {
  return { x: (p.x - 0.5) * 6, z: (p.y - 0.5) * 3.5 }
}

// 점 배열을 등간격으로 리샘플링
function resampleByDistance(pts: PathPoint[], spacing: number): PathPoint[] {
  if (pts.length < 2) return pts
  const result: PathPoint[] = [pts[0]]
  let accumulated = 0
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x
    const dz = pts[i].z - pts[i - 1].z
    accumulated += Math.sqrt(dx * dx + dz * dz)
    if (accumulated >= spacing) {
      result.push(pts[i])
      accumulated = 0
    }
  }
  return result
}

// 스트로크 배열 → 3D 경로 점 배열
// 스트로크 내부에서만 샘플링 — 스트로크 간에는 점을 생성하지 않음
// 단, 다음 스트로크 시작점으로 이동할 수 있도록 각 스트로크 첫 점은 포함
export function sampleDrawnPath(
  strokes: Point[][],
  spacing = 0.10,
): PathPoint[] {
  if (!strokes || strokes.length === 0) return []

  const result: PathPoint[] = []

  strokes.forEach((stroke, strokeIdx) => {
    if (stroke.length < 2) return

    const worldPts = stroke.map(toWorld)
    const sampled  = resampleByDistance(worldPts, spacing)

    // 스트로크 간 이동 구간을 표시하기 위해
    // 스트로크 시작점 앞에 특수 마커 대신, 순서대로 이어서 추가
    // (Hamster.tsx에서 스트로크 경계를 구분할 수 있도록
    //  첫 스트로크가 아닌 경우 시작점 바로 앞에 "이동 전용" 점을 삽입할 수도 있으나,
    //  현재는 단순 연결 — 스트로크 간 이동 시 똥은 안 싸는 방식으로 추후 개선 가능)
    result.push(...sampled)
  })

  return result
}
