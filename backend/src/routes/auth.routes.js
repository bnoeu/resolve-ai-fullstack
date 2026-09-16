const { Router } = require('express');
const asyncHandler = require('../utils/asyncHandler');
const authController = require('../controllers/auth.controller');

const router = Router();

router.post('/register', asyncHandler(authController.registrar));
router.post('/login', asyncHandler(authController.login));

module.exports = router;
