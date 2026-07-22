// models/flow.model.js - 流水记录（PRD §4.6 查看流水单）
const mongoose = require('mongoose');
const { Schema } = mongoose;

const flowSchema = new Schema({
  roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true, index: true },
  round: { type: Number, default: 0 },
  type: { type: String, enum: ['pay', 'settle', 'enter', 'exit', 'mode', 'owner', 'dissolve'], required: true },
  from: { type: Schema.Types.ObjectId, ref: 'User' },
  to: { type: Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, default: 0 },
  memo: { type: String, default: '' },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' } });

module.exports = mongoose.model('Flow', flowSchema);
