import { C } from '../shared/constants'
import type { Page } from '../shared/types'

interface Props {
  navigate: (p: Page) => void
}

export default function ContactPage({ navigate }: Props) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: C.bg, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        background: C.mintGrad, padding: '14px 16px',
        display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
      }}>
        <button onClick={() => navigate('profile')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#fff', padding: 0 }}>
          ← 返回
        </button>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>📋 联系我们</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Service */}
        <div style={{ background: C.card, borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>🎧 客服支持</div>
          </div>
          {[
            { icon: '💬', label: '在线客服', sub: '工作日 10:00–18:00', val: '联系' },
            { icon: '📧', label: '邮件反馈', sub: 'support@paiduo.app', val: '' },
            { icon: '🐧', label: '官方 QQ 群', sub: '加群号：888666333', val: '' },
          ].map((item, i, arr) => (
            <div key={item.label} style={{
              padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14,
              borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none',
              cursor: 'pointer',
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: C.mintLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{item.label}</div>
                <div style={{ fontSize: 11, color: C.textSub, marginTop: 2 }}>{item.sub}</div>
              </div>
              {item.val ? (
                <div style={{ fontSize: 12, fontWeight: 700, color: C.mint, background: C.mintLight, padding: '4px 12px', borderRadius: 10 }}>{item.val}</div>
              ) : (
                <span style={{ color: C.textSub, fontSize: 18 }}>›</span>
              )}
            </div>
          ))}
        </div>

        {/* Version info */}
        <div style={{ background: C.card, borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>📱 版本信息</div>
          </div>
          {[
            { label: '当前版本', val: 'v1.0.0' },
            { label: '更新日期', val: '2026-07-20' },
            { label: '设备信息', val: 'iOS 17.4' },
          ].map((item, i, arr) => (
            <div key={item.label} style={{
              padding: '12px 16px', display: 'flex', alignItems: 'center',
              borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none',
            }}>
              <span style={{ fontSize: 13, color: C.textSub, flex: 1 }}>{item.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{item.val}</span>
            </div>
          ))}
        </div>

        {/* Legal links */}
        <div style={{ background: C.card, borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          {['隐私政策', '用户协议', '关于我们'].map((label, i, arr) => (
            <div key={label} style={{
              padding: '14px 16px', display: 'flex', alignItems: 'center',
              borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none',
              cursor: 'pointer',
            }}>
              <span style={{ flex: 1, fontSize: 14, color: C.text }}>{label}</span>
              <span style={{ color: C.textSub, fontSize: 18 }}>›</span>
            </div>
          ))}
        </div>

        {/* Brand */}
        <div style={{ textAlign: 'center', padding: '20px 0 10px' }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🀄</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>牌桌记分</div>
          <div style={{ fontSize: 11, color: C.textSub, marginTop: 4 }}>让每一局都有迹可循</div>
        </div>
      </div>
    </div>
  )
}
