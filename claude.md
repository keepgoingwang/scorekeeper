# 项目开发规范
# 前端：微信小程序 | 后端：Node.js/Java 等自建服务


## 结构
- miniprogram/pages、components、services、utils
- server/controllers、services、models、middleware

## 前后端分离
前端只管UI交互，后端处理业务逻辑和权限，通过RESTful API通信

## 命名
文件 kebab-case | 函数 camelCase | 常量 UPPER_CASE

## API格式
成功 {code:200, data:{}, message:"success"}
失败 {code:错误码, data:null, message:"错误描述"}

## 前端规则
- 所有请求统一用 services/ 封装，不直接在页面调wx.request
- 页面必须有loading/error状态
- 所有异步必须try-catch
- setData合并更新，不要频繁调用
- 列表超20条分页，图片懒加载

## 后端规则
- 分层：Controller→Service→Model
- 所有接口做JWT鉴权和参数校验
- 用户只能操作自己的数据
- 软删除用isDeleted标记
- createTime/updateTime自动维护

## 权限
角色级别：visitor<user<vip<admin
前端页面级检查，后端接口级检查

## 通用
- 2空格缩进，单引号
- 公共函数加注释
- 敏感信息不打印

# 通用要求
common:
  - "所有异步操作必须 try-catch 错误处理"
  - "公共函数必须有 JSDoc 注释"
  - "代码缩进2空格"
  - "使用单引号"
  - "敏感信息不打印到日志"
  - "前端 token 过期自动跳转登录页"
  - "后端所有接口需做权限验证和参数校验"
  - "开发前需要根据实际情况选择使用的skills和框架"