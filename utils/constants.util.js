// utils/constants.util.js
// 领域常量：牌桌皮肤、房间状态、结算模式、角色、错误码

/** 接口基础地址（本地联调用 localhost，线上改为 HTTPS 域名） */
export const API_BASE = 'https://ocrcamera.xyz';
export const WS_BASE = 'wss://ocrcamera.xyz/ws';

/** 静态资源 origin（头像等后端返回相对路径时拼接） */
export const ASSET_ORIGIN = API_BASE;

/** 牌桌皮肤（PRD §4.4） */
export const SKINS = {
  MAHJONG: { key: 'mahjong', name: '经典麻将', color: '#2D5A3D' },
  TEXAS: { key: 'texas', name: '德州之夜', color: '#1A1A2E' },
  WOOD: { key: 'wood', name: '休闲木桌', color: '#D4A373' },
  MINT: { key: 'mint', name: '清新薄荷', color: '#4ECDC4' }
};

/** 房间状态 */
export const ROOM_STATE = {
  WAITING: 'waiting',     // 等待中
  PLAYING: 'playing',    // 进行中（空闲，可结算）
  SETTLING: 'settling',  // 自动结算输入中
  SETTLED: 'settled',    // 已结算（终局）
  DISSOLVED: 'dissolved' // 已解散
};

/** 结算模式 */
export const SETTLE_MODE = {
  MANUAL: 'manual', // 手动结算
  AUTO: 'auto'     // 自动结算
};

/** 用户在房间内的状态 */
export const MEMBER_STATUS = {
  ACTIVE: 'active',   // 有效用户
  EXITED: 'exited'    // 已退出用户
};

/** 角色等级 */
export const ROLE = {
  VISITOR: 'visitor',
  USER: 'user',
  VIP: 'vip',
  ADMIN: 'admin'
};

/** 统一错误码（前后端一致） */
export const ERROR_CODES = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};

/** 自动结算倒计时（秒） */
export const SETTLE_COUNTDOWN = 60;

/** 房间号长度 */
export const ROOM_NO_LENGTH = 6;

/** 头像区单行最大显示数 */
export const AVATAR_ROW_MAX = 5;

/** 第一圈最大玩家数 */
export const TABLE_FIRST_CIRCLE_MAX = 8;
