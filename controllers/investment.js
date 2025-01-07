const {StatusCodes} = require('http-status-codes');
const Deposit = require('../models/Deposit');
const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');
const {BadRequestError} = require('../errors');



const depositFunds = async (req, res) => {
    const {id: userId} = req.user;
    req.body.user = userId;

    const deposit = await Deposit.create(req.body);
    return res.status(StatusCodes.CREATED).json({success: true, code: 201, msg: 'Refresh and check your dashboard for funds'});
}


const withdrawFunds = async (req, res) => {
    const {id: userId} = req.user;
    const {walletAddress, amount, withdrawalMethod} = req.body;
    const user = await User.findOne({_id: userId})

    if (amount < 30) {
        throw new BadRequestError('Amount must be greater than $30')
    }

    if (amount > user.balance) {
        throw new BadRequestError('Insufficient funds');
    } 

    if (user.isSuspended) {
        throw new BadRequestError("Account frozen: You can't withdraw")
    }

    await Withdrawal.create({user: userId, walletAddress, amount, withdrawalMethod});

    user.balance = user.balance - amount;
    await user.save();

    return res.status(StatusCodes.CREATED).json({success: true, code: 201, msg: 'Withdrawal requested, wait for confirmation'});
}


const getActiveDeposits = async (req, res) => {
    const {id: userId} = req.user;
    const activeDeposit = await Deposit.find({user: userId, isPending: false});
    let activeDepositTotal = 0;

   activeDeposit.map((arr) => {
        activeDepositTotal += arr.amount;
    })
       
    return res.status(StatusCodes.OK).json({success: true, code: 200, msg: 'All deposits', data: {activeDeposits: activeDepositTotal}});
}



const getTotalWithdrawals = async (req, res) => {
    const {id: userId} = req.user;
    const withdrawals = await Withdrawal.find({user: userId, isPending: false});
    let totalWithdrawals = 0;

    withdrawals.map((arr)=> {
        totalWithdrawals += arr.amount;
    });

    return res.status(StatusCodes.OK).json({success: true, code: 200, msg: 'Total withdrawals', data: {totalWithdrawals}});
}


const getTotalEarnings = async (req, res) => {
    return res.status(StatusCodes.OK).json({success: true, code: 200, msg: 'Total earnings', data: {totalEarnings: 10000}});
}






module.exports = {depositFunds, getActiveDeposits, getTotalWithdrawals, getTotalEarnings, withdrawFunds};