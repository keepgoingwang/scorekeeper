// models/room.model.js - 房间模型（PRD §4 / §6 / §7 / §8）
const mongoose = require('mongoose');
const { Schema } = mongoose;

/** 房间成员子文档 */
const memberSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active', 'exited'], default: 'active' }, // 有效 / 已退出
  score: { type: Number, default: 0 },                                    // 实时积分
  isOwner: { type: Boolean, default: false },                              // 是否房主
  joinedAt: { type: Date, default: Date.now },
  lastSubmit: {                                            // 当前局提交（PRD §6.2）
    income: { type: Number, default: 0 },
    expense: { type: Number, default: 0 },
    submitted: { type: Boolean, default: false }
  }
}, { _id: false });

/** 房间动态子文档（PRD §4.5） */
const dynamicSchema = new Schema({
  type: { type: String },  // enter/exit/pay/income/mode/owner/dissolve
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const roomSchema = new Schema({
  roomNo: { type: String, unique: true, index: true },   // 6 位房间号
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [memberSchema],
  mode: { type: String, enum: ['manual', 'auto'], default: 'manual' },     // 结算模式
  state: { type: String, enum: ['waiting', 'playing', 'settling', 'settled', 'dissolved'], default: 'playing' },
  skin: { type: String, enum: ['mahjong', 'texas', 'wood', 'mint'], default: 'mahjong' },
  round: { type: Number, default: 0 },                    // 当前局数
  dynamics: { type: [dynamicSchema], default: [] },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' } });

module.exports = mongoose.model('Room', roomSchema);
