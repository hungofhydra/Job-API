const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const auth = async (req,res,next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) throw new UnauthenticatedError('Authentication invalid');
    
    const forgotPasswordToken = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(forgotPasswordToken, process.env.JWT_SECRET);
        req.reset = { userId: payload.userId, email : payload.email};
        next();
    }
    catch(err) {
        throw new UnauthenticatedError('Authentication invalid');
    }
};

module.exports = auth