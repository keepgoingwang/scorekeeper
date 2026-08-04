// services/settlement.service.js - 结算业务（PRD §6 自动结算状态机 / §7 手动结算 / §8 终局）
const SettleRound = require('../models/settle-round.model');
const Room = require('../models/room.model');
const Record = require('../models/record.model');
const User = require('../models/user.model');
const { BizError } = require('../middleware/error');
const roomService = require('./room.service');
const socket = require('../utils/socket.util');

const COUNTDOWN_MS = 90 * 1000;

async function loadRoom(roomNo) {
  const room = await Room.findOne({ roomNo, isDeleted: false });
  if (!room) throw new BizError('房间不存在或已解散', 404, 404);
  return room;
}

function assertOwner(room, userId) {
  if (room.owner.toString() !== userId.toString()) {
    throw new BizError('只有房主可以执行此操作', 403, 403);
  }
}

/**
 * 发起自动结算本局（PRD §6.2 Step1，仅房主）
 * @param {string} roomNo
 * @param {string} userId
 */
async function startSettle(roomNo, userId) {
  const room = await loadRoom(roomNo);
  assertOwner(room, userId);
  if (room.state === 'settling') throw new BizError('当前正在结算中', 400, 400);

  room.round += 1;
  room.state = 'settling';
  const active = room.members.filter((m) => m.status === 'active');
  active.forEach((m) => { m.lastSubmit = { income: 0, expense: 0, submitted: false }; });
  await room.save();

  const settle = await SettleRound.create({
    roomId: room._id,
    round: room.round,
    state: 'input',
    deadline: new Date(Date.now() + COUNTDOWN_MS),
    submissions: active.map((m) => ({ userId: m.userId, income: 0, expense: 0, submitted: false }))
  });

  socket.broadcast(room.roomNo, 'room:settle', {
    roomNo, round: room.round, deadline: settle.deadline, state: 'input'
  });

  // 90s 后自动校验（TODO: 进程重启会丢失，生产应改用任务表 + 定时扫描）
  setTimeout(() => verifyAndApply(roomNo, settle._id).catch(console.error), COUNTDOWN_MS);
  return { round: room.round, deadline: settle.deadline };
}

/**
 * 房主提前结束输入（PRD §6.2 Step3）
 */
async function endSettle(roomNo, userId) {
  const room = await loadRoom(roomNo);
  assertOwner(room, userId);
  if (room.state !== 'settling') throw new BizError('当前未在结算中', 400, 400);
  const settle = await SettleRound
    .findOne({ roomId: room._id, round: room.round, state: 'input' })
    .sort({ _id: -1 });
  if (!settle) throw new BizError('未找到结算单', 400, 400);
  return verifyAndApply(roomNo, settle._id);
}

/**
 * 用户提交本局收支（PRD §6.2 Step2）
 * @param {string} roomNo
 * @param {string} userId
 * @param {{income?:number, expense?:number}} data
 */
async function submitSettle(roomNo, userId, data = {}) {
  const room = await loadRoom(roomNo);
  if (room.state !== 'settling') throw new BizError('当前未在结算中', 400, 400);
  const member = room.members.find((m) => m.userId.toString() === userId.toString());
  if (!member) throw new BizError('您不在该房间', 400, 400);
  if (member.status === 'exited') throw new BizError('您已退出房间，无法操作', 400, 400);

  const settle = await SettleRound
    .findOne({ roomId: room._id, round: room.round, state: 'input' })
    .sort({ _id: -1 });
  if (!settle) throw new BizError('结算已结束', 400, 400);

  const sub = settle.submissions.find((s) => s.userId.toString() === userId.toString());
  if (!sub) throw new BizError('您不参与本局结算', 400, 400); // 倒计时内新加入不参与
  if (sub.submitted) throw new BizError('您已提交', 400, 400);

  sub.income = Math.max(0, Number(data.income) || 0);
  sub.expense = Math.max(0, Number(data.expense) || 0);
  sub.submitted = true;
  member.lastSubmit = { income: sub.income, expense: sub.expense, submitted: true };
  await Promise.all([settle.save(), room.save()]);

  const submitted = settle.submissions.filter((s) => s.submitted).length;
  const total = settle.submissions.length;
  socket.broadcast(room.roomNo, 'room:settle', { roomNo, round: room.round, submitted, total, state: 'input' });

  // 所有人已提交 -> 进入校验
  if (submitted >= total) {
    return verifyAndApply(roomNo, settle._id);
  }
  return { submitted, total };
}

/**
 * 校验并应用（PRD §6.2 Step4-5）-- 幂等：已 done 则跳过
 * @param {string} roomNo
 * @param {string} settleId
 */
async function verifyAndApply(roomNo, settleId) {
  const room = await loadRoom(roomNo);
  if (room.state !== 'settling') return null;
  const settle = await SettleRound.findById(settleId);
  if (!settle || settle.state !== 'input') return null;

  // 未提交者视为 0（PRD §6.2 Step3）
  settle.submissions.forEach((s) => {
    if (!s.submitted) { s.income = 0; s.expense = 0; s.submitted = true; }
  });

  const totalIncome = settle.submissions.reduce((a, s) => a + s.income, 0);
  const totalExpense = settle.submissions.reduce((a, s) => a + s.expense, 0);
  const balance = totalIncome === totalExpense; // 净额守恒：赢家赢的 == 输家输的
  settle.balance = balance;

  if (!balance) {
    // 不平衡：重置已提交，重新推送（PRD §6.2 Step5 情况B）
    settle.submissions.forEach((s) => { s.income = 0; s.expense = 0; s.submitted = false; });
    settle.deadline = new Date(Date.now() + COUNTDOWN_MS);
    await settle.save();
    room.members.forEach((m) => {
      if (m.status === 'active') m.lastSubmit = { income: 0, expense: 0, submitted: false };
    });
    await room.save();
    socket.broadcast(room.roomNo, 'room:settle', {
      roomNo, round: room.round, state: 'input', rebalance: true,
      diff: Math.abs(totalIncome - totalExpense), deadline: settle.deadline
    });
    setTimeout(() => verifyAndApply(roomNo, settle._id).catch(console.error), COUNTDOWN_MS);
    return { balance: false, diff: Math.abs(totalIncome - totalExpense) };
  }

  // 平衡：累加积分（PRD §6.2 Step5 情况A）
  const flowPromises = settle.submissions.map(async (s) => {
    const member = room.members.find((m) => m.userId.toString() === s.userId.toString());
    if (member) {
      const delta = s.income - s.expense; // 净收入
      member.score += delta;
      await roomService.pushFlow(room, { type: 'settle', from: s.userId, amount: delta, memo: `第${settle.round}局` });
    }
  });
  await Promise.all(flowPromises);
  settle.state = 'done';
  room.state = 'playing';
  await roomService.pushDynamic(room, { type: 'settle', text: `✅ 第${settle.round}局结算完成` });
  await Promise.all([settle.save(), room.save()]);
  socket.broadcast(room.roomNo, 'room:score', { roomNo, round: room.round, state: 'playing' });
  socket.broadcast(room.roomNo, 'room:settle', { roomNo, round: room.round, state: 'done' });
  return { balance: true };
}

/**
 * 手动结算转账（PRD §7.2）
 * @param {string} roomNo
 * @param {string} fromId 付款人
 * @param {{toUserId:string, amount:number}} data
 */
async function manualPay(roomNo, fromId, data) {
  const room = await loadRoom(roomNo);
  if (room.mode !== 'manual') throw new BizError('当前为自动结算模式', 400, 400);
  const { toUserId, amount } = data;
  const payer = room.members.find((m) => m.userId.toString() === fromId.toString());
  const payee = room.members.find((m) => m.userId.toString() === String(toUserId));
  if (!payer || payer.status === 'exited') throw new BizError('付款人无效', 400, 400);
  if (!payee || payee.status === 'exited') throw new BizError('收款人已退出', 400, 400);
  if (fromId.toString() === String(toUserId)) throw new BizError('不能转给自己', 400, 400);
  const amt = Number(amount);
  if (!amt || amt <= 0) throw new BizError('请输入有效金额', 400, 400);

  payer.score -= amt;
  payee.score += amt;
  await roomService.pushDynamic(room, { type: 'pay', text: `💸 支出 ${amt} 积分` });
  await roomService.pushFlow(room, { type: 'pay', from: fromId, to: toUserId, amount: amt });
  await room.save();
  socket.broadcast(room.roomNo, 'room:score', { roomNo, round: room.round });
  return { ok: true };
}

/**
 * 房间终局结算（PRD §8）：排名 + 盈亏 + 建议转账方案 + 写战绩
 * @param {string} roomNo
 * @param {string} userId
 */
async function settleFinal(roomNo, userId) {
  const room = await loadRoom(roomNo);
  assertOwner(room, userId);
  if (room.state === 'settled') throw new BizError('房间已结算', 400, 400);

  const active = room.members.filter((m) => m.status === 'active');
  // 查询用户信息填充昵称
  const userIds = active.map((m) => m.userId);
  const users = await User.find({ _id: { $in: userIds } }).lean();
  const userMap = new Map(users.map((u) => [u._id.toString(), u]));

  const ranked = active
    .map((m) => ({
      userId: m.userId,
      nickname: (userMap.get(m.userId.toString()) || {}).nickname || '牌友',
      score: m.score
    }))
    .sort((a, b) => b.score - a.score);
  const transferPlan = buildTransferPlan(ranked); // 最小化转账次数

  // 生成战绩 + 更新用户统计
  for (const m of active) {
    const result = m.score > 0 ? 'win' : (m.score < 0 ? 'lose' : 'even');
    await Record.create({
      userId: m.userId, roomId: room._id, roomNo: room.roomNo,
      memberCount: active.length, score: m.score, result
    });
    const inc = { 'stats.games': 1, 'stats.totalScore': m.score };
    if (result === 'win') inc['stats.wins'] = 1;
    await User.updateOne(
      { _id: m.userId },
      {
        $inc: inc,
        $max: { 'stats.maxScore': m.score },
        $set: { currentRoomId: null }
      }
    );
  }

  room.state = 'settled';
  await roomService.pushDynamic(room, { type: 'settle', text: '🏁 房间已结算' });
  await room.save();
  socket.broadcast(room.roomNo, 'room:settle', { roomNo, state: 'settled' });
  return { ranking: ranked, transferPlan };
}

/**
 * 建议转账方案：输家欠额转给赢家应收，贪心最小化转账次数
 */
function buildTransferPlan(ranked) {
  const debtors = ranked.filter((r) => r.score < 0).map((r) => ({ ...r, debt: -r.score }));
  const creditors = ranked.filter((r) => r.score > 0).map((r) => ({ ...r, credit: r.score }));
  const plan = [];
  let i = 0; let j = 0;
  while (i < debtors.length && j < creditors.length) {
    const pay = Math.min(debtors[i].debt, creditors[j].credit);
    plan.push({
      from: debtors[i].userId,
      fromNickname: debtors[i].nickname,
      to: creditors[j].userId,
      toNickname: creditors[j].nickname,
      amount: pay
    });
    debtors[i].debt -= pay;
    creditors[j].credit -= pay;
    if (debtors[i].debt === 0) i++;
    if (creditors[j].credit === 0) j++;
  }
  return plan;
}

module.exports = { startSettle, endSettle, submitSettle, manualPay, settleFinal };
