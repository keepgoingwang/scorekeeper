// pages/settings/settings.js
// 系统设置页（PRD §3.4）：牌桌皮肤 + 通知设置（声音/震动）- 基于Figma设计重构
import { SKINS } from '../../utils/constants.util';

Page({
  data: {
    skins: [],
    currentSkin: 'mahjong',
    soundEnabled: true,
    vibrateEnabled: true,
    saved: false
  },

  onLoad() {
    const skins = Object.values(SKINS).map(s => ({
      ...s,
      bg: s.key === 'mahjong' ? 'radial-gradient(ellipse at 40% 35%, #3D7A52, #1f4028)'
        : s.key === 'texas' ? 'radial-gradient(ellipse at 40% 35%, #252545, #0d0d1a)'
        : s.key === 'wood' ? 'radial-gradient(ellipse at 40% 35%, #D4A373, #8B5E3C)'
        : 'radial-gradient(ellipse at 40% 35%, #5EDDD4, #2AADA4)'
    }));
    this.setData({
      skins,
      currentSkin: wx.getStorageSync('skin') || 'mahjong',
      soundEnabled: wx.getStorageSync('soundEnabled') !== false,
      vibrateEnabled: wx.getStorageSync('vibrateEnabled') !== false
    });
  },

  onBack() {
    wx.navigateBack();
  },

  onSelectSkin(e) {
    const skin = e.currentTarget.dataset.skin;
    this.setData({ currentSkin: skin });
    wx.setStorageSync('skin', skin);
  },

  onToggleSound(e) {
    this.setData({ soundEnabled: e.detail.value });
    wx.setStorageSync('soundEnabled', e.detail.value);
  },

  onToggleVibrate(e) {
    this.setData({ vibrateEnabled: e.detail.value });
    wx.setStorageSync('vibrateEnabled', e.detail.value);
  },

  onSave() {
    this.setData({ saved: true });
    wx.showToast({ title: '已保存', icon: 'success' });
    setTimeout(() => this.setData({ saved: false }), 1500);
  }
});