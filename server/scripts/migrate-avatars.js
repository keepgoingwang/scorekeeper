// scripts/migrate-avatars.js - 一次性回填历史头像 URL 的 avatars 子目录（幂等、安全）
// 背景：升级 avatars 子目录前，user.avatar 存的是 /uploads/<file>（无子目录）。
// 本脚本仅处理「物理文件确实在 avatars/ 但 db 值漏写 avatars」的记录；
// 物理在根目录的保持原值不动（app.js 静态兜底已能 serve）；物理缺失的只打印不改。
// 用法（在 server 目录）：node scripts/migrate-avatars.js
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const env = require('../config/env');
const User = require('../models/user.model');

const UPLOAD_DIR = env.uploadDir;
const OLD_RE = /^\/uploads\/(?!avatars\/)/; // 命中 /uploads/<file> 但非 /uploads/avatars/<file>

async function migrate() {
  await mongoose.connect(env.mongoUri);
  const users = await User.find({ avatar: { $regex: OLD_RE } }).lean();
  let fixed = 0, kept = 0, missing = 0;
  for (const u of users) {
    const file = u.avatar.replace(/^\/uploads\//, ''); // 纯文件名
    const inSub = fs.existsSync(path.join(UPLOAD_DIR, 'avatars', file));
    const inRoot = fs.existsSync(path.join(UPLOAD_DIR, file));
    if (inSub) {
      await User.updateOne({ _id: u._id }, { $set: { avatar: '/uploads/avatars/' + file } });
      fixed++;
    } else if (inRoot) {
      kept++; // 物理在根，db 原值正确，app.js 兜底可 serve，无需改
    } else {
      missing++;
      console.log('[missing]', u._id.toString(), u.avatar);
    }
  }
  console.log(`[done] total=${users.length} fixed=${fixed} kept=${kept} missing=${missing}`);
  await mongoose.disconnect();
}

migrate().catch((e) => { console.error('[migrate failed]', e.message); process.exit(1); });
