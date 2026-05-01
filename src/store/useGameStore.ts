import { create } from 'zustand'

export interface HamsterInstance {
  id: string
  variantId: string
  initialPosition: [number, number, number]
}

export type GamePhase = 'idle' | 'pooping' | 'completed'

export interface PathPoint {
  x: number
  z: number
}

export interface PoopInstance {
  id: string
  position: [number, number, number]
  rotation: number   // Y축 랜덤 회전값
  spawnedAt: number
}

interface GameStore {
  // ── 햄스터 ────────────────────────────────────────
  hamsters: HamsterInstance[]
  selectedVariantId: string

  // ── 입력 (드로잉 전용) ────────────────────────────
  drawnPoints: { x: number; y: number }[]   // 0~1 정규화 좌표

  // ── 게임 진행 ────────────────────────────────────
  phase: GamePhase
  computedPath: PathPoint[]
  poops: PoopInstance[]

  // ── 햄스터 actions ──────────────────────────────
  setSelectedVariant: (variantId: string) => void
  rebuildHamster: () => void

  // ── 입력 actions ────────────────────────────────
  addDrawnPoint: (point: { x: number; y: number }) => void
  clearDrawnPoints: () => void

  // ── 게임 actions ────────────────────────────────
  setPhase: (phase: GamePhase) => void
  setComputedPath: (path: PathPoint[]) => void
  addPoop: (poop: PoopInstance) => void
  clearPoops: () => void
  reset: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  hamsters: [],
  selectedVariantId: 'gray',

  drawnPoints: [],

  phase: 'idle',
  computedPath: [],
  poops: [],

  // ── 햄스터 actions ──────────────────────────────
  setSelectedVariant: (variantId) => {
    set({ selectedVariantId: variantId })
    get().rebuildHamster()
  },

  rebuildHamster: () => {
    const { selectedVariantId } = get()
    set({
      hamsters: [{
        id: `hamster-${Date.now()}`,
        variantId: selectedVariantId,
        initialPosition: [0, 0, 0],
      }],
    })
  },

  // ── 입력 actions ────────────────────────────────
  // drawnPoints는 0~1 정규화 좌표로 저장 (캔버스 크기 독립적)
  addDrawnPoint: (point) =>
    set((s) => ({ drawnPoints: [...s.drawnPoints, point] })),
  clearDrawnPoints: () => set({ drawnPoints: [] }),

  // ── 게임 actions ────────────────────────────────
  setPhase: (phase) => set({ phase }),
  setComputedPath: (path) => set({ computedPath: path }),
  addPoop: (poop) => set((s) => ({ poops: [...s.poops, poop] })),
  clearPoops: () => set({ poops: [] }),

  reset: () => set({ phase: 'idle', computedPath: [], poops: [] }),
}))

useGameStore.getState().rebuildHamster()
