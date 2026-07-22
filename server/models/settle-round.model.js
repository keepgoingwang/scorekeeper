// models/settle-round.model.js - 自动结算单局（PRD §6 状态机）
const mongoose = require('mongoose');
const { Schema } = mongoose;

const submissionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  income: { type: Number, default: 0 },
  expense: { type: Number, default: 0 },
  submitted: { type: Boolean, default: false }
}, { _id: false });

const settleRoundSchema = new Schema({
  roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true, index: true },
  round: { type: Number, required: true },
  state: { type: String, enum: ['input', 'verify', 'done', 'cancelled'], default: 'input' },
  deadline: { type: Date },                               // 60s 倒计时截止
  submissions: { type: [submissionSchema], default: [] },
  balance: { type: Boolean, default: false }              // 收支是否平衡
}, { timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' } });

module.exports = mongoose.model('SettleRound', settleRoundSchema);
