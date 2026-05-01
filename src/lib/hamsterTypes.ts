export interface HamsterVariant {
  id: string
  name: string
  modelPath: string
  bodyColor: string   // HamsterPicker UI 동그라미 색 (모델 대표색)
}

export const HAMSTER_VARIANTS: HamsterVariant[] = [
  {
    id: 'golden',
    name: '골든',
    modelPath: '/models/golden_ham.glb',
    bodyColor: '#E8C9A0',
  },
  {
    id: 'jungarian',
    name: '정글리안',
    modelPath: '/models/jungarian_ham.glb',
    bodyColor: '#A8A39A',
  },
  {
    id: 'pearl',
    name: '펄',
    modelPath: '/models/pearl_ham.glb',
    bodyColor: '#F0EBE3',
  },
  {
    id: 'roborovskii',
    name: '로보로브스키',
    modelPath: '/models/roborovskii_ham.glb',
    bodyColor: '#D4B896',
  },
]
