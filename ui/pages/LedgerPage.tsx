import { C, LEDGER_ITEMS } from '../shared/constants'
import type { Page } from '../shared/types'

interface Props {
  navigate: (p: Page) => void
}

export default function LedgerPage({ navigate }: Props) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: C.bg, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        background: C.mintGrad, padding: '14px 16px',
        display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
      }}>
        <button onClick={() => navigate('room')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#fff', padding: 0 }}>
          ← 返回
        </button>
        <div style={{ flex: 1, fontSize: 16, fontWeight: 800, color: '#fff' }}>📋 流水记录</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>房间 888888</div>
      </div>

      {/* Summary bar */}
      <div style={{
        background: 'rgba(78,205,196,0.1)', padding: '10px 16px',
        display: 'flex', gap: 16, borderBottom: `1px solid ${C.border}`, flexShrink: 0,
      }}>
        {[
          { label: '总支出', val: '-430分', color: '#FF6B6B' },
          { label: '总收入', val: '+350分', color: '#6BCB77' },
          { label: '共 12 局', val: '', color: C.textSub },
        ].map(s => (
          <div key={s.label} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: C.textSub }}>{s.label}</span>
            {s.val && <span style={{ fontSize: 12, fontWeight: 800, color: s.color }}>{s.val}</span>}
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {LEDGER_ITEMS.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', borderRadius: 14,
              background: C.card, border: `1px solid ${C.border}`,
              boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                background: item.color + '20', border: `1.5px solid ${item.color}50`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
              }}>{item.icon}</div>
              <div style={{ flex: 1, fontSize: 13, color: C.text, fontWeight: 500 }}>{item.text}</div>
              <div style={{ fontSize: 11, color: C.textSub, flexShrink: 0 }}>{item.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
