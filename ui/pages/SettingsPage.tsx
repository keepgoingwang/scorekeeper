import { useState } from 'react'
import { C, SKINS } from '../shared/constants'
import { skinBg } from '../shared/helpers'
import type { Page, TableSkin } from '../shared/types'

interface Props {
  navigate: (p: Page) => void
  skin: TableSkin
  setSkin: (s: TableSkin) => void
}

function Toggle({ on, toggle }: { on: boolean; toggle: () => void }) {
  return (
    <div onClick={toggle} style={{
      width: 46, height: 26, borderRadius: 13,
      background: on ? C.mint : C.border,
      position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
      flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', top: 3, left: on ? 23 : 3, width: 20, height: 20,
        borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        transition: 'left 0.2s',
      }} />
    </div>
  )
}

export default function SettingsPage({ navigate, skin, setSkin }: Props) {
  const [sound, setSound] = useState(true)
  const [vibrate, setVibrate] = useState(true)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

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
        <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>⚙️ 系统设置</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Skin section */}
        <div style={{ background: C.card, borderRadius: 18, padding: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 14 }}>🎨 牌桌皮肤</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {SKINS.map(s => (
              <div key={s.key} onClick={() => setSkin(s.key)} style={{
                borderRadius: 14, overflow: 'hidden', cursor: 'pointer',
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
                      width: 20, height: 20, borderRadius: '50%',
                      background: col, border: '2px solid rgba(255,255,255,0.8)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    }} />
                  ))}
                </div>
                <div style={{
                  padding: '8px 10px',
                  background: skin === s.key ? C.mintLight : C.bg,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  {skin === s.key && <span style={{ fontSize: 12 }}>✓</span>}
                  <span style={{ fontSize: 12, fontWeight: 600, color: skin === s.key ? C.mint : C.text }}>{s.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notification section */}
        <div style={{ background: C.card, borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>🔔 通知设置</div>
          </div>
          {[
            { icon: '🔊', label: '结算提醒音效', sub: '有新的结算时播放提示音', val: sound, toggle: () => setSound(!sound) },
            { icon: '📳', label: '结算提醒震动', sub: '结算通知时触发震动反馈', val: vibrate, toggle: () => setVibrate(!vibrate) },
          ].map((item, i) => (
            <div key={item.label} style={{
              padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
              borderBottom: i === 0 ? `1px solid ${C.border}` : 'none',
            }}>
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: C.text, fontWeight: 500 }}>{item.label}</div>
                <div style={{ fontSize: 11, color: C.textSub, marginTop: 2 }}>{item.sub}</div>
              </div>
              <Toggle on={item.val} toggle={item.toggle} />
            </div>
          ))}
        </div>

        <button onClick={handleSave} style={{
          width: '100%', padding: '15px', borderRadius: 22,
          background: saved ? C.green : C.mintGrad, border: 'none', color: '#fff',
          fontSize: 15, fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(78,205,196,0.42)',
          transition: 'background 0.3s',
        }}>{saved ? '✅ 已保存' : '保存设置'}</button>
      </div>
    </div>
  )
}
