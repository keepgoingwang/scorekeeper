// pages/profile-edit/profile-edit.js
// 资料编辑页（PRD §3.2）：头像 / 昵称 / 年龄，ID 不可改 - 基于Figma设计重构
import { userApi } from '../../services/user.service';
import { API_BASE } from '../../utils/constants.util';

Page({
  data: {
    avatar: '',
    nickname: '',
    age: '',
    userId: '',
    loading: false,
    saved: false
  },

  onLoad() {
    const user = getApp().globalData.userInfo;
    if (user) {
      this.setData({
        avatar: user.avatar || '',
        nickname: user.nickname || '',
        age: String(user.age || ''),
        userId: user._id ? user._id.slice(-8) : '—'
      });
    }
  },
  onChooseAvatar(e) {
    this.setData({ avatar: e.detail.avatarUrl });
  },

  onNicknameInput(e) {
    this.setData({ nickname: e.detail.value });
  },

  onAgeInput(e) {
    this.setData({ age: e.detail.value });
  },

  async onSave() {
    if (this.data.loading) return;
    const { nickname, age } = this.data;
    if (!nickname.trim()) {
      return wx.showToast({ title: '请输入昵称', icon: 'none' });
    }
    this.setData({ loading: true });
    try {
      const data = { nickname: nickname.trim() };
      if (this.data.avatar && this.data.avatar.startsWith('wxfile://')) {
        data.avatar = await this.uploadAvatar(this.data.avatar);
      }
      if (age) data.age = parseInt(age, 10);
      const res = await userApi.updateProfile(data);
      getApp().globalData.userInfo = res.data;
      this.setData({ saved: true });
      wx.showToast({ title: '保存成功', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 1200);
    } catch (e) {
      wx.showToast({ title: e.message || '保存失败', icon: 'none' });
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
  }
});