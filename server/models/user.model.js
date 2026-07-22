// models/user.model.js - 用户模型
const mongoose = require('mongoose');
const { Schema } = mongoose;

const statsSchema = new Schema({
  games: { type: Number, default: 0 },       // 参与场次
  wins: { type: Number, default: 0 },        // 胜利场次（结算积分 >= 0）
  maxScore: { type: Number, default: 0 },     // 单局最高积分
  totalScore: { type: Number, default: 0 }    // 累计积分
}, { _id: false });

const userSchema = new Schema({
  openid: { type: String, unique: true, index: true },   // 微信 openid
  nickname: { type: String, default: '牌友' },
  avatar: { type: String, default: '' },
  age: { type: Number, default: 0 },
  role: { type: String, enum: ['visitor', 'user', 'vip', 'admin'], default: 'user' },
  currentRoomId: { type: Schema.Types.ObjectId, ref: 'Room', default: null }, // 房间唯一性
  stats: { type: statsSchema, default: () => ({}) },
  isDeleted: { type: Boolean, default: false }            // 软删除
}, { timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' } });

module.exports = mongoose.model('User', userSchema);
