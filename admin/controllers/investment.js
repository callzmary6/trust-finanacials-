const Deposit = require('../../models/Deposit');
const Withdrawal = require('../../models/Withdrawal')
const User = require('../../models/User');
const transporter = require('../../utils/transporter');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError} = require('../../errors');

const getAllDeposits = async (req, res) => {
    const deposits = await Deposit.find({}).sort('-createdAt').populate({
        path: 'user',
        select: 'firstName lastName'
    });
    return res.status(StatusCodes.OK).json({success: true, code: 200, msg: 'All deposits', data: deposits});
}


const approveDeposit = async (req, res) => {
    const {id: depositId} = req.params;

    const deposit = await Deposit.findByIdAndUpdate({_id: depositId}, {isPending: false})
    
    const user = await User.findOne({_id: deposit.user});

    if (user) {
        user.balance += deposit.amount;
        await user.save();
    }

    return res.status(StatusCodes.OK).json({success: true, code: 200, msg: 'Deposit approved'})
}


const getAllWithdrawals = async (req, res) => {
    const withdrawals = await Withdrawal.find({}).sort('-createdAt').populate({
        path: 'user',
        select: 'firstName lastName'
    });
    return res.status(StatusCodes.OK).json({success: true, code: 200, msg: 'All withdrawals', data: withdrawals});
}

const approveWithdrawal = async (req, res) => {
    const {id: withdrawalId} = req.params;

    const withdrawal = await Withdrawal.findByIdAndUpdate({_id: withdrawalId}, {isPending: false}).populate({
        path: 'user',
        select: '-_id email'
    })

    try {
        const info = await transporter.sendMail({
          from: '"AcunarTech" <jerrygodson3@gmail.com>',
          to: withdrawal.user.email,
          subject: "Withdrawal Approval",
          text: `Congratulations,\nYour withdrawal of $${withdrawal.amount} has been approved and sent to your wallet`,
        });
      } catch (error) {
        throw new BadRequestError(error);
      }

    return res.status(StatusCodes.OK).json({success: true, code: 200, msg: 'Withdrawal approved'})
}







module.exports = {getAllDeposits, approveDeposit, getAllWithdrawals, approveWithdrawal};