// services/record.service.js
// 战绩查询 API（PRD §3.3）
import { http } from '../utils/request.util';

export const recordApi = {
  /** 场次明细列表（PRD §3.3 场次明细） */
  list(params) {
    return http.get('/api/record/list', params);
  },

  /** 单场结算报告明细 */
  detail(id) {
    return http.get(`/api/record/${id}`);
  },

  /** 近 7/30 天盈亏趋势（PRD §3.3 数据可视化） */
  trend(range) {
    return http.get('/api/record/trend', { range });
  },

  /** 牌友排行榜（PRD §3.3 数据可视化） */
  ranking() {
    return http.get('/api/record/ranking');
  }
};
