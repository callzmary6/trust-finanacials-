const express = require('express');
const router = express.Router();

const {register, login, updateProfile} = require('../controllers/auth')

const authMiddleware = require('../middlewares/auth')

router.post('/register', register);
router.post('/login', login);
router.patch('/update-profile', authMiddleware, updateProfile);




module.exports = router;

 
