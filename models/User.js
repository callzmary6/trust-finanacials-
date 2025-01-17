require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const referralCodeGenerator = require('../utils/referral-code-generator');

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please provide your first name']
    },
    lastName: {
    type: String,
    required: [true, 'Please provide your last name']
    },
    password: {
        type: String,
        required: [true, 'Please provide password']
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide valid email']
    },
    balance: {
        type: Number,
        default: 5
    },
    bitcoinAddress: String,
    ethereumAddress: String,
    bitcoinCashAddress: String,
    usdtERCAddress: String,
    usdtTRCAddress: String,
    referralCode: String,
    referredBy: {
        ref: 'User', 
        type: mongoose.Schema.Types.ObjectId,
    },
    referrals: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    },
    referralCount: {
        type: Number,
        default: 0
    },
    isSuspended: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})


UserSchema.methods.createJWT =  function () {
    const token =  jwt.sign({
        id: this._id,
        email: this.email,
        username: this.username
    }, process.env.JWT_SECRET, {expiresIn: '30d'})
    return token;
}

UserSchema.pre('save', async function () {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    if (this.isModified('referralCode') || !this.referralCode) {
        this.referralCode = referralCodeGenerator();
    }
})

UserSchema.methods.comparePasswords = async function (userPassword) {
    const isPasswordCorrect = await bcrypt.compare(userPassword, this.password);
    return isPasswordCorrect;
}




module.exports = mongoose.model('User', UserSchema);