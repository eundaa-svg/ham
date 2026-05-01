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
  foodId: string    // 어떤 먹이에서 나온 똥인지
  spawnedAt: number
}

interface Point { x: number; y: number }

interface GameStore {
  // ── 햄스터 ──────────────────────────────────────
  hamsters: HamsterInstance[]
  selectedVariantId: string

  // ── 사용자 클릭 타겟 ─────────────────────────────
  userTarget: { x: number; z: number } | null
  setUserTarget: (target: { x: number; z: number } | null) => void

  // ── 먹이 ────────────────────────────────────────
  selectedFoodId: string

  // ── 드로잉 입력 ──────────────────────────────────
  drawnStrokes: Point[][]
  currentStroke: Point[]

  // ── 게임 진행 ────────────────────────────────────
  phase: GamePhase
  computedPath: PathPoint[]
  poops: PoopInstance[]

  // ── 사용자 설정 ──────────────────────────────────
  poopSize: number
  poopSpacing: number

  // ── UI 상태 ──────────────────────────────────────
  isInputPanelCollapsed: boolean

  // ── actions ─────────────────────────────────────
  setSelectedVariant: (variantId: string) => void
  rebuildHamster: () => void
  setSelectedFood: (foodId: string) => void

  startStroke: () => void
  addPointToStroke: (p: Point) => void
  endStroke: () => void
  clearDrawnStrokes: () => void

  setPhase: (phase: GamePhase) => void
  setComputedPath: (path: PathPoint[]) => void
  addPoop: (poop: PoopInstance) => void
  clearPoops: () => void
  reset: () => void

  setPoopSize: (size: number) => void
  setPoopSpacing: (spacing: number) => void
  setInputPanelCollapsed: (v: boolean) => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  hamsters: [],
  selectedVariantId: 'golden',
  userTarget: null,

  selectedFoodId: 'sunflower',

  drawnStrokes: [],
  currentStroke: [],

  phase: 'idle',
  computedPath: [],
  poops: [],

  poopSize: 1.0,
  poopSpacing: 0.10,

  isInputPanelCollapsed: false,

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

  setSelectedFood: (foodId) => set({ selectedFoodId: foodId }),
  setUserTarget: (target) => set({ userTarget: target }),

  // ── 드로잉 ──────────────────────────────────────
  startStroke: () => set({ currentStroke: [] }),
  addPointToStroke: (p) => set((s) => ({ currentStroke: [...s.currentStroke, p] })),
  endStroke: () => {
    const { currentStroke, drawnStrokes } = get()
    if (currentStroke.length > 0) {
      set({ drawnStrokes: [...drawnStrokes, currentStroke], currentStroke: [] })
    }
  },
  clearDrawnStrokes: () => set({ drawnStrokes: [], currentStroke: [] }),

  // ── 게임 ────────────────────────────────────────
  setPhase: (phase) => set({ phase }),
  setComputedPath: (path) => set({ computedPath: path }),
  addPoop: (poop) => set((s) => ({ poops: [...s.poops, poop] })),
  clearPoops: () => set({ poops: [] }),
  reset: () => set({ phase: 'idle', computedPath: [], poops: [] }),

  // ── 설정 ────────────────────────────────────────
  setPoopSize: (size) => set({ poopSize: size }),
  setPoopSpacing: (spacing) => set({ poopSpacing: spacing }),
  setInputPanelCollapsed: (v) => set({ isInputPanelCollapsed: v }),
}))

useGameStore.getState().rebuildHamster()
