const Deposit = require('../../models/Deposit');
const {StatusCodes} = require('http-status-codes');


const getAllDeposits = async (req, res) => {
    const deposits = await Deposit.find({}).sort('-createdAt');
    return res.status(StatusCodes.OK).json({success: true, code: 200, msg: 'All deposits', data: deposits});
}


const approveDeposit = async (req, res) => {
    const {id: depositId} = req.params;

    const deposit = await Deposit.findByIdAndUpdate({_id: depositId}, {isPending: false})

    return res.status(StatusCodes.OK).json({success: true, code: 200, msg: 'Deposit approved'})
}






module.exports = {getAllDeposits, approveDeposit};