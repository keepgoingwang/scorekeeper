// middleware/auth.js - 鉴权中间件（规范 auth_middleware）
// JWT 校验 + 角色权限校验
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { fail } = require('../utils/response.util');

const ROLES = { visitor: 0, user: 1, vip: 2, admin: 3 };

/**
 * 生成 JWT
 * @param {object} payload { _id, role }
 * @returns {string}
 */
function signToken(payload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

/**
 * 鉴权中间件工厂
 * @param {string} [requiredRole='user'] 需要的角色
 */
module.exports = (requiredRole = 'user') => {
  return (req, res, next) => {
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    if (!token) {
      return res.status(401).json(fail(401, '未登录'));
    }
    try {
      const user = jwt.verify(token, env.jwtSecret);
      if (ROLES[user.role] < ROLES[requiredRole]) {
        return res.status(403).json(fail(403, '无权限'));
      }
      req.user = user; // { _id, role }
      next();
    } catch (e) {
      return res.status(401).json(fail(401, 'token无效'));
    }
  };
};

module.exports.signToken = signToken;
