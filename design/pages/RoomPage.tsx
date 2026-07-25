import { useState } from 'react'
import { C, PLAYERS_4, PLAYERS_5, FEED } from '../shared/constants'
import { scoreLbl, scoreCol } from '../shared/helpers'
import type { Modal, TableSkin, SettleMode, SettlePhase } from '../shared/types'
import SquareTable from '../components/SquareTable'
import CircleTable from '../components/CircleTable'

interface Props {
  tableType: 'square' | 'circle'
  setModal: (m: Modal) => void
  onLeave: () => void
  isOwner: boolean
  setIsOwner: (v: boolean) => void
  skin: TableSkin
  setSkin?: (s: TableSkin) => void
}

export default function RoomPage({ tableType, setModal, onLeave, isOwner, setIsOwner, skin }: Props) {
  const [mode, setMode] = useState<SettleMode>('auto')
  const [settlePhase, setSettlePhase] = useState<SettlePhase>('idle')
  const [submittedIds] = useState<Set<number>>(new Set([1]))
  const [round] = useState(12)

  const players = tableType === 'square' ? PLAYERS_4 : PLAYERS_5
  const activePlayers = players.filter(p => !p.exited)

  const handleLaunchSettle = () => {
    setSettlePhase('inputting')
    setModal('auto-settle-input')
  }

  const modeInfo = (() => {
    if (mode === 'manual') return {
      title: '🎯 手动结算模式',
      desc: '点击底部「支出」选择收款人进行精确支付',
      color: C.sky,
    }
    if (settlePhase === 'inputting') return {
      title: '⚡ 自动结算 · 输入中',
      desc: `${submittedIds.size}/${activePlayers.length} 人已提交 · 剩余 42 秒`,
      color: C.orange,
    }
    return {
      title: '⚡ 自动结算模式',
      desc: '等待房主发起结算，或点击下方按钮',
      color: C.mint,
    }
  })()

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: C.bg, overflow: 'hidden' }}>

      {/* Nav bar */}
      <div style={{
        background: C.card, padding: '10px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid ${C.border}`, flexShrink: 0,
      }}>
        <button onClick={onLeave} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: C.text, padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
          ← 返回
        </button>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>
          房间 <span style={{ color: C.mint, letterSpacing: 2, fontWeight: 900 }}>888888</span>
        </div>
        <button onClick={() => setModal('action')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>⚙️</button>
      </div>

      {/* Player avatar row */}
      <div style={{
        background: C.card, flexShrink: 0,
        borderBottom: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'stretch',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        {/* Scrollable avatars */}
        <div style={{ flex: 1, display: 'flex', overflowX: 'auto', paddingLeft: 8, WebkitOverflowScrolling: 'touch' as any }}>
          {players.map(p => (
            <div key={p.id} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '9px 10px', gap: 2, flexShrink: 0,
              borderRight: `1px solid ${C.border}`,
              opacity: p.exited ? 0.5 : 1,
            }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: p.exited ? '#DDD' : p.isOwner ? C.mintGrad : C.mintLight,
                  border: `2.5px solid ${p.exited ? '#CCC' : p.isOwner ? C.mint : C.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, filter: p.exited ? 'grayscale(1)' : 'none',
                  boxShadow: p.isOwner ? '0 2px 8px rgba(78,205,196,0.4)' : 'none',
                }}>
                  {p.emoji}
                </div>
                {p.isOwner && !p.exited && <span style={{ position: 'absolute', top: -7, right: -4, fontSize: 11 }}>👑</span>}
                {submittedIds.has(p.id) && !p.exited && (
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: '50%', background: C.green, border: '1.5px solid #fff' }} />
                )}
                {p.exited && (
                  <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(200,200,200,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>🚪</div>
                )}
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color: p.exited ? C.textSub : C.text, whiteSpace: 'nowrap' }}>
                {p.name}{p.exited ? '(退)' : ''}
              </div>
              <div style={{ fontSize: 12, fontWeight: 800, color: scoreCol(p.score, p.exited) }}>
                {scoreLbl(p.score)}
              </div>
            </div>
          ))}
        </div>
        {/* Invite button — fixed right */}
        <button onClick={() => setModal('qr')} style={{
          flexShrink: 0, width: 66,
          background: C.mintLight,
          border: 'none', borderLeft: `1px solid ${C.border}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 3, cursor: 'pointer', padding: '8px 10px',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: C.card, border: `2px dashed ${C.mint}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
          }}>➕</div>
          <div style={{ fontSize: 9, color: C.mint, fontWeight: 700, whiteSpace: 'nowrap' }}>邀请好友</div>
        </button>
      </div>

      {/* Mode bar */}
      <div style={{
        background: C.modeBar, flexShrink: 0,
        padding: '8px 14px',
        display: 'flex', alignItems: 'center', gap: 10,
        borderBottom: '1px solid #E4E9EF',
      }}>
        <div style={{ width: 4, height: 32, borderRadius: 2, background: modeInfo.color, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{modeInfo.title}</div>
          <div style={{ fontSize: 11, color: C.textSub, marginTop: 1 }}>{modeInfo.desc}</div>
        </div>
        {/* Demo controls */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => setIsOwner(!isOwner)} style={{
            padding: '4px 8px', borderRadius: 8,
            background: isOwner ? '#FFF9E6' : C.bg,
            border: `1px solid ${isOwner ? C.yellow : C.border}`,
            color: isOwner ? '#B8860B' : C.textSub, fontSize: 10, fontWeight: 600, cursor: 'pointer',
          }}>{isOwner ? '👑房主' : '👤普通'}</button>
          <button onClick={() => { setMode(m => m === 'auto' ? 'manual' : 'auto'); setSettlePhase('idle') }} style={{
            padding: '4px 8px', borderRadius: 8,
            background: C.card, border: `1px solid ${C.mint}`,
            color: C.mint, fontSize: 10, fontWeight: 600, cursor: 'pointer',
          }}>切换模式</button>
        </div>
      </div>

      {/* Table area */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 8px', overflow: 'hidden', minHeight: 0 }}>
        {tableType === 'square'
          ? <SquareTable players={players} skin={skin} submittedIds={submittedIds} round={round} />
          : <CircleTable players={players} skin={skin} submittedIds={submittedIds} round={round} />
        }
      </div>

      {/* Activity ticker */}
      <div style={{
        background: 'rgba(0,0,0,0.04)', flexShrink: 0,
        padding: '7px 16px', borderTop: '1px solid rgba(0,0,0,0.06)',
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.textSub, marginBottom: 3 }}>📢 房间动态</div>
        {FEED.map((item, i) => (
          <div key={i} style={{ fontSize: 11, color: C.text, lineHeight: 1.7, display: 'flex', gap: 5 }}>
            <span>{item.icon}</span>
            <span style={{ color: C.textSub }}>{item.text}</span>
          </div>
        ))}
      </div>

      {/* Bottom actions */}
      <div style={{
        background: C.card, flexShrink: 0,
        padding: '10px 14px 22px',
        boxShadow: '0 -2px 16px rgba(0,0,0,0.08)',
        display: 'flex', gap: 10,
      }}>
        {mode === 'auto' ? (
          <>
            {isOwner && (
              <button onClick={handleLaunchSettle} style={{
                flex: 2, padding: '14px 0', borderRadius: 16, cursor: 'pointer',
                background: `linear-gradient(135deg, ${C.yellow} 0%, ${C.orange} 100%)`,
                border: 'none', boxShadow: '0 3px 12px rgba(255,217,61,0.4)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              }}>
                <span style={{ fontSize: 20 }}>🎲</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#5D3A00' }}>发起第 {round} 局结算</span>
              </button>
            )}
            <button onClick={() => setModal('action')} style={{
              flex: 1, padding: '14px 0', borderRadius: 16, cursor: 'pointer',
              background: C.bg, border: `1px solid ${C.border}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            }}>
              <span style={{ fontSize: 20 }}>⚙️</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>操作</span>
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setModal('manual-pay')} style={{
              flex: 2, padding: '14px 0', borderRadius: 16, cursor: 'pointer',
              background: C.redLight, border: `1px solid ${C.red}33`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            }}>
              <span style={{ fontSize: 20 }}>💸</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.red }}>支出</span>
            </button>
            <button onClick={() => setModal('action')} style={{
              flex: 1, padding: '14px 0', borderRadius: 16, cursor: 'pointer',
              background: C.bg, border: `1px solid ${C.border}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            }}>
              <span style={{ fontSize: 20 }}>⚙️</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>操作</span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}
