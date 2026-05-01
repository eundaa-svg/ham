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
  rotation: number
  spawnedAt: number
}

interface GameStore {
  // ── 햄스터 ──────────────────────────────────────
  hamsters: HamsterInstance[]
  selectedVariantId: string

  // ── 입력 ────────────────────────────────────────
  drawnPoints: { x: number; y: number }[]

  // ── 게임 진행 ────────────────────────────────────
  phase: GamePhase
  computedPath: PathPoint[]
  poops: PoopInstance[]

  // ── 사용자 설정 ──────────────────────────────────
  poopSize: number      // 똥 크기 배율 (0.5 ~ 2.0)
  poopSpacing: number   // 경로 점 간격 (0.05 ~ 0.20)

  // ── actions ─────────────────────────────────────
  setSelectedVariant: (variantId: string) => void
  rebuildHamster: () => void
  addDrawnPoint: (point: { x: number; y: number }) => void
  clearDrawnPoints: () => void
  setPhase: (phase: GamePhase) => void
  setComputedPath: (path: PathPoint[]) => void
  addPoop: (poop: PoopInstance) => void
  clearPoops: () => void
  reset: () => void
  setPoopSize: (size: number) => void
  setPoopSpacing: (spacing: number) => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  hamsters: [],
  selectedVariantId: 'golden',

  drawnPoints: [],

  phase: 'idle',
  computedPath: [],
  poops: [],

  poopSize: 1.0,
  poopSpacing: 0.10,

  // ── 햄스터 ──────────────────────────────────────
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

  // ── 입력 ────────────────────────────────────────
  addDrawnPoint: (point) =>
    set((s) => ({ drawnPoints: [...s.drawnPoints, point] })),
  clearDrawnPoints: () => set({ drawnPoints: [] }),

  // ── 게임 ────────────────────────────────────────
  setPhase: (phase) => set({ phase }),
  setComputedPath: (path) => set({ computedPath: path }),
  addPoop: (poop) => set((s) => ({ poops: [...s.poops, poop] })),
  clearPoops: () => set({ poops: [] }),
  reset: () => set({ phase: 'idle', computedPath: [], poops: [] }),

  // ── 설정 ────────────────────────────────────────
  setPoopSize: (size) => set({ poopSize: size }),
  setPoopSpacing: (spacing) => set({ poopSpacing: spacing }),
}))

useGameStore.getState().rebuildHamster()
