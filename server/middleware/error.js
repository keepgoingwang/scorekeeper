// middleware/error.js - 统一错误处理 / 404
const { fail } = require('../utils/response.util');

/**
 * 业务错误：携带 code / status
 */
class BizError extends Error {
  constructor(message, code = 500, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

/** 404 */
function notFound(req, res) {
  res.status(404).json(fail(404, '资源不存在'));
}

/** 统一错误捕获 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const code = err.code || 500;
  res.status(status).json(fail(code, err.message || '服务器错误'));
}

module.exports = { BizError, notFound, errorHandler };
