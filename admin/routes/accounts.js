const express = require('express');
const router = express.Router();

const {getAllUsers, deleteUser, freezeAccount, getRefferals} = require('../controllers/accounts');


router.get('/users', getAllUsers);
router.post('/delete-user/:id', deleteUser);
router.post('/freeze-user/:id', freezeAccount);
router.get('/referrals', getRefferals);





module.exports = router;