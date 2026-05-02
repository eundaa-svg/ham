export interface HamsterVariant {
  id: string
  name: string
  modelPath: string
  thumbnail: string
  bodyColor: string
}

const BASE = import.meta.env.BASE_URL  // 개발: '/', GitHub Pages: '/ham/'

export const HAMSTER_VARIANTS: HamsterVariant[] = [
  {
    id: 'golden',
    name: '골든',
    modelPath: `${BASE}models/golden_ham.glb`,
    thumbnail: `${BASE}images/hamsters/golden.png`,
    bodyColor: '#E8C9A0',
  },
  {
    id: 'jungarian',
    name: '정글리안',
    modelPath: `${BASE}models/jungarian_ham.glb`,
    thumbnail: `${BASE}images/hamsters/jungarian.png`,
    bodyColor: '#A8A39A',
  },
  {
    id: 'pearl',
    name: '펄',
    modelPath: `${BASE}models/pearl_ham.glb`,
    thumbnail: `${BASE}images/hamsters/pearl.png`,
    bodyColor: '#F0EBE3',
  },
  {
    id: 'roborovskii',
    name: '로보로브스키',
    modelPath: `${BASE}models/roborovskii_ham.glb`,
    thumbnail: `${BASE}images/hamsters/roborovskii.png`,
    bodyColor: '#D4B896',
  },
]
