import { useState } from 'react'
import { C } from '../shared/constants'
import type { Page } from '../shared/types'

interface Props {
  navigate: (p: Page) => void
}

const FAQS = [
  {
    q: '如何创建房间？',
    a: '在首页点击「创建房间」按钮，系统自动生成6位房间号并弹出分享页，邀请好友扫码或输入房间号加入。',
  },
  {
    q: '什么是自动结算模式？',
    a: '房主点击「发起结算」后，所有玩家在60秒内输入本局收入或支出，系统自动校验收支是否平衡，平衡则自动更新积分。',
  },
  {
    q: '收支不平衡怎么办？',
    a: '系统会提示差额并要求所有玩家重新输入，直至收支绝对值相等为止。',
  },
  {
    q: '房主退出后房间会解散吗？',
    a: '若房间内还有活跃用户，系统会随机选取一位成为新房主；若无活跃用户，房间将自动解散。',
  },
  {
    q: '已退出的玩家还参与结算吗？',
    a: '不参与。退出后头像变灰，不再参与任何后续积分分配和结算，但其历史数据保留。',
  },
  {
    q: '如何查看战绩？',
    a: '在「我的」页面点击「战绩查询」，可查看历史场次明细、积分趋势图及个人统计数据。',
  },
]

export default function HelpPage({ navigate }: Props) {
  const [open, setOpen] = useState<number | null>(null)
  const [feedback, setFeedback] = useState('')
  const [sent, setSent] = useState(false)

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
        <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>❓ 帮助反馈</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* FAQ */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10 }}>常见问题 FAQ</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{
                background: C.card, borderRadius: 14,
                overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                border: `1px solid ${open === i ? C.mint : C.border}`,
              }}>
                <div onClick={() => setOpen(open === i ? null : i)} style={{
                  padding: '14px 16px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                    background: C.mintLight, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 800, color: C.mint,
                  }}>Q</div>
                  <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: C.text }}>{faq.q}</div>
                  <span style={{ color: C.textSub, fontSize: 16, transition: 'transform 0.2s', transform: open === i ? 'rotate(90deg)' : 'none' }}>›</span>
                </div>
                {open === i && (
                  <div style={{
                    padding: '0 16px 14px 16px',
                    display: 'flex', gap: 10,
                  }}>
                    <div style={{
                      width: 24, flexShrink: 0, display: 'flex', justifyContent: 'center', paddingTop: 1,
                    }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: '50%',
                        background: '#E8F8ED', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 800, color: C.green,
                      }}>A</div>
                    </div>
                    <div style={{ fontSize: 13, color: C.textSub, lineHeight: 1.7 }}>{faq.a}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Feedback form */}
        <div style={{ background: C.card, borderRadius: 18, padding: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 12 }}>💬 意见反馈</div>
          <textarea
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            placeholder="请描述您遇到的问题或建议..."
            rows={4}
            style={{
              width: '100%', padding: '12px', borderRadius: 12,
              border: `1.5px solid ${feedback ? C.mint : C.border}`,
              fontSize: 13, color: C.text, background: C.bg,
              outline: 'none', resize: 'none', boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
          />
          <button
            onClick={() => { setSent(true); setFeedback(''); setTimeout(() => setSent(false), 2000) }}
            disabled={!feedback.trim()}
            style={{
              marginTop: 10, width: '100%', padding: '13px', borderRadius: 14,
              background: feedback.trim() ? C.mintGrad : C.border, border: 'none',
              color: feedback.trim() ? '#fff' : C.textSub,
              fontSize: 14, fontWeight: 700, cursor: feedback.trim() ? 'pointer' : 'default',
            }}
          >
            {sent ? '✅ 反馈已提交，感谢！' : '提交反馈'}
          </button>
        </div>
      </div>
    </div>
  )
}
