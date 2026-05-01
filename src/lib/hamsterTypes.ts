export interface HamsterVariant {
  id: string
  name: string
  modelPath: string
  thumbnail: string
  bodyColor: string   // fallback용
}

export const HAMSTER_VARIANTS: HamsterVariant[] = [
  {
    id: 'golden',
    name: '골든',
    modelPath: '/models/golden_ham.glb',
    thumbnail: '/images/hamsters/golden.png',
    bodyColor: '#E8C9A0',
  },
  {
    id: 'jungarian',
    name: '정글리안',
    modelPath: '/models/jungarian_ham.glb',
    thumbnail: '/images/hamsters/jungarian.png',
    bodyColor: '#A8A39A',
  },
  {
    id: 'pearl',
    name: '펄',
    modelPath: '/models/pearl_ham.glb',
    thumbnail: '/images/hamsters/pearl.png',
    bodyColor: '#F0EBE3',
  },
  {
    id: 'roborovskii',
    name: '로보로브스키',
    modelPath: '/models/roborovskii_ham.glb',
    thumbnail: '/images/hamsters/roborovskii.png',
    bodyColor: '#D4B896',
  },
]
