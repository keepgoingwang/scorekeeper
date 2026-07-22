// routes/settlement.routes.js - 结算相关（挂载于 /api/room，路径为 /:roomNo/...）
const express = require('express');
const Joi = require('joi');
const router = express.Router();
const ctrl = require('../controllers/settlement.controller');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

router.use(auth());

router.post('/:roomNo/settle/start', ctrl.startSettle);
router.post('/:roomNo/settle/end', ctrl.endSettle);
router.post(
  '/:roomNo/settle/submit',
  validate({ body: Joi.object({
    income: Joi.number().min(0).default(0),
    expense: Joi.number().min(0).default(0)
  }) }),
  ctrl.submitSettle
);
router.post(
  '/:roomNo/pay',
  validate({ body: Joi.object({
    toUserId: Joi.string().required(),
    amount: Joi.number().min(1).required()
  }) }),
  ctrl.manualPay
);
router.post('/:roomNo/settle-final', ctrl.settleFinal);

module.exports = router;
