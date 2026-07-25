import { skinBg } from '../shared/helpers'
import type { Player, TableSkin } from '../shared/types'
import ChipPile from './ChipPile'
import PlayerBadge from './PlayerBadge'

interface Props {
  players: Player[]
  skin: TableSkin
  submittedIds: Set<number>
  round?: number
}

const CHIP_POS = [
  { cx: '50%', cy: '19%' },
  { cx: '80%', cy: '50%' },
  { cx: '50%', cy: '81%' },
  { cx: '20%', cy: '50%' },
]

export default function SquareTable({ players, skin, submittedIds, round = 12 }: Props) {
  const T = 210
  const BW = 54
  const BH = 70
  const W = T + BW * 2
  const H = T + BH * 2

  return (
    <div style={{ position: 'relative', width: W, height: H, margin: '0 auto', flexShrink: 0 }}>
      {/* Table surface */}
      <div style={{
        position: 'absolute', left: BW, top: BH, width: T, height: T,
        borderRadius: 20,
        background: skinBg(skin),
        boxShadow: '0 8px 36px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.1)',
        border: '4px solid rgba(255,255,255,0.14)',
        overflow: 'hidden',
      }}>
        {/* Felt ring */}
        <div style={{ position: 'absolute', inset: 10, borderRadius: 12, border: '1.5px dashed rgba(255,255,255,0.18)', pointerEvents: 'none' }} />
        {/* Corner ornaments */}
        {[[10, 10], [10, T - 42], [T - 42, 10], [T - 42, T - 42]].map(([x, y], i) => (
          <div key={i} style={{ position: 'absolute', left: x, top: y, width: 32, height: 32, borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', pointerEvents: 'none' }} />
        ))}
        {/* Center emblem */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 72, height: 72, borderRadius: 14,
          background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.14)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
        }}>
          <div style={{ fontSize: 26 }}>🀄</div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>第 {round} 局</div>
        </div>
        {/* Chip piles */}
        {players.slice(0, 4).map((p, i) => !p.exited && (
          <div key={p.id} style={{
            position: 'absolute', left: CHIP_POS[i].cx, top: CHIP_POS[i].cy,
            transform: 'translate(-50%, -50%)',
          }}>
            <ChipPile score={p.score} size="sm" />
          </div>
        ))}
      </div>

      {/* Player badges — Top */}
      {players[0] && (
        <div style={{ position: 'absolute', top: 0, left: BW + T / 2, transform: 'translateX(-50%)' }}>
          <PlayerBadge player={players[0]} submittedIds={submittedIds} />
        </div>
      )}
      {/* Right */}
      {players[1] && (
        <div style={{ position: 'absolute', top: BH + T / 2, left: BW + T + 8, transform: 'translateY(-50%)' }}>
          <PlayerBadge player={players[1]} submittedIds={submittedIds} />
        </div>
      )}
      {/* Bottom */}
      {players[2] && (
        <div style={{ position: 'absolute', bottom: 0, left: BW + T / 2, transform: 'translateX(-50%)' }}>
          <PlayerBadge player={players[2]} submittedIds={submittedIds} />
        </div>
      )}
      {/* Left */}
      {players[3] && (
        <div style={{ position: 'absolute', top: BH + T / 2, right: BW + T + 8, transform: 'translateY(-50%)' }}>
          <PlayerBadge player={players[3]} submittedIds={submittedIds} />
        </div>
      )}
    </div>
  )
}
