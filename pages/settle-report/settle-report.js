// pages/settle-report/settle-report.js
// 房间结算报告页（PRD §8）：胜负排名 + 盈亏明细 + 建议转账方案 - 基于Figma设计重构
import { roomApi } from '../../services/room.service';
import { formatScore } from '../../utils/format.util';

Page({
  data: {
    roomNo: '',
    report: null,
    loading: false,
    expandedIdx: -1
  },

  onLoad(options) {
    const roomNo = options.roomNo || '';
    this.setData({ roomNo });
    this.loadReport(roomNo);
  },

  /** 分享结算报告 */
  onShareAppMessage() {
    return {
      title: '来看看我的棋牌结算报告！',
      path: '/pages/home/home'
    };
  },

  /** 拉取终局结算报告 */
  async loadReport(roomNo) {
    this.setData({ loading: true });
    try {
      const res = await roomApi.settleFinal(roomNo);
      this.setData({ report: res.data });
    } catch (e) {
      wx.showToast({ title: e.message || '结算失败', icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  /** 展开/收起成员详情 */
  toggleDetail(e) {
    const idx = e.currentTarget.dataset.index;
    this.setData({
      expandedIdx: this.data.expandedIdx === idx ? -1 : idx
    });
  },

  /** 返回首页 */
  onGoHome() {
    wx.switchTab({ url: '/pages/home/home' });
  },

  /** 再来一局：回到房间页 */
  onPlayAgain() {
    wx.redirectTo({ url: `/pages/room/room?roomNo=${this.data.roomNo}` });
  }
});
