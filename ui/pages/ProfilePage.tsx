import { C } from '../shared/constants'
import type { Page } from '../shared/types'

interface Props {
  navigate: (p: Page) => void
}

const STATS = [
  { label: '参与场次', value: '24' },
  { label: '胜率',     value: '58%' },
  { label: '累计积分', value: '+1,240' },
]

const MENU = [
  { icon: '📊', label: '战绩查询', sub: '查看历史房间记录', page: 'records' as Page },
  { icon: '⚙️', label: '系统设置', sub: '牌桌皮肤、通知设置', page: 'settings' as Page },
  { icon: '❓', label: '帮助反馈', sub: 'FAQ · 意见反馈',   page: 'help' as Page },
  { icon: '📋', label: '联系我们', sub: '客服 · 版本 · 协议', page: 'contact' as Page },
]

export default function ProfilePage({ navigate }: Props) {
  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {/* Header */}
      <div style={{
        background: C.mintGrad, padding: '28px 20px 56px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>我的</div>
      </div>

      {/* User card — overlaps header */}
      <div style={{ padding: '0 16px', marginTop: -40 }}>
        <div style={{ background: C.card, borderRadius: 22, padding: '20px', boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 68, height: 68, borderRadius: '50%',
              background: C.mintGrad, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 34, boxShadow: '0 4px 14px rgba(78,205,196,0.4)',
            }}>🤠</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: C.text }}>张三</div>
              <div style={{ fontSize: 12, color: C.textSub, marginTop: 3 }}>ID: 88234512</div>
            </div>
            <button onClick={() => navigate('edit-profile')} style={{
              padding: '8px 16px', borderRadius: 12,
              background: C.mintLight, border: `1.5px solid ${C.mint}`,
              color: C.mint, fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}>编辑资料</button>
          </div>
          {/* Stats row */}
          <div style={{ display: 'flex', marginTop: 18, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
            {STATS.map((s, i) => (
              <div key={s.label} style={{
                flex: 1, textAlign: 'center',
                borderRight: i < STATS.length - 1 ? `1px solid ${C.border}` : 'none',
              }}>
                <div style={{ fontSize: 17, fontWeight: 900, color: C.mint }}>{s.value}</div>
                <div style={{ fontSize: 10, color: C.textSub, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Menu */}
      <div style={{ padding: '16px 16px 24px' }}>
        <div style={{ background: C.card, borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 14px rgba(0,0,0,0.06)' }}>
          {MENU.map((item, i) => (
            <div key={item.label} onClick={() => navigate(item.page)} style={{
              padding: '16px 18px', cursor: 'pointer',
              borderBottom: i < MENU.length - 1 ? `1px solid ${C.border}` : 'none',
              display: 'flex', alignItems: 'center', gap: 14,
              transition: 'background 0.15s',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                background: C.mintLight,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
              }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: C.text, fontWeight: 600 }}>{item.label}</div>
                <div style={{ fontSize: 11, color: C.textSub, marginTop: 2 }}>{item.sub}</div>
              </div>
              <span style={{ color: C.textSub, fontSize: 18 }}>›</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
