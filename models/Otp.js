require('dotenv').config();
const mongoose = require('mongoose');

const OtpSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    otpExpiryDate: {
        type: Date,
        default: new Date()
    }
}, {timestamps: true})

OtpSchema.pre('save', function () {
    const otpExpiryDate = new Date(Date.now() + 600000); // 10 minutes
    this.otpExpiryDate = otpExpiryDate;
})




module.exports = mongoose.model('Otp', OtpSchema);