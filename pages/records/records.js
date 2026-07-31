// pages/records/records.js
// 战绩查询页（PRD §3.3）：统计概览 + 场次明细 + 趋势图 + 排行榜
import { userApi } from '../../services/user.service';
import { recordApi } from '../../services/record.service';
import { formatDateTime, formatDate } from '../../utils/format.util';

Page({
  data: {
    stats: null,
    list: [],
    trend: [],
    trendRange: 7,
    ranking: [],
    loading: false,
    statsLoading: false,
    listLoading: false,
    activeTab: 'stats', // stats | list | ranking
    page: 1,
    pageSize: 20,
    hasMore: false
  },

  onLoad() {
    this.loadStats();
    this.loadList();
  },

  /** 返回上一页 */
  /** 分享 */
  onShareAppMessage() {
    return { title: '我的棋牌战绩', path: '/pages/home/home' };
  },

  /** 切换 tab */
  onSwitchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
    if (tab === 'ranking' && !this.data.ranking.length) {
      this.loadRanking();
    }
  },

  /** 拉取统计概览 + 趋势 */
  async loadStats() {
    this.setData({ statsLoading: true });
    try {
      const [statsRes, trendRes] = await Promise.all([
        userApi.getStats(),
        recordApi.trend(this.data.trendRange)
      ]);
      this.setData({
        stats: statsRes.data,
        trend: this.buildTrendChart(trendRes.data || [])
      });
    } catch (e) {
      // 忽略，不影响其它 tab
    } finally {
      this.setData({ statsLoading: false });
    }
  },

  /** 切换趋势范围 */
  async onSwitchTrend(e) {
    const range = Number(e.currentTarget.dataset.range);
    this.setData({ trendRange: range, statsLoading: true });
    try {
      const res = await recordApi.trend(range);
      this.setData({ trend: this.buildTrendChart(res.data || []) });
    } catch (e) {
      // 忽略
    } finally {
      this.setData({ statsLoading: false });
    }
  },

  /** 构建趋势图表数据 */
  buildTrendChart(data) {
    if (!data.length) return [];
    const scores = data.map(d => d.score);
    const maxScore = Math.max(...scores.map(Math.abs), 1);
    const chartHeight = 300;
    return data.map((d, i) => {
      const barHeight = Math.abs(d.score) / maxScore * chartHeight * 0.8;
      return {
        ...d,
        barHeight,
        barColor: d.score >= 0 ? '#07C160' : '#FA5151',
        barTop: d.score >= 0 ? chartHeight - barHeight - 20 : chartHeight - 20,
        label: d.date.slice(5) // MM-DD
      };
    });
  },

  /** 拉取场次明细 */
  async loadList(append = false) {
    if (this.data.listLoading) return;
    this.setData({ listLoading: true });
    try {
      const { page, pageSize } = this.data;
      const res = await recordApi.list({ page: append ? page + 1 : 1, pageSize });
      const { list, total } = res.data;
      const enriched = list.map((r) => ({
        ...r,
        dateText: formatDateTime(r.settledAt),
        resultText: r.result === 'win' ? '赢' : (r.result === 'lose' ? '输' : '平')
      }));
      this.setData({
        list: append ? [...this.data.list, ...enriched] : enriched,
        page: append ? page + 1 : 1,
        hasMore: this.data.list.length + list.length < total
      });
    } catch (e) {
      wx.showToast({ title: e.message || '加载失败', icon: 'none' });
    } finally {
      this.setData({ listLoading: false });
    }
  },

  /** 加载更多场次 */
  onLoadMore() {
    if (this.data.hasMore) this.loadList(true);
  },

  /** 拉取排行榜 */
  async loadRanking() {
    this.setData({ loading: true });
    try {
      const res = await recordApi.ranking();
      this.setData({ ranking: res.data || [] });
    } catch (e) {
      // 忽略
    } finally {
      this.setData({ loading: false });
    }
  },

  /** 查看场次详情 */
  onViewDetail(e) {
    const id = e.currentTarget.dataset.id;
    // 跳转到结算报告（如有深入数据）
    wx.showToast({ title: '查看详情', icon: 'none' });
  }
});