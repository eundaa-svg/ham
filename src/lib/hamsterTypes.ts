export interface HamsterVariant {
  id: string;
  name: string;
  bodyColor: string;
  bellyColor: string;
  cheekColor: string;
  hasPatch?: boolean;
}

export const HAMSTER_VARIANTS: HamsterVariant[] = [
  { id: 'gray',     name: '회색이', bodyColor: '#A8A39A', bellyColor: '#F5F0E8', cheekColor: '#E8B4B8' },
  { id: 'beige',    name: '베이지', bodyColor: '#E8D4B8', bellyColor: '#FFF8EC', cheekColor: '#F0A8A0' },
  { id: 'brown',    name: '갈색이', bodyColor: '#9C7853', bellyColor: '#E8D4B8', cheekColor: '#D89090' },
  { id: 'white',    name: '하양이', bodyColor: '#F8F4ED', bellyColor: '#FFFFFF', cheekColor: '#FFC0CB' },
  { id: 'tricolor', name: '삼색이', bodyColor: '#6B5444', bellyColor: '#FFFFFF', cheekColor: '#E8B4B8', hasPatch: true },
];
