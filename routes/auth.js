const express = require('express');
const router = express.Router();

const {register, login, updateProfile, sendPasswordOtp, verifyOtp, resetPassword, getUserBalance, getProfile} = require('../controllers/auth')

const authMiddleware = require('../middlewares/auth')

router.post('/register', register);
router.post('/login', login);
router.post('/update-profile', authMiddleware, updateProfile);
router.post('/send-otp', sendPasswordOtp);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.get('/show-balance', authMiddleware, getUserBalance);
router.get('/get-profile', authMiddleware, getProfile);





module.exports = router;

 
