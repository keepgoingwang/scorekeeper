// utils/permission.util.js
// 权限校验：基于 globalData.userRole 的角色等级判断

/**
 * 判断当前用户是否满足指定角色权限
 * @param {string} role 'visitor' | 'user' | 'vip' | 'admin'
 * @returns {boolean}
 */
export function hasAuth(role) {
  const userRole = (getApp() && getApp().globalData && getApp().globalData.userRole) || 'visitor';
  const levels = { visitor: 0, user: 1, vip: 2, admin: 3 };
  return (levels[userRole] || 0) >= (levels[role] || 0);
}

/**
 * 判断当前用户是否为指定房间的房主
 * @param {string} ownerId 房间房主用户 ID
 * @returns {boolean}
 */
export function isRoomOwner(ownerId) {
  const user = getApp() && getApp().globalData && getApp().globalData.userInfo;
  return !!(user && user._id && user._id === ownerId);
}
