// utils/format.util.js
// 格式化工具：积分着色、日期、房间号、昵称截断
import { ASSET_ORIGIN } from './constants.util';

/**
 * 静态资源 URL：后端返回相对路径（如 /uploads/x.png）时拼接 origin
 * @param {string} path
 * @returns {string}
 */
export function assetUrl(path) {
  if (!path) return '';
  if (/^(https?:|wxfile:|weixin:)/.test(path)) return path; // 已是绝对/本地临时路径
  if (path.startsWith('/')) return ASSET_ORIGIN + path;
  return path;
}

/** 稳定身份 emoji：按用户 id 哈希从词表选取，同一用户始终同一张脸，用于无头像时占位 */
const EMOJI_LIST = ['🦊','🐼','🐔','🐷','🦄','🦀','🦉','🐶','🐱','🐰','🐸','🐵','🦁','🐯','🐻','🐨','🐹','🐮','🐴','🐍','🐲','🦋','🐝','🐞'];
export function userEmoji(id) {
  const raw = id && (typeof id === 'object' ? (id._id || id.userId || id.id || '') : id);
  const key = String(raw || '');
  if (!key) return '🎲';
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return EMOJI_LIST[h % EMOJI_LIST.length];
}

/**
 * 根据积分返回语义色 class（PRD §4.2：绿色正数/红色负数/灰色零）
 * @param {number} score
 * @returns {string} 'text-success' | 'text-danger' | 'text-muted'
 */
export function scoreColorClass(score) {
  if (score > 0) return 'text-success';
  if (score < 0) return 'text-danger';
  return 'text-muted';
}

/**
 * 格式化积分显示，正数加 + 号
 * @param {number} score
 * @returns {string}
 */
export function formatScore(score) {
  if (score > 0) return '+' + score;
  return String(score);
}

/**
 * 昵称截断：超过 max 字符省略（PRD §4.2 最多 6 字符）
 * @param {string} name
 * @param {number} [max=6]
 * @returns {string}
 */
export function ellipsisName(name, max = 6) {
  if (!name) return '';
  return name.length > max ? name.slice(0, max) + '…' : name;
}

/**
 * 房间号格式化：6 位数字（不足补 0）
 * @param {string|number} roomNo
 * @returns {string}
 */
export function formatRoomNo(roomNo) {
  return String(roomNo).padStart(6, '0');
}

/**
 * 时间戳格式化为 YYYY-MM-DD HH:mm
 * @param {number} ts 毫秒时间戳
 * @returns {string}
 */
export function formatDateTime(ts) {
  const d = new Date(ts);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/**
 * 时间戳格式化为 YYYY-MM-DD
 * @param {number} ts
 * @returns {string}
 */
export function formatDate(ts) {
  return formatDateTime(ts).split(' ')[0];
}
