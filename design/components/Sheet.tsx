import type { ReactNode } from 'react'
import { C } from '../shared/constants'

interface Props {
  title: string
  onClose: () => void
  children: ReactNode
}

export default function Sheet({ title, onClose, children }: Props) {
  return (
    <div style={{
      background: C.card, borderRadius: '20px 20px 0 0',
      maxHeight: '80vh', overflowY: 'auto',
      boxShadow: '0 -6px 32px rgba(0,0,0,0.14)', paddingBottom: 30,
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: C.border }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px 0' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{title}</div>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', fontSize: 22, cursor: 'pointer',
          color: C.textSub, lineHeight: 1, padding: 0,
        }}>×</button>
      </div>
      <div style={{ padding: '16px 20px 0' }}>{children}</div>
    </div>
  )
}
