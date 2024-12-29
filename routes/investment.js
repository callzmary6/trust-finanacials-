const express = require('express');
const router = express.Router();

const {depositFunds, getActiveDeposits, getTotalWithdrawals, getTotalEarnings} = require('../controllers/investment');



router.post('/deposit-funds', depositFunds);
router.get('/active-deposits', getActiveDeposits);
router.get('/total-earnings', getTotalEarnings);
router.get('/total-withdrawals', getTotalWithdrawals);





module.exports = router;