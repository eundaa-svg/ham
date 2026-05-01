export interface HamsterVariant {
  id: string
  name: string
  bodyColor: string    // 메인 바디
  bellyColor: string   // 배 (밝은 톤)
  faceColor: string    // 얼굴 면 (살짝 밝게)
  hasPatch?: boolean   // 삼색이 등 무늬
}

export const HAMSTER_VARIANTS: HamsterVariant[] = [
  {
    id: 'gray',
    name: '회색이',
    bodyColor:  '#B5B0A8',
    bellyColor: '#F0EBE2',
    faceColor:  '#C8C3BB',
  },
  {
    id: 'beige',
    name: '베이지',
    bodyColor:  '#E0BC8C',
    bellyColor: '#FAF1E0',
    faceColor:  '#EAC99E',
  },
  {
    id: 'brown',
    name: '갈색이',
    bodyColor:  '#9E7848',
    bellyColor: '#E8D5B5',
    faceColor:  '#B08858',
  },
  {
    id: 'white',
    name: '하양이',
    bodyColor:  '#F0EBE3',
    bellyColor: '#FFFFFF',
    faceColor:  '#FAF7F2',
  },
  {
    id: 'tricolor',
    name: '삼색이',
    bodyColor:  '#7A6048',
    bellyColor: '#FFFFFF',
    faceColor:  '#8C7258',
    hasPatch: true,
  },
]
