import { useGameStore } from '../../store/useGameStore'
import { HAMSTER_VARIANTS } from '../../lib/hamsterTypes'

export default function HamsterPicker() {
  const selectedVariantId = useGameStore((s) => s.selectedVariantId)
  const setSelectedVariant = useGameStore((s) => s.setSelectedVariant)
  const phase = useGameStore((s) => s.phase)

  return (
    <div
      style={{
        background: 'var(--surface-elev)',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '12px',
        width: '280px',
      }}
    >
      <div className="grid grid-cols-4 gap-1.5">
        {HAMSTER_VARIANTS.map((v) => {
          const isSelected = selectedVariantId === v.id
          return (
            <button
              key={v.id}
              onClick={() => { if (phase !== 'pooping') setSelectedVariant(v.id) }}
              disabled={phase === 'pooping'}
              className="flex flex-col items-center gap-1.5 transition-all"
              style={{
                padding: '8px 4px',
                borderRadius: 'var(--radius-md)',
                background: isSelected ? 'var(--accent-soft)' : 'transparent',
                cursor: phase === 'pooping' ? 'not-allowed' : 'pointer',
                opacity: phase === 'pooping' ? 0.5 : 1,
                border: 'none',
              }}
            >
              {/* PNG 썸네일 */}
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  background: 'var(--bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: isSelected ? 'scale(1.06)' : 'scale(1)',
                  transition: 'transform 0.15s',
                }}
              >
                <img
                  src={v.thumbnail}
                  alt={v.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    filter: isSelected ? 'none' : 'saturate(0.7)',
                    opacity: isSelected ? 1 : 0.65,
                    transition: 'all 0.15s',
                  }}
                />
              </div>

              {/* 이름 */}
              <span
                style={{
                  fontSize: 10,
                  lineHeight: 1.3,
                  textAlign: 'center',
                  color: isSelected ? 'var(--accent)' : 'var(--text-muted)',
                  fontWeight: isSelected ? 600 : 500,
                  letterSpacing: '-0.01em',
                }}
              >
                {v.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
