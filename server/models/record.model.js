// models/record.model.js - 战绩（PRD §3.3）
const mongoose = require('mongoose');
const { Schema } = mongoose;

const recordSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  roomNo: { type: String, required: true },
  memberCount: { type: Number, default: 0 },
  score: { type: Number, default: 0 },                    // 个人最终积分
  result: { type: String, enum: ['win', 'even', 'lose'], default: 'even' },
  settledAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' } });

module.exports = mongoose.model('Record', recordSchema);
