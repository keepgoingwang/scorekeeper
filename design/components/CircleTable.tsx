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

export default function CircleTable({ players, skin, submittedIds, round = 8 }: Props) {
  const R = 108
  const D = R * 2
  const ORBIT = R + 60
  const CX = ORBIT
  const CY = ORBIT
  const CONT = ORBIT * 2
  const chipR = R * 0.62

  return (
    <div style={{ position: 'relative', width: CONT, height: CONT, margin: '0 auto', flexShrink: 0 }}>
      {/* Table circle */}
      <div style={{
        position: 'absolute',
        left: ORBIT - R, top: ORBIT - R,
        width: D, height: D, borderRadius: '50%',
        background: skinBg(skin),
        boxShadow: '0 8px 36px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.1)',
        border: '4px solid rgba(255,255,255,0.14)',
        overflow: 'hidden',
      }}>
        {/* Felt ring */}
        <div style={{ position: 'absolute', inset: 10, borderRadius: '50%', border: '1.5px dashed rgba(255,255,255,0.18)', pointerEvents: 'none' }} />
        {/* Center emblem */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 66, height: 66, borderRadius: '50%',
          background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.14)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
        }}>
          <div style={{ fontSize: 22 }}>🀄</div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>第 {round} 局</div>
        </div>
        {/* Chip piles */}
        {players.map((p, i) => {
          const angle = (i / players.length) * 2 * Math.PI - Math.PI / 2
          const x = R + chipR * Math.cos(angle)
          const y = R + chipR * Math.sin(angle)
          return !p.exited && (
            <div key={p.id} style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%, -50%)' }}>
              <ChipPile score={p.score} size="sm" />
            </div>
          )
        })}
      </div>

      {/* Player badges around circle */}
      {players.map((p, i) => {
        const angle = (i / players.length) * 2 * Math.PI - Math.PI / 2
        const x = CX + (ORBIT - 2) * Math.cos(angle)
        const y = CY + (ORBIT - 2) * Math.sin(angle)
        return (
          <div key={p.id} style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%, -50%)' }}>
            <PlayerBadge player={p} submittedIds={submittedIds} />
          </div>
        )
      })}
    </div>
  )
}
