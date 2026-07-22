// routes/room.routes.js
const express = require('express');
const Joi = require('joi');
const router = express.Router();
const ctrl = require('../controllers/room.controller');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

router.use(auth()); // 所有房间接口需登录

router.post('/', ctrl.create);
router.get('/current', ctrl.current);
router.get('/:roomNo', ctrl.detail);
router.post('/:roomNo/join', ctrl.join);
router.post('/:roomNo/exit', ctrl.exit);
router.post('/:roomNo/dissolve', ctrl.dissolve);
router.put(
  '/:roomNo/mode',
  validate({ body: Joi.object({ mode: Joi.string().valid('manual', 'auto').required() }) }),
  ctrl.switchMode
);
router.put(
  '/:roomNo/skin',
  validate({ body: Joi.object({ skin: Joi.string().valid('mahjong', 'texas', 'wood', 'mint').required() }) }),
  ctrl.switchSkin
);
router.get('/:roomNo/flow', ctrl.flow);

module.exports = router;
