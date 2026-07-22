# 棋牌计分小程序 - 后端服务

Node.js + Express + MongoDB + WebSocket，分层架构 Controller -> Service -> Model。

## 目录结构

```
server/
  app.js                 入口：HTTP + WS 网关
  package.json
  .env.example           环境变量模板
  config/                env.js / db.js
  middleware/            auth(JWT+角色) / validate(Joi) / error(统一错误)
  controllers/           user / room / settlement / record
  services/              user / room / settlement / record（业务逻辑）
  models/                user / room / flow / settle-round / record（Mongoose）
  routes/                资源路由 + index 聚合
  utils/                 response.util / socket.util(WS 网关)
```

## 启动

```bash
cd server
cp .env.example .env      # 填入 MONGO_URI / JWT_SECRET / WX_APP_ID / WX_SECRET
npm install
npm run seed              # 灌入本地固定测试数据（房间 888888 + 5 用户）
npm run dev               # nodemon 热重载，或 npm start
```

默认监听 `:3000`，HTTP 接口前缀 `/api`，WebSocket 路径 `/ws`。
前期开发默认连本地 MongoDB（`127.0.0.1:27017`），如需连线上见 `.env.example` 注释。

## 接口概览

| 模块 | 方法 | 路径 | 说明 |
| --- | --- | --- | --- |
| 用户 | POST | /api/user/login | wx.login code 换 token |
| 用户 | GET | /api/user/profile | 个人资料 |
| 用户 | PUT | /api/user/profile | 更新资料 |
| 用户 | GET | /api/user/stats | 战绩统计 |
| 房间 | POST | /api/room | 创建房间 |
| 房间 | POST | /api/room/:no/join | 加入房间 |
| 房间 | GET | /api/room/:no | 房间详情 |
| 房间 | GET | /api/room/current | 当前所在房间 |
| 房间 | POST | /api/room/:no/exit | 退出房间 |
| 房间 | POST | /api/room/:no/dissolve | 解散房间（房主） |
| 房间 | PUT | /api/room/:no/mode | 切换结算模式（房主） |
| 房间 | PUT | /api/room/:no/skin | 切换牌桌皮肤（房主） |
| 房间 | GET | /api/room/:no/flow | 流水记录 |
| 结算 | POST | /api/room/:no/settle/start | 发起自动结算（房主） |
| 结算 | POST | /api/room/:no/settle/end | 提前结束输入（房主） |
| 结算 | POST | /api/room/:no/settle/submit | 提交本局收支 |
| 结算 | POST | /api/room/:no/pay | 手动结算转账 |
| 结算 | POST | /api/room/:no/settle-final | 终局结算 |
| 战绩 | GET | /api/record/list | 场次明细 |
| 战绩 | GET | /api/record/:id | 单场报告 |
| 战绩 | GET | /api/record/trend | 盈亏趋势 |
| 战绩 | GET | /api/record/ranking | 牌友排行 |

## WebSocket 事件

连接：`wss://host/ws?token=<jwt>`，客户端发 `room:join { roomNo }` 加入频道。

服务端广播：

| 事件 | 触发 |
| --- | --- |
| room:score | 积分变动（手动转账 / 自动结算分配 / 皮肤切换） |
| room:dynamic | 房间动态（进入/退出/转账/模式切换/房主变更/解散） |
| room:settle | 结算状态机（发起/提交进度/校验/平衡/完成） |
| room:member | 成员变动（进入/退出） |
| room:dissolved | 房间解散 |

## 核心规则实现

- **用户房间唯一性**：`User.currentRoomId` 单一引用，create/join 前原子退出旧房（`roomService.exitOldRoom`）。
- **房主转移/解散**：房主退出时，有活跃成员随机转房主，无则解散。
- **自动结算状态机**：`input -> verify -> (balance: done | rebalance: re-input)`，60s 倒计时，超时未提交视为 0，收支平衡校验。
- **终局结算**：排名 + 盈亏 + 建议转账方案（贪心最小化次数）+ 写战绩 + 更新统计。

> ⚠️ 60s 倒计时用 `setTimeout` 实现，进程重启会丢失。生产应改用「任务表 + 定时扫描」。

## 待办

- [ ] 房间二维码生成（微信 wxacode，scene=roomNo）
- [ ] 倒计时持久化（任务表 + 定时扫描）
- [ ] 接口自动化测试
- [ ] AppID / 合法域名配置联调
