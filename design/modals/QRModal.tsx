import { C } from '../shared/constants'

interface Props {
  onClose: () => void
  roomNo?: string
}

const QR_CELLS = [0,1,5,6,7,8,14,15,16,22,23,24,48,49,55,56,57,63,
  2,3,4,9,10,17,18,25,26,30,31,33,34,38,39,45,46,50,51,58,59,60]

export default function QRModal({ onClose, roomNo = '888888' }: Props) {
  return (
    <div style={{
      background: C.card, borderRadius: 24, padding: '0 0 24px', overflow: 'hidden',
      width: '100%', boxShadow: '0 -8px 40px rgba(0,0,0,0.2)',
    }}>
      {/* Header */}
      <div style={{
        background: C.mintGrad, padding: '20px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>🎉 邀请好友加入</div>
        <button onClick={onClose} style={{
          background: 'rgba(255,255,255,0.25)', border: 'none',
          width: 32, height: 32, borderRadius: '50%',
          color: '#fff', fontSize: 18, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>✕</button>
      </div>

      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        {/* QR code */}
        <div style={{
          width: 200, height: 200, background: C.bg, borderRadius: 20,
          border: `2px solid ${C.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 3, padding: 16, width: '100%', height: '100%', boxSizing: 'border-box' }}>
            {Array.from({ length: 64 }, (_, i) => (
              <div key={i} style={{
                borderRadius: 2,
                background: QR_CELLS.includes(i) ? C.text : 'transparent',
              }} />
            ))}
          </div>
          <div style={{
            position: 'absolute', width: 48, height: 48, borderRadius: 12,
            background: C.mintGrad,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
            boxShadow: '0 2px 8px rgba(78,205,196,0.4)',
          }}>🀄</div>
        </div>

        {/* Room number */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: C.textSub, marginBottom: 6 }}>房间号（长按可复制）</div>
          <div style={{
            fontSize: 34, fontWeight: 900, color: C.mint, letterSpacing: 8,
            background: C.mintLight, padding: '10px 24px', borderRadius: 16,
          }}>{roomNo}</div>
        </div>

        {/* Share button */}
        <button onClick={onClose} style={{
          width: '100%', padding: '15px', borderRadius: 22,
          background: C.mintGrad, border: 'none', color: '#fff',
          fontSize: 15, fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(78,205,196,0.42)',
        }}>💬 转发给好友</button>
      </div>
    </div>
  )
}
