// config/db.js - MongoDB 连接
const mongoose = require('mongoose');
const env = require('./env');

/**
 * 连接 MongoDB
 * @returns {Promise<void>}
 */
async function connectDb() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.mongoUri);
  console.log('[db] MongoDB connected');
}

module.exports = { connectDb };
