const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors')
const bcrypt = require('bcryptjs')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
//Register 
const register = async (req, res) => {
    const {name, email, password} = req.body;
     if (!name || !email || !password) {
         throw new BadRequestError('Please provide email, password and name');
     }
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
        throw new UnauthenticatedError(`The email address ${email} you entered is not connected to an account`)
    }

    //compare password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect)  throw new UnauthenticatedError('Invalid password');
    //send token
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ msg : 'Logined successfully' , user : {name: user.name}, token});
}

const forgotPassword = async(req,res) => {
    const {email} = req.body
    if (!email) throw new BadRequestError('Please provide email');

    const user = await User.findOne({email})
    if(!user) {
        throw new UnauthenticatedError(`The email address ${email} you entered is not connected to an account`)
    }

    const forgotPasswordToken = user.createPasswordToken();

    const msg = {
        to: email, // Change to your recipient
        from: 'hungofhydra@gmail.com', // Change to your verified sender
        subject: 'Reset Password Email',
        html : `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><a href="https://job-api-example.herokuapp.com/api/v1/auth/reset2/${forgotPasswordToken}">Reset Password</a></body></html>`,
      }
      sgMail
        .send(msg)
        .then(() => {s
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error)
        })
    res.status(StatusCodes.OK).json({ msg : 'Sent password request to email successfully'});
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
const resetPassword2 = async(req,res) => {
    let {
         reset : {userId, email},
         prams : {passwordToken}
    } = req
 
    
    if (passwordToken === '') {
     throw new UnauthenticatedError('Link had expired')
    }

    let newPassword = (Math.random() + 1).toString(36).substring(7);
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(newPassword, salt);
 
    const user = await User.findByIdAndUpdate({_id : userId, email}, {newPassword}, {new : true, runValidators : true})
    if (!user) throw new NotFoundError(`No user with id ${userId}`);
     
    res.status(StatusCodes.OK).json({ msg : 'Reseted password successfully', newPassword});
    
 }

module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword,
    resetPassword2
}