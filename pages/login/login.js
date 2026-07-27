// pages/login/login.js
// 微信登录：选择头像 + 自动填入昵称 → 点击登录
import { userApi } from '../../services/user.service';
import { API_BASE } from '../../utils/constants.util';

Page({
  data: {
    avatar: '',
    nickname: '',
    loading: false
  },

  onChooseAvatar(e) {
    this.setData({ avatar: e.detail.avatarUrl || '' });
  },

  onNicknameInput(e) {
    const val = e.detail.value || '';
    if (val) this.setData({ nickname: val });
  },

  async onLogin() {
    if (this.data.loading) return;
    const nickname = this.data.nickname.trim();
    if (!nickname) {
      return wx.showToast({ title: '请点击昵称输入框', icon: 'none' });
    }
    this.setData({ loading: true });
    try {
      let avatarUrl = '';
      if (this.data.avatar) {
        avatarUrl = await this.uploadAvatar(this.data.avatar);
      }
      const { code } = await wx.login();
      const res = await userApi.login(code, { nickname, avatar: avatarUrl });

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

  uploadAvatar(filePath) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: API_BASE + '/api/user/avatar',
        filePath,
        name: 'avatar',
        success: (res) => {
          try {
            const data = JSON.parse(res.data);
            if (data.code === 200) resolve(data.data.url);
            else reject(new Error(data.message || '头像上传失败'));
          } catch (err) {
            reject(new Error('头像上传失败'));
          }
        },
        fail: () => reject(new Error('头像上传失败'))
      });
    });
  },

  onOpenPage(e) {
    wx.navigateTo({ url: e.currentTarget.dataset.url });
  }
});