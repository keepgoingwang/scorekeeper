import { useState } from 'react'
import { C } from '../shared/constants'
import Sheet from '../components/Sheet'

interface Props {
  onClose: () => void
  onEnter: () => void
}

export default function JoinSheet({ onClose, onEnter }: Props) {
  const [code, setCode] = useState('')

  return (
    <Sheet title="加入房间" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Scan QR */}
        <div style={{
          background: C.bg, borderRadius: 16, padding: '22px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          border: `2px dashed ${C.border}`, cursor: 'pointer',
        }}>
          <div style={{ fontSize: 40 }}>📷</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>扫码加入</div>
          <div style={{ fontSize: 12, color: C.textSub }}>扫描房主分享的二维码</div>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, height: 1, background: C.border }} />
          <div style={{ fontSize: 12, color: C.textSub }}>或输入房间号</div>
          <div style={{ flex: 1, height: 1, background: C.border }} />
        </div>

        {/* Room code input */}
        <input
          value={code}
          onChange={e => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
          placeholder="请输入6位房间号"
          style={{
            width: '100%', padding: '14px', borderRadius: 16,
            border: `1.5px solid ${code.length === 6 ? C.mint : C.border}`,
            fontSize: 24, fontWeight: 800, letterSpacing: 14, textAlign: 'center',
            outline: 'none', color: C.text, background: C.bg, boxSizing: 'border-box',
          }}
        />

        <button onClick={onEnter} disabled={code.length !== 6} style={{
          width: '100%', padding: '15px', borderRadius: 22,
          background: code.length === 6 ? C.mintGrad : C.border, border: 'none',
          color: code.length === 6 ? '#fff' : C.textSub,
          fontSize: 15, fontWeight: 700, cursor: code.length === 6 ? 'pointer' : 'default',
          boxShadow: code.length === 6 ? '0 4px 16px rgba(78,205,196,0.42)' : 'none',
        }}>🔍 加入房间</button>
      </div>
    </Sheet>
  )
}
