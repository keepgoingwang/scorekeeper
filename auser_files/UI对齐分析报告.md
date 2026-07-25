# 房间页 UI 对齐分析报告

> 生成时间：2026-07-25
> 对比基准：`design/pages/RoomPage.tsx` + `design/components/*` + `design/modals/*` (Figma 设计稿)
> 当前实现：`pages/room/room.wxml` + `room.wxss` + `room.js` (微信小程序)
> 换算基准：设计稿基于 390px 宽设备，1px ≈ 1.923rpx

---

## 一、差异列表

### 🔴 P0 级差异（直接影响视觉一致性）

| # | 区域 | 设计稿 (Figma) | 当前实现 | 差异说明 |
|---|------|----------------|----------|----------|
| **1** | **导航栏** | 自定义导航栏：`← 返回` \| 房间号(品牌色高亮) \| ⚙️设置按钮 | 使用微信原生导航栏，仅显示标题"房间号" | 设计稿的导航栏完全在页面内，包含返回按钮、房间号高亮、设置齿轮图标。当前缺少自定义导航栏，没有设置按钮入口 |
| **2** | **圆形牌桌尺寸** | 桌面直径 **216px** (R=108)，容器 336×336px | 桌面 552rpx (≈287px)，容器 672rpx | 当前偏大约 **33%**，圆形牌桌视觉效果远大于设计稿 |
| **3** | **方形牌桌尺寸** | 桌面 210×210px，容器 318×350px | 桌面 420rpx (≈218px)，容器 636rpx | 当前偏大约 **4%** (rpx 换算偏差) |
| **4** | **手动结算 UI** | 自定义底部弹窗 ManualPaySheet + AmountSheet，含用户列表选择 + 金额输入键盘 | 使用微信原生 `wx.showActionSheet()` + `wx.showModal()` | 原生弹窗样式与设计稿完全不一致，缺少头像、积分展示、快捷金额按钮等 |
| **5** | **终局结算报告** | 包含排名列表 + 建议转账方案(详细 from/to/金额) + 分享战绩 + 解散房间 | 仅显示排名列表，缺少转账方案渲染，"返回首页" 而非 "解散房间" | 缺少重要功能区块 |

### 🟡 P1 级差异（体验细节）

| # | 区域 | 设计稿 | 当前实现 | 差异说明 |
|---|------|--------|----------|----------|
| **6** | **模式栏 - 房主设置按钮** | 右侧显示 ⚙️ 设置按钮（房主切换模式） | 没有设置按钮 | 房主缺少快捷切换模式入口 |
| **7** | **结算弹窗 - 关闭按钮大小** | 32×32px，字号 18px | 64rpx (≈33px)，字号 36rpx (≈19px) | 偏大一些，但可接受 |
| **8** | **结算弹窗 - 已提交状态** | 设计稿有 "已提交，等待其他成员…" 视图 | 已实现，基本一致 | 可以接受 |
| **9** | **头像区 - 滑动渐变遮罩** | 可滑动时右侧显示边缘渐变遮罩提示更多用户 | 未实现 | 缺少用户视觉提示 |
| **10** | **皮肤选择 - 活动状态阴影** | `boxShadow: 0 0 0 2px ${C.mint}40` | `boxShadow: 0 0 0 4rpx rgba(78,205,196,0.25)` | 近似，但设计稿的阴影更精确 |
| **11** | **牌桌皮肤 key 不一致** | 设计稿: `'classic'`, `'poker'`, `'wood'`, `'mint'` | 当前: `'mahjong'`, `'texas'`, `'wood'`, `'mint'` | 两个 key 不匹配，会导致向后端存错值 |
| **12** | **终局结算 - "解散房间" vs "返回首页"** | 有"解散房间"按钮（红色字） | 是"返回首页"按钮 | 功能不同 |
| **13** | **动态区 - 入场动画** | 新动态从底部滑入，旧动态向上淡出 | 静态列表 | 缺少动画效果 |
| **14** | **快捷金额按钮 - 仅收入** | 设计稿快捷按钮固定为 `+50/+100/+200/+500` 收入 | 同上，点击后设置收入 | 用户可能期望支出也有快捷按钮 |

### 🟢 P2 级差异（极细微）

| # | 区域 | 设计稿 | 当前实现 | 差异说明 |
|---|------|--------|----------|----------|
| **15** | **头像圆角边框宽度** | 2.5px (owner) / 2px (normal) | 5rpx (≈2.6px) | 近似，基本一致 |
| **16** | **头像区 - 已提交绿点** | 10px 直径，1.5px 白色边框 | 20rpx (≈10.4px)，3rpx (≈1.6px) 边框 | 接近 |
| **17** | **二维码弹窗 - 头部高度** | padding 20px 24px | 40rpx 48rpx (≈20.8px 25px) | 接近 |
| **18** | **颜色值一致性** | 设计稿使用 `C` 常量 | 当前使用硬编码 | 少量硬编码如 `#5D3A00`、`#B8860B` 未使用统一的颜色系统 |

---

## 二、详细对照

### 2.1 导航栏缺失

**设计稿** (`design/pages/RoomPage.tsx:54-66`)：
```jsx
<div style={{ background: C.card, padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E8ECEF' }}>
  <button onClick={onLeave}>← 返回</button>
  <div>房间 <span style={{ color: '#4ECDC4' }}>888888</span></div>
  <button onClick={() => setModal('action')}>⚙️</button>
</div>
```

**当前实现**：使用 `wx.setNavigationBarTitle` 设置原生导航栏标题，无自定义导航栏组件。

**影响**：缺少返回按钮、房间号品牌色展示、设置齿轮入口。

### 2.2 圆形牌桌尺寸偏差

**设计稿尺寸推导**：
```
R = 108, D = 216, ORBIT = 168, CONT = 336
桌面: 216×216px, 位置: left=60, top=60
容器: 336×336px
```

**当前实现**：
```css
.room__circle-table { width: 672rpx; height: 672rpx; }     /* 349px vs 336px */
.room__circle-surface { width: 552rpx; height: 552rpx; }   /* 287px vs 216px */
```

**正确值**（按 1px=1.923rpx 换算）：
- 容器: 336px → 646rpx
- 桌面: 216px → 415rpx
- 偏移: 60px → 115rpx

### 2.3 方形牌桌尺寸偏差

**设计稿尺寸推导**：
```
T = 210, BW = 54, BH = 70
W = 318, H = 350
桌面: 210×210px
```

**当前实现**：
```css
.room__square-table { width: 636rpx; height: 700rpx; }     /* 331px vs 318px */
.room__square-surface { width: 420rpx; height: 420rpx; }   /* 218px vs 210px */
```

### 2.4 手动结算弹窗

**设计稿**：自定义底部 Sheet
- ManualPaySheet：显示所有有效用户列表（头像+昵称+积分），点击选择收款人
- AmountSheet：金额输入 + 快捷金额按钮 + 当前积分提示

**当前实现**：
```js
wx.showActionSheet({ itemList: payees.map(m => `${m.nickname}（${formatScore(m.score)}）`) });
wx.showModal({ title: '转账给 ' + payee.nickname, editable: true });
```

### 2.5 终局结算报告

**设计稿** (`design/modals/FinalSheet.tsx`)：
- 排名列表（含奖牌、emoji、标签、积分）
- 建议转账方案（详细 from→to，金额）
- 分享战绩按钮（黄色渐变）
- 解散房间按钮（白底红字）

**当前实现** (`room.wxml` 第 365-391 行)：
- 排名列表 ✅
- 建议转账方案 ❌ 未渲染
- 分享战绩按钮 ✅
- "返回首页" 按钮 ❌ 应为"解散房间"

---

## 三、优化优先级

### 紧急 (P0) — 必须修复

| 优先级 | 事项 | 影响范围 | 预估工作量 |
|--------|------|----------|-----------|
| **P0-1** | 添加自定义导航栏（←返回 + 房间号 + ⚙️） | `room.wxml` + `room.wxss` + `room.json` | 中 |
| **P0-2** | 修正圆形牌桌桌面尺寸（缩小 33%） | `room.wxss` + `room.js` | 小 |
| **P0-3** | 替换手动结算为自定义弹窗（ManualPaySheet + AmountSheet） | `room.wxml` + `room.wxss` + `room.js` | 大 |
| **P0-4** | 终局结算报告渲染转账方案，替换"返回首页"为"解散房间" | `room.wxml` + `room.js` | 中 |

### 重要 (P1) — 建议修复

| 优先级 | 事项 | 影响范围 | 预估工作量 |
|--------|------|----------|-----------|
| **P1-1** | 模式栏添加房主⚙️设置按钮 | `room.wxml` + `room.wxss` | 小 |
| **P1-2** | 统一皮肤 key（`classic`/`poker`/`wood`/`mint`） | `room.js` + `constants.util.js` + `server/` | 中 |
| **P1-3** | 方形牌桌尺寸微调（缩小 4%） | `room.wxss` | 小 |
| **P1-4** | 头像区滑动渐变遮罩 | `room.wxml` + `room.wxss` | 小 |
| **P1-5** | 动态区滑入动画 | `room.wxss` + `room.js` | 中 |
| **P1-6** | 修复牌桌筹码位置计算（与设计稿对齐） | `room.js` | 中 |

### 细节 (P2) — 打磨

| 优先级 | 事项 | 影响范围 | 预估工作量 |
|--------|------|----------|-----------|
| **P2-1** | 统一所有硬编码颜色值 | `room.wxss` + `room.wxml` | 中 |
| **P2-2** | 结算弹窗关闭按钮尺寸微调 | `room.wxss` | 小 |
| **P2-3** | 皮肤选择活动态阴影微调 | `room.wxss` | 小 |

---

## 四、修改计划

### 第一阶段：P0 修复

**步骤 1：添加自定义导航栏**
- 在 `room.wxml` 顶部（avatar 行之前）添加导航栏区域
- 在 `room.json` 中设置 `"navigationStyle": "custom"` 隐藏原生导航栏
- 包含：`← 返回` 按钮（左）、房间号（中、品牌色高亮）、⚙️ 设置按钮（右，触发 action sheet）
- 样式参考：`background: #FFFFFF, padding: 10px 16px, borderBottom: 1px solid #E8ECEF`
- 涉及文件：`room.wxml`、`room.wxss`、`room.json`
- 参考设计：`design/pages/RoomPage.tsx:54-66`

**步骤 2：修正圆形牌桌尺寸**
- 容器：从 672rpx → 646rpx
- 桌面表面：从 552rpx → 415rpx
- 位置偏移：left/top 从 60rpx → 115rpx
- 中心徽章：从 132rpx → 127rpx
- 同时修正筹码位置计算比例
- 涉及文件：`room.wxss`、`room.js`

**步骤 3：替换手动结算 UI**
- 新增 ManualPaySheet 弹窗（底部 Sheet）
- 显示所有有效用户列表（含头像、昵称、积分）
- 选择收款人后弹出 AmountSheet（含金额输入、快捷金额、当前积分提示）
- 移除 `wx.showActionSheet()` 和 `wx.showModal()` 调用
- 涉及文件：`room.wxml`、`room.wxss`、`room.js`
- 参考设计：`design/modals/ManualPaySheet.tsx`、`design/modals/AmountSheet.tsx`

**步骤 4：完善终局结算报告**
- 在 `room.wxml` 的 final sheet 中添加转账方案渲染
- 从 `finalData` 中提取 `transferPlan` 渲染
- 将"返回首页"按钮替换为"解散房间"
- 解散房间样式：白底、红色文字、1.5px 边框
- 涉及文件：`room.wxml`、`room.js`
- 参考设计：`design/modals/FinalSheet.tsx`

### 第二阶段：P1 修复

**步骤 5：模式栏房主设置按钮**
- 在模式栏右侧添加 ⚙️ 按钮（仅房主可见）
- 点击弹出结算模式切换或设置弹窗
- 涉及文件：`room.wxml`、`room.wxss`

**步骤 6：统一皮肤 key**
- 修改 `constants.util.js` 中的 `SKINS` 对象 key
- 修改 `room.js` 中的皮肤映射
- 同步修改后端 `room.model.js` 的 enum 值
- 在 `skinList` 中更新 key 名称
- 涉及文件：`constants.util.js`、`room.js`、`server/models/room.model.js`

**步骤 7：方形牌桌微调**
- 容器：636rpx → 612rpx
- 桌面：420rpx → 404rpx
- 偏移：108rpx → 104rpx, 140rpx → 135rpx
- 涉及文件：`room.wxss`

**步骤 8：头像区渐变遮罩**
- 在 `scroll-view` 右侧添加 `mask-image` 渐变
- 仅当可滚动时显示
- 涉及文件：`room.wxml`、`room.wxss`

**步骤 9：动态区动画**
- 使用 `animation` API 或 CSS `transition` 实现新动态滑入
- 旧动态向上淡出
- 涉及文件：`room.wxss`、`room.js`

### 第三阶段：P2 打磨

**步骤 10：颜色统一**
- 检查 `room.wxss` 中所有硬编码颜色值
- 替换为 `constants.util.js` 中的常量或 CSS 变量
- 涉及文件：`room.wxss`

**步骤 11：细节微调**
- 关闭按钮尺寸
- 皮肤阴影精确度
- 其他极细微间距/圆角调整
- 涉及文件：`room.wxss`

---

## 五、设计稿详细尺寸参考

### 5.1 颜色常量 (design/shared/constants.ts)

```typescript
mint: '#4ECDC4'        // 品牌色
mintDark: '#3ABDB4'
mintLight: '#E8F8F7'
mintGrad: 'linear-gradient(135deg, #4ECDC4 0%, #45B7D1 100%)'
sky: '#45B7D1'
yellow: '#FFD93D'
green: '#6BCB77'
greenLight: '#E8F8ED'
orange: '#FF9F45'
red: '#FF6B6B'
redLight: '#FFF2F2'
bg: '#F8FAFB'
card: '#FFFFFF'
text: '#2C3E50'
textSub: '#7F8C8D'
border: '#E8ECEF'
modeBar: '#F0F4F8'
```

### 5.2 牌桌尺寸 (design/components/SquareTable.tsx / CircleTable.tsx)

**方形牌桌**：
```
T = 210 (桌面边长)
BW = 54 (徽章宽度)
BH = 70 (徽章高度)
W = 318 (容器宽), H = 350 (容器高)
桌面: borderRadius 20px, boxShadow 0 8px 36px rgba(0,0,0,0.45)
毡圈: inset 10px, borderRadius 12px, border 1.5px dashed
角饰: 32×32px, borderRadius 6px
中心: 72×72px, borderRadius 14px
筹码位置: ['50% 19%', '80% 50%', '50% 81%', '20% 50%']
```

**圆形牌桌**：
```
R = 108 (桌面半径)
D = 216 (桌面直径)
ORBIT = 168 (轨道半径)
CONT = 336 (容器直径)
桌面: borderRadius 50%, 其他同方形
中心: 66×66px, borderRadius 50%
筹码位置: 半径 = R * 0.62, 按角度均匀分布
```

### 5.3 玩家徽章 (design/components/PlayerBadge.tsx)

```typescript
avatarSize: 38px (md) / 32px (sm)
border: 2px solid (owner: C.mint / normal: C.border / exited: #CCC)
name: fontSize 9px, fontWeight 600
score: fontSize 10px, fontWeight 800
crown: top -7px, right -4px, fontSize 10px
submitted: 10px, border 1.5px solid #fff
```

### 5.4 筹码 (design/components/ChipPile.tsx)

```typescript
W = 22px (sm) / 26px (md)
STEP = 4px (sm) / 5px (md)
count: score===0 ? 1 : min(ceil(abs(score)/65), 6)
```

### 5.5 弹窗组件 (design/components/Sheet.tsx / Overlay.tsx)

```typescript
Sheet: borderRadius 20px 20px 0 0, handle 36×4px, title 16px 700
Overlay: background rgba(0,0,0,0.52), alignItems flex-end
CenterOverlay: background rgba(0,0,0,0.6), alignItems center
```

---

## 六、状态统计

| 类别 | 数量 | 说明 |
|------|------|------|
| 🔴 P0 差异 | 5 项 | 导航栏、圆形牌桌尺寸、方形牌桌尺寸、手动结算 UI、终局结算报告 |
| 🟡 P1 差异 | 9 项 | 模式栏按钮、结算弹窗细节、渐变遮罩、皮肤 key、动画等 |
| 🟢 P2 差异 | 4 项 | 颜色统一、边框微调、阴影对齐等 |
| **合计** | **18 项** | |

> 以上分析基于 `design/` 目录中的 Figma 设计规范与 `pages/room/` 中的当前实现逐项对比，未修改任何代码。