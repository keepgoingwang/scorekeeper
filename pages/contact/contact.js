// pages/contact/contact.js
// 联系我们页（PRD §3.6）：客服联系方式 + 版本信息 + 隐私协议 - 基于Figma设计重构

Page({
  data: {
    version: '1.0.0',
    contactInfo: {
      wechat: 'scorekeeper_01',
      email: 'support@scorekeeper.app',
      qq: '888666333'
    }
  },

  onLoad() {
    const accountInfo = wx.getAccountInfoSync();
    this.setData({
      version: accountInfo.miniProgram.version || '1.0.0'
    });
  },

  onBack() {
    wx.navigateBack();
  },

  onCopyWechat() {
    wx.setClipboardData({
      data: this.data.contactInfo.wechat,
      success: () => wx.showToast({ title: '已复制微信号', icon: 'success' })
    });
  },

  onCopyEmail() {
    wx.setClipboardData({
      data: this.data.contactInfo.email,
      success: () => wx.showToast({ title: '已复制邮箱', icon: 'success' })
    });
  },

  onCopyQq() {
    wx.setClipboardData({
      data: this.data.contactInfo.qq,
      success: () => wx.showToast({ title: '已复制QQ群号', icon: 'success' })
    });
  },

  onShowPrivacy() {
    wx.showModal({
      title: '隐私协议',
      content: '棋牌计分小程序尊重并保护用户隐私。我们仅收集必要的用户信息（微信昵称、头像）用于提供记分服务。我们不会将您的个人信息用于任何其他目的或分享给第三方。',
      showCancel: false,
      confirmText: '我知道了'
    });
  },

  onShowAgreement() {
    wx.showModal({
      title: '用户协议',
      content: '使用棋牌计分小程序即表示您同意：1. 您将合法使用本服务；2. 您不会利用本服务进行任何违法违规活动；3. 我们有权在必要时更新本协议。',
      showCancel: false,
      confirmText: '我知道了'
    });
  }
});