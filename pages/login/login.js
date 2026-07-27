// pages/login/login.js
// 微信一键登录：点按钮 → wx.login → 换 token → 进首页，零授权弹窗。
// 首次登录使用默认头像与昵称（后端缺省填充），真实资料可在「我的-编辑资料」修改。
import { userApi } from '../../services/user.service';

Page({
  data: {
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

  /** 一键登录：直接拿 code 换 token，不弹任何授权 */
  async onLogin() {
    if (this.data.loading) return;
    this.setData({ loading: true });
    try {
      const { code } = await wx.login();
      const res = await userApi.login(code, {});

      const app = getApp();
      app.globalData.token = res.data.token;
      app.globalData.userInfo = res.data.user;
      app.globalData.userRole = res.data.user.role || 'user';
      wx.setStorageSync('token', res.data.token);

      wx.switchTab({ url: '/pages/home/home' });
    } catch (e) {
      wx.showToast({ title: e.message || '登录失败', icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  onOpenPage(e) {
    wx.navigateTo({ url: e.currentTarget.dataset.url });
  }
});
