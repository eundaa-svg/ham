export interface FoodVariant {
  id: string
  name: string
  emoji: string
  poopColor: string   // 기본 색 (Poop에서 ±랜덤 변동 적용)
  description: string
}

export const FOOD_VARIANTS: FoodVariant[] = [
  { id: 'sunflower',  name: '해바라기씨', emoji: '🌻', poopColor: '#3A2818', description: '오리지널' },
  { id: 'carrot',     name: '당근',       emoji: '🥕', poopColor: '#A85A2E', description: '주황빛'  },
  { id: 'vegetable',  name: '야채',       emoji: '🥬', poopColor: '#5C6B3A', description: '초록빛'  },
  { id: 'blueberry',  name: '블루베리',   emoji: '🫐', poopColor: '#5C3A5E', description: '보랏빛'  },
  { id: 'strawberry', name: '딸기',       emoji: '🍓', poopColor: '#A04848', description: '분홍빛'  },
]
