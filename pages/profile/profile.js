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
    headerPaddingTop: 0
  },

  onLoad() {
    const sysInfo = wx.getWindowInfo();
    const menuBtn = wx.getMenuButtonBoundingClientRect();
    const statusBarHeight = sysInfo.statusBarHeight || 20;
    const navBarHeight = (menuBtn.bottom - menuBtn.top) + (menuBtn.top - statusBarHeight) * 2;
    this.setData({ headerPaddingTop: statusBarHeight + navBarHeight });
  },

  onShow() {
    this.loadProfile();
    this.loadStats();
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
      if (!cached) {
        wx.showToast({ title: e.message || '加载失败', icon: 'none' });
      }
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
    wx.navigateTo({ url: '/pages/profile-edit/profile-edit' });
  },

  /** 战绩查询（PRD §3.3） */
  onRecords() {
    wx.navigateTo({ url: '/pages/records/records' });
  },

  /** 系统设置（PRD §3.4） */
  onSettings() {
    wx.navigateTo({ url: '/pages/settings/settings' });
  },

  /** 帮助反馈（PRD §3.5） */
  onHelp() {
    wx.navigateTo({ url: '/pages/help/help' });
  },

  /** 联系我们（PRD §3.6） */
  onContact() {
    wx.navigateTo({ url: '/pages/contact/contact' });
  }
});