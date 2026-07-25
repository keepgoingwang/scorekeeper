import { useState } from 'react'
import { C } from '../shared/constants'
import type { Player } from '../shared/types'

interface Props {
  onClose: () => void
  players: Player[]
  round?: number
}

export default function AutoSettleModal({ onClose, players, round = 12 }: Props) {
  const [income, setIncome] = useState('')
  const [expense, setExpense] = useState('')
  const active = players.filter(p => !p.exited)
  const submitted = 2
  const total = active.length
  const countdown = 42
  const pct = (countdown / 60) * 100

  const incomeN = parseInt(income) || 0
  const expenseN = parseInt(expense) || 0
  const net = incomeN - expenseN
  const hasInput = incomeN > 0 || expenseN > 0

  return (
    <div style={{
      background: C.card, borderRadius: 24, overflow: 'hidden',
      width: '100%', boxShadow: '0 -8px 40px rgba(0,0,0,0.2)',
      paddingBottom: 28,
    }}>
      {/* Header */}
      <div style={{
        background: C.mintGrad, padding: '20px 24px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>第 {round} 局结算</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>
            请输入本局收入或支出，不进不出可不填
          </div>
        </div>
        <button onClick={onClose} style={{
          background: 'rgba(255,255,255,0.25)', border: 'none',
          width: 32, height: 32, borderRadius: '50%',
          color: '#fff', fontSize: 18, cursor: 'pointer', lineHeight: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>×</button>
      </div>

      <div style={{ padding: '20px 24px 0' }}>
        {/* Progress + countdown */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 12, color: C.textSub }}>
            已提交：<span style={{ color: C.mint, fontWeight: 700 }}>{submitted}/{total}</span> 人
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: countdown <= 15 ? C.redLight : '#FFF9E6',
            borderRadius: 20, padding: '4px 12px',
            border: `1px solid ${countdown <= 15 ? C.red : C.yellow}`,
          }}>
            <span style={{ fontSize: 14 }}>⏱️</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: countdown <= 15 ? C.red : '#B8860B' }}>
              剩余 {countdown} 秒
            </span>
          </div>
        </div>

        {/* Timer bar */}
        <div style={{ height: 6, background: C.border, borderRadius: 3, marginBottom: 20, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 3, width: `${pct}%`,
            background: pct > 50 ? C.mintGrad : pct > 25
              ? `linear-gradient(90deg, ${C.yellow}, ${C.orange})`
              : `linear-gradient(90deg, ${C.red}, ${C.orange})`,
            transition: 'width 1s linear',
          }} />
        </div>

        {/* Income / Expense inputs */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
          {[
            { label: '收入金额', icon: '💰', color: C.green, bg: C.greenLight, val: income, set: setIncome },
            { label: '支出金额', icon: '💸', color: C.red,   bg: C.redLight,   val: expense, set: setExpense },
          ].map(f => (
            <div key={f.label} style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 7 }}>
                <span style={{ fontSize: 14 }}>{f.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: f.color }}>{f.label}</span>
              </div>
              <input
                type="number" value={f.val}
                onChange={e => f.set(e.target.value.replace(/[^0-9]/g, '').slice(0, 5))}
                placeholder="0"
                style={{
                  width: '100%', padding: '13px', borderRadius: 14,
                  border: `2px solid ${f.val ? f.color : C.border}`,
                  fontSize: 24, fontWeight: 800, textAlign: 'center', outline: 'none',
                  color: f.color, background: f.val ? f.bg : C.bg,
                  boxSizing: 'border-box',
                }}
              />
            </div>
          ))}
        </div>

        {/* Quick amounts */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {['50', '100', '200', '500'].map(n => (
            <button key={n} onClick={() => setIncome(n)} style={{
              flex: 1, padding: '7px 0', borderRadius: 10,
              background: C.mintLight, border: `1px solid ${C.border}`,
              color: C.mint, fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>+{n}</button>
          ))}
        </div>

        {/* Net preview */}
        {hasInput && (
          <div style={{
            padding: '10px 14px', borderRadius: 12, marginBottom: 14,
            background: net >= 0 ? C.greenLight : C.redLight,
            border: `1px solid ${net >= 0 ? '#C2EACC' : '#FFCECE'}`,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 16 }}>{net >= 0 ? '📈' : '📉'}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: net >= 0 ? C.green : C.red }}>
              本局净{net >= 0 ? '收益' : '支出'}：{net >= 0 ? '+' : ''}{net} 积分
            </span>
          </div>
        )}

        <button onClick={onClose} style={{
          width: '100%', padding: '15px', borderRadius: 22,
          background: C.mintGrad, border: 'none',
          color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(78,205,196,0.42)',
        }}>✅ 提交本局数据</button>

        <div style={{ textAlign: 'center', marginTop: 10, fontSize: 11, color: C.textSub }}>
          倒计时结束后未提交将自动视为 0 分
        </div>
      </div>
    </div>
  )
}
