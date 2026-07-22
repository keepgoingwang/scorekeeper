// behaviors/loading.behavior.js
// 行为混入：统一 loading / error 状态处理
// 多个页面共享同一套异步加载逻辑时引入

module.exports = Behavior({
  data: {
    loading: false,
    error: null
  },

  methods: {
    /**
     * 包裹异步加载：自动管理 loading 与 error
     * @param {function} fn 返回 Promise 的函数
     * @returns {Promise<*>} 结果；失败时已 setData error
     */
    async runWithLoading(fn) {
      if (this.data.loading) return;
      this.setData({ loading: true, error: null });
      try {
        return await fn();
      } catch (e) {
        this.setData({ error: e.message });
        wx.showToast({ title: e.message || '加载失败', icon: 'none' });
        throw e;
      } finally {
        this.setData({ loading: false });
      }
    }
  }
});
