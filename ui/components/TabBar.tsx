import { C } from '../shared/constants'
import type { Tab } from '../shared/types'

interface Props {
  tab: Tab
  setTab: (t: Tab) => void
}

const ITEMS: { key: Tab; icon: string; label: string }[] = [
  { key: 'home',    icon: '🏠', label: '首页' },
  { key: 'profile', icon: '👤', label: '我的' },
]

export default function TabBar({ tab, setTab }: Props) {
  return (
    <div style={{
      background: C.card, borderTop: `1px solid ${C.border}`,
      display: 'flex', padding: '8px 0 16px',
      boxShadow: '0 -2px 12px rgba(0,0,0,0.06)',
    }}>
      {ITEMS.map(t => (
        <button key={t.key} onClick={() => setTab(t.key)} style={{
          flex: 1, background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '4px 0',
        }}>
          <span style={{ fontSize: 24 }}>{t.icon}</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: tab === t.key ? C.mint : C.textSub }}>{t.label}</span>
          {tab === t.key && <div style={{ width: 22, height: 3, borderRadius: 2, background: C.mint }} />}
        </button>
      ))}
    </div>
  )
}
