// utils/request.util.js
// 统一请求封装：基于 wx.request，支持 token 注入、统一错误码处理
// 规范：所有异步操作必须 try-catch；token 过期自动跳转登录页
import { API_BASE as BASE } from './constants.util';

/**
 * 读取本地 token，优先 storage，兜底 globalData
 * @returns {string}
 */
function getToken() {
  const app = getApp();
  return (app && app.globalData && app.globalData.token) || wx.getStorageSync('token') || '';
}

/**
 * token 过期处理：清空本地态，降级为游客
 */
function handleUnauthorized() {
  wx.removeStorageSync('token');
  const app = getApp();
  if (app && app.globalData) {
    app.globalData.token = '';
    app.globalData.userRole = 'visitor';
    app.globalData.userInfo = null;
  }
  // 游客态（从未登录过）不强制跳登录页，避免审核不合规
  // 仅已登录用户 token 过期时才引导重新登录
}

const http = {
  /**
   * 底层请求方法
   * @param {string} method HTTP 方法
   * @param {string} url 接口路径（不含 BASE）
   * @param {object} data 请求参数
   * @returns {Promise<object>} 后端统一响应体 { code, data, message }
   */
  request(method, url, data) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: BASE + url,
        method,
        data,
        header: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getToken()
        },
        success(res) {
          if (res.statusCode === 200 && res.data && res.data.code === 200) {
            resolve(res.data);
          } else if (res.statusCode === 401) {
            handleUnauthorized();
            reject(new Error('登录已过期'));
          } else {
            reject(new Error((res.data && res.data.message) || '请求失败'));
          }
        },
        fail() {
          reject(new Error('网络异常'));
        }
      });
    });
  },

  get(url, params) {
    return this.request('GET', url + this.toQuery(params));
  },

  post(url, data) {
    return this.request('POST', url, data);
  },

  put(url, data) {
    return this.request('PUT', url, data);
  },

  delete(url) {
    return this.request('DELETE', url);
  },

  /**
   * 对象转 query string
   * @param {object} params
   * @returns {string}
   */
  toQuery(params) {
    if (!params) return '';
    const q = Object.keys(params)
      .filter(k => params[k] !== undefined && params[k] !== null)
      .map(k => `${k}=${encodeURIComponent(params[k])}`)
      .join('&');
    return q ? '?' + q : '';
  }
};

export { http };
