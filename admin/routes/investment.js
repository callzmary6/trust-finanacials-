const express = require('express');
const router = express.Router();

const {getAllDeposits, approveDeposit, getAllWithdrawals, approveWithdrawal} = require('../controllers/investment');


router.get('/deposits', getAllDeposits);
router.post('/approve-deposit/:id', approveDeposit);
router.get('/withdrawals', getAllWithdrawals);
router.post('/approve-withdrawal/:id', approveWithdrawal);




module.exports = router;