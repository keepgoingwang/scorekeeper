import { C } from '../shared/constants'

interface Props {
  msg: string
  confirmLabel: string
  onCancel: () => void
  onConfirm: () => void
  icon?: string
  danger?: boolean
}

export default function ConfirmDialog({ msg, confirmLabel, onCancel, onConfirm, icon = '⚠️', danger = false }: Props) {
  return (
    <div style={{
      background: C.card, borderRadius: 20, padding: '28px 24px',
      width: 300, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', textAlign: 'center',
    }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 14, color: C.text, lineHeight: 1.7, marginBottom: 24 }}>{msg}</div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onCancel} style={{
          flex: 1, padding: '13px', borderRadius: 14,
          background: C.bg, border: `1px solid ${C.border}`,
          color: C.textSub, fontSize: 14, fontWeight: 600, cursor: 'pointer',
        }}>返回</button>
        <button onClick={onConfirm} style={{
          flex: 1, padding: '13px', borderRadius: 14,
          background: danger ? C.red : C.mintGrad, border: 'none',
          color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
          boxShadow: danger ? '0 3px 10px rgba(255,107,107,0.4)' : '0 3px 10px rgba(78,205,196,0.4)',
        }}>{confirmLabel}</button>
      </div>
    </div>
  )
}
