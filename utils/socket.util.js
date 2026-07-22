// utils/socket.util.js
// WebSocket 封装：用于房间内实时同步（积分变动、动态、结算状态机）
// 规范：页面卸载时清理定时器和事件监听
import { WS_BASE } from './constants.util';

/** 事件订阅表：eventName -> Set<handler> */
const listeners = new Map();

let socketTask = null;
let reconnectTimer = null;
let reconnectAttempts = 0;
const MAX_RECONNECT = 5;

const socket = {
  /**
   * 建立连接
   * @param {string} token 登录 token
   * @returns {Promise<void>}
   */
  connect(token) {
    return new Promise((resolve, reject) => {
      if (socketTask && socketTask.readyState === 1) return resolve();

      socketTask = wx.connectSocket({ url: `${WS_BASE}?token=${token}` });

      socketTask.onOpen(() => {
        reconnectAttempts = 0;
        resolve();
      });

      socketTask.onMessage((res) => {
        try {
          const { event, payload } = JSON.parse(res.data);
          this.emit(event, payload);
        } catch (e) {
          // 忽略非 JSON 心跳包
        }
      });

      socketTask.onClose(() => {
        socketTask = null;
        this.scheduleReconnect(token);
      });

      socketTask.onError((err) => {
        reject(err);
      });
    });
  },

  /**
   * 订阅事件
   * @param {string} event 事件名
   * @param {function} handler 回调
   * @returns {function} 取消订阅函数
   */
  on(event, handler) {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event).add(handler);
    return () => listeners.get(event) && listeners.get(event).delete(handler);
  },

  /**
   * 触发事件
   * @param {string} event
   * @param {*} payload
   */
  emit(event, payload) {
    const handlers = listeners.get(event);
    if (handlers) handlers.forEach(h => h(payload));
  },

  /**
   * 发送消息
   * @param {string} event
   * @param {*} payload
   */
  send(event, payload) {
    if (socketTask && socketTask.readyState === 1) {
      socketTask.send({ data: JSON.stringify({ event, payload }) });
    }
  },

  /**
   * 断线重连（指数退避）
   */
  scheduleReconnect(token) {
    if (reconnectTimer || reconnectAttempts >= MAX_RECONNECT) return;
    reconnectAttempts++;
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      this.connect(token);
    }, 1000 * reconnectAttempts);
  },

  /**
   * 主动关闭连接，清理资源（页面卸载时调用）
   */
  close() {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    reconnectAttempts = MAX_RECONNECT; // 阻止自动重连
    if (socketTask) {
      socketTask.close({});
      socketTask = null;
    }
    listeners.clear();
  }
};

export { socket };
