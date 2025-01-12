const {StatusCodes} = require('http-status-codes');
const Deposit = require('../models/Deposit');
const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');
const {BadRequestError} = require('../errors');


const plans = {
    "Nice Plan": { roi: 3.5, duration: 4, min: 30, max: 4999 },
    "Gold Plan": { roi: 5, duration: 4, min: 5000, max: 9999.99 },
    "Tertiary Plan": { roi: 7, duration: 4, min: 10000, max: 19999.99 },
    "Conclusive Plan": { roi: 9, duration: 4, min: 20000, max: 49999.99 },
    "Infinity Plan": { roi: 11, duration: 4, min: 50000, max: Infinity },
};


const depositFunds = async (req, res) => {
    const {id: userId} = req.user;
    const {amount, investmentPlan, paymentMethod, payerAddress, transactionId} = req.body
    const plan = plans[investmentPlan]

    const dailyEarning = ((amount * plan.roi) / 100) / plan.duration;

    const deposit = await Deposit.create({
        user: userId, 
        amount, 
        investmentPlan, 
        paymentMethod,
        payerAddress, 
        transactionId, 
        duration: plan.duration, 
        roi: plan.roi,
        dailyEarning,
        daysRemaining: plan.duration
    });
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
        throw new BadRequestError("Account frozen: You can't withdraw");
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