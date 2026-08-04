// services/room.service.js - 房间业务（PRD §2 / §4 / §4.6 / §九）
// 规范：用户房间唯一性、房主转移/解散、流水与动态记录、WS 广播
const Room = require('../models/room.model');
const User = require('../models/user.model');
const Flow = require('../models/flow.model');
const { BizError } = require('../middleware/error');
const socket = require('../utils/socket.util');

/**
 * 生成 6 位不重复房间号
 * @returns {Promise<string>}
 */
async function genRoomNo() {
  for (let i = 0; i < 10; i++) {
    const no = String(Math.floor(100000 + Math.random() * 900000));
    if (!await Room.findOne({ roomNo: no })) return no;
  }
  throw new BizError('房间号生成失败，请重试', 500, 500);
}

/**
 * 退出旧房间（PRD §2.2 / §九：房主退出则转移/解散）
 * @param {string} userId
 * @param {object} [opts] { silent } 内部调用时不广播
 * @returns {Promise<object|null>} 旧房间（已解散则 null）
 */
async function exitOldRoom(userId, opts = {}) {
  const user = await User.findById(userId);
  if (!user.currentRoomId) return null;
  const roomId = user.currentRoomId;
  user.currentRoomId = null;
  await user.save();

  const room = await Room.findById(roomId);
  if (!room) return null;

  const member = room.members.find((m) => m.userId.toString() === userId.toString());
  if (member) member.status = 'exited';

  if (room.owner.toString() === userId.toString()) {
    // 房主退出：转移或解散
    const active = room.members.filter(
      (m) => m.status === 'active' && m.userId.toString() !== userId.toString()
    );
    if (active.length) {
      const newOwner = active[Math.floor(Math.random() * active.length)];
      room.owner = newOwner.userId;
      newOwner.isOwner = true;
      await pushDynamic(room, { type: 'owner', text: '👑 新房主已就任' });
      await pushFlow(room, { type: 'owner', from: userId, to: newOwner.userId });
    } else {
      room.state = 'dissolved';
      await pushDynamic(room, { type: 'dissolve', text: '💥 房间已解散' });
      await room.save();
      if (!opts.silent) socket.broadcast(room.roomNo, 'room:dissolved', { roomNo: room.roomNo });
      return null;
    }
  }

  await pushDynamic(room, { type: 'exit', text: '👋 用户退出房间' });
  await pushFlow(room, { type: 'exit', from: userId });
  await room.save();
  if (!opts.silent) socket.broadcast(room.roomNo, 'room:member', { roomNo: room.roomNo });
  return room;
}

/**
 * 创建房间（PRD §2.2），返回新房主身份
 * @param {string} userId
 */
async function create(userId) {
  await exitOldRoom(userId); // 房间唯一性
  const roomNo = await genRoomNo();
  const room = await Room.create({
    roomNo,
    owner: userId,
    members: [{ userId, status: 'active', score: 0, isOwner: true }],
    mode: 'manual',
    state: 'playing',
    skin: 'mahjong',
    round: 0
  });
  await User.findByIdAndUpdate(userId, { currentRoomId: room._id });
  await pushDynamic(room, { type: 'enter', text: '🎉 房间已创建' });
  await pushFlow(room, { type: 'enter', from: userId });
  await room.save();
  return { roomNo: room.roomNo };
}

/**
 * 加入房间（PRD §2.3），校验房间存在与状态
 * @param {string} roomNo
 * @param {string} userId
 */
async function join(roomNo, userId) {
  const room = await Room.findOne({ roomNo, isDeleted: false });
  if (!room || room.state === 'dissolved') {
    throw new BizError('房间不存在或已解散', 404, 404);
  }
  if (room.state === 'settled') {
    throw new BizError('房间已结算', 400, 400);
  }
  await exitOldRoom(userId); // 房间唯一性

  const exists = room.members.find((m) => m.userId.toString() === userId.toString());
  if (!exists) {
    room.members.push({ userId, status: 'active', score: 0 });
  } else {
    exists.status = 'active'; // 重新进入
  }
  await User.findByIdAndUpdate(userId, { currentRoomId: room._id });
  await pushDynamic(room, { type: 'enter', text: '🎉 用户进入房间' });
  await pushFlow(room, { type: 'enter', from: userId });
  await room.save();
  socket.broadcast(room.roomNo, 'room:member', { roomNo: room.roomNo });
  return { roomNo: room.roomNo };
}

/**
 * 房间详情（含成员昵称/头像）
 * @param {string} roomNo
 * @param {string} [currentUserId] 用于标记 isOwner
 */
async function detail(roomNo, currentUserId) {
  const room = await Room.findOne({ roomNo, isDeleted: false }).lean();
  if (!room) throw new BizError('房间不存在或已解散', 404, 404);

  const userIds = room.members.map((m) => m.userId);
  const users = await User.find({ _id: { $in: userIds } }).lean();
  const userMap = new Map(users.map((u) => [u._id.toString(), u]));

  const members = room.members.map((m) => ({
    userId: m.userId,
    nickname: (userMap.get(m.userId.toString()) || {}).nickname || '未知',
    avatar: (userMap.get(m.userId.toString()) || {}).avatar || '',
    status: m.status,
    score: m.score,
    isOwner: m.isOwner,
    submitted: m.lastSubmit ? m.lastSubmit.submitted : false
  }));

  return {
    roomNo: room.roomNo,
    owner: room.owner,
    isOwner: currentUserId && room.owner.toString() === currentUserId.toString(),
    mode: room.mode,
    state: room.state,
    skin: room.skin,
    round: room.round,
    members,
    dynamics: room.dynamics.slice(-3) // 最近 3 条动态（PRD §4.5）
  };
}

/**
 * 当前所在房间（首页卡片）
 * @param {string} userId
 */
async function current(userId) {
  const user = await User.findById(userId);
  if (!user || !user.currentRoomId) return null;
  const room = await Room.findById(user.currentRoomId).lean();
  if (!room || room.state === 'dissolved') return null;
  return {
    roomNo: room.roomNo,
    state: room.state,
    stateText: room.state === 'playing' ? '游戏中' : (room.state === 'settling' ? '结算中' : '已结算'),
    memberCount: room.members.filter((m) => m.status === 'active').length
  };
}

/**
 * 退出房间（PRD §4.6）
 * @param {string} roomNo
 * @param {string} userId
 */
async function exit(roomNo, userId) {
  const room = await Room.findOne({ roomNo, isDeleted: false });
  if (!room) throw new BizError('房间不存在或已解散', 404, 404);
  const member = room.members.find((m) => m.userId.toString() === userId.toString());
  if (!member) throw new BizError('您不在该房间', 400, 400);
  if (member.status === 'exited') throw new BizError('您已退出房间，无法操作', 400, 400);
  await exitOldRoom(userId);
  return { ok: true };
}

/**
 * 解散房间（仅房主，PRD §4.6）
 * @param {string} roomNo
 * @param {string} userId
 */
async function dissolve(roomNo, userId) {
  const room = await Room.findOne({ roomNo, isDeleted: false });
  if (!room) throw new BizError('房间不存在或已解散', 404, 404);
  if (room.owner.toString() !== userId.toString()) {
    throw new BizError('只有房主可以执行此操作', 403, 403);
  }
  room.state = 'dissolved';
  room.members.forEach((m) => { if (m.userId.toString() !== userId.toString()) m.status = 'exited'; });
  await pushDynamic(room, { type: 'dissolve', text: '💥 房间已解散' });
  await pushFlow(room, { type: 'dissolve', from: userId });
  await room.save();
  // 清理所有成员的 currentRoomId
  const ids = room.members.map((m) => m.userId);
  await User.updateMany({ _id: { $in: ids } }, { currentRoomId: null });
  socket.broadcast(room.roomNo, 'room:dissolved', { roomNo: room.roomNo });
  return { ok: true };
}

/**
 * 切换结算模式（仅房主，PRD §4.3）
 * @param {string} roomNo
 * @param {string} userId
 * @param {'manual'|'auto'} mode
 */
async function switchMode(roomNo, userId, mode) {
  const room = await Room.findOne({ roomNo, isDeleted: false });
  if (!room) throw new BizError('房间不存在或已解散', 404, 404);
  if (room.owner.toString() !== userId.toString()) {
    throw new BizError('只有房主可以执行此操作', 403, 403);
  }
  room.mode = mode;
  await pushDynamic(room, { type: 'mode', text: `⚙️ 切换为${mode === 'auto' ? '自动' : '手动'}结算模式` });
  await room.save();
  socket.broadcast(room.roomNo, 'room:settle', { roomNo: room.roomNo });
  return { mode };
}

/**
 * 切换牌桌皮肤（仅房主，PRD §4.4）
 */
async function switchSkin(roomNo, userId, skin) {
  const room = await Room.findOne({ roomNo, isDeleted: false });
  if (!room) throw new BizError('房间不存在或已解散', 404, 404);
  if (room.owner.toString() !== userId.toString()) {
    throw new BizError('只有房主可以执行此操作', 403, 403);
  }
  room.skin = skin;
  await room.save();
  socket.broadcast(room.roomNo, 'room:score', { roomNo: room.roomNo });
  return { skin };
}

/**
 * 流水记录（PRD §4.6）
 * @param {string} roomNo
 * @param {object} params { page, pageSize }
 */
async function getFlow(roomNo, params = {}) {
  const room = await Room.findOne({ roomNo, isDeleted: false });
  if (!room) throw new BizError('房间不存在或已解散', 404, 404);
  const { page = 1, pageSize = 50 } = params;
  const [list, total, allFlows] = await Promise.all([
    Flow.find({ roomId: room._id, isDeleted: false })
      .sort({ _id: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Flow.countDocuments({ roomId: room._id, isDeleted: false }),
    Flow.find({ roomId: room._id, isDeleted: false }).select('type amount').lean()
  ]);
  // 真实汇总：pay 转账额与 settle 正额计入收入，settle 负额计入支出（房间级流水规模）
  let totalIncome = 0;
  let totalExpense = 0;
  for (const f of allFlows) {
    const signed = f.type === 'settle' ? (f.amount || 0) : (f.type === 'pay' ? (f.amount || 0) : 0);
    if (signed > 0) totalIncome += signed;
    else if (signed < 0) totalExpense += -signed;
  }
  return { list, total, page, pageSize, summary: { totalIncome, totalExpense, rounds: room.round || 0 } };
}

// ---- 内部辅助 ----

/**
 * 追加动态（仅内存 + 持久化前，调用方需 room.save()）
 * @param {object} room
 * @param {{type:string, text:string}} item
 */
async function pushDynamic(room, item) {
  room.dynamics.push(item);
  // 动态最多保留 100 条
  if (room.dynamics.length > 100) room.dynamics = room.dynamics.slice(-100);
  socket.broadcast(room.roomNo, 'room:dynamic', { text: item.text, type: item.type });
}

/**
 * 追加流水（独立持久化）
 */
async function pushFlow(room, item) {
  await Flow.create({
    roomId: room._id,
    round: room.round,
    type: item.type,
    from: item.from || null,
    to: item.to || null,
    amount: item.amount || 0,
    memo: item.memo || ''
  });
}

module.exports = {
  create, join, detail, current, exit, dissolve, switchMode, switchSkin, getFlow,
  exitOldRoom, pushDynamic, pushFlow
};
