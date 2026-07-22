// controllers/record.controller.js - 战绩接口（规范 controller_template）
const recordService = require('../services/record.service');
const { success, fail } = require('../utils/response.util');

/** GET /api/record/list */
exports.list = async (req, res) => {
  try {
    const result = await recordService.list(req.user._id, req.query);
    res.json(success(result));
  } catch (e) {
    res.status(e.status || 500).json(fail(e.code || 500, e.message || '服务器错误'));
  }
};

/** GET /api/record/:id */
exports.detail = async (req, res) => {
  try {
    const result = await recordService.detail(req.params.id, req.user._id);
    res.json(success(result));
  } catch (e) {
    res.status(e.status || 500).json(fail(e.code || 500, e.message || '服务器错误'));
  }
};

/** GET /api/record/trend?range=7|30 */
exports.trend = async (req, res) => {
  try {
    const result = await recordService.trend(req.user._id, req.query.range);
    res.json(success(result));
  } catch (e) {
    res.status(e.status || 500).json(fail(e.code || 500, e.message || '服务器错误'));
  }
};

/** GET /api/record/ranking */
exports.ranking = async (req, res) => {
  try {
    const result = await recordService.ranking(req.user._id);
    res.json(success(result));
  } catch (e) {
    res.status(e.status || 500).json(fail(e.code || 500, e.message || '服务器错误'));
  }
};
