// app.js - 服务入口
// 规范：Controller -> Service -> Model 分层；统一错误处理；WebSocket 网关
const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const fs = require('fs');
const env = require('./config/env');
const { connectDb } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/error');
const socket = require('./utils/socket.util');
const routes = require('./routes');

const app = express();

// 上传目录（从环境变量读取），按类型分子目录
const UPLOAD_DIR = env.uploadDir;
const UPLOAD_SUBDIRS = ['avatars'];
UPLOAD_SUBDIRS.forEach(dir => {
  const p = path.join(UPLOAD_DIR, dir);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

app.use(cors({ origin: env.clientOrigin }));
app.use(express.json());
app.use('/uploads', express.static(UPLOAD_DIR));
// 兼容历史头像 URL：升级 avatars 子目录前，user.avatar 存的是 /uploads/<file>（无子目录）。
// express.static 找不到文件会 next()，故同前缀再挂一次 avatars 目录兜底，使新旧 URL 均可命中。
app.use('/uploads', express.static(path.join(UPLOAD_DIR, 'avatars')));

// 业务路由
app.use('/api', routes);

// 404 + 统一错误处理
app.use(notFound);
app.use(errorHandler);

const server = http.createServer(app);

/**
 * 启动：先连库，再初始化 WS 网关，最后监听端口
 */
async function start() {
  await connectDb();
  socket.init(server); // WebSocket 挂载到同一 HTTP server（/ws）
  server.listen(env.port, () => {
    console.log(`[server] listening on :${env.port} (ws /ws)`);
  });
}

start().catch((e) => {
  console.error('[server] start failed:', e.message);
  process.exit(1);
});

module.exports = app;
