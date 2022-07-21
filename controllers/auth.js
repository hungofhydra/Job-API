const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors')
const bcrypt = require('bcryptjs')

//Register 
const register = async (req, res) => {
    const {name, email, password} = req.body;
    // if (!name || !email || !password) {
    //     throw new BadRequestError('Please provide email, password and name');
    // }
    const user = await User.create(req.body)
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({ msg : 'Registered successfully', user : {name : user.name, mail : user.email}, token})
  
}

//Login
const login = async (req,res) => {
    const {email, password} = req.body
    if (!email || !password) throw new BadRequestError('Please provide email and password');

    const user = await User.findOne({email})
    if(!user) {
        throw new UnauthenticatedError('Invalid Credentials')
    }

    //compare password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect)  throw new UnauthenticatedError('Invalid Credentials');
    //send token
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ msg : 'Logined successfully' , user : {name: user.name}, token});
}

const forgotPassword = async(req,res) => {
    const {email} = req.body
    if (!email) throw new BadRequestError('Please provide email');

    const user = await User.findOne({email})
    if(!user) {
        throw new UnauthenticatedError('Invalid Credentials')
    }

    const forgotPasswordToken = user.createPasswordToken();
    res.status(StatusCodes.OK).json({ msg : 'Sent password request successfully' , forgotPasswordToken});
}

const resetPassword = async(req,res) => {
   let {
        reset : {userId, email},
        body : {newPassword : password}
   } = req

   if (password === '') {
    throw new BadRequestError('New password fields cannot be empty')
    }
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    const user = await User.findByIdAndUpdate({_id : userId, email}, {password}, {new : true, runValidators : true})
    if (!user) throw new NotFoundError(`No user with id ${userId}`);
    
    res.status(StatusCodes.OK).json({ msg : 'Reseted password successfully'});
   
}


module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword
}