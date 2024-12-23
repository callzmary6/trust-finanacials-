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
    user.password = undefined; // Removes the password from the response
    user.__v = undefined; // Removes the version (--V) from the response
    return res.status(StatusCodes.CREATED).json({success: true, code: 201, msg: 'Acount created successfully', data: {user, token}});
}



const login = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      throw new BadRequestError("Please provide email and password to login");
    }
  
    const user = await User.findOne({ email: email }).select('password fullName username email createdAt updatedAt');
  
    if (!user) {
      throw new UnauthenticatedError("User does not exist");
    }
        
    const isPasswordCorrect = await user.comparePasswords(password);
  
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Password incorrect");
    }
  
    const token = user.createJWT();
    user.password = undefined; // Removes the password from the response
    return res.status(StatusCodes.OK).json({ success: true, code: 200, msg: 'Login successful', data: {user, token} });
  };


  // Update the user profile data
  const updateProfile = async (req, res) => {
    const {id:userId} = req.user;
    
    const updatedUser = await User.findByIdAndUpdate({_id:userId}, req.body, {runValidators: true});
    return res.status(StatusCodes.OK).json({success: true, code: 200, msg: 'Profile updated'})
  }





module.exports = {register, login, updateProfile};