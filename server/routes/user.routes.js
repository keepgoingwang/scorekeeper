// routes/user.routes.js
const express = require('express');
const Joi = require('joi');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const router = express.Router();
const ctrl = require('../controllers/user.controller');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

// 头像上传配置
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.png';
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } });

router.post(
  '/login',
  validate({ body: Joi.object({
    code: Joi.string().required(),
    nickname: Joi.string().max(10).allow(''),
    avatar: Joi.string().allow('')
  }) }),
  ctrl.login
);

// 头像上传（免登录）
router.post('/avatar', upload.single('avatar'), ctrl.uploadAvatar);

router.get('/profile', auth(), ctrl.getProfile);
router.put(
  '/profile',
  auth(),
  validate({ body: Joi.object({
    nickname: Joi.string().max(10),
    avatar: Joi.string(),
    age: Joi.number().min(0)
  }) }),
  ctrl.updateProfile
);
router.get('/stats', auth(), ctrl.getStats);

module.exports = router;
