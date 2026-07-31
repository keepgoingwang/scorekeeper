// pages/home/home.js
// 首页：创建房间 / 加入房间 / 当前所在房间卡片 - 加入房间弹窗Figma复刻
import { roomApi } from '../../services/room.service';
import { formatRoomNo } from '../../utils/format.util';

Page({
  data: {
    loading: false,
    currentRoom: null,
    // 加入房间弹窗
    joinVisible: false,
    joinCode: ''
  },

  onShow() {
    // 游客可浏览首页；仅已登录时加载当前房间
    if (getApp().globalData.token) {
      this.loadCurrentRoom();
    } else {
      this.setData({ currentRoom: null });
    }
  },

  /** 需要登录的操作：未登录时引导去登录页，返回 true 表示已登录可继续 */
  requireLogin() {
    if (getApp().globalData.token) return true;
    wx.navigateTo({ url: '/pages/login/login' });
    return false;
  },

  onShareAppMessage() {
    return { title: '牌桌记分 - 打牌计分，一键搞定', path: '/pages/home/home' };
  },

  async loadCurrentRoom() {
    if (this.data.loading) return;
    this.setData({ loading: true });
    try {
      const res = await roomApi.current();
      this.setData({ currentRoom: res.data || null });
    } catch (e) {
      this.setData({ currentRoom: null });
    } finally {
      this.setData({ loading: false });
    }
  },

  // ===== 创建房间 =====
  async onCreateRoom() {
    if (!this.requireLogin()) return;
    const room = this.data.currentRoom;
    if (room) {
      const confirmed = await this.confirmExitOldRoom(room.roomNo, '开房');
      if (!confirmed) return;
    }
    try {
      const res = await roomApi.create({});
      wx.navigateTo({
        url: `/pages/room/room?roomNo=${formatRoomNo(res.data.roomNo)}&share=1`
      });
      this.setData({ currentRoom: res.data });
    } catch (e) {
      wx.showToast({ title: e.message || '创建失败', icon: 'none' });
    }
  },

  // ===== 加入房间 - Figma弹窗 =====
  onJoinRoom() {
    if (!this.requireLogin()) return;
    this.setData({ joinVisible: true, joinCode: '' });
  },

  onCloseJoin() {
    this.setData({ joinVisible: false, joinCode: '' });
  },

  // 输入房间号
  onJoinCodeInput(e) {
    const val = e.detail.value.replace(/[^0-9]/g, '').slice(0, 6);
    this.setData({ joinCode: val });
  },

  // 扫码加入 - Figma: 点击触发扫码
  async onJoinByScan() {
    this.setData({ joinVisible: false, joinCode: '' });
    try {
      const { result } = await wx.scanCode({ onlyFromCamera: false, scanType: ['qrCode'] });
      await this.doJoin(result);
    } catch (e) {
      // 用户取消扫码
    }
  },

  // 输入房间号加入 - Figma: 6位数字后激活按钮
  async onJoinByCode() {
    const code = this.data.joinCode;
    if (code.length !== 6) return;
    this.setData({ joinVisible: false, joinCode: '' });
    await this.doJoin(code);
  },

  async doJoin(roomNo) {
    const current = this.data.currentRoom;
    if (current) {
      const confirmed = await this.confirmExitOldRoom(current.roomNo, '加入新房间');
      if (!confirmed) return;
    }
    try {
      const res = await roomApi.join(formatRoomNo(roomNo));
      wx.navigateTo({ url: `/pages/room/room?roomNo=${formatRoomNo(res.data.roomNo)}` });
      this.setData({ currentRoom: res.data });
    } catch (e) {
      wx.showToast({ title: e.message || '房间不存在或已解散', icon: 'none' });
    }
  },

  confirmExitOldRoom(roomNo, action) {
    return new Promise((resolve) => {
      wx.showModal({
        title: '提示',
        content: `您当前在房间 ${formatRoomNo(roomNo)} 中，${action}会自动退出该房间，是否继续？`,
        confirmText: '继续',
        cancelText: '返回',
        success: (res) => resolve(res.confirm)
      });
    });
  },

  onReturnRoom() {
    const room = this.data.currentRoom;
    if (!room) return;
    wx.navigateTo({ url: `/pages/room/room?roomNo=${formatRoomNo(room.roomNo)}` });
  }
});