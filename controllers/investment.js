const {StatusCodes} = require('http-status-codes');
const Deposit = require('../models/Deposit');



const depositFunds = async (req, res) => {
    const {id: userId} = req.user;
    req.body.user = userId;

    const deposit = await Deposit.create(req.body);
    return res.status(StatusCodes.CREATED).json({success: true, code: 201, msg: 'Refresh and check your dashboard for funds'});
}


const getActiveDeposits = async (req, res) => {
    const {id: userId} = req.user;
    const activeDeposit = await Deposit.find({user: userId, isPending: false});
    let activeDepositTotal = 0;

    // const activeDepositTotal = await Deposit.aggregate([
    //     {
    //         $match: {
    //             user: userId,
    //             isPending: false
    //         },
    //     },
    //     {
    //         $group: {
    //             _id: '$investmentPlan',
    //             totalAmount: {
    //                 $sum: '$amount'
    //             }
    //         }
    //     }    
    // ])

   activeDeposit.map((arr) => {
        activeDepositTotal += arr.amount;
    })
       
    return res.status(StatusCodes.OK).json({success: true, code: 200, msg: 'All deposits', data: {activeDeposits: activeDepositTotal}});
}



const getTotalWithdrawals = async (req, res) => {
    return res.status(StatusCodes.OK).json({success: true, code: 200, msg: 'Total withdrawals', data: {totalWithdrawals: 2000}});
}


const getTotalEarnings = async (req, res) => {
    return res.status(StatusCodes.OK).json({success: true, code: 200, msg: 'Total earnings', data: {totalEarnings: 10000}});
}






module.exports = {depositFunds, getActiveDeposits, getTotalWithdrawals, getTotalEarnings};