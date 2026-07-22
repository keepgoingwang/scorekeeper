// scripts/seed.js - 本地固定测试数据（前期开发联调用）
// 用法：npm run seed  （需先配置 .env 中的 MONGO_URI）
// MongoDB 无需 DDL：集合在写入时自动创建，索引由 Mongoose schema 同步
require('dotenv').config();
const mongoose = require('mongoose');
const env = require('../config/env');
const User = require('../models/user.model');
const Room = require('../models/room.model');
const Flow = require('../models/flow.model');

const USERS = [
  { openid: 'dev_zhangsan', nickname: '张三', age: 28 },
  { openid: 'dev_lisi', nickname: '李四', age: 30 },
  { openid: 'dev_wangwu', nickname: '王五', age: 25 },
  { openid: 'dev_zhaoliu', nickname: '赵六', age: 32 },
  { openid: 'dev_qianqi', nickname: '钱七', age: 27 }
];

async function seed() {
  await mongoose.connect(env.mongoUri);
  console.log('[seed] connected to', env.mongoUri);

  // 清空旧测试数据
  await Promise.all([
    User.deleteMany({ openid: /^dev_/ }),
    Room.deleteMany({ roomNo: '888888' }),
    Flow.deleteMany({})
  ]);

  const users = await User.create(USERS);
  const [zhang, li, wang, zhao, qian] = users;

  const room = await Room.create({
    roomNo: '888888',
    owner: zhang._id,
    members: [
      { userId: zhang._id, status: 'active', score: 120, isOwner: true },
      { userId: li._id, status: 'active', score: -50 },
      { userId: wang._id, status: 'active', score: 30 },
      { userId: zhao._id, status: 'active', score: -80 },
      { userId: qian._id, status: 'active', score: -20 }
    ],
    mode: 'manual',
    state: 'playing',
    skin: 'mahjong',
    round: 0,
    dynamics: [
      { type: 'enter', text: '🎉 房间已创建' },
      { type: 'pay', text: '💸 张三 支出 50 积分 -> 李四' },
      { type: 'enter', text: '🎉 王五 进入房间' }
    ]
  });

  // 绑定用户当前房间
  await User.updateMany(
    { _id: { $in: users.map((u) => u._id) } },
    { currentRoomId: room._id }
  );

  await Flow.create([
    { roomId: room._id, round: 0, type: 'enter', from: zhang._id, amount: 0 },
    { roomId: room._id, round: 0, type: 'pay', from: zhang._id, to: li._id, amount: 50 },
    { roomId: room._id, round: 0, type: 'enter', from: wang._id, amount: 0 }
  ]);

  console.log('[seed] done');
  console.log('  房间号: 888888');
  console.log('  房主: 张三（积分 120）');
  console.log('  成员: 李四(-50) 王五(+30) 赵六(-80) 钱七(-20)');
  console.log('  联调提示：前端登录后会新建一个 dev 用户，加入 888888 即可看到上述固定成员');
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error('[seed] failed:', e.message);
  process.exit(1);
});
