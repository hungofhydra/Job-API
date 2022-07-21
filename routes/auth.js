const express = require('express');
const router = express.Router();
const authenticationPassword = require('../middleware/authenticationPassword')
const {login, register, forgotPassword, resetPassword} = require('../controllers/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot', forgotPassword)
//router.post('/reset', authenticationPassword, resetPassword);
router.get('/resetpassword/:passwordToken', authenticationPassword, resetPassword)
module.exports = router