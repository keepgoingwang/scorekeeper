// config/env.js - 环境变量集中读取
// 规范：敏感信息不打印到日志；敏感信息从环境变量读取
require('dotenv').config();

module.exports = {
  port: parseInt(process.env.PORT, 10) || 3000,
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/scorekeeper',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  // 微信小程序（用于 wx.login -> code2session 与二维码生成）
  wxAppId: process.env.WX_APP_ID || '',
  wxSecret: process.env.WX_SECRET || '',

  // 客户端回调域名（生成带 scene 的二维码）
  clientOrigin: process.env.CLIENT_ORIGIN || '*'
};
