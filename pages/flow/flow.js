// pages/flow/flow.js
// 流水记录页（PRD §4.6）：房间内所有积分变动历史 - 基于Figma设计重构
import { roomApi } from '../../services/room.service';
import { formatDateTime, formatScore } from '../../utils/format.util';

const FLOW_TYPE_MAP = {
  pay: { icon: '💸', color: '#FF6B6B', text: '转账' },
  settle: { icon: '🎲', color: '#4ECDC4', text: '结算' },
  enter: { icon: '🎉', color: '#6BCB77', text: '加入' },
  exit: { icon: '👋', color: '#FF9F45', text: '退出' },
  mode: { icon: '⚙️', color: '#45B7D1', text: '模式切换' },
  owner: { icon: '👑', color: '#FFD93D', text: '房主变更' },
  dissolve: { icon: '💥', color: '#FF6B6B', text: '解散' }
};

Page({
  data: {
    roomNo: '',
    list: [],
    loading: false,
    page: 1,
    pageSize: 50,
    hasMore: false
  },

  onLoad(options) {
    this.setData({ roomNo: options.roomNo || '' });
    this.loadFlow();
  },

  onBack() {
    wx.navigateBack();
  },

  /** 拉取流水列表 */
  async loadFlow(append = false) {
    if (this.data.loading) return;
    this.setData({ loading: true });
    try {
      const { page, pageSize } = this.data;
      const res = await roomApi.flow(this.data.roomNo, { page: append ? page + 1 : 1, pageSize });
      const { list, total } = res.data;
      const enriched = list.map((item) => {
        const typeInfo = FLOW_TYPE_MAP[item.type] || { icon: '💸', color: '#4ECDC4', text: item.type };
        return {
          ...item,
          typeIcon: typeInfo.icon,
          iconColor: typeInfo.color + '20',
          iconBorder: `2rpx solid ${typeInfo.color}50`,
          typeText: typeInfo.text,
          timeText: formatDateTime(item.createTime || item._id)
        };
      });
      this.setData({
        list: append ? [...this.data.list, ...enriched] : enriched,
        page: append ? page + 1 : 1,
        hasMore: this.data.list.length + list.length < total
      });
    } catch (e) {
      wx.showToast({ title: e.message || '加载失败', icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  /** 加载更多 */
  onLoadMore() {
    if (this.data.hasMore) this.loadFlow(true);
  }
});