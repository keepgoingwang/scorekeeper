// routes/record.routes.js - 战绩（挂载于 /api/record）
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/record.controller');
const auth = require('../middleware/auth');

router.use(auth());

router.get('/list', ctrl.list);
router.get('/trend', ctrl.trend);
router.get('/ranking', ctrl.ranking);
router.get('/:id', ctrl.detail);

module.exports = router;
