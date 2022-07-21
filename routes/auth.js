const express = require('express');
const router = express.Router();
const authenticationPassword = require('../middleware/authenticationPassword')
const {login, register, forgotPassword, resetPassword, resetPassword2} = require('../controllers/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot', forgotPassword)
router.post('/reset', authenticationPassword, resetPassword)
router.post('/reset2', authenticationPassword, resetPassword2)
module.exports = router