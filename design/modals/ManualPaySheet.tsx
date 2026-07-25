import { C } from '../shared/constants'
import { scoreCol, scoreLbl } from '../shared/helpers'
import type { Player } from '../shared/types'
import Sheet from '../components/Sheet'

interface Props {
  onClose: () => void
  players: Player[]
  onNext: (p: Player) => void
}

export default function ManualPaySheet({ onClose, players, onNext }: Props) {
  const valid = players.filter(p => !p.exited && !p.isOwner)

  return (
    <Sheet title="💸 选择收款方" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 12, color: C.textSub }}>
          选择收款玩家（仅显示房间内有效用户）
        </div>
        {valid.map(p => (
          <div key={p.id} onClick={() => onNext(p)} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 16px', borderRadius: 14,
            background: C.bg, border: `1px solid ${C.border}`, cursor: 'pointer',
          }}>
            <div style={{
              width: 46, height: 46, borderRadius: '50%',
              background: C.mintLight, border: `2px solid ${C.mint}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
            }}>{p.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{p.name}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: scoreCol(p.score), marginTop: 2 }}>{scoreLbl(p.score)} 积分</div>
            </div>
            <span style={{ color: C.textSub, fontSize: 18 }}>›</span>
          </div>
        ))}
        {valid.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px', color: C.textSub, fontSize: 13 }}>
            暂无可选收款方
          </div>
        )}
      </div>
    </Sheet>
  )
}
