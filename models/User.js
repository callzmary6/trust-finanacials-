require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please provide your full name']
    },
    username: {
        type: String,
        required: [true, 'Please provide username']
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
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

UserSchema.methods.comparePasswords = async function (userPassword) {
    const isPasswordCorrect = await bcrypt.compare(userPassword, this.password);
    return isPasswordCorrect
}




module.exports = mongoose.model('User', UserSchema);