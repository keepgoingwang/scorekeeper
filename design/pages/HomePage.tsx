import { C } from '../shared/constants'
import type { Modal } from '../shared/types'

interface Props {
  inRoom: boolean
  setModal: (m: Modal) => void
  enterRoom: (tt: 'square' | 'circle') => void
  setPendingAction: (fn: (() => void) | null) => void
}

export default function HomePage({ inRoom, setModal, enterRoom, setPendingAction }: Props) {
  const handleCreate = () => {
    if (inRoom) {
      setPendingAction(() => () => enterRoom('square'))
      setModal('confirm-switch')
    } else {
      enterRoom('square')
    }
  }

  const handleJoin = () => {
    if (inRoom) {
      setPendingAction(() => () => setModal('join'))
      setModal('confirm-switch')
    } else {
      setModal('join')
    }
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      {/* Hero */}
      <div style={{
        background: C.mintGrad,
        padding: '40px 24px 52px',
        borderRadius: '0 0 40px 40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 130, height: 130, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ position: 'absolute', bottom: -20, left: -20, width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ fontSize: 60, marginBottom: 12, position: 'relative' }}>🀄</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: 1, position: 'relative' }}>牌桌记分</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.88)', marginTop: 6, position: 'relative' }}>打牌计分，一键搞定</div>
      </div>

      {/* Action Buttons */}
      <div style={{ padding: '28px 20px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Create room */}
        <button onClick={handleCreate} style={{
          width: '100%', padding: '22px 0', borderRadius: 22,
          background: C.mintGrad, border: 'none', cursor: 'pointer',
          boxShadow: '0 8px 28px rgba(78,205,196,0.5)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        }}>
          <span style={{ fontSize: 36 }}>🎲</span>
          <span style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>创建房间</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>点击快速开启牌局</span>
        </button>

        {/* Join room */}
        <button onClick={handleJoin} style={{
          width: '100%', padding: '22px 0', borderRadius: 22,
          background: C.card, border: `2px solid ${C.mint}`, cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(78,205,196,0.18)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        }}>
          <span style={{ fontSize: 36 }}>📷</span>
          <span style={{ fontSize: 18, fontWeight: 900, color: C.mint }}>加入房间</span>
          <span style={{ fontSize: 12, color: C.textSub }}>扫码或输入房间号加入</span>
        </button>
      </div>

      {/* Current room card */}
      {inRoom && (
        <div style={{ padding: '18px 20px 0' }}>
          <div style={{
            background: C.card, borderRadius: 18, padding: '16px',
            border: `1.5px solid ${C.mint}`,
            boxShadow: '0 2px 14px rgba(78,205,196,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 20 }}>🏠</span>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>当前所在房间</div>
              <div style={{
                marginLeft: 'auto', fontSize: 11, fontWeight: 700,
                background: C.greenLight, color: C.green, padding: '3px 10px', borderRadius: 10,
              }}>进行中</div>
            </div>
            <div style={{ fontSize: 12, color: C.textSub, marginBottom: 12 }}>
              房间号：<span style={{ color: C.mint, fontWeight: 800, letterSpacing: 2 }}>888888</span>
              &nbsp;·&nbsp; 成员：4人
            </div>
            <button onClick={() => enterRoom('square')} style={{
              width: '100%', padding: '12px', borderRadius: 14,
              background: C.mintGrad, border: 'none', color: '#fff',
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 3px 10px rgba(78,205,196,0.35)',
            }}>点击返回房间 →</button>
          </div>
        </div>
      )}

      {/* Demo shortcuts */}
      <div style={{ padding: '16px 20px 28px', marginTop: 'auto' }}>
        <div style={{ fontSize: 11, color: C.border, letterSpacing: 1, textAlign: 'center', marginBottom: 10 }}>── 演示入口 ──</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => enterRoom('square')} style={{
            flex: 1, padding: '12px 0', borderRadius: 16,
            background: C.mintLight, border: `1px solid ${C.border}`,
            color: C.text, fontSize: 12, fontWeight: 600, cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          }}>
            <span style={{ fontSize: 18 }}>⬛</span><span>4人方桌</span>
          </button>
          <button onClick={() => enterRoom('circle')} style={{
            flex: 1, padding: '12px 0', borderRadius: 16,
            background: C.mintLight, border: `1px solid ${C.border}`,
            color: C.text, fontSize: 12, fontWeight: 600, cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          }}>
            <span style={{ fontSize: 18 }}>🔵</span><span>5人圆桌</span>
          </button>
        </div>
      </div>
    </div>
  )
}
