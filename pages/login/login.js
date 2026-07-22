// pages/login/login.js
// 首次微信登录：chooseAvatar 取头像 + nickname 输入取昵称 + wx.login code
import { userApi } from '../../services/user.service';
import { API_BASE } from '../../utils/constants.util';

Page({
  data: {
    avatar: '',      // chooseAvatar 返回的临时路径
    nickname: '',
    loading: false
  },

  /** 选择微信头像 */
  onChooseAvatar(e) {
    this.setData({ avatar: e.detail.avatarUrl });
  },

  /** 昵称输入（input 与 blur 均绑定，兼容微信昵称自动填充） */
  onNicknameInput(e) {
    this.setData({ nickname: e.detail.value || '' });
  },

  /** 登录：wx.login 换 code -> 上传头像 -> 调后端登录 */
  async onLogin() {
    if (this.data.loading) return;
    const { avatar, nickname } = this.data;
    if (!nickname.trim()) {
      return wx.showToast({ title: '请输入昵称', icon: 'none' });
    }
    this.setData({ loading: true });
    try {
      const { code } = await wx.login();
      const avatarUrl = avatar ? await this.uploadAvatar(avatar) : '';
      const res = await userApi.login(code, { nickname: nickname.trim(), avatar: avatarUrl });

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

  /**
   * 上传头像到后端，返回可访问 URL
   * @param {string} filePath 临时文件路径
   * @returns {Promise<string>}
   */
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
  }
});
