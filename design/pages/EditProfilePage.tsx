import { useState } from 'react'
import { C } from '../shared/constants'
import type { Page } from '../shared/types'

interface Props {
  navigate: (p: Page) => void
}

const EMOJIS = ['🤠', '😊', '😎', '🙂', '😏', '🥳', '🤩', '😄', '😁', '🤑', '😤', '🧐']

export default function EditProfilePage({ navigate }: Props) {
  const [nickname, setNickname] = useState('张三')
  const [age, setAge] = useState('28')
  const [emoji, setEmoji] = useState('🤠')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => { setSaved(false); navigate('profile') }, 1200)
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
        <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>编辑资料</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Avatar picker */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 88, height: 88, borderRadius: '50%',
            background: C.mintGrad,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 44, boxShadow: '0 4px 20px rgba(78,205,196,0.4)',
            border: `3px solid #fff`,
          }}>{emoji}</div>
          <div style={{ fontSize: 12, color: C.textSub }}>选择你的头像表情</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {EMOJIS.map(e => (
              <button key={e} onClick={() => setEmoji(e)} style={{
                width: 44, height: 44, borderRadius: 12, fontSize: 24,
                background: emoji === e ? C.mintLight : C.bg,
                border: `2px solid ${emoji === e ? C.mint : C.border}`,
                cursor: 'pointer',
              }}>{e}</button>
            ))}
          </div>
        </div>

        {/* Fields */}
        <div style={{ background: C.card, borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          {/* Nickname */}
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, color: C.textSub, marginBottom: 6, fontWeight: 600 }}>昵称（最多10字）</div>
            <input
              value={nickname}
              onChange={e => setNickname(e.target.value.slice(0, 10))}
              style={{
                width: '100%', border: 'none', outline: 'none',
                fontSize: 16, fontWeight: 600, color: C.text, background: 'transparent',
                boxSizing: 'border-box',
              }}
            />
          </div>
          {/* Age */}
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, color: C.textSub, marginBottom: 6, fontWeight: 600 }}>年龄</div>
            <input
              type="number"
              value={age}
              onChange={e => setAge(e.target.value.replace(/[^0-9]/g, '').slice(0, 2))}
              style={{
                width: '100%', border: 'none', outline: 'none',
                fontSize: 16, fontWeight: 600, color: C.text, background: 'transparent',
                boxSizing: 'border-box',
              }}
            />
          </div>
          {/* ID — read only */}
          <div style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: C.textSub, marginBottom: 6, fontWeight: 600 }}>用户 ID（不可修改）</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: C.textSub }}>88234512</div>
          </div>
        </div>

        <button onClick={handleSave} style={{
          width: '100%', padding: '15px', borderRadius: 22,
          background: saved ? C.green : C.mintGrad, border: 'none', color: '#fff',
          fontSize: 15, fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(78,205,196,0.42)',
          transition: 'background 0.3s',
        }}>{saved ? '✅ 保存成功' : '保存修改'}</button>
      </div>
    </div>
  )
}
