const User = require('../models/User');
const {BadRequestError, UnauthenticatedError} = require('../errors');
const { StatusCodes } = require('http-status-codes');


const register = async (req, res) => {
    const {username, fullName, email, password, password2} = req.body;

    if (!username || !fullName || !email || !password) {
        throw new BadRequestError('Please provide the necessary fields')
    }

    if (password !== password2) {
        throw new BadRequestError('The passwords do not match!')
    }

    const user = await User.create({username, fullName, email, password});
    const token = user.createJWT()
    user.password = undefined;
    user.__v = undefined;
    return res.status(StatusCodes.CREATED).json({success: true, code: 201, msg: 'Acount created successfully', data: {user, token}});
}



const login = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      throw new BadRequestError("Please provide email and password to login");
    }
  
    const user = await User.findOne({ email: email }).select('-__v');
  
    if (!user) {
      throw new UnauthenticatedError("Invalid email", 401);
    }
        
    const isPasswordCorrect = await user.comparePasswords(password);
  
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Invalid password");
    }
  
    const token = user.createJWT();
    user.password = undefined;
    return res.status(StatusCodes.OK).json({ success: true, code: 200, msg: 'Login successful', data: {user, token} });
  };





module.exports = {register, login};