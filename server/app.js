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

// 头像上传目录
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

app.use(cors({ origin: env.clientOrigin }));
app.use(express.json());
app.use('/uploads', express.static(UPLOAD_DIR));

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
