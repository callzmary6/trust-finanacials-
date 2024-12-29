const express = require('express');
const router = express.Router();

const {getAllDeposits, approveDeposit} = require('../controllers/investment');


router.get('/deposits', getAllDeposits);
router.post('/deposit/approve', approveDeposit)




module.exports = router;