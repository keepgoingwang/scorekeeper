import type { Player, HistoryRecord, TableSkin } from './types'

export const C = {
  mint: '#4ECDC4',
  mintDark: '#3ABDB4',
  mintLight: '#E8F8F7',
  mintGrad: 'linear-gradient(135deg, #4ECDC4 0%, #45B7D1 100%)',
  sky: '#45B7D1',
  yellow: '#FFD93D',
  green: '#6BCB77',
  greenLight: '#E8F8ED',
  orange: '#FF9F45',
  red: '#FF6B6B',
  redLight: '#FFF2F2',
  bg: '#F8FAFB',
  card: '#FFFFFF',
  text: '#2C3E50',
  textSub: '#7F8C8D',
  border: '#E8ECEF',
  modeBar: '#F0F4F8',
}

export const SKINS: { key: TableSkin; name: string; color: string }[] = [
  { key: 'classic', name: '经典麻将', color: '#2D5A3D' },
  { key: 'poker',   name: '德州之夜', color: '#1A1A2E' },
  { key: 'wood',    name: '休闲木桌', color: '#C08A58' },
  { key: 'mint',    name: '清新薄荷', color: C.mint },
]

export const PLAYERS_4: Player[] = [
  { id: 1, name: '张三', emoji: '🤠', score: 350, isOwner: true },
  { id: 2, name: '李四', emoji: '😊', score: 120 },
  { id: 3, name: '王五', emoji: '😎', score: -80, exited: true },
  { id: 4, name: '赵六', emoji: '🙂', score: -390 },
]

export const PLAYERS_5: Player[] = [
  { id: 1, name: '张三', emoji: '🤠', score: 350, isOwner: true },
  { id: 2, name: '李四', emoji: '😊', score: 120 },
  { id: 3, name: '王五', emoji: '😎', score: -80 },
  { id: 4, name: '赵六', emoji: '🙂', score: -200 },
  { id: 5, name: '钱七', emoji: '😏', score: -190 },
]

export const FEED = [
  { icon: '🎉', text: '张三 进入房间' },
  { icon: '💸', text: '赵六 支出 200 积分 → 张三' },
  { icon: '👋', text: '王五 退出房间' },
]

export const HISTORY: HistoryRecord[] = [
  { id: 1, roomNo: '882341', date: '07-16', players: 4, myScore: 350, status: '已结算' },
  { id: 2, roomNo: '441209', date: '07-14', players: 4, myScore: -120, status: '已结算' },
  { id: 3, roomNo: '993847', date: '07-12', players: 5, myScore: 0,   status: '已结算' },
  { id: 4, roomNo: '771234', date: '07-10', players: 4, myScore: 280, status: '已结算' },
  { id: 5, roomNo: '554321', date: '07-08', players: 3, myScore: -60, status: '已结算' },
  { id: 6, roomNo: '338812', date: '07-05', players: 5, myScore: 180, status: '已结算' },
  { id: 7, roomNo: '229944', date: '07-03', players: 4, myScore: 410, status: '已结算' },
]

export const LEDGER_ITEMS = [
  { icon: '💸', text: '赵六 支出 200 分 → 张三', time: '14:32', color: '#FF6B6B' },
  { icon: '💸', text: '王五 支出 80 分 → 李四',  time: '13:58', color: '#FF6B6B' },
  { icon: '🎲', text: '第11局结算完成',           time: '13:45', color: '#4ECDC4' },
  { icon: '💸', text: '钱七 支出 150 分 → 张三',  time: '13:22', color: '#FF6B6B' },
  { icon: '🎲', text: '第10局结算完成',           time: '13:10', color: '#4ECDC4' },
  { icon: '👑', text: '张三 成为新房主',           time: '12:55', color: '#FFD93D' },
  { icon: '🎉', text: '李四 进入房间',             time: '12:30', color: '#6BCB77' },
  { icon: '🎉', text: '王五 进入房间',             time: '12:28', color: '#6BCB77' },
  { icon: '🏠', text: '房间 888888 创建',           time: '12:20', color: '#4ECDC4' },
]
