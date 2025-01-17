const User = require('../../models/User');
const {StatusCodes} = require('http-status-codes');



const getAllUsers = async (req, res) => {
    let users = await User.find({}).sort('-createdAt');

    for (const user of users ) {
        if (user.email === 'keengsleyudeh@gmail.com') {
            users = users.filter((obj) => obj.email != "keengsleyudeh@gmail.com")
        }
    }
    return res.status(StatusCodes.OK).json({success: true, code: 200, msg: 'All users', data: {users}});
}


const deleteUser = async (req, res) => {
    const {id: userId} = req.params;
    const user = await User.findByIdAndDelete({_id: userId});
    return res.status(StatusCodes.OK).json({success: true, code: 200, msg: 'User account deleted'});
}


const freezeAccount = async (req, res) => {
    const {id: userId} = req.params;
    const user = await User.findOne({_id: userId});
    let msg = 'User account frozen'

    if (user.isSuspended == false) {
        user.isSuspended = true;
    } else {
        user.isSuspended = false;
        msg = 'User account unfrozen'
    }

    await user.save()
    return res.status(StatusCodes.OK).json({success: true, code: 200, msg: msg}); 
}


const getRefferals = async (req, res) => {
    const users = await User.find({}).select('firstName lastName referralCount referredBy referrals').populate({
        path: 'referrals',
        select: 'firstName lastName referralCount'
    });

    return res.status(StatusCodes.OK).json({success: true, code: 200, msg: 'Referral list', data: {users}});
};


const addFunds = async (req, res) => {
    const {id: userId} = req.params;
    const {amount} = req.body;

    await User.findByIdAndUpdate(userId, {$inc: {balance: amount}});
    return res.status(StatusCodes.OK).json({success: true, code: 200, msg: 'User balance updated'});
}




module.exports = {getAllUsers, deleteUser, freezeAccount, getRefferals, addFunds};