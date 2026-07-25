import { C } from '../shared/constants'
import { scoreCol, scoreLbl } from '../shared/helpers'
import type { Player } from '../shared/types'

interface Props {
  player: Player
  submittedIds: Set<number>
  size?: 'sm' | 'md'
}

export default function PlayerBadge({ player, submittedIds, size = 'md' }: Props) {
  const isSubmitted = submittedIds.has(player.id)
  const avatarSize = size === 'sm' ? 32 : 38

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
      opacity: player.exited ? 0.5 : 1,
    }}>
      <div style={{ position: 'relative' }}>
        <div style={{
          width: avatarSize, height: avatarSize, borderRadius: '50%',
          background: player.exited ? '#DDD'
            : player.isOwner ? C.mintGrad
            : C.mintLight,
          border: `2px solid ${player.exited ? '#CCC' : player.isOwner ? C.mint : C.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: avatarSize * 0.52,
          filter: player.exited ? 'grayscale(1)' : 'none',
          boxShadow: player.isOwner ? '0 2px 8px rgba(78,205,196,0.4)' : 'none',
        }}>
          {player.emoji}
        </div>
        {player.isOwner && !player.exited && (
          <span style={{ position: 'absolute', top: -7, right: -4, fontSize: 10 }}>👑</span>
        )}
        {isSubmitted && !player.exited && (
          <div style={{
            position: 'absolute', bottom: -1, right: -1,
            width: 10, height: 10, borderRadius: '50%',
            background: C.green, border: '1.5px solid #fff',
          }} />
        )}
        {player.exited && (
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: 'rgba(200,200,200,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11,
          }}>🚪</div>
        )}
      </div>
      <div style={{ fontSize: 9, fontWeight: 600, color: player.exited ? C.textSub : C.text, whiteSpace: 'nowrap' }}>
        {player.name}{player.exited ? '(退)' : ''}
      </div>
      <div style={{ fontSize: 10, fontWeight: 800, color: scoreCol(player.score, player.exited) }}>
        {scoreLbl(player.score)}
      </div>
    </div>
  )
}
