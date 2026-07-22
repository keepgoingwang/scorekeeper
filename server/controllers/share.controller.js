// controllers/share.controller.js - 分享相关接口（二维码生成）
const QRCode = require('qrcode');
const Room = require('../models/room.model');
const { success, fail } = require('../utils/response.util');

/** GET /api/room/:roomNo/qrcode - 生成房间二维码（返回 data URL） */
exports.qrcode = async (req, res) => {
  try {
    const { roomNo } = req.params;
    const room = await Room.findOne({ roomNo, isDeleted: false });
    if (!room) {
      return res.status(404).json(fail(404, '房间不存在或已解散'));
    }
    // 二维码内容：小程序 scheme 或直接房间号（开发阶段用房间号）
    const content = roomNo;
    const dataUrl = await QRCode.toDataURL(content, {
      width: 280,
      margin: 2,
      color: { dark: '#1A1A1A', light: '#FFFFFF' }
    });
    res.json(success({ qrcode: dataUrl, roomNo }));
  } catch (e) {
    res.status(500).json(fail(500, e.message || '二维码生成失败'));
  }
};