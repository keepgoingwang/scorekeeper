// utils/socket.util.js - WebSocket 网关
// 按 roomNo 维护连接池，广播房间事件（PRD §4.5 / §6.1 实时同步）
const { WebSocketServer } = require('ws');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

/** roomNo -> Set<ws> */
const rooms = new Map();
let wss = null;

/**
 * 初始化 WS 服务，挂载到 HTTP server
 * @param {http.Server} server
 */
function init(server) {
  wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws, req) => {
    // 连接鉴权：token 从 query 读取
    const token = new URL(req.url, 'http://x').searchParams.get('token');
    try {
      const payload = jwt.verify(token, env.jwtSecret);
      ws.userId = payload._id;
    } catch (e) {
      ws.close();
      return;
    }
    ws.roomNo = null;

    ws.on('message', (raw) => {
      try {
        const { event, payload } = JSON.parse(raw);
        if (event === 'room:join') this.joinRoom(ws, payload.roomNo);
        else if (event === 'room:leave') this.leaveRoom(ws);
      } catch (e) {
        // 忽略非法消息
      }
    });

    ws.on('close', () => this.leaveRoom(ws));
  });
}

/**
 * 将连接加入房间频道
 * @param {WebSocket} ws
 * @param {string} roomNo
 */
function joinRoom(ws, roomNo) {
  leaveRoom(ws);
  ws.roomNo = roomNo;
  if (!rooms.has(roomNo)) rooms.set(roomNo, new Set());
  rooms.get(roomNo).add(ws);
}

/**
 * 离开当前房间频道
 * @param {WebSocket} ws
 */
function leaveRoom(ws) {
  if (ws.roomNo && rooms.has(ws.roomNo)) {
    rooms.get(ws.roomNo).delete(ws);
    if (rooms.get(ws.roomNo).size === 0) rooms.delete(ws.roomNo);
  }
  ws.roomNo = null;
}

/**
 * 向房间内所有连接广播事件
 * @param {string} roomNo
 * @param {string} event room:score | room:dynamic | room:settle | room:member | room:dissolved
 * @param {*} payload
 */
function broadcast(roomNo, event, payload) {
  const conns = rooms.get(roomNo);
  if (!conns) return;
  const msg = JSON.stringify({ event, payload });
  conns.forEach((ws) => {
    if (ws.readyState === ws.OPEN) ws.send(msg);
  });
}

module.exports = { init, joinRoom, leaveRoom, broadcast };
