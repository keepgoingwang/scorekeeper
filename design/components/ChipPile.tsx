import { chipColors, scoreLbl } from '../shared/helpers'

interface Props {
  score: number
  name?: string
  size?: 'sm' | 'md'
}

export default function ChipPile({ score, name, size = 'md' }: Props) {
  const W = size === 'sm' ? 22 : 26
  const STEP = size === 'sm' ? 4 : 5
  const count = score === 0 ? 1 : Math.min(Math.ceil(Math.abs(score) / 65), 6)
  const { main, light, shadow } = chipColors(score)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <div style={{
        fontSize: size === 'sm' ? 10 : 11, fontWeight: 800,
        color: score > 0 ? '#FFE566' : score < 0 ? '#FFB3B3' : 'rgba(255,255,255,0.55)',
        textShadow: '0 1px 4px rgba(0,0,0,0.8)',
      }}>{scoreLbl(score)}</div>
      <div style={{ position: 'relative', width: W, height: W + (count - 1) * STEP }}>
        {Array.from({ length: count }, (_, i) => {
          const isTop = i === count - 1
          return (
            <div key={i} style={{
              position: 'absolute', bottom: i * STEP,
              width: W, height: W, borderRadius: '50%',
              background: isTop
                ? `radial-gradient(circle at 38% 32%, ${light}, ${main})`
                : `radial-gradient(circle at 38% 32%, ${main}, ${shadow})`,
              border: '2px solid rgba(255,255,255,0.76)',
              boxShadow: `0 ${count - i + 1}px ${(count - i) * 2 + 2}px rgba(0,0,0,0.42)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {isTop && (
                <div style={{ width: W * 0.52, height: W * 0.52, borderRadius: '50%', border: '1.5px dashed rgba(255,255,255,0.68)' }} />
              )}
            </div>
          )
        })}
      </div>
      {name && (
        <div style={{
          fontSize: 8, fontWeight: 600,
          color: 'rgba(255,255,255,0.8)',
          textShadow: '0 1px 3px rgba(0,0,0,0.7)',
          whiteSpace: 'nowrap',
          background: 'rgba(0,0,0,0.2)', padding: '1px 4px', borderRadius: 3,
        }}>{name}</div>
      )}
    </div>
  )
}
