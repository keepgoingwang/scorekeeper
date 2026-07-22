// services/room.service.js
// 房间相关 API（PRD §2、§4、§6、§7、§8）
import { http } from '../utils/request.util';

export const roomApi = {
  /** 创建房间（PRD §2.2），返回新房主身份 */
  create(data) {
    return http.post('/api/room', data);
  },

  /** 加入房间（PRD §2.3），roomNo 为 6 位房间号 */
  join(roomNo) {
    return http.post(`/api/room/${roomNo}/join`);
  },

  /** 获取房间详情（成员、模式、积分、动态） */
  detail(roomNo) {
    return http.get(`/api/room/${roomNo}`);
  },

  /** 当前用户所在房间（用于首页「当前所在房间卡片」） */
  current() {
    return http.get('/api/room/current');
  },

  /** 退出房间（PRD §4.6，房主退出触发新房主/解散） */
  exit(roomNo) {
    return http.post(`/api/room/${roomNo}/exit`);
  },

  /** 解散房间（仅房主） */
  dissolve(roomNo) {
    return http.post(`/api/room/${roomNo}/dissolve`);
  },

  /** 切换结算模式（仅房主，PRD §4.3） */
  switchMode(roomNo, mode) {
    return http.put(`/api/room/${roomNo}/mode`, { mode });
  },

  /** 切换牌桌皮肤（仅房主，PRD §4.4） */
  switchSkin(roomNo, skin) {
    return http.put(`/api/room/${roomNo}/skin`, { skin });
  },

  /** 发起自动结算本局（仅房主，PRD §6.2 Step1） */
  startSettle(roomNo) {
    return http.post(`/api/room/${roomNo}/settle/start`);
  },

  /** 房主提前结束输入（PRD §6.2 Step3） */
  endSettle(roomNo) {
    return http.post(`/api/room/${roomNo}/settle/end`);
  },

  /** 用户提交本局收支（PRD §6.2 Step2） */
  submitSettle(roomNo, data) {
    return http.post(`/api/room/${roomNo}/settle/submit`, data);
  },

  /** 手动结算转账（PRD §7.2） */
  manualPay(roomNo, data) {
    return http.post(`/api/room/${roomNo}/pay`, data);
  },

  /** 房间终局结算（PRD §8） */
  settleFinal(roomNo) {
    return http.post(`/api/room/${roomNo}/settle-final`);
  },

  /** 流水记录（PRD §4.6 查看流水单） */
  flow(roomNo, params) {
    return http.get(`/api/room/${roomNo}/flow`, params);
  },

  /** 房间二维码（PRD §5） */
  qrcode(roomNo) {
    return http.get(`/api/room/${roomNo}/qrcode`);
  }
};
