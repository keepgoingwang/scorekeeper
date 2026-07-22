// services/user.service.js
// 用户相关 API（PRD §3）
import { http } from '../utils/request.util';

export const userApi = {
  /** 微信登录：wx.login code + 微信头像/昵称换 token */
  login(code, profile) {
    return http.post('/api/user/login', { code, ...profile });
  },

  /** 获取当前用户资料（恢复登录态时调用） */
  getProfile() {
    return http.get('/api/user/profile');
  },

  /** 更新资料（昵称/头像/年龄，PRD §3.2） */
  updateProfile(data) {
    return http.put('/api/user/profile', data);
  },

  /** 战绩统计概览（PRD §3.3 统计概览） */
  getStats() {
    return http.get('/api/user/stats');
  }
};
