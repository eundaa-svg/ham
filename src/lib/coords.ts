// 드로잉 캔버스(280×160 px) ↔ 3D 월드 좌표 변환

const CANVAS_W = 280
const CANVAS_H = 160
const WORLD_W = 6   // 월드 x 범위: -3 ~ 3
const WORLD_H = 3.5 // 월드 z 범위: -1.75 ~ 1.75

export function canvasToWorld(x: number, y: number): { x: number; z: number } {
  return {
    x: (x / CANVAS_W - 0.5) * WORLD_W,
    z: (y / CANVAS_H - 0.5) * WORLD_H,
  }
}
