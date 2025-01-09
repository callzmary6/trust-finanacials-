const User = require('../../models/User');
const {StatusCodes} = require('http-status-codes');



const getAllUsers = async (req, res) => {
    const users = await User.find({}).sort('-createdAt');
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
    var msg = 'User account frozen'

    if (user.isSuspended == false) {
        user.isSuspended = true;
    } else {
        user.isSuspended = false
        msg = 'User account unfrozen'
    }

    await user.save()
    return res.status(StatusCodes.OK).json({success: true, code: 200, msg: msg}); 
}



module.exports = {getAllUsers, deleteUser, freezeAccount};