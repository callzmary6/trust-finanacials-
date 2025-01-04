const mongoose = require('mongoose');

const WithdrawalSchema  = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'please provide the user']
    },
    walletAddress: {
        type: String
    },
    amount: {
        type: Number
    },
    withdrawalMethod: {
        type: String
    },
    isPending: {
        type: Boolean,
        default: true
    }
}, {timestamps: true})






module.exports = mongoose.model('Withdrawal', WithdrawalSchema);