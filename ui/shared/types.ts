export type Tab = 'home' | 'profile'

export type Page =
  | 'home'
  | 'profile'
  | 'room'
  | 'records'
  | 'settings'
  | 'help'
  | 'contact'
  | 'edit-profile'
  | 'ledger'

export type Modal =
  | 'none'
  | 'join'
  | 'qr'
  | 'manual-pay'
  | 'manual-amount'
  | 'auto-settle-input'
  | 'action'
  | 'final'
  | 'skin'
  | 'confirm-switch'
  | 'scan'

export type TableSkin = 'classic' | 'poker' | 'wood' | 'mint'
export type SettleMode = 'auto' | 'manual'
export type SettlePhase = 'idle' | 'inputting'

export interface Player {
  id: number
  name: string
  emoji: string
  score: number
  isOwner?: boolean
  exited?: boolean
}

export interface HistoryRecord {
  id: number
  roomNo: string
  date: string
  players: number
  myScore: number
  status: string
}

export interface AppNav {
  page: Page
  tab: Tab
  inRoom: boolean
  tableType: 'square' | 'circle'
  modal: Modal
  isOwner: boolean
  manualPayee: Player | null
  pendingAction: (() => void) | null
  skin: TableSkin
  settleMode: SettleMode
}
