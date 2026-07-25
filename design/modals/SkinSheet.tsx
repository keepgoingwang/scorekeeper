import { C, SKINS } from '../shared/constants'
import { skinBg } from '../shared/helpers'
import type { TableSkin } from '../shared/types'
import Sheet from '../components/Sheet'

interface Props {
  onClose: () => void
  skin: TableSkin
  setSkin: (s: TableSkin) => void
}

export default function SkinSheet({ onClose, skin, setSkin }: Props) {
  return (
    <Sheet title="🎨 牌桌皮肤" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {SKINS.map(s => (
            <div key={s.key} onClick={() => setSkin(s.key)} style={{
              borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
              border: `2.5px solid ${skin === s.key ? C.mint : 'transparent'}`,
              boxShadow: skin === s.key ? `0 0 0 2px ${C.mint}40` : 'none',
              transition: 'all 0.2s',
            }}>
              <div style={{
                height: 72, background: skinBg(s.key),
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                {['#FFD93D', '#6BCB77', '#FF6B6B'].map((col, j) => (
                  <div key={j} style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: col, border: '2px solid rgba(255,255,255,0.8)',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                  }} />
                ))}
              </div>
              <div style={{
                padding: '8px 10px',
                background: skin === s.key ? C.mintLight : C.bg,
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                {skin === s.key && <span style={{ fontSize: 12, color: C.mint }}>✓</span>}
                <span style={{ fontSize: 12, fontWeight: 600, color: skin === s.key ? C.mint : C.text }}>{s.name}</span>
              </div>
            </div>
          ))}
        </div>
        <button onClick={onClose} style={{
          width: '100%', padding: '15px', borderRadius: 22,
          background: C.mintGrad, border: 'none', color: '#fff',
          fontSize: 15, fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(78,205,196,0.42)',
        }}>应用皮肤</button>
      </div>
    </Sheet>
  )
}
