import { useState } from 'react'
import { C } from '../shared/constants'
import Sheet from '../components/Sheet'

interface Props {
  onClose: () => void
  title: string
  hint: string
}

export default function AmountSheet({ onClose, title, hint }: Props) {
  const [amount, setAmount] = useState('')

  return (
    <Sheet title={title} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 12, color: C.textSub }}>{hint}</div>

        <input
          type="number" value={amount}
          onChange={e => setAmount(e.target.value.replace(/[^0-9]/g, '').slice(0, 5))}
          placeholder="0" autoFocus
          style={{
            width: '100%', padding: '18px', borderRadius: 16,
            border: `2px solid ${amount ? C.red : C.border}`,
            fontSize: 34, fontWeight: 800, textAlign: 'center', outline: 'none',
            color: C.red, background: amount ? C.redLight : C.bg, boxSizing: 'border-box',
          }}
        />

        <div style={{ display: 'flex', gap: 8 }}>
          {['50', '100', '200', '500'].map(n => (
            <button key={n} onClick={() => setAmount(n)} style={{
              flex: 1, padding: '9px 0', borderRadius: 12,
              background: C.mintLight, border: `1px solid ${C.border}`,
              color: C.mint, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>{n}</button>
          ))}
        </div>

        <button disabled={!amount} onClick={onClose} style={{
          width: '100%', padding: '15px', borderRadius: 22,
          background: amount ? `linear-gradient(135deg, ${C.red} 0%, ${C.orange} 100%)` : C.border,
          border: 'none',
          color: amount ? '#fff' : C.textSub,
          fontSize: 15, fontWeight: 700,
          cursor: amount ? 'pointer' : 'default',
          boxShadow: amount ? '0 4px 16px rgba(255,107,107,0.4)' : 'none',
        }}>✅ 确认转账</button>
      </div>
    </Sheet>
  )
}
