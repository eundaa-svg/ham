import { create } from 'zustand'

export interface HamsterInstance {
  id: string
  variantId: string
  initialPosition: [number, number, number]
}

export type InputMode = 'text' | 'drawing'
export type GamePhase = 'idle' | 'pooping' | 'completed'

export interface PathPoint {
  x: number
  z: number
}

export interface PoopInstance {
  id: string
  position: [number, number, number]
  variantId: string
  spawnedAt: number
}

interface GameStore {
  // ── 햄스터 (단일 선택) ──────────────────────────
  hamsters: HamsterInstance[]
  selectedVariantId: string

  // ── 입력 ────────────────────────────────────────
  inputMode: InputMode
  textInput: string
  drawnPoints: { x: number; y: number }[]

  // ── 게임 진행 ────────────────────────────────────
  phase: GamePhase
  computedPath: PathPoint[]
  poops: PoopInstance[]

  // ── 햄스터 actions ──────────────────────────────
  setSelectedVariant: (variantId: string) => void
  rebuildHamster: () => void

  // ── 입력 actions ────────────────────────────────
  setInputMode: (mode: InputMode) => void
  setTextInput: (text: string) => void
  addDrawnPoint: (point: { x: number; y: number }) => void
  clearDrawnPoints: () => void
  clearInput: () => void

  // ── 게임 actions ────────────────────────────────
  setPhase: (phase: GamePhase) => void
  setComputedPath: (path: PathPoint[]) => void
  addPoop: (poop: PoopInstance) => void
  clearPoops: () => void
  reset: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  // ── 초기값 ──────────────────────────────────────
  hamsters: [],
  selectedVariantId: 'gray',

  inputMode: 'text',
  textInput: '',
  drawnPoints: [],

  phase: 'idle',
  computedPath: [],
  poops: [],

  // ── 햄스터 actions ──────────────────────────────

  setSelectedVariant: (variantId) => {
    set({ selectedVariantId: variantId })
    get().rebuildHamster()
  },

  // 선택된 종류의 햄스터 1마리를 중앙에 생성
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
  setInputMode: (mode) => set({ inputMode: mode }),
  setTextInput: (text) => set({ textInput: text }),
  addDrawnPoint: (point) =>
    set((s) => ({ drawnPoints: [...s.drawnPoints, point] })),
  clearDrawnPoints: () => set({ drawnPoints: [] }),
  clearInput: () => set({ textInput: '', drawnPoints: [] }),

  // ── 게임 actions ────────────────────────────────
  setPhase: (phase) => set({ phase }),
  setComputedPath: (path) => set({ computedPath: path }),
  addPoop: (poop) => set((s) => ({ poops: [...s.poops, poop] })),
  clearPoops: () => set({ poops: [] }),

  reset: () =>
    set({ phase: 'idle', computedPath: [], poops: [] }),
}))

// 앱 시작 시 햄스터 1마리 초기 생성
useGameStore.getState().rebuildHamster()
