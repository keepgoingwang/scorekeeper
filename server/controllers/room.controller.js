// controllers/room.controller.js - 房间接口（规范 controller_template）
const roomService = require('../services/room.service');
const { success, fail } = require('../utils/response.util');

/** POST /api/room */
exports.create = async (req, res) => {
  try {
    const result = await roomService.create(req.user._id);
    res.json(success(result));
  } catch (e) {
    res.status(e.status || 500).json(fail(e.code || 500, e.message || '服务器错误'));
  }
};

/** POST /api/room/:roomNo/join */
exports.join = async (req, res) => {
  try {
    const result = await roomService.join(req.params.roomNo, req.user._id);
    res.json(success(result));
  } catch (e) {
    res.status(e.status || 500).json(fail(e.code || 500, e.message || '服务器错误'));
  }
};

/** GET /api/room/:roomNo */
exports.detail = async (req, res) => {
  try {
    const result = await roomService.detail(req.params.roomNo, req.user._id);
    res.json(success(result));
  } catch (e) {
    res.status(e.status || 500).json(fail(e.code || 500, e.message || '服务器错误'));
  }
};

/** GET /api/room/current */
exports.current = async (req, res) => {
  try {
    const result = await roomService.current(req.user._id);
    res.json(success(result));
  } catch (e) {
    res.status(e.status || 500).json(fail(e.code || 500, e.message || '服务器错误'));
  }
};

/** POST /api/room/:roomNo/exit */
exports.exit = async (req, res) => {
  try {
    const result = await roomService.exit(req.params.roomNo, req.user._id);
    res.json(success(result));
  } catch (e) {
    res.status(e.status || 500).json(fail(e.code || 500, e.message || '服务器错误'));
  }
};

/** POST /api/room/:roomNo/dissolve */
exports.dissolve = async (req, res) => {
  try {
    const result = await roomService.dissolve(req.params.roomNo, req.user._id);
    res.json(success(result));
  } catch (e) {
    res.status(e.status || 500).json(fail(e.code || 500, e.message || '服务器错误'));
  }
};

/** PUT /api/room/:roomNo/mode { mode } */
exports.switchMode = async (req, res) => {
  try {
    const result = await roomService.switchMode(req.params.roomNo, req.user._id, req.body.mode);
    res.json(success(result));
  } catch (e) {
    res.status(e.status || 500).json(fail(e.code || 500, e.message || '服务器错误'));
  }
};

/** PUT /api/room/:roomNo/skin { skin } */
exports.switchSkin = async (req, res) => {
  try {
    const result = await roomService.switchSkin(req.params.roomNo, req.user._id, req.body.skin);
    res.json(success(result));
  } catch (e) {
    res.status(e.status || 500).json(fail(e.code || 500, e.message || '服务器错误'));
  }
};

/** GET /api/room/:roomNo/flow */
exports.flow = async (req, res) => {
  try {
    const result = await roomService.getFlow(req.params.roomNo, req.query);
    res.json(success(result));
  } catch (e) {
    res.status(e.status || 500).json(fail(e.code || 500, e.message || '服务器错误'));
  }
};
