// routes/share.routes.js - 分享相关（挂载于 /api/room）
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/share.controller');
const auth = require('../middleware/auth');

router.get('/:roomNo/qrcode', auth(), ctrl.qrcode);

module.exports = router;