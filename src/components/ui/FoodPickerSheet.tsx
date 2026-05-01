import { useGameStore } from '../../store/useGameStore'
import { FOOD_VARIANTS } from '../../lib/foodTypes'

interface Props { onClose: () => void }

export default function FoodPickerSheet({ onClose }: Props) {
  const selectedFoodId = useGameStore((s) => s.selectedFoodId)
  const setSelectedFood = useGameStore((s) => s.setSelectedFood)

  const handleSelect = (id: string) => {
    setSelectedFood(id)
    setTimeout(onClose, 120)
  }

  return (
    <>
      {/* 배경 딤 */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 40,
          background: 'rgba(0,0,0,0.28)',
          animation: 'fadeIn 0.2s ease-out',
        }}
      />

      {/* 바텀 시트 */}
      <div
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          zIndex: 50,
          background: 'var(--surface-elev)',
          borderRadius: '24px 24px 0 0',
          paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
          animation: 'slideUp 0.25s ease-out',
          maxWidth: 520,
          margin: '0 auto',
        }}
      >
        {/* Grabber */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 8px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border-strong)' }} />
        </div>

        {/* 제목 */}
        <div style={{ padding: '4px 20px 4px' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>먹이 선택</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            먹이에 따라 똥 색이 달라져요
          </p>
        </div>

        {/* 리스트 */}
        <div style={{ padding: '12px 16px 8px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {FOOD_VARIANTS.map((food) => {
            const isSelected = selectedFoodId === food.id
            return (
              <button
                key={food.id}
                onClick={() => handleSelect(food.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-lg)',
                  background: isSelected ? 'var(--accent-soft)' : 'var(--bg)',
                  border: `2px solid ${isSelected ? 'var(--accent)' : 'transparent'}`,
                  transition: 'all 0.15s',
                  width: '100%',
                }}
              >
                {/* 이모지 */}
                <div style={{
                  width: 44, height: 44, borderRadius: 'var(--radius-md)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--surface-elev)', fontSize: 22, flexShrink: 0,
                }}>
                  {food.emoji}
                </div>

                {/* 이름 + 설명 */}
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{
                    fontSize: 13, fontWeight: 500,
                    color: isSelected ? 'var(--accent)' : 'var(--text)',
                  }}>
                    {food.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                    {food.description}
                  </div>
                </div>

                {/* 똥 색 미리보기 */}
                <div style={{
                  width: 28, height: 14, borderRadius: 'var(--radius-pill)',
                  background: food.poopColor, flexShrink: 0,
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.25)',
                }} />
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
