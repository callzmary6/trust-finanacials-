const express = require('express');
const router = express.Router();

const {getAllUsers, deleteUser, freezeAccount} = require('../controllers/accounts');


router.get('/users', getAllUsers);
router.post('/delete-user/:id', deleteUser);
router.post('/freeze-user/:id', freezeAccount);




module.exports = router;