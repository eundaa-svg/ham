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
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 40,
        background: 'rgba(26, 22, 20, 0.4)',
        animation: 'fadeIn 0.2s ease-out',
      }} />

      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        zIndex: 50,
        background: 'var(--surface)',
        borderRadius: 'var(--r-xl) var(--r-xl) 0 0',
        borderTop: '1px solid var(--line)',
        paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
        animation: 'slideUp 0.28s cubic-bezier(0.32, 0.72, 0, 1)',
        maxWidth: 500, margin: '0 auto',
      }}>
        {/* Grabber */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: 36, height: 3, borderRadius: 2, background: 'var(--line-bold)' }} />
        </div>

        {/* 헤더 */}
        <div style={{ padding: '16px 28px 0' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <h3 className="t-display" style={{ fontSize: 22, color: 'var(--text)' }}>햄스터</h3>
            <span className="t-caption">{String(HAMSTER_VARIANTS.length).padStart(2, '0')}</span>
          </div>
          <div style={{ height: 1, background: 'var(--line)', marginTop: 12 }} />
        </div>

        {/* 리스트 */}
        <div style={{ padding: '4px 16px 8px' }}>
          {HAMSTER_VARIANTS.map((v, idx) => {
            const isSelected = selectedVariantId === v.id
            return (
              <button
                key={v.id}
                onClick={() => handleSelect(v.id)}
                style={{
                  width: '100%',
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '12px',
                  borderRadius: 'var(--r-md)',
                  background: isSelected ? 'var(--bg-soft)' : 'transparent',
                  borderBottom: idx < HAMSTER_VARIANTS.length - 1 ? '1px solid var(--line)' : 'none',
                  transition: 'background 0.15s',
                }}
              >
                {/* 인덱스 */}
                <span className="t-mono" style={{ fontSize: 11, color: 'var(--text-muted)', width: 20, flexShrink: 0 }}>
                  {String(idx + 1).padStart(2, '0')}
                </span>

                {/* 썸네일 */}
                <div style={{
                  width: 48, height: 48, borderRadius: 'var(--r-md)',
                  overflow: 'hidden', background: 'var(--bg-soft)', flexShrink: 0,
                }}>
                  <img src={v.thumbnail} alt={v.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>

                {/* 이름 */}
                <span className="t-heading" style={{ fontSize: 15, color: 'var(--text)', flex: 1, textAlign: 'left' }}>
                  {v.name}
                </span>

                {/* 선택 체크 */}
                {isSelected && (
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: 'var(--text)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.6"
                        strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
