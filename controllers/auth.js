const User = require('../models/User');
const Otp = require('../models/Otp');
const {BadRequestError, UnauthenticatedError} = require('../errors');
const { StatusCodes } = require('http-status-codes');
const transporter = require('../utils/transporter');
const bcrypt = require('bcryptjs')

const register = async (req, res) => {
    const {firstName, lastName, email, password, referralCode} = req.body;
    let referredBy = undefined;

    if (!firstName || !lastName || !email || !password) {
        throw new BadRequestError('Please provide the necessary fields')
    }

    const referral = await User.findOne({referralCode: referralCode});

    const user = await User.create({firstName, lastName, email, password});

    // Referral functionality
    if (referral) {
      user.referredBy = referral._id // This sets the id of the user's referral
      await user.save()

      referral.referralCount += 1;
      referral.referrals.push(user._id);

      await referral.save();
    }

    const token = user.createJWT()
    if (user.balance) {
      user.balance = undefined;  // Removes the balance of the user from the response
    }
    user.password = undefined; // Removes the password from the response
    user.__v = undefined; // Removes the version (--V) from the response
    return res.status(StatusCodes.CREATED).json({success: true, code: 201, msg: 'Acount created successfully', data: {user, token}});
}



const login = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      throw new BadRequestError("Please provide email and password to login");
    }
  
    const user = await User.findOne({ email: email }).select('password firstName lastName email referralCode createdAt updatedAt');
  
    if (!user) {
      throw new UnauthenticatedError("User does not exist");
    }
        
    const isPasswordCorrect = await user.comparePasswords(password);
  
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Password incorrect");
    }
  
    const token = user.createJWT();
    user.password = undefined; // Removes the password from the response
    if (user.balance) {
      user.balance = undefined;  // Removes the balance of the user from the response
    }
    return res.status(StatusCodes.OK).json({ success: true, code: 200, msg: 'Login successful', data: {user, token} });
  };


  // Update the user profile data
  const updateProfile = async (req, res) => {
    const {id:userId} = req.user;
    
    const updatedUser = await User.findByIdAndUpdate({_id:userId}, req.body, {runValidators: true});
    return res.status(StatusCodes.OK).json({success: true, code: 200, msg: 'Profile updated'})
  }


  const getProfile = async (req, res) => {
    const {id: userId} = req.user;

    const userProfile = await User.findOne({_id: userId}).select('-_id bitcoinAddress ethereumAddress bitcoinCashAddress usdtERCAddress usdtTRCAddress')

    return res.status(StatusCodes.OK).json({success: true, code: 200, msg: 'User profile', data: {userProfile}});
  }


  const sendPasswordOtp = async (req, res) => {
    const {email} = req.body;

    const user = await User.findOne({email: email});

    let otpCode;

    if (!user) {
      throw new BadRequestError('User with this email does not exist');
    }

    const otp = await Otp.findOne({userId: user._id});

    if (otp) {
      otp.deleteOne();
    }
    
    otpCode = Math.floor(Math.random() * 1000000).toString();
    await Otp.create({ userId: user._id, userEmail: email, code: otpCode });
    

    try {
      const info = await transporter.sendMail({
        from: '"AcunarTech" <jerrygodson3@gmail.com>',
        to: email,
        subject: "Reset your password",
        text: `Use this code to reset your pasword\n ${otpCode}, \n This code is valid for only 10 minutes`,
      });
    } catch (error) {
      throw new BadRequestError(error);
      // console.log(error);
    }

    return res.status(StatusCodes.OK).json({success: true, code: 200, msg: 'Your otp has been sent to your email'})

  }

  
  const verifyOtp = async (req, res) => {
    const {otpCode} = req.body;

    const otp = await Otp.findOne({code: otpCode});

    if (!otp) {
      throw new BadRequestError('Otp is not correct');
    }

    if (new Date().getTime() > otp.otpExpiryDate.getTime()){
      throw new BadRequestError('Opt has expired, request another')
    }

    await otp.deleteOne()
    return res.status(StatusCodes.OK).json({success: true, code: 200, msg: 'Otp correct, change your password'})
  }


  const resetPassword = async (req, res) => {
    const {email, newPassword} = req.body;

    const salt = await bcrypt.genSalt(10);
    safePassword = await bcrypt.hash(newPassword, salt);

    const user = await User.updateOne({email:email}, {password: safePassword});

    return res.status(StatusCodes.OK).json({success: true, code: 200, msg: 'Password updated'});
  }


  const getUserBalance = async (req, res) => {
    const {id: userId} = req.user
    const user = await User.findOne({_id: userId});
    return res.status(StatusCodes.OK).json({success: true, code: 200, msg: 'User balance', data: {userBalance: user.balance, referralCount: user.referralCount}});
}






module.exports = {register, login, updateProfile, sendPasswordOtp, verifyOtp, resetPassword, getUserBalance, getProfile};