// pages/login/login.js
// 简化版微信登录：点击按钮 → chooseAvatar → 微信昵称建议 → 自动登录
import { userApi } from '../../services/user.service';
import { API_BASE } from '../../utils/constants.util';

Page({
  data: {
    avatar: '',
    nickname: '',
    loading: false,
    showNickname: false,
    autoFocus: false
  },

  /** 选择微信头像后，显示昵称输入框让用户点一下微信建议 */
  onChooseAvatar(e) {
    const avatar = e.detail.avatarUrl || '';
    this.setData({
      avatar,
      showNickname: true,
      autoFocus: true
    });
  },

  /** 昵称自动填入（来自微信键盘建议） */
  onNicknameInput(e) {
    const nickname = e.detail.value || '';
    if (nickname) {
      this.setData({ nickname });
    }
  },

  /** 用户点击微信键盘的"确认"或昵称建议后，自动登录 */
  onNicknameConfirm(e) {
    const nickname = e.detail.value || '';
    if (nickname) {
      this.setData({ nickname });
    }
    this.doLogin();
  },

  /** 执行登录：上传头像 → wx.login → 调后端登录接口 */
  async doLogin() {
    if (this.data.loading) return;
    this.setData({ loading: true });
    try {
      // 1. 上传头像到服务器
      let avatarUrl = '';
      if (this.data.avatar) {
        avatarUrl = await this.uploadAvatar(this.data.avatar);
      }

      // 2. wx.login 获取 code
      const { code } = await wx.login();

      // 3. 调后端登录接口
      const res = await userApi.login(code, {
        nickname: this.data.nickname || '牌友',
        avatar: avatarUrl
      });

      // 4. 保存登录态
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

  /** 上传头像到服务器，返回可访问 URL */
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

  /** 打开协议页面 */
  onOpenPage(e) {
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({ url });
  }
});