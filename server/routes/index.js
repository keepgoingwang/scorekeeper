// routes/index.js - 路由聚合
const express = require('express');
const router = express.Router();

router.use('/user', require('./user.routes'));
router.use('/room', require('./room.routes'));
router.use('/room', require('./settlement.routes')); // /:roomNo/settle/* 与 /:roomNo/pay、settle-final
router.use('/record', require('./record.routes'));

router.use('/room', require('./share.routes')); // /:roomNo/qrcode

module.exports = router;
