// pages/profile/profile.js
// 我的页面：个人资料卡片 + 功能入口（PRD §3.1）
import { userApi } from '../../services/user.service';
import { assetUrl } from '../../utils/format.util';

Page({
  data: {
    userInfo: null,
    avatarUrl: '',
    stats: null,
    loading: false,
    headerPaddingTop: 0,
    isLoggedIn: false
  },

  onLoad() {
    const sysInfo = wx.getWindowInfo();
    const menuBtn = wx.getMenuButtonBoundingClientRect();
    const statusBarHeight = sysInfo.statusBarHeight || 20;
    const navBarHeight = (menuBtn.bottom - menuBtn.top) + (menuBtn.top - statusBarHeight) * 2;
    this.setData({ headerPaddingTop: statusBarHeight + navBarHeight });
  },

  onShow() {
    const loggedIn = !!getApp().globalData.token;
    this.setData({ isLoggedIn: loggedIn });
    if (loggedIn) {
      this.loadProfile();
      this.loadStats();
    } else {
      // 游客态：显示默认信息，不调接口
      this.setData({ userInfo: null, avatarUrl: '', stats: null });
    }
  },

  /** 需要登录的操作：未登录时引导去登录页 */
  requireLogin() {
    if (getApp().globalData.token) return true;
    wx.navigateTo({ url: '/pages/login/login' });
    return false;
  },

  /** 分享小程序 */
  onShareAppMessage() {
    return {
      title: '牌桌记分 - 打牌计分，一键搞定',
      path: '/pages/home/home'
    };
  },

  /** 拉取用户资料（优先用 globalData 缓存） */
  async loadProfile() {
    const cached = getApp().globalData.userInfo;
    if (cached) {
      this.setData({ userInfo: cached, avatarUrl: assetUrl(cached.avatar) });
    }
    this.setData({ loading: true });
    try {
      const res = await userApi.getProfile();
      this.setData({ userInfo: res.data, avatarUrl: assetUrl(res.data.avatar) });
      getApp().globalData.userInfo = res.data;
      getApp().globalData.userRole = res.data.role || 'user';
    } catch (e) {
      // 静默失败，不弹提示（游客态或 token 过期均不应打扰用户）
    } finally {
      this.setData({ loading: false });
    }
  },

  /** 加载战绩统计 */
  async loadStats() {
    try {
      const res = await userApi.getStats();
      this.setData({ stats: res.data });
    } catch (e) {
      // 忽略
    }
  },

  /** 编辑资料（PRD §3.2） */
  onEditProfile() {
    if (!this.requireLogin()) return;
    wx.navigateTo({ url: '/pages/profile-edit/profile-edit' });
  },

  /** 战绩查询（PRD §3.3） */
  onRecords() {
    if (!this.requireLogin()) return;
    wx.navigateTo({ url: '/pages/records/records' });
  },

  /** 系统设置（PRD §3.4） */
  onSettings() {
    if (!this.requireLogin()) return;
    wx.navigateTo({ url: '/pages/settings/settings' });
  },

  /** 帮助反馈（PRD §3.5） */
  onHelp() {
    if (!this.requireLogin()) return;
    wx.navigateTo({ url: '/pages/help/help' });
  },

  /** 联系我们（PRD §3.6） */
  onContact() {
    if (!this.requireLogin()) return;
    wx.navigateTo({ url: '/pages/contact/contact' });
  },

  /** 退出登录 */
  onLogout() {
    wx.showModal({
      title: '提示',
      content: '确定退出登录？',
      confirmText: '退出',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('token');
          const app = getApp();
          app.globalData.token = '';
          app.globalData.userInfo = null;
          app.globalData.userRole = 'visitor';
          wx.switchTab({ url: '/pages/home/home' });
        }
      }
    });
  }
});