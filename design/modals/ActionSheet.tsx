import { C } from '../shared/constants'
import type { Modal, Page } from '../shared/types'
import Sheet from '../components/Sheet'

interface Props {
  onClose: () => void
  setModal: (m: Modal) => void
  navigate: (p: Page) => void
  isOwner: boolean
}

export default function ActionSheet({ onClose, setModal, navigate, isOwner }: Props) {
  const base = [
    {
      icon: '📋', label: '查看流水单', col: C.text,
      action: () => { onClose(); navigate('ledger') },
    },
    {
      icon: '🚪', label: '退出房间', col: C.orange,
      action: onClose,
    },
  ]
  const ownerExtra = [
    {
      icon: '⚙️', label: '切换结算模式', col: C.text,
      action: onClose,
    },
    {
      icon: '🎨', label: '牌桌皮肤设置', col: C.text,
      action: () => { onClose(); setModal('skin') },
    },
    {
      icon: '🏁', label: '房间结算（终局）', col: C.mint,
      action: () => { onClose(); setModal('final') },
    },
    {
      icon: '💥', label: '解散房间', col: C.red,
      action: onClose,
    },
  ]
  const items = isOwner ? [...base, ...ownerExtra] : base

  return (
    <Sheet title="⚙️ 操作菜单" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {isOwner && (
          <div style={{
            fontSize: 11, color: C.mint, fontWeight: 700,
            background: C.mintLight, padding: '6px 12px', borderRadius: 10,
          }}>
            👑 你是房主，拥有额外权限
          </div>
        )}
        {items.map(item => (
          <button key={item.label} onClick={item.action} style={{
            width: '100%', padding: '14px 16px', borderRadius: 14,
            background: C.bg, border: `1px solid ${C.border}`,
            color: item.col, fontSize: 14, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
          }}>
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </Sheet>
  )
}
