import { C } from '../shared/constants'
import { scoreCol, scoreLbl } from '../shared/helpers'
import type { Player } from '../shared/types'
import Sheet from '../components/Sheet'

interface Props {
  onClose: () => void
  players: Player[]
}

function tagOf(s: number) {
  if (s > 100)  return { label: '大赢家', bg: C.green }
  if (s > 0)    return { label: '小赢',   bg: '#8DCB96' }
  if (s < -100) return { label: '大输家', bg: C.red }
  if (s < 0)    return { label: '小输',   bg: '#FF9F9F' }
  return { label: '保本', bg: C.textSub }
}

export default function FinalSheet({ onClose, players }: Props) {
  const sorted = [...players].filter(p => !p.exited).sort((a, b) => b.score - a.score)
  const losers = sorted.filter(p => p.score < 0)
  const winners = sorted.filter(p => p.score > 0)
  const medals = ['🥇', '🥈', '🥉']

  return (
    <Sheet title="🏆 房间结算报告" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 11, color: C.textSub }}>
          房间 888888 · 共 12 局 · 仅统计有效用户
        </div>

        {/* Ranking */}
        {sorted.map((p, i) => {
          const tag = tagOf(p.score)
          return (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '14px',
              borderRadius: 16,
              background: p.score > 0 ? '#EDFBF0' : p.score < 0 ? C.redLight : C.bg,
              border: `1px solid ${p.score > 0 ? '#C2EACC' : p.score < 0 ? '#FFCECE' : C.border}`,
            }}>
              <div style={{ fontSize: 22, width: 28, textAlign: 'center' }}>{i < 3 ? medals[i] : `${i + 1}`}</div>
              <span style={{ fontSize: 24 }}>{p.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{p.name}</div>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                  background: tag.bg, color: '#fff', marginTop: 2, display: 'inline-block',
                }}>{tag.label}</span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 900, color: scoreCol(p.score) }}>{scoreLbl(p.score)}</div>
            </div>
          )
        })}

        {/* Transfer suggestion */}
        {losers.length > 0 && winners.length > 0 && (
          <div style={{
            background: C.modeBar, borderRadius: 16, padding: '14px',
            border: `1px solid ${C.border}`,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10 }}>
              💰 建议转账方案
            </div>
            {losers.map(l => (
              <div key={l.id} style={{
                fontSize: 12, color: C.textSub, lineHeight: 2.2,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span style={{ background: '#FFE8E8', color: C.red, fontWeight: 700, padding: '1px 8px', borderRadius: 6, fontSize: 11 }}>{l.name}</span>
                <span>→</span>
                <span style={{ background: C.mintLight, color: C.mint, fontWeight: 700, padding: '1px 8px', borderRadius: 6, fontSize: 11 }}>{winners[0].name}</span>
                <span style={{ color: C.orange, fontWeight: 800 }}>¥{Math.abs(l.score)}</span>
              </div>
            ))}
          </div>
        )}

        <button style={{
          width: '100%', padding: '15px', borderRadius: 22,
          background: `linear-gradient(135deg, ${C.yellow} 0%, ${C.orange} 100%)`,
          border: 'none', color: '#333', fontSize: 15, fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(255,217,61,0.4)',
        }}>📤 分享战绩</button>

        <button onClick={onClose} style={{
          width: '100%', padding: '13px', borderRadius: 22,
          background: C.bg, border: `1.5px solid ${C.border}`,
          color: C.red, fontSize: 14, fontWeight: 700, cursor: 'pointer',
        }}>💥 解散房间</button>
      </div>
    </Sheet>
  )
}
