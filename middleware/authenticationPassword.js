const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const auth = async (req,res,next) => {
    let {
        params : {passwordToken}
    } = req

    if (!passwordToken) throw new UnauthenticatedError('Authentication invalid');
    try {
        const payload = jwt.verify(passwordToken, process.env.JWT_SECRET);
        req.reset = { userId: payload.userId, email : payload.email};
        next();
    }
    catch(err) {
        throw new UnauthenticatedError('Authentication invalid');
    }
};

module.exports = auth