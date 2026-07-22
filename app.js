// app.js - 棋牌计分小程序入口
App({
  globalData: {
    userInfo: null,        // 当前用户信息
    userRole: 'visitor',   // visitor | user | vip | admin
    token: wx.getStorageSync('token') || '',
    currentRoom: null      // 当前所在房间（保证用户房间唯一性）
  },

  onLaunch() {
    // 有本地 token 则校验恢复；无 token 时由首页引导至登录页
    if (this.globalData.token) {
      this.restoreLogin();
    }
  },

  onError(error) {
    console.error('[app error]', error);
  },

  /**
   * 恢复登录态：用本地 token 拉取用户信息
   * token 失效则清空，由首页引导重新登录
   */
  async restoreLogin() {
    try {
      const { userApi } = await import('./services/user.service');
      const res = await userApi.getProfile();
      this.globalData.userInfo = res.data;
      this.globalData.userRole = res.data.role || 'user';
    } catch (e) {
      this.globalData.token = '';
      this.globalData.userRole = 'visitor';
      this.globalData.userInfo = null;
      wx.removeStorageSync('token');
    }
  }
});
