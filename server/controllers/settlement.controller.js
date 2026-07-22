// controllers/settlement.controller.js - 结算接口（规范 controller_template）
const settlementService = require('../services/settlement.service');
const { success, fail } = require('../utils/response.util');

/** POST /api/room/:roomNo/settle/start （房主发起自动结算） */
exports.startSettle = async (req, res) => {
  try {
    const result = await settlementService.startSettle(req.params.roomNo, req.user._id);
    res.json(success(result));
  } catch (e) {
    res.status(e.status || 500).json(fail(e.code || 500, e.message || '服务器错误'));
  }
};

/** POST /api/room/:roomNo/settle/end （房主提前结束输入） */
exports.endSettle = async (req, res) => {
  try {
    const result = await settlementService.endSettle(req.params.roomNo, req.user._id);
    res.json(success(result));
  } catch (e) {
    res.status(e.status || 500).json(fail(e.code || 500, e.message || '服务器错误'));
  }
};

/** POST /api/room/:roomNo/settle/submit { income, expense } */
exports.submitSettle = async (req, res) => {
  try {
    const result = await settlementService.submitSettle(req.params.roomNo, req.user._id, req.body);
    res.json(success(result));
  } catch (e) {
    res.status(e.status || 500).json(fail(e.code || 500, e.message || '服务器错误'));
  }
};

/** POST /api/room/:roomNo/pay { toUserId, amount } （手动结算转账） */
exports.manualPay = async (req, res) => {
  try {
    const result = await settlementService.manualPay(req.params.roomNo, req.user._id, req.body);
    res.json(success(result));
  } catch (e) {
    res.status(e.status || 500).json(fail(e.code || 500, e.message || '服务器错误'));
  }
};

/** POST /api/room/:roomNo/settle-final （终局结算） */
exports.settleFinal = async (req, res) => {
  try {
    const result = await settlementService.settleFinal(req.params.roomNo, req.user._id);
    res.json(success(result));
  } catch (e) {
    res.status(e.status || 500).json(fail(e.code || 500, e.message || '服务器错误'));
  }
};
