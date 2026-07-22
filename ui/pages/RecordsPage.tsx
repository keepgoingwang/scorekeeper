import { C, HISTORY } from '../shared/constants'
import { scoreCol, scoreLbl } from '../shared/helpers'
import type { Page } from '../shared/types'

interface Props {
  navigate: (p: Page) => void
}

const total = HISTORY.reduce((s, r) => s + r.myScore, 0)
const wins = HISTORY.filter(r => r.myScore > 0).length
const winRate = Math.round((wins / HISTORY.length) * 100)
const maxScore = Math.max(...HISTORY.map(r => r.myScore))

const STATS = [
  { label: '参与场次', value: String(HISTORY.length) },
  { label: '胜率',     value: `${winRate}%` },
  { label: '最高积分', value: `+${maxScore}` },
  { label: '累计积分', value: scoreLbl(total) },
]

// Simple line chart data — use last 7 records
const CHART_DATA = [...HISTORY].reverse().slice(0, 7)
const VALS = CHART_DATA.map(r => r.myScore)
const MIN_V = Math.min(...VALS, -50)
const MAX_V = Math.max(...VALS, 50)
const RANGE = MAX_V - MIN_V || 1

function toPt(i: number, v: number, W: number, H: number) {
  const x = (i / (VALS.length - 1)) * W
  const y = H - ((v - MIN_V) / RANGE) * H
  return [x, y] as const
}

function SparkLine() {
  const W = 320, H = 90
  const pts = VALS.map((v, i) => toPt(i, v, W, H))
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const zeroY = H - ((0 - MIN_V) / RANGE) * H

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
      {/* Zero line */}
      <line x1={0} y1={zeroY} x2={W} y2={zeroY} stroke={C.border} strokeWidth={1} strokeDasharray="4,4" />
      {/* Line */}
      <path d={d} fill="none" stroke={C.mint} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {/* Fill */}
      <path
        d={`${d} L${W},${H} L0,${H} Z`}
        fill={`url(#chartGrad)`}
        opacity={0.18}
      />
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.mint} />
          <stop offset="100%" stopColor={C.mint} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Dots */}
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={4} fill={VALS[i] >= 0 ? C.green : C.red} stroke="#fff" strokeWidth={1.5} />
      ))}
    </svg>
  )
}

export default function RecordsPage({ navigate }: Props) {
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
        <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>📊 战绩查询</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          {STATS.map(s => (
            <div key={s.label} style={{
              background: C.card, borderRadius: 16, padding: '14px',
              textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
            }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: C.mint }}>{s.value}</div>
              <div style={{ fontSize: 11, color: C.textSub, marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Trend chart */}
        <div style={{
          background: C.card, borderRadius: 18, padding: '16px 16px 12px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>近期积分走势</div>
            <div style={{
              fontSize: 11, color: C.mint, fontWeight: 600,
              background: C.mintLight, padding: '3px 10px', borderRadius: 10,
            }}>近7场</div>
          </div>
          <SparkLine />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            {CHART_DATA.map(r => (
              <div key={r.id} style={{ fontSize: 9, color: C.textSub }}>{r.date}</div>
            ))}
          </div>
        </div>

        {/* Record list */}
        <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10 }}>场次明细</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {HISTORY.map(r => (
            <div key={r.id} style={{
              background: C.card, borderRadius: 16, padding: '14px',
              display: 'flex', alignItems: 'center', gap: 12,
              boxShadow: '0 2px 10px rgba(0,0,0,0.06)', cursor: 'pointer',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: r.myScore > 0 ? C.greenLight : r.myScore < 0 ? C.redLight : C.modeBar,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
              }}>
                {r.myScore > 0 ? '🏆' : r.myScore < 0 ? '😢' : '😐'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>#{r.roomNo}</div>
                <div style={{ fontSize: 11, color: C.textSub, marginTop: 2 }}>
                  {r.date} · {r.players}人 · {r.status}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: scoreCol(r.myScore) }}>{scoreLbl(r.myScore)}</div>
                <div style={{ fontSize: 9, color: C.textSub }}>积分</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
