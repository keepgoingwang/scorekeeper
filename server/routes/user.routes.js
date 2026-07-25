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
const env = require('../config/env');

// 头像上传配置（路径从环境变量读取，存到 avatars 子目录）
const AVATAR_DIR = path.join(env.uploadDir, 'avatars');
if (!fs.existsSync(AVATAR_DIR)) fs.mkdirSync(AVATAR_DIR, { recursive: true });
const storage = multer.diskStorage({
  destination: AVATAR_DIR,
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
