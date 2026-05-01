import { useGameStore } from '../../store/useGameStore'
import { HAMSTER_VARIANTS } from '../../lib/hamsterTypes'

interface Props { onClose: () => void }

export default function HamsterPickerSheet({ onClose }: Props) {
  const selectedVariantId = useGameStore((s) => s.selectedVariantId)
  const setSelectedVariant = useGameStore((s) => s.setSelectedVariant)

  const handleSelect = (id: string) => {
    setSelectedVariant(id)
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
        <div style={{ padding: '4px 20px 16px' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>햄스터 선택</h3>
        </div>

        {/* 2열 그리드 */}
        <div style={{ padding: '0 16px 8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {HAMSTER_VARIANTS.map((v) => {
            const isSelected = selectedVariantId === v.id
            return (
              <button
                key={v.id}
                onClick={() => handleSelect(v.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-lg)',
                  background: isSelected ? 'var(--accent-soft)' : 'var(--bg)',
                  border: `2px solid ${isSelected ? 'var(--accent)' : 'transparent'}`,
                  transition: 'all 0.15s',
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 'var(--radius-md)',
                  overflow: 'hidden', background: 'var(--surface-elev)', flexShrink: 0,
                }}>
                  <img src={v.thumbnail} alt={v.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <span style={{
                  fontSize: 13, fontWeight: 500,
                  color: isSelected ? 'var(--accent)' : 'var(--text)',
                }}>
                  {v.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
