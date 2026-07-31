// pages/room/room.js - 房间页 - 完全照搬Figma设计
import { roomApi } from '../../services/room.service';
import { formatRoomNo, formatScore, assetUrl, userEmoji } from '../../utils/format.util';
import { SETTLE_COUNTDOWN } from '../../utils/constants.util';
import { socket } from '../../utils/socket.util';

Page({
  data: {
    roomNo: '',
    room: null,
    loading: false,
    settleInput: { income: '', expense: '' },
    settleCountdown: 0,
    settleTimer: null,
    settleModalVisible: false,
    settleSubmitted: 0,
    settleTotal: 0,
    shareVisible: false,
    shareQrcode: '',
    shareLoading: false,
    settingsVisible: false,
    actionSheetVisible: false,
    skinSheetVisible: false,
    finalSheetVisible: false,
    confirmVisible: false,
    confirmMsg: '',
    confirmLabel: '确定',
    confirmDanger: false,
    confirmAction: null,
    finalData: [],
    skinList: [
      { key: 'mahjong', name: '经典麻将', color: '#2D5A3D', bg: 'radial-gradient(ellipse at 40% 35%, #3D7A52, #1f4028)' },
      { key: 'texas', name: '德州之夜', color: '#1A1A2E', bg: 'radial-gradient(ellipse at 40% 35%, #252545, #0d0d1a)' },
      { key: 'wood', name: '休闲木桌', color: '#C08A58', bg: 'radial-gradient(ellipse at 40% 35%, #D4A373, #8B5E3C)' },
      { key: 'mint', name: '清新薄荷', color: '#4ECDC4', bg: 'radial-gradient(ellipse at 40% 35%, #5EDDD4, #2AADA4)' }
    ],
    modeInfo: { title: '⚡ 自动结算模式', desc: '等待房主发起结算', color: '#4ECDC4' },
    skinBg: 'radial-gradient(ellipse at 40% 35%, #3D7A52, #1f4028)',
    activePlayers: [],
    settleNet: 0,
    // 手动结算弹窗
    manualPayVisible: false,
    manualPayees: [],
    manualAmountVisible: false,
    manualPayee: null,
    manualAmount: '',
    manualPayHint: ''
  },

  onLoad(options) {
    const roomNo = options.roomNo || '';
    this.setData({ roomNo });
    wx.setNavigationBarTitle({ title: `房间号：${roomNo}` });
    this.loadDetail();
    this.bindSocket();
    if (options.share === '1') {
      setTimeout(() => this.onInvite(), 800);
    }
  },

  onShareAppMessage() {
    return { title: '一起来玩牌桌记分吧！', query: `roomNo=${this.data.roomNo}` };
  },

  onUnload() {
    this.clearSocket();
    this.clearSettleTimer();
  },

  chipCount(score) {
    if (score === 0) return 1;
    return Math.min(Math.ceil(Math.abs(score) / 65), 6);
  },

  chipColor(score, isTop) {
    if (score > 200) {
      return isTop ? 'radial-gradient(circle at 38% 32%, #FFF176, #FFD93D)' : 'radial-gradient(circle at 38% 32%, #FFD93D, #B8860B)';
    }
    if (score > 0) {
      return isTop ? 'radial-gradient(circle at 38% 32%, #93DE9D, #6BCB77)' : 'radial-gradient(circle at 38% 32%, #6BCB77, #3A8C46)';
    }
    if (score < 0) {
      return isTop ? 'radial-gradient(circle at 38% 32%, #FF9999, #FF6B6B)' : 'radial-gradient(circle at 38% 32%, #FF6B6B, #C0392B)';
    }
    return isTop ? 'radial-gradient(circle at 38% 32%, #BDBDBD, #9E9E9E)' : 'radial-gradient(circle at 38% 32%, #9E9E9E, #616161)';
  },

  async loadDetail() {
    if (this.data.loading) return;
    this.setData({ loading: true });
    try {
      const res = await roomApi.detail(this.data.roomNo);
      const room = res.data;
      const skinColors = { mahjong: '#2D5A3D', texas: '#1A1A2E', wood: '#C08A58', mint: '#4ECDC4' };
      const skinBgs = {
        mahjong: 'radial-gradient(ellipse at 40% 35%, #3D7A52, #1f4028)',
        texas: 'radial-gradient(ellipse at 40% 35%, #252545, #0d0d1a)',
        wood: 'radial-gradient(ellipse at 40% 35%, #D4A373, #8B5E3C)',
        mint: 'radial-gradient(ellipse at 40% 35%, #5EDDD4, #2AADA4)'
      };
      room.skinColor = skinColors[room.skin] || '#2D5A3D';
      const skinBg = skinBgs[room.skin] || skinBgs.mahjong;

      const myId = getApp().globalData.userInfo?._id;
      const myMember = room.members.find(m => m.userId === myId);
      room.currentUserSubmitted = myMember ? myMember.submitted : false;

      const activeMembers = room.members.filter(m => m.status === 'active');
      room.tableShape = room.members.length <= 4 ? 'square' : 'circle';
      const total = room.members.length;

      // Compute player positions and chip positions
      room.members = room.members.map((m, i) => {
        const pos = i;
        let playerStyle = '';
        let chipX = 50, chipY = 50;
        let playerX = 50, playerY = 50;

        if (room.tableShape === 'square') {
          const positions = ['top:0;left:50%;transform:translateX(-50%)', 'top:50%;right:0;transform:translateY(-50%)', 'bottom:0;left:50%;transform:translateX(-50%)', 'top:50%;left:0;transform:translateY(-50%)'];
          playerStyle = positions[pos % 4] || '';
          const chipPos = [{ x: 50, y: 19 }, { x: 80, y: 50 }, { x: 50, y: 81 }, { x: 20, y: 50 }];
          chipX = chipPos[pos % 4].x;
          chipY = chipPos[pos % 4].y;
        } else {
          // 圆形牌桌：设计稿 ORBIT=168, CONT=336, R=108
          // 玩家徽章在容器中的位置偏移: 166/336 ≈ 49.4%
          // 筹码在桌面中的位置偏移: R*0.62/R = 62% 半径 → 31% 直径
          const angle = (pos / total) * 360 - 90;
          const rad = (angle * Math.PI) / 180;
          playerX = 50 + 49.4 * Math.cos(rad);
          playerY = 50 + 49.4 * Math.sin(rad);
          chipX = 50 + 31 * Math.cos(rad);
          chipY = 50 + 31 * Math.sin(rad);
        }

        const chipCount = m.status === 'active' ? Math.min(Math.ceil(Math.abs(m.score) / 65), 6) : 0;
        return { ...m, avatar: assetUrl(m.avatar), emoji: userEmoji(m.userId), playerStyle, playerX, playerY, chipX, chipY, chipCount };
      });

      // Compute modeInfo
      const mode = room.mode || 'auto';
      const state = room.state || 'playing';
      let modeInfo;
      if (mode === 'manual') {
        modeInfo = { title: '🎯 手动结算模式', desc: '点击底部「支出」按钮选择收款人进行精确支付', color: '#45B7D1' };
      } else if (state === 'settling') {
        modeInfo = { title: '⚡ 自动结算 · 输入中', desc: `${this.data.settleSubmitted}/${activeMembers.length} 人已提交` + (this.data.settleCountdown > 0 ? ` · 剩余 ${this.data.settleCountdown} 秒` : ''), color: '#FF9F45' };
      } else {
        modeInfo = { title: '⚡ 自动结算模式', desc: '等待房主发起结算', color: '#4ECDC4' };
      }

      this.setData({ room, skinBg, activeMembers, modeInfo });
    } catch (e) {
      wx.showToast({ title: e.message || '加载失败', icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  bindSocket() {
    const token = getApp().globalData.token;
    socket.connect(token);
    socket.send('room:join', { roomNo: this.data.roomNo });
    this._unsubScore = socket.on('room:score', () => this.loadDetail());
    this._unsubDynamic = socket.on('room:dynamic', () => this.loadDetail());
    this._unsubMember = socket.on('room:member', () => this.loadDetail());
    this._unsubSettle = socket.on('room:settle', (payload) => {
      if (payload.submitted !== undefined) {
        this.setData({ settleSubmitted: payload.submitted, settleTotal: payload.total });
      }
      if (payload.deadline) this.startCountdown(payload.deadline);
      this.loadDetail();
      if (payload.state === 'done' || payload.state === 'settled') this.clearSettleTimer();
      if (payload.rebalance) {
        wx.showToast({ title: `收支不平衡（差额${payload.diff}），请重新输入`, icon: 'none', duration: 3000 });
      }
    });
    this._unsubDissolved = socket.on('room:dissolved', () => {
      wx.showToast({ title: '房间已解散', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
    });
  },

  clearSocket() {
    if (this._unsubScore) this._unsubScore();
    if (this._unsubDynamic) this._unsubDynamic();
    if (this._unsubMember) this._unsubMember();
    if (this._unsubSettle) this._unsubSettle();
    if (this._unsubDissolved) this._unsubDissolved();
  },

  clearSettleTimer() {
    if (this.data.settleTimer) {
      clearInterval(this.data.settleTimer);
      this.setData({ settleTimer: null, settleCountdown: 0 });
    }
  },

  startCountdown(deadline) {
    this.clearSettleTimer();
    const deadlineMs = new Date(deadline).getTime();
    const tick = () => {
      const remaining = Math.max(0, Math.round((deadlineMs - Date.now()) / 1000));
      this.setData({ settleCountdown: remaining });
      if (remaining <= 0) this.clearSettleTimer();
    };
    tick();
    this.setData({ settleTimer: setInterval(tick, 1000) });
  },

  // ===== 手动结算弹窗（Figma ManualPaySheet + AmountSheet） =====
  onPay() {
    const room = this.data.room;
    if (!room || room.mode !== 'manual') return;
    const myId = getApp().globalData.userInfo?._id;
    // 过滤出有效收款人（不含自己、不含已退出用户）
    const payees = room.members.filter(m => m.status === 'active' && m.userId !== myId);
    if (!payees.length) return wx.showToast({ title: '没有可转账的成员', icon: 'none' });
    this.setData({ manualPayees: payees, manualPayVisible: true, manualAmount: '' });
  },

  onClosePay() {
    this.setData({ manualPayVisible: false, manualPayees: [] });
  },

  onSelectPayee(e) {
    const idx = e.currentTarget.dataset.index;
    const payee = this.data.manualPayees[idx];
    if (!payee) return;
    const payer = this.data.room.members.find(m => m.userId === getApp().globalData.userInfo?._id);
    const currentScore = payer ? payer.score : 0;
    this.setData({
      manualPayVisible: false,
      manualAmountVisible: true,
      manualPayee: payee,
      manualAmount: '',
      manualPayHint: `当前可用积分：${currentScore}，积分将从你账户扣除并转给 ${payee.nickname}`
    });
  },

  onCloseAmount() {
    this.setData({ manualAmountVisible: false, manualPayee: null, manualAmount: '' });
  },

  onAmountInput(e) {
    const val = e.detail.value.replace(/[^0-9]/g, '').slice(0, 5);
    this.setData({ manualAmount: val });
  },

  onQuickAmount(e) {
    const amount = e.currentTarget.dataset.amount;
    this.setData({ manualAmount: String(amount) });
  },

  async onConfirmPay() {
    const payee = this.data.manualPayee;
    const amount = parseInt(this.data.manualAmount, 10);
    if (!payee) return;
    if (!amount || amount <= 0) return wx.showToast({ title: '请输入有效金额', icon: 'none' });
    const payer = this.data.room.members.find(m => m.userId === getApp().globalData.userInfo?._id);
    const currentScore = payer ? payer.score : 0;
    if (amount > currentScore) return wx.showToast({ title: `积分不足，当前可用积分：${currentScore}`, icon: 'none' });
    try {
      await roomApi.manualPay(this.data.roomNo, { toUserId: payee.userId, amount });
      wx.showToast({ title: '转账成功', icon: 'success' });
      this.setData({ manualAmountVisible: false, manualPayee: null, manualAmount: '' });
      this.loadDetail();
    } catch (e) {
      wx.showToast({ title: e.message || '转账失败', icon: 'none' });
    }
  },

  // ===== 自动结算 =====
  async onStartSettle() {
    try {
      const res = await roomApi.startSettle(this.data.roomNo);
      this.setData({ 'room.state': 'settling', settleInput: { income: '', expense: '' }, settleModalVisible: true });
      wx.showToast({ title: '结算已发起，请提交收支', icon: 'none' });
      this.loadDetail();
    } catch (e) {
      wx.showToast({ title: e.message || '发起结算失败', icon: 'none' });
    }
  },

  onOpenSettleModal() { this.setData({ settleModalVisible: true }); },
  onCloseSettleModal() { this.setData({ settleModalVisible: false }); },

  async onEndSettle() {
    try {
      await roomApi.endSettle(this.data.roomNo);
      wx.showToast({ title: '已结束输入', icon: 'success' });
      this.loadDetail();
    } catch (e) {
      wx.showToast({ title: e.message || '操作失败', icon: 'none' });
    }
  },

  onIncomeInput(e) {
    const income = e.detail.value;
    const expense = this.data.settleInput.expense;
    const net = (parseInt(income) || 0) - (parseInt(expense) || 0);
    this.setData({ 'settleInput.income': income, settleNet: net });
  },

  onExpenseInput(e) {
    const expense = e.detail.value;
    const income = this.data.settleInput.income;
    const net = (parseInt(income) || 0) - (parseInt(expense) || 0);
    this.setData({ 'settleInput.expense': expense, settleNet: net });
  },

  onQuickIncome(e) {
    const amount = e.currentTarget.dataset.amount;
    this.setData({ 'settleInput.income': amount, settleNet: parseInt(amount) });
  },

  async onSettleSubmit() {
    const { income, expense } = this.data.settleInput;
    const incomeNum = parseInt(income) || 0;
    const expenseNum = parseInt(expense) || 0;
    if (incomeNum <= 0 && expenseNum <= 0) return wx.showToast({ title: '请输入收入或支出', icon: 'none' });
    try {
      await roomApi.submitSettle(this.data.roomNo, { income: incomeNum, expense: expenseNum });
      wx.showToast({ title: '提交成功', icon: 'success' });
      this.setData({ settleInput: { income: '', expense: '' }, settleNet: 0 });
      this.loadDetail();
    } catch (e) {
      wx.showToast({ title: e.message || '提交失败，请重试', icon: 'none' });
    }
  },

  // ===== 操作菜单 =====
  onAction() { this.setData({ actionSheetVisible: true }); },
  onCloseActionSheet() { this.setData({ actionSheetVisible: false }); },

  onViewFlow() {
    this.setData({ actionSheetVisible: false });
    wx.navigateTo({ url: `/pages/flow/flow?roomNo=${this.data.roomNo}` });
  },

  onExitRoom() {
    this.setData({ actionSheetVisible: false });
    this.showConfirm('确定退出当前房间？退出后头像变灰，不再参与后续结算。', '退出房间', false, async () => {
      try {
        await roomApi.exit(this.data.roomNo);
        wx.showToast({ title: '已退出', icon: 'success' });
        setTimeout(() => wx.navigateBack(), 1000);
      } catch (e) {
        wx.showToast({ title: e.message || '退出失败', icon: 'none' });
      }
    });
  },

  onSwitchMode() {
    this.setData({ actionSheetVisible: false });
    this.switchMode();
  },

  async switchMode() {
    const room = this.data.room;
    const newMode = room.mode === 'manual' ? 'auto' : 'manual';
    try {
      await roomApi.switchMode(this.data.roomNo, newMode);
      wx.showToast({ title: `已切换为${newMode === 'auto' ? '自动结算' : '手动结算'}`, icon: 'success' });
      this.loadDetail();
    } catch (e) {
      wx.showToast({ title: e.message || '切换失败', icon: 'none' });
    }
  },

  onDissolveRoom() {
    this.setData({ actionSheetVisible: false });
    this.showConfirm('确定解散当前房间？所有成员将被移出，此操作不可撤销。', '解散', true, async () => {
      try {
        await roomApi.dissolve(this.data.roomNo);
        wx.showToast({ title: '房间已解散', icon: 'success' });
        setTimeout(() => wx.navigateBack(), 1000);
      } catch (e) {
        wx.showToast({ title: e.message || '解散失败', icon: 'none' });
      }
    });
  },

  async onSettleFinal() {
    this.setData({ actionSheetVisible: false });
    try {
      const res = await roomApi.settleFinal(this.data.roomNo);
      const sorted = (res.data.ranking || []).sort((a, b) => b.score - a.score);
      this.setData({ finalData: sorted, finalSheetVisible: true });
    } catch (e) {
      wx.showToast({ title: e.message || '结算失败', icon: 'none' });
    }
  },

  onCloseFinalSheet() { this.setData({ finalSheetVisible: false }); },

  onShareFinal() {
    wx.shareAppMessage({
      title: '来看看我的牌桌记分结算报告！',
      path: `/pages/home/home`
    });
  },

  onGoHome() {
    wx.switchTab({ url: '/pages/home/home' });
  },

  // ===== 皮肤设置 =====
  onOpenSettings() { this.setData({ skinSheetVisible: true }); },
  onCloseSkinSheet() { this.setData({ skinSheetVisible: false }); },

  async onSettingsSelectSkin(e) {
    const skin = e.currentTarget.dataset.skin;
    const room = this.data.room;
    if (!room || !room.isOwner) return wx.showToast({ title: '仅房主可操作', icon: 'none' });
    try {
      await roomApi.switchSkin(this.data.roomNo, skin);
      this.setData({ 'room.skin': skin });
      this.loadDetail();
    } catch (e) {
      wx.showToast({ title: e.message || '切换失败', icon: 'none' });
    }
  },

  async onSettingsSwitchMode() {
    const room = this.data.room;
    if (!room || !room.isOwner) return wx.showToast({ title: '仅房主可操作', icon: 'none' });
    await this.switchMode();
  },

  // ===== 确认弹窗 =====
  showConfirm(msg, label, danger, action) {
    this.setData({ confirmVisible: true, confirmMsg: msg, confirmLabel: label, confirmDanger: danger, confirmAction: action });
  },

  onConfirmCancel() { this.setData({ confirmVisible: false }); },

  onConfirmOk() {
    const action = this.data.confirmAction;
    this.setData({ confirmVisible: false });
    if (action) action();
  },

  // ===== 邀请分享 =====
  async onInvite() {
    this.setData({ shareVisible: true, shareLoading: true });
    try {
      const res = await roomApi.qrcode(this.data.roomNo);
      this.setData({ shareQrcode: res.data.qrcode });
    } catch (e) {
      this.setData({ shareQrcode: '' });
    } finally {
      this.setData({ shareLoading: false });
    }
  },

  onCloseShare() { this.setData({ shareVisible: false }); },

  onShareApp() {
    wx.shareAppMessage({
      title: '一起来玩牌桌记分吧！',
      imageUrl: this.data.shareQrcode || '',
      query: `roomNo=${this.data.roomNo}`
    });
  },

  onCopyRoomNo() {
    wx.setClipboardData({
      data: this.data.roomNo,
      success: () => wx.showToast({ title: '房间号已复制', icon: 'success' })
    });
  }
});