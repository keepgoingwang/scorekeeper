// pages/scan/scan.js
// 扫码页（PRD §2.3）：相机扫码加入房间
import { roomApi } from '../../services/room.service';
import { formatRoomNo } from '../../utils/format.util';

Page({
  data: {
    scanning: false
  },

  onLoad() {
    this.startScan();
  },

  /** 扫码加入 */
  startScan() {
    if (this.data.scanning) return;
    this.setData({ scanning: true });
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode'],
      success: (res) => {
        this.doJoin(res.result);
      },
      fail: () => {
        wx.showToast({ title: '扫码失败', icon: 'none' });
        this.setData({ scanning: false });
        setTimeout(() => wx.navigateBack(), 1000);
      }
    });
  },

  /** 取消扫码 */
  onCancel() {
    wx.navigateBack();
  },

  /** 执行加入 */
  async doJoin(roomNo) {
    try {
      const res = await roomApi.join(formatRoomNo(roomNo));
      wx.redirectTo({ url: `/pages/room/room?roomNo=${formatRoomNo(res.data.roomNo)}` });
    } catch (e) {
      wx.showToast({ title: e.message || '房间不存在或已解散', icon: 'none' });
      this.setData({ scanning: false });
    }
  }
});