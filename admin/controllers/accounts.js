const User = require('../../models/User');
const {StatusCodes} = require('http-status-codes');



const getAllUsers = async (req, res) => {
    const users = await User.find({}).sort('-createdAt');
    return res.status(StatusCodes.OK).json({success: true, code: 200, msg: 'All users', data: {users}});
}


const deleteUser = async (req, res) => {
    const {id: userId} = req.params;
    const user = await User.findByIdAndDelete({_id: userId});
    return res.status(StatusCodes.NO_CONTENT).json({success: true, code: 204, msg: 'User deleted'});
}

const freezeAccount = async (req, res) => {
    const {id: userId} = req.params;
    await User.findByIdAndUpdate({_id: userId}, {isSuspended: true})
    return res.status(StatusCodes.OK).json({success: true, code: 200, msg: 'User account frozen'}); 
}



module.exports = {getAllUsers, deleteUser, freezeAccount};