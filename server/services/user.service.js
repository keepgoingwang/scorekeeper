// services/user.service.js - 用户业务（PRD §3 / 登录闭环）
const axios = require('axios');
const User = require('../models/user.model');
const { signToken } = require('../middleware/auth');
const { BizError } = require('../middleware/error');
const env = require('../config/env');

/**
 * 微信登录：wx.login code -> openid -> upsert -> 下发 token
 * @param {string} code
 * @param {{nickname?:string, avatar?:string}} [profile] 微信头像/昵称（首次登录时由前端上传）
 * @returns {Promise<{token, user}>}
 */
async function login(code, profile = {}) {
  let openid;
  if (env.wxAppId && env.wxSecret) {
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${env.wxAppId}&secret=${env.wxSecret}&js_code=${code}&grant_type=authorization_code`;
    const { data } = await axios.get(url);
    if (!data.openid) throw new BizError(data.errmsg || '微信登录失败', 401, 401);
    openid = data.openid;
  } else {
    // 开发态：未配置 AppID 时用 code 作临时 openid，便于联调
    openid = 'dev_' + code;
  }

  let user = await User.findOne({ openid });
  if (!user) {
    user = await User.create({
      openid,
      nickname: profile.nickname || '牌友' + Math.floor(Math.random() * 1000),
      avatar: profile.avatar || ''
    });
  } else if (profile.nickname || profile.avatar) {
    // 已有用户：用本次提交的微信资料更新
    const set = {};
    if (profile.nickname) set.nickname = profile.nickname;
    if (profile.avatar) set.avatar = profile.avatar;
    user = await User.findByIdAndUpdate(user._id, { $set: set }, { new: true });
  }
  const token = signToken({ _id: user._id.toString(), role: user.role });
  return { token, user: toProfile(user) };
}

/**
 * 获取个人资料
 * @param {string} userId
 */
async function getProfile(userId) {
  const user = await User.findById(userId);
  if (!user) throw new BizError('用户不存在', 404, 404);
  return toProfile(user);
}

/**
 * 更新资料（昵称 / 头像 / 年龄，ID 不可改）
 * @param {string} userId
 * @param {object} data
 */
async function updateProfile(userId, data) {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: pick(data, ['nickname', 'avatar', 'age']) },
    { new: true }
  );
  if (!user) throw new BizError('用户不存在', 404, 404);
  return toProfile(user);
}

/**
 * 战绩统计概览（PRD §3.3）
 * @param {string} userId
 */
async function getStats(userId) {
  const user = await User.findById(userId);
  if (!user) throw new BizError('用户不存在', 404, 404);
  const stats = user.stats.toObject();
  const winRate = stats.games ? Math.round((stats.wins / stats.games) * 100) : 0;
  return { ...stats, winRate };
}

/** 转为对外资料 DTO */
function toProfile(u) {
  return {
    _id: u._id,
    nickname: u.nickname,
    avatar: u.avatar,
    age: u.age,
    role: u.role
  };
}

function pick(obj, keys) {
  const r = {};
  keys.forEach((k) => { if (obj[k] !== undefined) r[k] = obj[k]; });
  return r;
}

module.exports = { login, getProfile, updateProfile, getStats };
