// components/empty-state/empty-state.js
// 空状态组件：列表无数据时统一展示
Component({
  properties: {
    text: { type: String, value: '暂无数据' },
    actionText: { type: String, value: '' }
  },
  methods: {
    onAction() {
      this.triggerEvent('action');
    }
  }
});
