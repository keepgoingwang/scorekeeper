// utils/response.util.js - 统一响应格式（前后端一致）
// 规范 api_format：{ code, data, message }

/**
 * 成功响应
 * @param {*} data
 * @param {string} [message='success']
 * @returns {object}
 */
function success(data = null, message = 'success') {
  return { code: 200, data, message };
}

/**
 * 失败响应
 * @param {number} code 错误码
 * @param {string} message 错误描述
 * @returns {object}
 */
function fail(code, message) {
  return { code, data: null, message };
}

module.exports = { success, fail };
