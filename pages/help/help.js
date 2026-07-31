// pages/help/help.js
// 帮助反馈页（PRD §3.5）：常见问题 FAQ + 意见反馈（文字+截图）- 基于Figma设计重构

const FAQ_LIST = [
  { q: '如何创建房间？', a: '在首页点击「创建房间」按钮，系统自动生成6位房间号并弹出分享页，邀请好友扫码或输入房间号加入。' },
  { q: '什么是自动结算模式？', a: '房主点击「发起结算」后，所有玩家在60秒内输入本局收入或支出，系统自动校验收支是否平衡，平衡则自动更新积分。' },
  { q: '收支不平衡怎么办？', a: '系统会提示差额并要求所有玩家重新输入，直至收支绝对值相等为止。' },
  { q: '房主退出后房间会解散吗？', a: '若房间内还有活跃用户，系统会随机选取一位成为新房主；若无活跃用户，房间将自动解散。' },
  { q: '已退出的玩家还参与结算吗？', a: '不参与。退出后头像变灰，不再参与任何后续积分分配和结算，但其历史数据保留。' },
  { q: '如何查看战绩？', a: '在「我的」页面点击「战绩查询」，可查看历史场次明细、积分趋势图及个人统计数据。' }
];

Page({
  data: {
    faqList: FAQ_LIST,
    expandedFaq: -1,
    feedbackText: '',
    feedbackImages: [],
    submitting: false,
    submitted: false
  },
  onToggleFaq(e) {
    const idx = e.currentTarget.dataset.index;
    this.setData({
      expandedFaq: this.data.expandedFaq === idx ? -1 : idx
    });
  },

  onFeedbackInput(e) {
    this.setData({ feedbackText: e.detail.value });
  },

  onChooseImage() {
    wx.chooseImage({
      count: 3,
      sizeType: ['compressed'],
      success: (res) => {
        this.setData({ feedbackImages: res.tempFilePaths });
      }
    });
  },

  onRemoveImage(e) {
    const idx = e.currentTarget.dataset.index;
    const images = [...this.data.feedbackImages];
    images.splice(idx, 1);
    this.setData({ feedbackImages: images });
  },

  async onSubmitFeedback() {
    if (this.data.submitting || !this.data.feedbackText.trim()) return;
    this.setData({ submitting: true });
    try {
      wx.showToast({ title: '感谢您的反馈！', icon: 'success' });
      this.setData({ submitted: true, feedbackText: '', feedbackImages: [] });
      setTimeout(() => this.setData({ submitted: false }), 2000);
    } catch (e) {
      wx.showToast({ title: '提交失败，请重试', icon: 'none' });
    } finally {
      this.setData({ submitting: false });
    }
  }
});