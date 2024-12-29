const mongoose = require('mongoose');



const DepositSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide the user for this deposit']
    },
    amount: {
        type: Number,
        required: [true, 'Please provide the deposit amount']
    },
    investmentPlan: {
        type: String,
        required: [true, 'Please provide investment plan']
    },
    paymentMethod: {
        type: String
    },
    payerAddress: {
        type: String
    },
    transactionId: {
        type: String
    },
    isPending: {
        type: Boolean,
        default: true
    }
}, {timestamps: true})






module.exports = mongoose.model('Deposit', DepositSchema);