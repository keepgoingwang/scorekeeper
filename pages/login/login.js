// pages/login/login.js
// 微信一键登录：点按钮 → 校验协议勾选 → wx.login → 换 token → 进首页
import { userApi } from '../../services/user.service';

Page({
  data: {
    loading: false,
    agreed: false,
    nickname: '',
    autoFocus: false,
    headerPaddingTop: 0
  },

  onLoad() {
    const sysInfo = wx.getWindowInfo();
    const menuBtn = wx.getMenuButtonBoundingClientRect();
    const statusBarHeight = sysInfo.statusBarHeight || 20;
    const navBarHeight = (menuBtn.bottom - menuBtn.top) + (menuBtn.top - statusBarHeight) * 2;
    this.setData({ headerPaddingTop: statusBarHeight + navBarHeight });
    setTimeout(() => this.setData({ autoFocus: true }), 300);
  },

  /** 切换协议勾选 */
  onToggleAgree() {
    this.setData({ agreed: !this.data.agreed });
  },

  onNicknameInput(e) {
    this.setData({ nickname: e.detail.value || '' });
  },

  /** 一键登录：校验协议 → 拿 code 换 token */
  async onLogin() {
    if (this.data.loading) return;
    if (!this.data.agreed) {
      return wx.showModal({
        title: '隐私协议',
        content: '登录前请先阅读并同意《用户协议》与《隐私政策》',
        confirmText: '同意协议',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            this.setData({ agreed: true });
            this.onLogin();
          }
        }
      });
    }
    const nickname = (this.data.nickname || '').trim();
    if (!nickname) {
      return wx.showToast({ title: '请点击输入框选择微信昵称', icon: 'none' });
    }
    this.setData({ loading: true });
    try {
      const { code } = await wx.login();
      const res = await userApi.login(code, { nickname });

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
