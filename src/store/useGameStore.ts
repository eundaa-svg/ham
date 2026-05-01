import { create } from 'zustand'

export interface HamsterInstance {
  id: string
  variantId: string
  initialPosition: [number, number, number]
}

export type InputMode = 'text' | 'drawing'
export type GamePhase = 'idle' | 'pooping' | 'completed'

export interface PathPoint {
  x: number // 3D world x
  z: number // 3D world z
}

export interface PoopInstance {
  id: string
  position: [number, number, number]
  variantId: string
  spawnedAt: number
}

interface GameStore {
  // ── 햄스터 ──────────────────────────────
  hamsters: HamsterInstance[]
  selectedVariants: string[]
  countPerVariant: number

  // ── 입력 ────────────────────────────────
  inputMode: InputMode
  textInput: string
  drawnPoints: { x: number; y: number }[]

  // ── 게임 진행 ────────────────────────────
  phase: GamePhase
  computedPath: PathPoint[]
  hamsterAssignments: Record<string, number[]> // 햄스터 id → 담당 경로 점 인덱스
  poops: PoopInstance[]
  completedCount: number // 미션 끝낸 햄스터 수

  // ── 햄스터 actions ──────────────────────
  toggleVariant: (variantId: string) => void
  setCountPerVariant: (n: number) => void
  rebuildHamsters: () => void

  // ── 입력 actions ────────────────────────
  setInputMode: (mode: InputMode) => void
  setTextInput: (text: string) => void
  addDrawnPoint: (point: { x: number; y: number }) => void
  clearDrawnPoints: () => void
  clearInput: () => void

  // ── 게임 actions ────────────────────────
  setPhase: (phase: GamePhase) => void
  setComputedPath: (path: PathPoint[]) => void
  setHamsterAssignments: (a: Record<string, number[]>) => void
  addPoop: (poop: PoopInstance) => void
  clearPoops: () => void
  reportHamsterDone: () => void // 햄스터 1마리가 미션 끝냈을 때 호출
  reset: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  // ── 초기값 ──────────────────────────────
  hamsters: [],
  selectedVariants: ['gray', 'beige', 'brown', 'white', 'tricolor'],
  countPerVariant: 1,

  inputMode: 'text',
  textInput: '',
  drawnPoints: [],

  phase: 'idle',
  computedPath: [],
  hamsterAssignments: {},
  poops: [],
  completedCount: 0,

  // ── 햄스터 actions ──────────────────────
  toggleVariant: (variantId) => {
    const current = get().selectedVariants
    const next = current.includes(variantId)
      ? current.filter((id) => id !== variantId)
      : [...current, variantId]
    set({ selectedVariants: next })
    get().rebuildHamsters()
  },

  setCountPerVariant: (n) => {
    set({ countPerVariant: Math.max(1, Math.min(5, n)) })
    get().rebuildHamsters()
  },

  rebuildHamsters: () => {
    const { selectedVariants, countPerVariant } = get()
    const newHamsters: HamsterInstance[] = []
    selectedVariants.forEach((variantId) => {
      for (let i = 0; i < countPerVariant; i++) {
        const angle = Math.random() * Math.PI * 2
        const radius = Math.random() * 5
        newHamsters.push({
          id: `${variantId}-${i}-${Date.now()}-${Math.random()}`,
          variantId,
          initialPosition: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius],
        })
      }
    })
    set({ hamsters: newHamsters })
  },

  // ── 입력 actions ────────────────────────
  setInputMode: (mode) => set({ inputMode: mode }),
  setTextInput: (text) => set({ textInput: text }),
  addDrawnPoint: (point) =>
    set((state) => ({ drawnPoints: [...state.drawnPoints, point] })),
  clearDrawnPoints: () => set({ drawnPoints: [] }),
  clearInput: () => set({ textInput: '', drawnPoints: [] }),

  // ── 게임 actions ────────────────────────
  setPhase: (phase) => set({ phase }),
  setComputedPath: (path) => set({ computedPath: path }),
  setHamsterAssignments: (a) => set({ hamsterAssignments: a }),
  addPoop: (poop) => set((state) => ({ poops: [...state.poops, poop] })),
  clearPoops: () => set({ poops: [] }),

  reportHamsterDone: () => {
    const next = get().completedCount + 1
    const total = get().hamsters.length
    set({ completedCount: next })
    // 모든 햄스터가 끝나면 completed
    if (next >= total) {
      set({ phase: 'completed' })
    }
  },

  reset: () =>
    set({
      phase: 'idle',
      computedPath: [],
      hamsterAssignments: {},
      poops: [],
      completedCount: 0,
    }),
}))

useGameStore.getState().rebuildHamsters()
