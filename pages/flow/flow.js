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
    hasMore: false,
    summary: { expenseText: '0分', incomeText: '0分', roundsText: '0 局' }
  },

  onLoad(options) {
    this.setData({ roomNo: options.roomNo || '' });
    this.loadFlow();
  },


  /** 拉取流水列表 */
  async loadFlow(append = false) {
    if (this.data.loading) return;
    this.setData({ loading: true });
    try {
      const { page, pageSize } = this.data;
      const res = await roomApi.flow(this.data.roomNo, { page: append ? page + 1 : 1, pageSize });
      const { list, total, summary } = res.data;
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
      const allLoaded = append ? [...this.data.list, ...list] : list;
      const sum = summary || this.calcSummary(allLoaded);
      const rounds = (summary && summary.rounds != null) ? summary.rounds : allLoaded.reduce((m, it) => Math.max(m, it.round || 0), 0);
      const summaryView = {
        expenseText: (sum.totalExpense ? '-' + sum.totalExpense : '0') + '分',
        incomeText: (sum.totalIncome ? '+' + sum.totalIncome : '0') + '分',
        roundsText: rounds + ' 局'
      };
      this.setData({
        list: append ? [...this.data.list, ...enriched] : enriched,
        page: append ? page + 1 : 1,
        hasMore: this.data.list.length + list.length < total,
        summary: summaryView
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
  },

  /** 兜底：后端未返回 summary 时，基于已加载流水按同口径计算（真实值，非模拟） */
  calcSummary(list) {
    let totalIncome = 0;
    let totalExpense = 0;
    for (const it of list) {
      const signed = it.type === 'settle' ? (it.amount || 0) : (it.type === 'pay' ? (it.amount || 0) : 0);
      if (signed > 0) totalIncome += signed;
      else if (signed < 0) totalExpense += -signed;
    }
    return { totalIncome, totalExpense };
  }
});