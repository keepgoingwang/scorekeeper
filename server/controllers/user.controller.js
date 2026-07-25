// controllers/user.controller.js - 用户接口（规范 controller_template）
const userService = require('../services/user.service');
const { success, fail } = require('../utils/response.util');

/** POST /api/user/login { code, nickname, avatar } */
exports.login = async (req, res) => {
  try {
    const { code, nickname, avatar } = req.body;
    const result = await userService.login(code, { nickname, avatar });
    res.json(success(result));
  } catch (e) {
    res.status(e.status || 500).json(fail(e.code || 500, e.message || '服务器错误'));
  }
};

/** POST /api/user/avatar （multipart，字段名 avatar，免登录：首次注册前尚无 token） */
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json(fail(400, '未上传文件'));
    const url = `/uploads/avatars/${req.file.filename}`;
    res.json(success({ url }));
  } catch (e) {
    res.status(e.status || 500).json(fail(e.code || 500, e.message || '上传失败'));
  }
};

/** GET /api/user/profile */
exports.getProfile = async (req, res) => {
  try {
    const result = await userService.getProfile(req.user._id);
    res.json(success(result));
  } catch (e) {
    res.status(e.status || 500).json(fail(e.code || 500, e.message || '服务器错误'));
  }
};

/** PUT /api/user/profile { nickname, avatar, age } */
exports.updateProfile = async (req, res) => {
  try {
    const result = await userService.updateProfile(req.user._id, req.body);
    res.json(success(result));
  } catch (e) {
    res.status(e.status || 500).json(fail(e.code || 500, e.message || '服务器错误'));
  }
};

/** GET /api/user/stats */
exports.getStats = async (req, res) => {
  try {
    const result = await userService.getStats(req.user._id);
    res.json(success(result));
  } catch (e) {
    res.status(e.status || 500).json(fail(e.code || 500, e.message || '服务器错误'));
  }
};
