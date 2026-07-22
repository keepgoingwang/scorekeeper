// services/record.service.js - 战绩业务（PRD §3.3）
const Record = require('../models/record.model');
const User = require('../models/user.model');
const { BizError } = require('../middleware/error');

/**
 * 场次明细列表
 * @param {string} userId
 * @param {object} params { page, pageSize }
 */
async function list(userId, params = {}) {
  const { page = 1, pageSize = 20 } = params;
  const [list, total] = await Promise.all([
    Record.find({ userId, isDeleted: false })
      .sort({ settledAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Record.countDocuments({ userId, isDeleted: false })
  ]);
  return { list, total, page, pageSize };
}

/**
 * 单场结算报告明细
 * @param {string} id 记录 ID
 * @param {string} userId 仅本人可查
 */
async function detail(id, userId) {
  const rec = await Record.findOne({ _id: id, userId, isDeleted: false }).lean();
  if (!rec) throw new BizError('记录不存在', 404, 404);
  return rec;
}

/**
 * 近 N 天盈亏趋势（PRD §3.3 数据可视化）
 * @param {string} userId
 * @param {string|number} range 7 | 30
 */
async function trend(userId, range = 7) {
  const days = Number(range) === 30 ? 30 : 7;
  const since = new Date(Date.now() - days * 24 * 3600 * 1000);
  const records = await Record.find({ userId, settledAt: { $gte: since }, isDeleted: false }).lean();
  const map = {};
  records.forEach((r) => {
    const day = new Date(r.settledAt).toISOString().slice(0, 10);
    map[day] = (map[day] || 0) + r.score;
  });
  return Object.entries(map)
    .map(([date, score]) => ({ date, score }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * 牌友排行榜（与该用户打过牌的所有人，按累计积分）
 * @param {string} userId
 */
async function ranking(userId) {
  const myRecords = await Record.find({ userId, isDeleted: false }).lean();
  const roomIds = myRecords.map((r) => r.roomId);
  const all = await Record.find({ roomId: { $in: roomIds }, isDeleted: false }).lean();
  const scoreMap = {};
  const userIds = new Set();
  all.forEach((r) => {
    const k = r.userId.toString();
    scoreMap[k] = (scoreMap[k] || 0) + r.score;
    userIds.add(k);
  });
  // 补充昵称
  const users = await User.find({ _id: { $in: [...userIds] } }).lean();
  const userMap = new Map(users.map((u) => [u._id.toString(), u]));
  return Object.entries(scoreMap)
    .map(([uid, score]) => ({
      userId: uid,
      nickname: (userMap.get(uid) || {}).nickname || '牌友',
      score
    }))
    .sort((a, b) => b.score - a.score);
}

module.exports = { list, detail, trend, ranking };
